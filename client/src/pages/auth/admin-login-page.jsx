"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Mail, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { toast } from "sonner"
import Header from "@/components/shared/sytle-header"

const Login = () => {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const { login } = useAdminAuth()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setError("")

      if (!phone.trim() || !password.trim()) {
        setError(t("auth.pleaseFillAllFields"))
        return
      }

      setIsLoading(true)
      const response = await login(phone, password)

      if (response.success) {
        toast.success(t("auth.loginSuccess") || "Login successful")
        navigate("/admin")
      } else {
        setError(response.message || t("auth.loginFailed") || "Login failed")
        toast.error(response.message || t("auth.loginFailed") || "Login failed")
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to login"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden bg-teal-600">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.15)_0%,transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(13,148,136,0.15)_0%,transparent_50%)]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-8 max-w-lg">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-48 h-48 rounded-2xl bg-white shadow-lg border-2 border-teal-100">
              <img src="/logo-2.png" alt="logo" className="w-44 h-44 object-contain" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white leading-tight text-balance">
                {t("login.manageServices")} <span className="text-white">{t("login.services")}</span>{" "}
                {t("login.and")} <span className="text-white">{t("login.parts")}</span>
              </h1>
              <p className="text-base text-white max-w-md mx-auto text-pretty leading-relaxed">
                {t("login.dashboardDescription")}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6">
              {[t("login.realTimeTracking"), t("login.serviceManagement"), t("login.analyticsReports")].map(
                (feature, i) => (
                  <div
                    key={i}
                    className="flex justify-start mx-auto max-w-xs items-center gap-3 text-sm text-white"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="space-y-3">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white border-2 border-teal-100">
                  <img src="/logo-2.png" alt="logo" className="w-12 h-12 object-contain" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-teal-900"> <Header size={'text-5xl'} title={t("auth.welcomeBack")}/></h2>
              <p className="text-sm text-teal-700">{t("auth.signInToAccount")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-teal-900">{t("auth.emailAddress")}</label>
                <div className="relative group">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 group-focus-within:text-teal-700 transition-colors pointer-events-none z-10" />
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="8830xxxx788"
                    className="h-12 w-full pl-11 pr-4 bg-teal-50/50 border-teal-600 rounded-xl text-teal-900 placeholder:text-teal-600 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-teal-900">{t("auth.password")}</label>
                  <a href="#" className="text-xs text-teal-600 hover:text-teal-800 transition-colors">
                    {t("auth.forgotPassword")}
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 group-focus-within:text-teal-700 transition-colors pointer-events-none z-10" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    disabled={isLoading}
                    className="h-12 w-full pl-11 pr-11 bg-teal-50/50 border-teal-600 rounded-xl text-teal-900 placeholder:text-teal-400 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-600 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-700 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t("auth.signingIn")}
                  </>
                ) : (
                  <>
                    {t("auth.signIn")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
