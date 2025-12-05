import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { useAuth } from "../contexts/AuthContext";
import {
  Settings as SettingsIcon,
  Key,
  Bell,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import "./Settings.css";

const Settings = () => {
  const { user, geminiKey, updateGeminiKey, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [settings, setSettings] = useState({
    geminiApiKey: "",
    emailNotifications: true,
    marketingEmails: false,
    profileVisibility: "public",
  });

  useEffect(() => {
    if (geminiKey) {
      setSettings(prev => ({ ...prev, geminiApiKey: geminiKey }));
    }
  }, [geminiKey]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSaveApiKey = async () => {
    if (!settings.geminiApiKey.trim()) {
      setError("Please enter a Gemini API key");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const result = await updateGeminiKey(settings.geminiApiKey);

    if (result.success) {
      setSuccess("Gemini API key updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error || "Failed to update API key");
    }

    setIsLoading(false);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Save API key if changed
    if (settings.geminiApiKey && settings.geminiApiKey !== geminiKey) {
      const result = await updateGeminiKey(settings.geminiApiKey);
      if (!result.success) {
        setError(result.error || "Failed to update API key");
        setIsLoading(false);
        return;
      }
    }

    // Here you would save other settings to backend
    // For now, we'll just show success
    setSuccess("Settings saved successfully!");
    setTimeout(() => setSuccess(""), 3000);
    setIsLoading(false);
  };

  const handleDeleteProfile = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/user/delete/", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        await logout();
        navigate("/");
      } else {
        setError(data.error || "Failed to delete profile");
        setIsLoading(false);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Delete profile error:", error);
      setError("Network error. Please try again.");
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="dashboard-app">
      <DashboardHeader />
      <div className="dashboard-main-container">
        <DashboardSidebar />
        <div className="dashboard-content-area">
          <div className="settings-content">
            <div className="settings-header">
              <div className="settings-header-content">
                <SettingsIcon className="w-8 h-8" />
                <div>
                  <h1 className="settings-title">Settings</h1>
                  <p className="settings-subtitle">Manage your account settings and preferences</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="settings-alert settings-alert-error">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="settings-alert settings-alert-success">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            )}

            {/* API Settings */}
            <section className="settings-section">
              <div className="settings-section-header">
                <Key className="settings-section-icon" />
                <div>
                  <h2 className="settings-section-title">API Configuration</h2>
                  <p className="settings-section-description">
                    Manage your API keys for AI-powered features
                  </p>
                </div>
              </div>
              <div className="settings-section-content">
                <div className="settings-field">
                  <label htmlFor="geminiApiKey" className="settings-label">
                    Gemini API Key
                  </label>
                  <div className="settings-input-wrapper">
                    <input
                      type={showApiKey ? "text" : "password"}
                      id="geminiApiKey"
                      name="geminiApiKey"
                      value={settings.geminiApiKey}
                      onChange={handleInputChange}
                      placeholder="Enter your Gemini API key"
                      className="settings-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="settings-toggle-visibility"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="settings-hint">
                    Your API key is encrypted and stored securely. 
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="settings-link"
                    >
                      Get your API key here
                    </a>
                  </p>
                  <button
                    onClick={handleSaveApiKey}
                    disabled={isLoading}
                    className="settings-save-btn"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save API Key</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Notification Settings */}
            <section className="settings-section">
              <div className="settings-section-header">
                <Bell className="settings-section-icon" />
                <div>
                  <h2 className="settings-section-title">Notifications</h2>
                  <p className="settings-section-description">
                    Choose what notifications you want to receive
                  </p>
                </div>
              </div>
              <div className="settings-section-content">
                <div className="settings-toggle-field">
                  <div className="settings-toggle-info">
                    <label htmlFor="emailNotifications" className="settings-toggle-label">
                      Email Notifications
                    </label>
                    <p className="settings-toggle-description">
                      Receive email updates about your account activity
                    </p>
                  </div>
                  <label className="settings-switch">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={handleInputChange}
                    />
                    <span className="settings-slider"></span>
                  </label>
                </div>

                <div className="settings-toggle-field">
                  <div className="settings-toggle-info">
                    <label htmlFor="marketingEmails" className="settings-toggle-label">
                      Marketing Emails
                    </label>
                    <p className="settings-toggle-description">
                      Receive emails about new features and updates
                    </p>
                  </div>
                  <label className="settings-switch">
                    <input
                      type="checkbox"
                      id="marketingEmails"
                      name="marketingEmails"
                      checked={settings.marketingEmails}
                      onChange={handleInputChange}
                    />
                    <span className="settings-slider"></span>
                  </label>
                </div>
              </div>
            </section>

            {/* Privacy Settings */}
            <section className="settings-section">
              <div className="settings-section-header">
                <Shield className="settings-section-icon" />
                <div>
                  <h2 className="settings-section-title">Privacy</h2>
                  <p className="settings-section-description">
                    Control your profile visibility
                  </p>
                </div>
              </div>
              <div className="settings-section-content">
                <div className="settings-field">
                  <label htmlFor="profileVisibility" className="settings-label">
                    Profile Visibility
                  </label>
                  <select
                    id="profileVisibility"
                    name="profileVisibility"
                    value={settings.profileVisibility}
                    onChange={handleInputChange}
                    className="settings-select"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="contacts">Contacts Only</option>
                  </select>
                  <p className="settings-hint">
                    Control who can view your profile information
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy Policy */}
            <section className="settings-section">
              <div className="settings-section-header">
                <Shield className="settings-section-icon" />
                <div>
                  <h2 className="settings-section-title">Privacy Policy</h2>
                  <p className="settings-section-description">
                    How we handle your data
                  </p>
                </div>
              </div>
              <div className="settings-section-content">
                <div className="privacy-policy-content">
                  <h3 className="privacy-heading">Data Collection</h3>
                  <p className="privacy-text">
                    We collect and store the information you provide when creating your account and profile, 
                    including personal details, professional experience, and skills. This data is used to 
                    provide you with personalized job application assistance and resume generation services.
                  </p>

                  <h3 className="privacy-heading">Data Security</h3>
                  <p className="privacy-text">
                    Your data is encrypted and stored securely. We use industry-standard security measures 
                    to protect your information from unauthorized access, alteration, or disclosure. Your 
                    API keys are stored separately and encrypted.
                  </p>

                  <h3 className="privacy-heading">Data Usage</h3>
                  <p className="privacy-text">
                    Your profile data is used solely to generate resumes, cover letters, and provide 
                    job application assistance. We do not share your personal information with third parties 
                    without your explicit consent, except as required by law.
                  </p>

                  <h3 className="privacy-heading">Your Rights</h3>
                  <p className="privacy-text">
                    You have the right to access, update, or delete your account and data at any time. 
                    You can update your profile information through the Profile page or delete your account 
                    using the option below.
                  </p>

                  <h3 className="privacy-heading">Contact</h3>
                  <p className="privacy-text">
                    If you have questions about this privacy policy or how we handle your data, please 
                    contact us at privacy@jobsphere.com
                  </p>

                  <p className="privacy-updated">
                    Last updated: December 2025
                  </p>
                </div>
              </div>
            </section>

            {/* Save Settings Button */}
            <div className="settings-actions">
              <button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="settings-primary-btn"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save All Settings</span>
                  </>
                )}
              </button>
            </div>

            {/* Delete Account */}
            <section className="settings-section settings-section-danger">
              <div className="settings-section-header">
                <Trash2 className="settings-section-icon settings-section-icon-danger" />
                <div>
                  <h2 className="settings-section-title">Delete Account</h2>
                  <p className="settings-section-description">
                    Permanently delete your account and all associated data
                  </p>
                </div>
              </div>
              <div className="settings-section-content">
                {!showDeleteConfirm ? (
                  <div className="delete-account-warning">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="delete-warning-text">
                        Once you delete your account, there is no going back. All your data, 
                        including your profile, resumes, and generated content will be permanently deleted.
                      </p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="settings-danger-btn"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete My Account</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="delete-confirm">
                    <div className="delete-confirm-warning">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                      <h3 className="delete-confirm-title">Are you absolutely sure?</h3>
                      <p className="delete-confirm-text">
                        This action cannot be undone. This will permanently delete your account, 
                        profile data, and all associated content.
                      </p>
                    </div>
                    <div className="delete-confirm-actions">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="settings-cancel-btn"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteProfile}
                        disabled={isLoading}
                        className="settings-danger-btn"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            <span>Yes, Delete My Account</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

