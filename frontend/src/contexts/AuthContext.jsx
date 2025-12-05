import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [geminiKey, setGeminiKey] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:8000/user/profile/", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser({ email: data.email, username: data.username });
          setProfileData(data.profile_data || {});
          setGeminiKey(data.gemini_key || null);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Fetch profile data
        const profileResponse = await fetch("http://localhost:8000/user/profile/", {
          method: "GET",
          credentials: "include",
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUser({ email: profileData.email, username: profileData.username });
          setProfileData(profileData.profile_data || {});
          setGeminiKey(profileData.gemini_key || null);

          // Check if profile is complete
          const hasProfileData = profileData.profile_data && 
            Object.keys(profileData.profile_data).length > 0 &&
            profileData.profile_data.personal;

          if (hasProfileData) {
            navigate("/dashboard");
          } else {
            navigate("/profile/update");
          }
        }
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch("http://localhost:8000/user/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser({ email, username });
        setProfileData({});
        navigate("/profile/update");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed" };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/user/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setProfileData(null);
      setGeminiKey(null);
      navigate("/");
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch("http://localhost:8000/user/profile/update/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ profile_data: profileData }),
      });

      const data = await response.json();

      if (data.success) {
        setProfileData(profileData);
        navigate("/dashboard");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Profile update failed" };
      }
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/user/profile/", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser({ email: data.email, username: data.username });
          const profileDataWithResumes = {
            ...(data.profile_data || {}),
            generated_resumes: data.generated_resumes || [],
          };
          setProfileData(profileDataWithResumes);
          setGeminiKey(data.gemini_key || null);
          return profileDataWithResumes;
        }
      }
      return null;
    } catch (error) {
      console.error("Fetch profile error:", error);
      return null;
    }
  }, []); // Empty dependency array - function doesn't depend on any state/props

  const updateGeminiKey = async (key) => {
    try {
      const response = await fetch("http://localhost:8000/user/gemini/update/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ gemini_key: key }),
      });

      const data = await response.json();

      if (data.success) {
        setGeminiKey(key);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to update API key" };
      }
    } catch (error) {
      console.error("Update Gemini key error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const value = {
    user,
    profileData,
    loading,
    geminiKey,
    login,
    register,
    logout,
    updateProfile,
    fetchProfile,
    updateGeminiKey,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

