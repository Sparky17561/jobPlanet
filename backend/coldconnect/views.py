import json
import time
import io
import requests
from PyPDF2 import PdfReader
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


MODEL_NAME = "gemini-2.5-flash-preview-09-2025"


# ===========================
# COMMON HELPERS
# ===========================

def extract_pdf_text(file_obj):
    """Extract plain text from uploaded PDF file."""
    pdf_reader = PdfReader(file_obj)
    text = "\n".join(page.extract_text() or "" for page in pdf_reader.pages)
    return text.strip()


def extract_gemini_response(api_response):
    """Extract text + sources."""
    candidate = api_response.get("candidates", [{}])[0]

    text = (
        candidate
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
    )

    sources = []
    grounding = candidate.get("groundingMetadata", {})

    if grounding and grounding.get("groundingAttributions"):
        sources = [
            f"Source: {attr.get('web', {}).get('title', 'N/A')} ({attr.get('web', {}).get('uri', 'N/A')})"
            for attr in grounding["groundingAttributions"]
        ]

    return text, sources


def call_gemini(api_key, payload):
    """Real Gemini API call with retry."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}

    for attempt in range(3):
        try:
            res = requests.post(url, headers=headers, json=payload)
            res.raise_for_status()
            return res.json()
        except requests.exceptions.RequestException as e:
            if attempt == 2:
                raise e
            time.sleep(2 ** attempt)


# =========================================================
# 1. COLD MAIL VIEW
# =========================================================
@csrf_exempt
@require_http_methods(["POST"])
def cold_mail_view(request):

    required = ["job_description", "company_name", "tone", "gemini_api_key"]

    for field in required:
        if not request.POST.get(field):
            return JsonResponse({"error": f"Missing field: {field}"}, status=400)

    if "resume_file" not in request.FILES:
        return JsonResponse({"error": "Missing PDF file: resume_file"}, status=400)

    pdf_file = request.FILES["resume_file"]
    resume_text = extract_pdf_text(pdf_file)

    system_prompt = (
        "You are an expert career coach. Write a personalized cold email including a Subject line "
        "using the resume content provided."
    )

    user_query = (
        f"Write a cold email for the role of {request.POST['job_description']} "
        f"at {request.POST['company_name']}.\n\n"
        f"Resume:\n{resume_text}\n\n"
        f"Tone: {request.POST['tone']}"
    )

    payload = {
        "contents": [{"parts": [{"text": user_query}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]}
    }

    try:
        raw = call_gemini(request.POST["gemini_api_key"], payload)
    except Exception as e:
        return JsonResponse({"error": f"Gemini API error: {e}"}, status=503)

    text, sources = extract_gemini_response(raw)

    # Separate subject + body
    subject = ""
    body = text

    if text.lower().startswith("subject:"):
        parts = text.split("\n", 1)
        subject = parts[0].replace("Subject:", "").strip()
        body = parts[1].strip() if len(parts) > 1 else ""

    return JsonResponse({
        "success": True,
        "subject": subject,
        "body": body,
        "sources": sources
    }, status=200)


# =========================================================
# 2. COLD DM VIEW
# =========================================================
@csrf_exempt
@require_http_methods(["POST"])
def cold_dm_view(request):

    required = ["job_description", "company_name", "letter_size", "gemini_api_key"]

    for field in required:
        if not request.POST.get(field):
            return JsonResponse({"error": f"Missing field: {field}"}, status=400)

    if "resume_file" not in request.FILES:
        return JsonResponse({"error": "Missing PDF file: resume_file"}, status=400)

    resume_text = extract_pdf_text(request.FILES["resume_file"])

    system_prompt = (
        "Write a concise LinkedIn-style DM, strictly within the given character limit."
    )

    user_query = (
        f"Cold DM for role: {request.POST['job_description']} at {request.POST['company_name']}\n"
        f"Resume:\n{resume_text}\n"
        f"Character limit: {request.POST['letter_size']}"
    )

    payload = {
        "contents": [{"parts": [{"text": user_query}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]}
    }

    try:
        raw = call_gemini(request.POST["gemini_api_key"], payload)
    except Exception as e:
        return JsonResponse({"error": f"Gemini API error: {e}"}, status=503)

    text, sources = extract_gemini_response(raw)

    return JsonResponse({
        "success": True,
        "message": text.strip(),
        "sources": sources
    }, status=200)


# =========================================================
# 3. COVER LETTER VIEW
# =========================================================
@csrf_exempt
@require_http_methods(["POST"])
def cover_letter_view(request):

    required = ["job_description", "company_name", "gemini_api_key"]

    for field in required:
        if not request.POST.get(field):
            return JsonResponse({"error": f"Missing field: {field}"}, status=400)

    if "resume_file" not in request.FILES:
        return JsonResponse({"error": "Missing PDF file: resume_file"}, status=400)

    resume_text = extract_pdf_text(request.FILES["resume_file"])

    system_prompt = (
        "Write a detailed, professional, structured cover letter tailored to the role "
        "and directly referencing the resume content."
    )

    user_query = (
        f"Cover letter for {request.POST['job_description']} at {request.POST['company_name']}.\n\n"
        f"Resume:\n{resume_text}"
    )

    payload = {
        "contents": [{"parts": [{"text": user_query}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]}
    }

    try:
        raw = call_gemini(request.POST["gemini_api_key"], payload)
    except Exception as e:
        return JsonResponse({"error": f"Gemini API error: {e}"}, status=503)

    text, sources = extract_gemini_response(raw)

    return JsonResponse({
        "success": True,
        "cover_letter": text.strip(),
        "sources": sources
    }, status=200)
