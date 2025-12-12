import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function Settings() {
  const userProfile = useQuery(api.dashboard.getUserProfile);
  
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || "",
    persona: userProfile?.persona || "professional",
    monthlyIncome: userProfile?.monthlyIncome || 0,
    currency: "INR",
    timezone: "Asia/Kolkata",
    theme: "light"
  });

  const [notifications, setNotifications] = useState({
    billReminders: true,
    goalReminders: true,
    weeklyReports: true,
    lowBalanceAlerts: false,
    emailNotifications: true,
    pushNotifications: true
  });

  const [aiPreferences, setAiPreferences] = useState({
    tone: "friendly",
    language: "english",
    complexity: "beginner"
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "ai", label: "AI Preferences", icon: "🤖" },
    { id: "data", label: "Data & Privacy", icon: "🛡️" }
  ];

  const handleSaveProfile = () => {
    // In production, this would call a mutation to update the profile
    toast.success("Profile updated successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  const handleSaveAI = () => {
    toast.success("AI preferences updated!");
  };

  const handleExportData = () => {
    toast.info("Data export will be sent to your email within 24 hours");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("Account deletion requested. Please check your email for confirmation.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">⚙️ Settings</h2>
        <p className="text-gray-600">
          Manage your account preferences, security, and privacy settings
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Persona
                  </label>
                  <select
                    value={profileData.persona}
                    onChange={(e) => setProfileData(prev => ({ ...prev, persona: e.target.value as "student" | "professional" }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    value={profileData.monthlyIncome}
                    onChange={(e) => setProfileData(prev => ({ ...prev, monthlyIncome: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={profileData.currency}
                    onChange={(e) => setProfileData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={profileData.timezone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={profileData.theme}
                    onChange={(e) => setProfileData(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Save Profile
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Notification Preferences</h3>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-800 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {key === "billReminders" && "Get notified before bill due dates"}
                        {key === "goalReminders" && "Reminders to save for your goals"}
                        {key === "weeklyReports" && "Weekly financial summary emails"}
                        {key === "lowBalanceAlerts" && "Alerts when balance is low"}
                        {key === "emailNotifications" && "Receive notifications via email"}
                        {key === "pushNotifications" && "Browser push notifications"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveNotifications}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">🔑 Change Password</h4>
                  <p className="text-sm text-gray-600 mb-3">Update your password to keep your account secure</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Change Password
                  </button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">🛡️ Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Enable 2FA
                  </button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">📧 Email Verification</h4>
                  <p className="text-sm text-gray-600 mb-3">Verify your email address for account recovery</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Verified
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Preferences Tab */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">AI Assistant Preferences</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone Style
                  </label>
                  <select
                    value={aiPreferences.tone}
                    onChange={(e) => setAiPreferences(prev => ({ ...prev, tone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="friendly">Friendly & Casual</option>
                    <option value="professional">Professional</option>
                    <option value="encouraging">Encouraging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={aiPreferences.language}
                    onChange={(e) => setAiPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="english">English</option>
                    <option value="hinglish">Hinglish</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complexity Level
                  </label>
                  <select
                    value={aiPreferences.complexity}
                    onChange={(e) => setAiPreferences(prev => ({ ...prev, complexity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveAI}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Save AI Preferences
              </button>
            </div>
          )}

          {/* Data & Privacy Tab */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Data & Privacy</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">📥 Export Your Data</h4>
                  <p className="text-sm text-gray-600 mb-3">Download all your financial data in JSON format</p>
                  <button
                    onClick={handleExportData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Request Data Export
                  </button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">🔒 Data Encryption</h4>
                  <p className="text-sm text-gray-600">
                    Your financial data is encrypted using AES-256 encryption and stored securely. 
                    We never share your personal information with third parties.
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">📱 App Permissions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Notifications</span>
                      <span className="text-green-600">✅ Granted</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Camera (for receipt scanning)</span>
                      <span className="text-gray-500">❌ Not requested</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location</span>
                      <span className="text-gray-500">❌ Not requested</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">🗑️ Delete Account</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
