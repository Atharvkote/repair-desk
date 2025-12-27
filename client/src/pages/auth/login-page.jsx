"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react"
import { FaLock } from "react-icons/fa6"

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate("/admin/service")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-8">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-46 h-46 rounded-2xl bg-white shadow-lg animate-float">
              <img src="/logo-2.png" alt="logo" className="w-full h-full object-contain" />
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Manage Your{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Services
                </span>{" "}
                &{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Parts</span>
              </h1>
              <p className="text-lg text-foreground max-w-md mx-auto">
                Powerful admin dashboard to manage your entire inventory and service catalog effortlessly
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4">
              {["Real-time inventory tracking", "Complete service management", "Advanced analytics & reports"].map(
                (feature, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center gap-3 text-sm text-primary animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ),
              )}
            </div>


          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col bg-primary items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex lg:hidden items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white flex items-center gap-3"><FaLock className="w-8 h-8" /> Welcome back</h2>
              <p className="text-sm text-white">Sign in to your admin account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 animate-shake">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Email Address</label>
                <div className="relative group">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white group-focus-within:text-white transition-colors" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className=" h-11 w-full
      pl-10 pr-10
      bg-transparent
      border border-white/30
      rounded-lg
      text-white
      placeholder:text-white/50
      focus:border-white
      focus:ring-2 focus:ring-white/20
      focus:outline-none
      transition-all duration-200
      shadow-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-white">Password</label>
                  <a href="#" className="text-xs text-white hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white group-focus-within:text-white transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    disabled={isLoading}
                    className="
      h-11 w-full
      pl-10 pr-10
      bg-transparent
      border border-white/30
      rounded-lg
      text-white
      placeholder:text-white/50
      focus:border-white
      focus:ring-2 focus:ring-white/20
      focus:outline-none
      transition-all duration-200
      shadow-lg
    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.73 3.73"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-transparent border-2 cursor-pointer  border-white hover:text-primary hover:bg-white text-white font-semibold rounded-lg transition-colors duration-300 disabled:opacity-70 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
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
