"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    BarChart3,
    Zap,
    Shield,
    TrendingUp,
    Users,
    Package,
    Wrench,
    Clock,
    CheckCircle2,
    AlertCircle,
} from "lucide-react"
import { FaTractor, FaWrench } from "react-icons/fa6"
import { useTranslation } from "react-i18next"

const Overview = () => {
    const { t } = useTranslation('common')
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        services: 0,
        parts: 0,
        admins: 0,
        revenue: 0,
    })

    // Simulate counter animation
    useEffect(() => {
        const targets = { services: 248, parts: 1452, admins: 12, revenue: 45230 }
        const duration = 2000
        const increment = 50

        const currentValues = { services: 0, parts: 0, admins: 0, revenue: 0 }
        const interval = setInterval(() => {
            let updated = false
            Object.keys(targets).forEach((key) => {
                if (currentValues[key] < targets[key]) {
                    currentValues[key] += Math.ceil(targets[key] / (duration / increment))
                    if (currentValues[key] > targets[key]) currentValues[key] = targets[key]
                    updated = true
                }
            })
            setStats({ ...currentValues })
            if (!updated) clearInterval(interval)
        }, increment)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen overflow-hidden px-4">
            {/* Navigation Bar */}
            <nav className=" backdrop-blur-sm rounded-xl bg-white border-b border-primary/10 mb-5 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/70">
                            <FaWrench className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold font-bbh-bogle  text-primary">
                            {t("overview.repairDesk")} <span className="text-white p-1 rounded-lg mr-2 bg-primary">Desk</span>
                        </h1>
                    </div>

                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl rounded-xl px-6 py-20 space-y-12 bg-white">
                <div className="flex items-center gap-3">

                    <div className="space-y-6 text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                            {/* <FaTractor className="w-4 h-4 text-primary" /> */}
                            <span className="text-md uppercase font-bold text-primary tracking-widest">{t("overview.mateTractors")}</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mx-auto">
                            {t("overview.manageServicesParts")}{" "}
                            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                {t("overview.powerfulControls")}
                            </span>
                        </h2>

                        <p className="text-xl text-muted-foreground  mx-auto leading-relaxed">
                            {t("overview.dashboardDescription")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                onClick={() => navigate("/admin/service")}
                                className="h-12 px-10 cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group"
                            >
                                {t("overview.getStarted")}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 px-8 cursor-pointer border-2 border-primary hover:border-primary hover:bg-teal-600 font-semibold rounded-lg transition-all duration-300 bg-transparent"
                            >
                                {t("overview.learnMore")}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <img src="/logo-2.png" alt="logo" className="w-full h-full object-contain" />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Overview
