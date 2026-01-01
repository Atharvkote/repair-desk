"use client"

import { useState, useEffect } from "react"
import { Shield, Zap } from "lucide-react"
import { t } from "i18next"

export default function Loader() {
    const [mounted, setMounted] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setMounted(true)

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + Math.random() * 15
            })
        }, 300)

        return () => clearInterval(interval)
    }, [])

    const loadingTips = [
        "Preparing your secure session...",
        "Loading system modules...",
        "Authenticating credentials...",
        "Initializing components...",
        "Almost ready...",
    ]

    const currentTip = loadingTips[Math.min(Math.floor(progress / 20), loadingTips.length - 1)]

    return (
        <div className="min-h-screen flex rounded-xl flex-col justify-center bg-gradient-to-br from-white to-teal-50">
            <div
                className={`w-full flex items-center justify-center p-4 sm:p-4 lg:p-8 xl:p-10 transition-all duration-1000 relative min-h-[50vh] lg:min-h-screen ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                <div className="w-full flex flex-col items-center max-w-4xl">
                    {/* Loader Header */}
                    <div className="w-full flex flex-col lg:flex-row items-center gap-8 mb-8">
                        <div className="flex-shrink-0">
                            <div className="relative w-48 h-48">
                                {/* Outer rotating ring */}
                                <div
                                    className="absolute inset-0 rounded-full border-4 border-teal-100 animate-spin"
                                    style={{ animationDuration: "3s" }}
                                />

                                {/* Inner teal ring */}
                                <div
                                    className="absolute inset-4 rounded-full border-4 border-transparent border-t-teal-600 border-r-teal-600 animate-spin"
                                    style={{ animationDuration: "2s", animationDirection: "reverse" }}
                                />

                                {/* Center circle with icon */}
                                <img
                                    src="/timer.gif"
                                    alt="Sand Clock Timer"
                                    width="200"
                                    height="200"
                                    className="sand-clock-gif drop-shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Loader Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-3xl  sm:text-4xl lg:text-7xl  font-bold font-bbh-bogle  text-primary">
                                {t("overview.repairDesk")} <span className="text-white p-1 rounded-lg mr-2 bg-primary">Desk</span>
                            </h1>
                            <div className="h-1 w-12 bg-gradient-to-r from-teal-600 to-teal-400 rounded-full mb-4" />

                            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent mb-6">
                                Loading . . .
                            </div>

                            {/* Loading Tip */}
                            <p className="text-gray-600 text-lg font-medium mb-4">{currentTip}</p>

                            {/* Progress Bar */}
                            <div className="w-full bg-teal-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-teal-600 to-teal-500 transition-all duration-300 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 bg-gradient-to-r from-teal-600 to-teal-700 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-teal-500/30 shadow-lg w-full max-w-2xl hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center mr-4">
                                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm sm:text-base">Secure Session Initialization</p>
                                    <p className="text-teal-100 text-xs sm:text-sm">Encrypting your connection</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {[1, 2, 3].map((dot) => (
                                    <div
                                        key={dot}
                                        className="w-2 h-2 bg-teal-200 rounded-full animate-pulse"
                                        style={{ animationDelay: `${dot * 0.2}s` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-xs sm:text-sm text-gray-500">
                            This should only take a moment. Please don't refresh the page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}