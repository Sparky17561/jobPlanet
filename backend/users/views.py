import json
import bcrypt
from datetime import datetime
from pymongo import MongoClient
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


# MongoDB Setup
def get_users_collection():
    """Get MongoDB users collection with error handling."""
    try:
        client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
        # Test connection
        client.server_info()
        db = client[settings.MONGO_DB_NAME]
        return db["users"]
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        print("Please ensure MongoDB is running on localhost:27017")
        raise

# Try to connect at module load, but don't fail if MongoDB is not running
try:
    users_collection = get_users_collection()
except Exception as e:
    print(f"Warning: MongoDB not available at startup: {e}")
    print("MongoDB connection will be attempted on first request")
    users_collection = None


# ============================================================
# 1) SIGNUP API
# ============================================================
@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    try:
        # Get MongoDB collection (reconnect if needed)
        global users_collection
        if users_collection is None:
            try:
                users_collection = get_users_collection()
            except Exception as e:
                return JsonResponse({"error": "Database connection failed. Please ensure MongoDB is running on localhost:27017"}, status=500)
        
        try:
            data = json.loads(request.body)
        except Exception as e:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        required = ["username", "email", "password"]
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
            "gemini_key": data.get("gemini_key", ""),  # Optional field
            "profile_data": {}
        }

        users_collection.insert_one(doc)

        # Store session
        request.session["email"] = data["email"]
        request.session["username"] = data["username"]

        return JsonResponse({"success": True, "message": "Signup successful"})
    except Exception as e:
        import traceback
        print(f"Signup error: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


# ============================================================
# 2) LOGIN API
# ============================================================
@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        # Get MongoDB collection (reconnect if needed)
        global users_collection
        if users_collection is None:
            try:
                users_collection = get_users_collection()
            except Exception as e:
                return JsonResponse({"error": "Database connection failed. Please ensure MongoDB is running on localhost:27017"}, status=500)
        
        try:
            data = json.loads(request.body)
        except Exception as e:
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
    except Exception as e:
        import traceback
        print(f"Login error: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


# ============================================================
# 3) FETCH PROFILE DATA API
# ============================================================
@csrf_exempt
@require_http_methods(["GET"])
def fetch_profile(request):
    try:
        # Get MongoDB collection (reconnect if needed)
        global users_collection
        if users_collection is None:
            try:
                users_collection = get_users_collection()
            except Exception as e:
                return JsonResponse({"error": "Database connection failed. Please ensure MongoDB is running on localhost:27017"}, status=500)
        
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
            "profile_data": user.get("profile_data", {}),
            "generated_resumes": user.get("generated_resumes", [])
        })
    except Exception as e:
        import traceback
        print(f"Fetch profile error: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


# ============================================================
# 4) UPDATE PROFILE_DATA API
# ============================================================
@csrf_exempt
@require_http_methods(["POST"])
def update_profile_data(request):
    try:
        # Get MongoDB collection (reconnect if needed)
        global users_collection
        if users_collection is None:
            try:
                users_collection = get_users_collection()
            except Exception as e:
                return JsonResponse({"error": "Database connection failed. Please ensure MongoDB is running on localhost:27017"}, status=500)
        
        email = request.session.get("email")
        if not email:
            return JsonResponse({"error": "Not logged in"}, status=401)

        try:
            data = json.loads(request.body)
        except Exception as e:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        if "profile_data" not in data:
            return JsonResponse({"error": "Missing profile_data"}, status=400)

        users_collection.update_one(
            {"email": email},
            {"$set": {"profile_data": data["profile_data"]}}
        )

        return JsonResponse({"success": True, "message": "Profile updated"})
    except Exception as e:
        import traceback
        print(f"Update profile error: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


# ============================================================
# 5) UPDATE GEMINI KEY API
# ============================================================
@csrf_exempt
@require_http_methods(["POST"])
def update_gemini_key(request):
    try:
        # Get MongoDB collection (reconnect if needed)
        global users_collection
        if users_collection is None:
            try:
                users_collection = get_users_collection()
            except Exception as e:
                return JsonResponse({"error": "Database connection failed. Please ensure MongoDB is running on localhost:27017"}, status=500)
        
        email = request.session.get("email")
        if not email:
            return JsonResponse({"error": "Not logged in"}, status=401)

        try:
            data = json.loads(request.body)
        except Exception as e:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        if "gemini_key" not in data:
            return JsonResponse({"error": "Missing gemini_key"}, status=400)

        users_collection.update_one(
            {"email": email},
            {"$set": {"gemini_key": data["gemini_key"]}}
        )

        return JsonResponse({"success": True, "message": "Gemini key updated"})
    except Exception as e:
        import traceback
        print(f"Update Gemini key error: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


# ============================================================
# 6) LOGOUT API
# ============================================================
@csrf_exempt
@require_http_methods(["POST"])
def logout(request):
    request.session.flush()
    return JsonResponse({"success": True, "message": "Logged out successfully"})


# ============================================================
# 7) DELETE ACCOUNT API
# ============================================================
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_account(request):
    try:
        # Get MongoDB collection (reconnect if needed)
        global users_collection
        if users_collection is None:
            try:
                users_collection = get_users_collection()
            except Exception as e:
                return JsonResponse({"error": "Database connection failed. Please ensure MongoDB is running on localhost:27017"}, status=500)
        
        email = request.session.get("email")
        if not email:
            return JsonResponse({"error": "Not logged in"}, status=401)

        # Delete user from database
        result = users_collection.delete_one({"email": email})
        
        if result.deleted_count > 0:
            # Flush session
            request.session.flush()
            return JsonResponse({"success": True, "message": "Account deleted successfully"})
        else:
            return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        import traceback
        print(f"Delete account error: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


