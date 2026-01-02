"use client"

import { useState, useEffect } from "react"
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
import { RiEnglishInput, RiShieldUserFill } from "react-icons/ri";
import { toast } from "sonner"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "react-i18next"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { FaLocationArrow, FaLock } from "react-icons/fa"
import { FaPencil } from "react-icons/fa6"
import Header from "@/components/shared/sytle-header"
import { MdAccountBox } from "react-icons/md"
import { ShieldUser } from "lucide-react"
import { GrLocal, GrMapLocation } from "react-icons/gr"
import { Square } from "lucide-react"
import { CheckSquare } from "lucide-react"

const SettingsPage = () => {
  const { currentLanguage, changeLanguage } = useLanguage()
  const { t } = useTranslation('common')
  const [activeTab, setActiveTab] = useState("account")
  const { admin } = useAdminAuth();
  const [currentUser, setCurrentUser] = useState({
    name: admin?.name,
    email: admin?.email,
    phone: admin?.phone,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    serviceUpdates: true,
    adminAlerts: true,
  })


  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [editingAccount, setEditingAccount] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleLanguageChange = (label) => {
    // Map label to language code
    const langCode = label === "English" ? "en" : "mr"
    changeLanguage(langCode)
  }

  // Get current language label for display
  const getCurrentLanguageLabel = () => {
    return currentLanguage === "mr" ? "मराठी" : "English"
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
      toast.warning(t("settings.passwordsDoNotMatch"))
      return
    }
    if (passwords.new.length < 6) {
      toast.warning(t("settings.passwordTooShort"))
      return
    }
    setPasswords({ current: "", new: "", confirm: "" })
    toast.success(t("settings.passwordChangedSuccess"))
  }

  const settingsTabs = [
    { id: "account", label: t("settings.account"), icon: User },
    { id: "security", label: t("settings.security"), icon: Lock },
    { id: "preferences", label: t("settings.preferences"), icon: RiEnglishInput },
    { id: "notifications", label: t("settings.notifications"), icon: Bell },
  ]

  return (
    <div className="min-h-screen bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Main container with sidebar and content */}
      <div className="flex h-screen">
        {/* Left Sidebar Navigation */}
        <div className="w-56 bg-white border-r border-border">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 text-teal-600"> <IoMdSettings className="w-8 h-8" /> {t("settings.title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("settings.manageAccount")}</p>
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
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MdAccountBox className="w-8 h-8 text-teal-600" /> {t("settings.accountInformation")}</h2>

                  {/* User Info Card */}
                  <div className="bg-teal-50 rounded-lg p-6 border border-teal-200 mb-6">
                    <div className="flex justify-between items-center gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">{currentUser?.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{currentUser?.name}</h3>
                          <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                        </div>
                      </div>
                      {admin.role === "superadmin" ? <div>
                        <Header flag={true} title={"SUPER ADMIN"} />
                      </div> : <div>
                        <Header title={"SITE ADMIN"} />
                      </div>
                      }
                    </div>

                    {!editingAccount && (
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => setEditingAccount(true)}
                          className="w-full bg-teal-600 rounded-xl hover:bg-teal-700 max-w-1/2 mx-auto text-white cursor-pointer"
                        >
                          <FaPencil />
                          {t("settings.editAccount")}
                        </Button>
                        <Button
                          onClick={() => setActiveTab("security")}
                          className="flex items-center rounded-xl gap-2 w-full bg-teal-600 hover:bg-teal-700 max-w-1/2 mx-auto text-white cursor-pointer"
                        >
                          <FaLock />  Edit Password
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Edit Form */}
                  {editingAccount && (
                    <div className="bg-white border border-border rounded-lg p-6 space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          {t("settings.fullName")}
                        </Label>
                        <Input
                          id="name"
                          value={accountForm.name}
                          onChange={(e) => handleAccountChange("name", e.target.value)}
                          placeholder={t("settings.enterFullName")}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          {t("settings.emailAddress")}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={accountForm.email}
                          onChange={(e) => handleAccountChange("email", e.target.value)}
                          placeholder={t("settings.enterEmail")}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          {t("settings.phoneNumber")}
                        </Label>
                        <Input
                          id="phone"
                          value={accountForm.phone}
                          onChange={(e) => handleAccountChange("phone", e.target.value)}
                          placeholder={t("settings.enterPhoneNumber")}
                          className="mt-2"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSaveAccount} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
                          {t("settings.saveChanges")}
                        </Button>
                        <Button onClick={() => setEditingAccount(false)} variant="outline" className="flex-1 text-white cursor-pointer">
                          {t("settings.cancel")}
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
                            <td className="px-6 py-3 bg-teal-50 font-semibold text-sm text-muted-foreground">{t("settings.name")}</td>
                            <td className="px-6 py-3 font-medium text-foreground">{currentUser?.name}</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="px-6 py-3 bg-teal-50 font-semibold text-sm text-muted-foreground">{t("settings.email")}</td>
                            <td className="px-6 py-3 font-medium text-foreground">
                              <a href={`mailto:${currentUser?.email}`} target="_blank" className="text-teal-600 underline">{currentUser?.email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-3 bg-teal-50 font-semibold text-sm text-muted-foreground">{t("settings.phone")}</td>
                            <td className="px-6 py-3 font-medium text-foreground">IN +91 {currentUser?.phone}</td>
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
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><RiShieldUserFill className="w-8 h-8 text-teal-600" />{t("settings.securitySettings")}</h2>

                {/* Change Password */}
                <div className="bg-white border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-teal-600" />
                    {t("settings.changePassword")}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password" className="text-sm font-medium">
                        {t("settings.currentPassword")}
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          value={passwords.current}
                          onChange={(e) => handlePasswordChange("current", e.target.value)}
                          placeholder={t("settings.enterCurrentPassword")}
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
                        {t("settings.newPassword")}
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={passwords.new}
                          onChange={(e) => handlePasswordChange("new", e.target.value)}
                          placeholder={t("settings.enterNewPassword")}
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
                        {t("settings.confirmPassword")}
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                        placeholder={t("settings.confirmNewPassword")}
                        className="mt-2"
                      />
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      className="w-full bg-teal-600 cursor-pointer hover:bg-teal-700 text-white mt-4"
                    >
                      {t("settings.updatePassword")}
                    </Button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {t("settings.deleteAccount")}
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    {t("settings.deleteAccountWarning")}
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-red-600 cursor-pointer hover:bg-red-700 text-white gap-2">
                        <Trash2 className="w-4 h-4" />
                        {t("settings.deleteAccount")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("settings.deleteAccount")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("settings.deleteAccountConfirm")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex gap-3">
                        <AlertDialogCancel>{t("settings.cancel")}</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">{t("settings.delete")}</AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><FaLocationArrow className="w-5 h-5 text-teal-600" />{t("settings.preferences")}</h2>

                {/* Language Selection */}
                <div className="bg-white border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-teal-600" />
                    {t("settings.language")}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="language" className="text-sm font-medium ">
                        {t("settings.selectLanguage")}
                      </Label>
                      <ToggleTabs
                        key={currentLanguage}
                        options={[
                          { label: "English", icon: <RiEnglishInput className="w-4 h-4" /> },
                          { label: "मराठी", icon: <TbCurrencyRupeeNepalese className="w-4 h-4" /> },
                        ]}
                        defaultActive={getCurrentLanguageLabel()}
                        onChange={handleLanguageChange}
                        className="bg-slate-100/50 border-none p-1 my-2 cursor-pointer rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {t("settings.selectedLanguage")}: {getCurrentLanguageLabel()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><Bell className="w-8 h-8 text-teal-600" />{t("settings.notifications")}</h2>

                <div className="bg-white border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t("settings.notificationType")}</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">{t("settings.enabled")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-foreground">{t("settings.emailNotifications")}</td>
                        <td className="px-6 py-3 text-center">
                          <button onClick={
                            () => {
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: !notificationSettings.emailNotifications
                              });
                              toast.warning("Notification Setting has been updated!!.");
                            }}
                            className="hover:text-teal-600 cursor-pointer transition-colors">
                            {notificationSettings.emailNotifications ? (
                              <CheckSquare className="w-5 h-5 text-teal-600" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-border hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-foreground">{t("settings.serviceUpdates")}</td>
                        <td className="px-6 py-3 text-center">
                          <button onClick={
                            () => {
                              setNotificationSettings({
                                ...notificationSettings,
                                serviceUpdates: !notificationSettings.serviceUpdates
                              });
                              toast.warning("Notification Setting has been updated!!.");
                            }}
                            className="hover:text-teal-600 cursor-pointer transition-colors">
                            {notificationSettings.serviceUpdates ? (
                              <CheckSquare className="w-5 h-5 text-teal-600" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-foreground">{t("settings.adminAlerts")}</td>
                        <td className="px-6 py-3 text-center">
                          <button onClick={
                            () => {
                              setNotificationSettings({
                                ...notificationSettings,
                                adminAlerts: !notificationSettings.adminAlerts
                              });
                              toast.warning("Notification Setting has been updated!!.");
                            }}
                            className="hover:text-teal-600 cursor-pointer transition-colors">
                            {notificationSettings.adminAlerts ? (
                              <CheckSquare className="w-5 h-5 text-teal-600" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
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
