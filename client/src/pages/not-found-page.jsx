import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Home, ArrowLeft, Heart, Shield, Search } from "lucide-react"
import { useIsMobile } from "@/lib/use-mobile"
import FuzzyText from "@/components/customs/fuzzy-text"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const hoverIntensity = 0.5;
  const enableHover = !isMobile;

  useEffect(() => {
    setMounted(true)
  }, [])

  const quickLinks = [
    { icon: Home, label: "Home", href: "/", description: "Return to main page" },
    { icon: Heart, label: "Register", href: "/register", description: "Create new account" },
    { icon: Shield, label: "Login", href: "/login", description: "Access your account" },
    { icon: Search, label: "Help", href: "/help", description: "Get assistance" },
  ]

  return (
    <div className="min-h-screen flex flex-col justify-center lg:flex-row">
      <div
        className={`w-full flex items-center justify-center p-4 sm:p-4 lg:p-8 xl:p-10 transition-all duration-1000 relative min-h-[50vh] lg:min-h-screen ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <div className="w-full flex flex-col items-center max-w-5xl">
          {/* Error Header */}
          <div className="w-full flex flex-col lg:flex-row gap-4  items-center">
            <div className="text-center mb-6 sm:mb-8 flex flex-col items-center gap-4">
              <h1 className="text-3xl  sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                Page Not Found
              </h1>
              <FuzzyText
                baseIntensity={0.2}
                hoverIntensity={hoverIntensity}
                enableHover={enableHover}
              >
                404
              </FuzzyText>
              <p className="text-foreground text-sm sm:text-base leading-relaxed">
                The page you're looking for doesn't exist or has been moved. This could be due to a mistyped URL or an
                outdated link.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="w-full space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Quick Actions</h3>

              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigate(link.href)}
                  className="w-full cursor-pointer flex items-center p-3 sm:p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-teal-800 hover:bg-teal-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-teal-200 transition-colors">
                    <link.icon className="w-5 h-5 text-teal-800" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">{link.label}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">{link.description}</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 group-hover:text-teal-800 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Primary Actions */}
          <div className="w-1/2 space-y-3">
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border border-transparent rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium text-white bg-gradient-to-r from-teal-800 to-teal-900 hover:from-teal-900 hover:to-teal-950 transition-all duration-200"
            >
              <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Return to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border-2 border-teal-800 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium text-teal-800 bg-white hover:bg-teal-50 transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Go Back
            </button>
          </div>

          {/* Security Badge */}
          <div className="mt-6 sm:mt-8 bg-teal-800 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 shadow-lg w-full">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-teal-800" />
              </div>
              <div>
                <p className="text-white font-medium text-xs sm:text-sm">Secure Navigation</p>
                <p className="text-white/70 text-xs">All links are verified and secure</p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              If you continue to experience issues, please contact our support team
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}