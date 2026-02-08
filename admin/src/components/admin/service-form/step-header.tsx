"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import { GrServices } from "react-icons/gr"
import Header from "@/components/shared/sytle-header"

interface Step {
  id: number
  name: string
  icon: React.ComponentType<{ className?: string }>
}

interface StepHeaderProps {
  currentStep: number
  steps: Step[]
}

export default function StepHeader({ currentStep, steps }: StepHeaderProps) {
  const { t } = useTranslation("pages")

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-sm mb-8">
      <h1 className="text-2xl font-bold text-teal-600 flex items-center gap-2 mb-2">
        <GrServices className="w-9 h-9" /> <Header title={t("stepForm.title")}  />
      </h1>
      <p className="text-foreground font-medium mb-3"> {t("stepForm.description")} </p>
      <div className="relative flex justify-between items-start max-w-3xl mx-auto">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0">
          <motion.div
            className="h-full bg-teal-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {steps.map((step) => {
          const Icon = step.icon
          const isCompleted = currentStep > step.id
          const isActive = currentStep === step.id
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? "#14b8a6" : "#f1f5f9",
                  scale: isActive ? 1.1 : 1,
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors border-4 border-white`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                )}
              </motion.div>
              <div className="flex flex-col items-center">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-teal-600" : "text-slate-400"}`}
                >
                  {t("stepForm.step")} {step.id}
                </span>
                <span
                  className={`text-[13px] font-bold whitespace-nowrap ${isActive ? "text-slate-900" : "text-slate-400"}`}
                >
                  {step.name}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
