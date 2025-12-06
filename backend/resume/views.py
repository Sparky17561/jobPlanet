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



import os
import json
import uuid
import time
import subprocess
import tempfile
from datetime import datetime

from django.conf import settings
from django.http import JsonResponse, HttpResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from pymongo import MongoClient
import requests


# ============================================================
#  MongoDB Setup
# ============================================================

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]
users = db["users"]


# ============================================================
#  Gemini Model Info
# ============================================================

MODEL_NAME = "gemini-2.5-flash-preview-09-2025"


# ============================================================
#  Gemini Helpers
# ============================================================

def call_gemini(api_key, payload):
    """Send request to Gemini with retry."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}

    for attempt in range(3):
        try:
            res = requests.post(url, headers=headers, json=payload, timeout=60)
            res.raise_for_status()
            return res.json()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1.5 ** attempt)


def extract_text(resp):
    """Extract final pure text from Gemini LLM response."""
    try:
        return resp["candidates"][0]["content"]["parts"][0]["text"]
    except:
        return ""


# ============================================================
# 1) RESUME GENERATION
# POST /user/resume/generate/
# ============================================================

@csrf_exempt
@require_http_methods(["POST"])
def resume_generate(request):

    email = request.session.get("email")
    if not email:
        return JsonResponse({"error": "Not logged in"}, status=401)

    user = users.find_one({"email": email})
    if not user:
        return JsonResponse({"error": "User not found"}, status=404)

    gemini_key = user.get("gemini_key")
    profile_data = user.get("profile_data", {})

    if not gemini_key:
        return JsonResponse({"error": "Gemini key missing"}, status=400)

    # -------------------- Parse Body --------------------
    try:
        body = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    template = body.get("template")
    jd = body.get("job_description")

    if not template or not jd:
        return JsonResponse({"error": "Missing template or job_description"}, status=400)

    # -------------------- LLM Prompt --------------------
    system_prompt = (
        "You are a senior resume writer & LaTeX engineer. "
        "Using the template, generate a ONE-PAGE ATS optimized LaTeX resume. "
        "STRICT RULES:\n"
        "- Output ONLY LaTeX.\n"
        "- Do NOT modify template structure or LaTeX commands.\n"
        "- Use profile_data exactly.\n"
        "- Align text with the JD.\n"
        "- Do not invent skills.\n"
        "- End with: % ATS_SCORE: 85"
    )

    user_prompt = f"""
Job Description:
{jd}

User Profile JSON:
{json.dumps(profile_data, indent=2)}

LaTeX Template:
{template}

Follow the rules and output only LaTeX.
"""

    payload = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"parts": [{"text": user_prompt}]}]
    }

    # -------------------- LLM Call --------------------
    try:
        raw = call_gemini(gemini_key, payload)
    except Exception as e:
        return JsonResponse({"error": f"LLM call failed: {e}"}, status=500)

    latex = extract_text(raw)

    # -------------------- Store in DB --------------------
    resume_id = str(uuid.uuid4())
    entry = {
        "id": resume_id,
        "latex": latex,
        "job_description_snippet": jd[:400],
        "generated_at": datetime.utcnow().isoformat(),
    }

    users.update_one(
        {"email": email},
        {"$push": {"generated_resumes": entry}}
    )

    # -------------------- Store .tex File --------------------
    temp_folder = settings.TEMP_FOLDER
    os.makedirs(temp_folder, exist_ok=True)

    tex_path = os.path.join(temp_folder, f"{resume_id}.tex")
    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(latex)

    return JsonResponse({"success": True, "id": resume_id, "latex": latex})


# ============================================================
# 2) RESUME ENHANCE
# POST /user/resume/enhance/
# ============================================================

@csrf_exempt
@require_http_methods(["POST"])
def resume_enhance(request):

    email = request.session.get("email")
    if not email:
        return JsonResponse({"error": "Not logged in"}, status=401)

    user = users.find_one({"email": email})
    if not user:
        return JsonResponse({"error": "User not found"}, status=404)

    gemini_key = user.get("gemini_key")

    try:
        body = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    latex_input = body.get("latex")
    context = body.get("context")

    if not latex_input or not context:
        return JsonResponse({"error": "Missing latex or context"}, status=400)

    # -------------------- Enhance Prompt --------------------
    system_prompt = (
        "You are an expert LaTeX resume optimizer. "
        "Enhance the resume content using context but DO NOT modify the template structure. "
        "Return ONLY LaTeX."
    )

    user_prompt = f"""
Context for Enhancement:
{context}

Original LaTeX Resume:
{latex_input}

Improve wording, strengthen achievements, match the new context.
Keep format exactly same. Output only LaTeX.
"""

    payload = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"parts": [{"text": user_prompt}]}]
    }

    raw = call_gemini(gemini_key, payload)
    enhanced = extract_text(raw)

    # -------------------- Store new version --------------------
    resume_id = str(uuid.uuid4())
    entry = {
        "id": resume_id,
        "latex": enhanced,
        "generated_at": datetime.utcnow().isoformat()
    }

    users.update_one(
        {"email": email},
        {"$push": {"generated_resumes": entry}}
    )

    # -------------------- Save .tex --------------------
    temp_folder = settings.TEMP_FOLDER
    os.makedirs(temp_folder, exist_ok=True)

    tex_path = os.path.join(temp_folder, f"{resume_id}.tex")
    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(enhanced)

    return JsonResponse({"success": True, "id": resume_id, "latex": enhanced})


# ============================================================
# 3) DOWNLOAD LATEX FILE
# GET /user/resume/download/<id>/
# ============================================================

def resume_download(request, id):

    email = request.session.get("email")
    if not email:
        return JsonResponse({"error": "Not logged in"}, status=401)

    tex_path = os.path.join(settings.TEMP_FOLDER, f"{id}.tex")

    if not os.path.exists(tex_path):
        return JsonResponse({"error": "File not found"}, status=404)

    with open(tex_path, "r", encoding="utf-8") as f:
        latex = f.read()

    response = HttpResponse(latex, content_type="text/plain")
    response["Content-Disposition"] = f"attachment; filename={id}.tex"
    return response


# ============================================================
# 4) LATEX → PDF
# GET /user/resume/pdf/<id>/
# ============================================================
import os
import re
import tempfile
import subprocess
from django.http import JsonResponse, FileResponse
from django.conf import settings


def clean_latex(text):
    """Remove characters that break pdflatex."""
    text = text.replace("\u2013", "-")
    text = text.replace("\u2014", "-")
    text = text.replace("\u00A0", " ")
    text = re.sub(r"[^\x00-\x7F]+", " ", text)  # remove all unicode
    return text

def resume_pdf(request, id):

    email = request.session.get("email")
    if not email:
        return JsonResponse({"error": "Not logged in"}, status=401)

    tex_path = os.path.join(settings.TEMP_FOLDER, f"{id}.tex")

    if not os.path.exists(tex_path):
        return JsonResponse({"error": "LaTeX file not found"}, status=404)

    with open(tex_path, "r", encoding="utf-8") as f:
        latex_raw = f.read()

    latex_cleaned = clean_latex(latex_raw)

    with tempfile.TemporaryDirectory() as tmp:

        local_tex = os.path.join(tmp, "resume.tex")
        local_pdf = os.path.join(tmp, "resume.pdf")

        with open(local_tex, "w", encoding="utf-8") as f:
            f.write(latex_cleaned)

        try:
            result = subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", "resume.tex"],
                cwd=tmp,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=60,
                text=True
            )
        except subprocess.TimeoutExpired:
            return JsonResponse({"error": "PDF generation timeout"}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        if not os.path.exists(local_pdf):

            log_path = os.path.join(tmp, "resume.log")
            log_text = ""
            if os.path.exists(log_path):
                with open(log_path, "r", errors="ignore") as lf:
                    log_text = lf.read()

            return JsonResponse({
                "error": "pdflatex failed",
                "stdout": result.stdout,
                "stderr": result.stderr,
                "log": log_text,
            }, status=500)

        # *** FIX: READ PDF INTO MEMORY BEFORE TEMP FOLDER DELETES ***
        import io
        with open(local_pdf, "rb") as f:
            pdf_bytes = f.read()

        return FileResponse(
            io.BytesIO(pdf_bytes),
            content_type="application/pdf",
            as_attachment=True,
            filename="resume.pdf"
        )


# ============================================================
# 5) PREP HUB - COMPANY SEARCH
# POST /resume/prep-hub/search/
# ============================================================

@csrf_exempt
@require_http_methods(["POST"])
def prep_hub_search(request):
    """Generate all prep hub data for a company."""
    try:
        email = request.session.get("email")
        if not email:
            return JsonResponse({"error": "Not logged in"}, status=401)

        user = users.find_one({"email": email})
        if not user:
            return JsonResponse({"error": "User not found"}, status=404)

        gemini_key = user.get("gemini_key")
        if not gemini_key:
            return JsonResponse({"error": "Gemini API key not found. Please add it in Settings."}, status=400)

        try:
            body = json.loads(request.body)
        except:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        company_name = body.get("company_name")
        if not company_name:
            return JsonResponse({"error": "Missing company_name"}, status=400)

        # Generate all data using Gemini
        system_prompt = """You are an expert career coach and technical interview preparation specialist. 
Generate comprehensive interview preparation data for companies. 
Always return valid JSON format only, no markdown, no explanations."""

        user_prompt = f"""Generate comprehensive interview preparation data for {company_name}.

Return a JSON object with the following structure:

{{
  "interview_questions": {{
    "technical_round_1": [
      {{"question": "question text", "answer": "brief answer or approach"}},
      ...
    ],
    "technical_round_2": [
      {{"question": "question text", "answer": "brief answer or approach"}},
      ...
    ],
    "hr_round": [
      {{"question": "question text", "answer": "brief answer or approach"}},
      ...
    ]
  }},
  "preparation_roadmap": {{
    "weeks": [
      {{
        "week_number": 1,
        "foundations": "description of what to build this week",
        "time_commitment_per_day": "X hours",
        "topics": ["topic1", "topic2", ...]
      }},
      ...
    ]
  }},
  "leetcode_problems": [
    {{
      "id": 1,
      "problem_name": "Problem Name",
      "difficulty": "Easy/Medium/Hard",
      "frequency": "High/Medium/Low",
      "url": "https://leetcode.com/problems/problem-slug/"
    }},
    ...
  ],
  "tech_stack": {{
    "required_skills": ["skill1", "skill2", ...],
    "preferred_skills": ["skill1", "skill2", ...],
    "frameworks": ["framework1", "framework2", ...],
    "databases": ["db1", "db2", ...]
  }}
}}

Generate realistic data based on {company_name}'s typical interview process and tech stack.
Include at least 5 questions per round, 4-6 weeks of roadmap, 10-15 leetcode problems, and comprehensive tech stack.
For LeetCode problems, provide actual LeetCode problem URLs in the format: https://leetcode.com/problems/problem-slug/
Return ONLY the JSON object, no markdown formatting."""

        payload = {
            "systemInstruction": {"parts": [{"text": system_prompt}]},
            "contents": [{"parts": [{"text": user_prompt}]}]
        }

        try:
            raw = call_gemini(gemini_key, payload)
            response_text = extract_text(raw)
            
            # Clean the response - remove markdown code blocks if present
            response_text = response_text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            # Parse JSON
            data = json.loads(response_text)
            
            return JsonResponse({
                "success": True,
                "company_name": company_name,
                "data": data
            })
        except json.JSONDecodeError as e:
            return JsonResponse({
                "error": f"Failed to parse AI response as JSON: {str(e)}",
                "raw_response": response_text[:500] if 'response_text' in locals() else "No response"
            }, status=500)
        except Exception as e:
            return JsonResponse({"error": f"Gemini API error: {str(e)}"}, status=500)
    except Exception as e:
        import traceback
        print(f"Prep hub search error: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)