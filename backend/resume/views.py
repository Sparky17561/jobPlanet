from django.http import JsonResponse
from django.conf import settings
from reportlab.pdfgen import canvas
import os
import json
import time
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

def generate_pdf(request):
    folder = settings.TEMP_FOLDER
    os.makedirs(folder, exist_ok=True)

    filename = "it_works.pdf"
    filepath = os.path.join(folder, filename)

    c = canvas.Canvas(filepath)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(150, 750, "IT WORKS")
    c.save()

    file_url = request.build_absolute_uri(f"/media/temp/{filename}")

    return JsonResponse({
        "success": True,
        "file_url": file_url,
        "filename": filename
    })




MODEL_NAME = "gemini-2.5-flash-preview-09-2025"


# ------------------------------
# Gemini API Helper
# ------------------------------
def call_gemini(api_key, payload):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}

    for attempt in range(3):  # retry logic
        try:
            res = requests.post(url, headers=headers, json=payload)
            res.raise_for_status()
            return res.json()
        except requests.exceptions.RequestException as e:
            if attempt == 2:
                raise e
            time.sleep(2 ** attempt)


# ------------------------------
# Extract pure text from Gemini
# ------------------------------
def extract_text(api_response):
    try:
        return api_response["candidates"][0]["content"]["parts"][0]["text"]
    except:
        return ""


# =============================================================
#               MAIN VIEW: AI LaTeX Resume Builder
# =============================================================
@csrf_exempt
@require_http_methods(["POST"])
def generate_resume_latex(request):

    required_fields = ["jd", "template", "resume_json", "gemini_api_key"]

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    # Check required fields
    for f in required_fields:
        if f not in data:
            return JsonResponse({"error": f"Missing field: {f}"}, status=400)

    jd = data["jd"]
    template = data["template"]
    resume_json = data["resume_json"]
    api_key = data["gemini_api_key"]

    # --------------------------
    # Build prompt
    # --------------------------
    system_prompt = (
        "You are an expert resume writer and LaTeX specialist. "
        "You take a resume JSON, deeply understand the user's skills & experience, "
        "and rewrite + optimize the content to match the job description. "
        "You strictly follow the provided LaTeX template, filling in sections accurately. "
        "DO NOT modify formatting commands, DO NOT add new packages. "
        "Return ONLY pure LaTeX code ready for compilation."
    )

    user_prompt = f"""
Job Description:
----------------
{jd}

Resume JSON:
------------
{json.dumps(resume_json, indent=2)}

LaTeX Template:
---------------
{template}

Task:
-----
1. Rewrite + optimize resume text to perfectly match the job description.
2. Maintain ATS-optimized, measurable bullet points.
3. Fill the provided LaTeX template **with the rewritten content**.
4. DO NOT escape LaTeX commands already in the template.
5. Output ONLY pure LaTeX code, nothing else.
"""

    payload = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"parts": [{"text": user_prompt}]}],
    }

    # --------------------------
    # Call LLM
    # --------------------------
    try:
        raw = call_gemini(api_key, payload)
        latex_code = extract_text(raw)
    except Exception as e:
        return JsonResponse({"error": f"LLM Error: {e}"}, status=503)

    return JsonResponse({
        "success": True,
        "latex": latex_code
    }, status=200)


