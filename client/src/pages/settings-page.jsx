"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Eye, EyeOff, Globe, Lock, User, Trash2, AlertTriangle, Bell, Shield } from "lucide-react"
import { IoMdSettings } from "react-icons/io";
import ToggleTabs from "@/components/customs/toggle-tabs"
import { TbCurrencyRupeeNepalese } from "react-icons/tb";
import { RiEnglishInput } from "react-icons/ri";
import { useEffect } from "react"

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account")
  const [currentUser, setCurrentUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
  })

  const [language, setLanguage] = useState("english")
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [editingAccount, setEditingAccount] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem("preferredLanguage")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [language])

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    localStorage.setItem("preferredLanguage", lang)
  }


  const [accountForm, setAccountForm] = useState(currentUser)

  const handleAccountChange = (field, value) => {
    setAccountForm({ ...accountForm, [field]: value })
  }

  const handleSaveAccount = () => {
    setCurrentUser(accountForm)
    setEditingAccount(false)
  }

  const handlePasswordChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value })
  }

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!")
      return
    }
    if (passwords.new.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }
    setPasswords({ current: "", new: "", confirm: "" })
    alert("Password changed successfully!")
  }

  const settingsTabs = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <div className="min-h-screen bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Main container with sidebar and content */}
      <div className="flex h-screen">
        {/* Left Sidebar Navigation */}
        <div className="w-56 bg-white border-r border-border">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 text-teal-600"> <IoMdSettings className="w-8 h-8" /> Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account</p>
          </div>

          {/* Settings Menu */}
          <div className="p-4 space-y-2 font-google-sans font-semibold text-md">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center text-sm cursor-pointer gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                    ? "bg-teal-100 text-teal-700 font-semibold"
                    : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Account Information</h2>

                  {/* User Info Card */}
                  <div className="bg-teal-50 rounded-lg p-6 border border-teal-200 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">{currentUser.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{currentUser.name}</h3>
                        <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                      </div>
                    </div>

                    {!editingAccount && (
                      <Button
                        onClick={() => setEditingAccount(true)}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                      >
                        Edit Account
                      </Button>
                    )}
                  </div>

                  {/* Edit Form */}
                  {editingAccount && (
                    <div className="bg-white border border-border rounded-lg p-6 space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={accountForm.name}
                          onChange={(e) => handleAccountChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={accountForm.email}
                          onChange={(e) => handleAccountChange("email", e.target.value)}
                          placeholder="Enter your email"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={accountForm.phone}
                          onChange={(e) => handleAccountChange("phone", e.target.value)}
                          placeholder="Enter your phone number"
                          className="mt-2"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSaveAccount} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
                          Save Changes
                        </Button>
                        <Button onClick={() => setEditingAccount(false)} variant="outline" className="flex-1 text-white cursor-pointer">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Account Details Table */}
                  {!editingAccount && (
                    <div className="bg-white border border-border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <tbody>
                          <tr className="border-b border-border">
                            <td className="px-6 py-3 bg-gray-50 font-medium text-sm text-muted-foreground">Name</td>
                            <td className="px-6 py-3 text-foreground">{currentUser.name}</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="px-6 py-3 bg-gray-50 font-medium text-sm text-muted-foreground">Email</td>
                            <td className="px-6 py-3 text-foreground">{currentUser.email}</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-3 bg-gray-50 font-medium text-sm text-muted-foreground">Phone</td>
                            <td className="px-6 py-3 text-foreground">{currentUser.phone}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Security Settings</h2>

                {/* Change Password */}
                <div className="bg-white border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-teal-600" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password" className="text-sm font-medium">
                        Current Password
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          value={passwords.current}
                          onChange={(e) => handlePasswordChange("current", e.target.value)}
                          placeholder="Enter current password"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new-password" className="text-sm font-medium">
                        New Password
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={passwords.new}
                          onChange={(e) => handlePasswordChange("new", e.target.value)}
                          placeholder="Enter new password"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password" className="text-sm font-medium">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                        placeholder="Confirm new password"
                        className="mt-2"
                      />
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      className="w-full bg-teal-600 cursor-pointer hover:bg-teal-700 text-white mt-4"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-red-600 cursor-pointer hover:bg-red-700 text-white gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete your account? This action cannot be undone and all your data
                          will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex gap-3">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Preferences</h2>

                {/* Language Selection */}
                <div className="bg-white border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-teal-600" />
                    Language
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="language" className="text-sm font-medium ">
                        Select Language
                      </Label>
                      <ToggleTabs
                        options={[
                          { label: "English", icon: <RiEnglishInput className="w-4 h-4" /> },
                          { label: "मराठी", icon: <TbCurrencyRupeeNepalese className="w-4 h-4" /> },
                        ]}
                        defaultActive="English"
                        onChange={handleLanguageChange}
                        className="bg-slate-100/50 border-none p-1 my-2 cursor-pointer rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Selected Language: {language === "english" ? "English" : "मराठी"}
                      </p>
                    </div>

                    <Button className="w-full cursor-pointer bg-teal-600 hover:bg-teal-700 text-white mt-4">Save Preferences</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Notifications</h2>

                <div className="bg-white border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Notification Type</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Enabled</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-foreground">Email Notifications</td>
                        <td className="px-6 py-3 text-center">
                          <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                        </td>
                      </tr>
                      <tr className="border-b border-border hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-foreground">Service Updates</td>
                        <td className="px-6 py-3 text-center">
                          <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-foreground">Admin Alerts</td>
                        <td className="px-6 py-3 text-center">
                          <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
