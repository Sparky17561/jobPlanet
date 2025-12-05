import json
import bcrypt
from datetime import datetime
from pymongo import MongoClient
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


# MongoDB Setup
client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]
users_collection = db["users"]


# ============================================================
# 1) SIGNUP API
# ============================================================
@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    required = ["username", "email", "password", "gemini_key"]
    for f in required:
        if f not in data:
            return JsonResponse({"error": f"Missing field: {f}"}, status=400)

    # Check if user already exists
    if users_collection.find_one({"email": data["email"]}):
        return JsonResponse({"error": "User already exists"}, status=400)

    # Hash password
    hashed_password = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()

    # Create new user
    doc = {
        "username": data["username"],
        "email": data["email"],
        "password": hashed_password,
        "gemini_key": data["gemini_key"],
        "profile_data": {}
    }

    users_collection.insert_one(doc)

    # Store session
    request.session["email"] = data["email"]
    request.session["username"] = data["username"]

    return JsonResponse({"success": True, "message": "Signup successful"})


# ============================================================
# 2) LOGIN API
# ============================================================
@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    required = ["email", "password"]
    for f in required:
        if f not in data:
            return JsonResponse({"error": f"Missing field: {f}"}, status=400)

    user = users_collection.find_one({"email": data["email"]})
    if not user:
        return JsonResponse({"error": "User not found"}, status=404)

    if not bcrypt.checkpw(data["password"].encode(), user["password"].encode()):
        return JsonResponse({"error": "Incorrect password"}, status=401)

    # Set session
    request.session["email"] = user["email"]
    request.session["username"] = user["username"]

    return JsonResponse({"success": True, "message": "Login successful"})


# ============================================================
# 3) FETCH PROFILE DATA API
# ============================================================
@csrf_exempt
@require_http_methods(["GET"])
def fetch_profile(request):
    email = request.session.get("email")
    if not email:
        return JsonResponse({"error": "Not logged in"}, status=401)

    user = users_collection.find_one({"email": email})
    if not user:
        return JsonResponse({"error": "User not found"}, status=404)

    return JsonResponse({
        "success": True,
        "username": user["username"],
        "email": user["email"],
        "gemini_key": user.get("gemini_key", None),
        "profile_data": user.get("profile_data", {})
    })


# ============================================================
# 4) UPDATE PROFILE_DATA API
# ============================================================
@csrf_exempt
@require_http_methods(["POST"])
def update_profile_data(request):
    email = request.session.get("email")
    if not email:
        return JsonResponse({"error": "Not logged in"}, status=401)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if "profile_data" not in data:
        return JsonResponse({"error": "Missing profile_data"}, status=400)

    users_collection.update_one(
        {"email": email},
        {"$set": {"profile_data": data["profile_data"]}}
    )

    return JsonResponse({"success": True, "message": "Profile updated"})


# ============================================================
# 5) UPDATE GEMINI KEY API
# ============================================================
@csrf_exempt
@require_http_methods(["POST"])
def update_gemini_key(request):
    email = request.session.get("email")
    if not email:
        return JsonResponse({"error": "Not logged in"}, status=401)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if "gemini_key" not in data:
        return JsonResponse({"error": "Missing gemini_key"}, status=400)

    users_collection.update_one(
        {"email": email},
        {"$set": {"gemini_key": data["gemini_key"]}}
    )

    return JsonResponse({"success": True, "message": "Gemini key updated"})


