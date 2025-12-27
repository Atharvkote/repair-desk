"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function ToggleTabs({ options, defaultActive, onChange, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultActive || options?.[0]?.label)

  const handleChange = (label) => {
    setActiveTab(label)
    onChange?.(label)
  }

  return (
    <div className={`flex items-center bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50 ${className}`}>
      {options.map((option) => (
        <button
          key={option.label}
          onClick={() => handleChange(option.label)}
          className="relative flex-1 px-5 py-2.5 rounded-lg transition-all duration-300 focus-visible:outline-none"
        >
          {activeTab === option.label && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-[10px]"
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span
            className={`relative z-10 flex items-center justify-center gap-2.5 text-[13px] font-bold tracking-tight transition-colors duration-300 ${
              activeTab === option.label ? "text-teal-700" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span
              className={`transition-transform duration-300 ${activeTab === option.label ? "scale-110" : "scale-100 opacity-70"}`}
            >
              {option.icon}
            </span>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  )
}
