"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useTranslation } from "react-i18next"

interface StepFooterProps {
  currentStep: number
  stepsLength: number
  stepName: string
  selectedUser: any
  selections: any[]
  isLoadingOrder: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
}

export default function StepFooter({
  currentStep,
  stepsLength,
  stepName,
  selectedUser,
  selections,
  isLoadingOrder,
  onPrevious,
  onNext,
  onSubmit,
}: StepFooterProps) {
  const { t } = useTranslation("pages")

  return (
    <div className="fixed md:static bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 md:border-none md:bg-transparent p-4 md:p-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden md:flex items-center gap-3 border-2 border-white px-4 py-2 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
          <p className="text-[13px] font-medium text-white">
            {currentStep === stepsLength
              ? t("stepForm.verifyDetails")
              : `${t("stepForm.next")}: ${stepName || "Finalize"}`}
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {currentStep > 1 && (
            <Button
              variant="outline"
              className="flex-1 border-2 md:flex-none cursor-pointer px-6 h-12 border-white text-white hover:text-teal-600 hover:bg-white duration-300 transition-colors font-bold rounded-xl bg-transparent"
              onClick={onPrevious}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t("stepForm.previous")}
            </Button>
          )}
          <Button
            className={`flex-[2] md:flex-none border-2 border-white px-10 h-12 rounded-xl font-bold bg-transparent
              border-white text-white hover:text-teal-600 hover:bg-white duration-300 transition-colors cursor-pointer disabled:cursor-not-allowed`}
            onClick={currentStep === stepsLength ? onSubmit : onNext}
            disabled={
              (currentStep === 1 && !selectedUser) || (currentStep === 2 && selections.length === 0) || isLoadingOrder
            }
          >
            {currentStep === stepsLength ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                {t("stepForm.submit")}
              </>
            ) : (
              <>
                {t("stepForm.next")}
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
