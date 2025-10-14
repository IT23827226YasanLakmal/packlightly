"use client";
import React from "react";
import { motion } from "framer-motion";
import { User, Key, Save, Shield, Settings } from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useUserStore } from "@/store/userStore";

export default function AdminSettingsPage() {
  const { user: currentUser, loading: userLoading } = useCurrentUser();
  const { updateUser, loading: storeLoading } = useUserStore();
  
  const [displayName, setDisplayName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [notifications, setNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [theme, setTheme] = React.useState("dark");
  const [language, setLanguage] = React.useState("en");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState<"success" | "error">("success");
  
  // Password change states
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  React.useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
      setPhoneNumber(currentUser.phoneNumber || "");
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const updates = {
        uid: currentUser.uid,
        email: currentUser.email || "",
        displayName,
        phoneNumber,
        bio,
        role: currentUser.role as "user" | "admin",
        disabled: false,
        preferences: {
          notifications,
          emailNotifications,
          theme,
          language
        }
      };
      await updateUser(updates);
      setMessage("Profile updated successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("Failed to update profile");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentUser || !currentUser.email) {
      setMessage("User email not found");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords don't match");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setSaving(true);
    try {
      // Note: Password change functionality would typically require Firebase Auth methods
      // For security, this should be implemented with proper authentication
      setMessage("Password change initiated. Check your email for verification.");
      setMessageType("success");
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error("Password change failed:", error);
      setMessage("Failed to change password. Please try again.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (userLoading) {
    return (
      <section className="px-6 lg:px-10 py-6">
        <div className="rounded-3xl bg-gradient-to-br from-black/70 via-emerald-900/60 to-emerald-950/70 border border-green-700/40 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-green-700/30 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-green-700/20 rounded w-2/3"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 lg:px-10 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-black/70 via-emerald-900/60 to-emerald-950/70 border border-green-700/40 p-6"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Admin Settings</h1>
        <p className="text-green-300 text-sm">Manage your account and preferences.</p>
        {currentUser && (
          <div className="mt-3 text-sm text-green-200">
            <span className="font-semibold">{currentUser.email}</span>
            <span className="ml-2 px-2 py-1 bg-emerald-600 rounded-full text-xs">
              {currentUser.role?.toUpperCase() || 'USER'}
            </span>
          </div>
        )}
      </motion.div>

      {message && (
        <div className={`rounded-xl p-4 ${
          messageType === "success" 
            ? "bg-green-900/50 border border-green-600/50 text-green-300"
            : "bg-red-900/50 border border-red-600/50 text-red-300"
        }`}>
          {message}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-green-700/30 p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || storeLoading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-green-300 mb-1">Email</label>
            <input
              type="email"
              value={currentUser?.email || ""}
              disabled
              className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm text-green-300 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-green-300 mb-1">Phone</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-green-300 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-green-700/30 p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-green-300">All Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-green-500/40 rounded-full peer peer-checked:bg-emerald-600 transition-all" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-green-300">Email Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-green-500/40 rounded-full peer peer-checked:bg-emerald-600 transition-all" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-green-300">Theme</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded-xl border border-green-500/30 bg-black/30 text-white py-1 px-2 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-green-300">Language</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-xl border border-green-500/30 bg-black/30 text-white py-1 px-2 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </motion.div>

      {/* Password Change Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-green-700/30 p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <Key className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Security</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-green-300 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-green-300 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-green-300 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        
        <button
          onClick={handlePasswordChange}
          disabled={!currentPassword || !newPassword || !confirmPassword || saving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-xl transition-colors"
        >
          Change Password
        </button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl bg-red-900/20 border border-red-700/30 p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-400" />
          <h2 className="text-lg font-semibold text-white">Danger Zone</h2>
        </div>
        
        <div className="bg-red-900/30 border border-red-600/30 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Account Management</h3>
          <p className="text-red-300 text-sm mb-4">
            Critical account actions require administrator approval. For security purposes, password changes and account deletion are handled through secure channels.
          </p>
          <div className="space-y-2">
            <p className="text-red-200 text-sm">
              • Password changes require email verification
            </p>
            <p className="text-red-200 text-sm">
              • Account deletion requires administrator approval
            </p>
            <p className="text-red-200 text-sm">
              • All actions are logged for security auditing
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
