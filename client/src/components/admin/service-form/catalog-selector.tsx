"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Minus } from "lucide-react"
import ToggleTabs from "@/components/customs/toggle-tabs"
import { useTranslation } from "react-i18next"

interface CatalogSelectorProps {
  activeTab: "Services" | "Parts"
  onTabChange: (tab: "Services" | "Parts") => void
  searchQuery: string
  onSearchChange: (query: string) => void
  catalogResults: any[]
  isSearching: boolean
  selections: any[]
  onAddItem: (item: any) => void
  onRemoveItem: (id: string) => void
  services: any[]
  parts: any[]
}

export function CatalogSelector({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  catalogResults,
  isSearching,
  selections,
  onAddItem,
  onRemoveItem,
  services,
  parts,
}: CatalogSelectorProps) {
  const { t } = useTranslation("pages")
  const [localResults, setLocalResults] = useState(catalogResults)

  useEffect(() => {
    setLocalResults(catalogResults)
  }, [catalogResults])

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{t("stepForm.selectItems")}</h3>
        <p className="text-slate-500 text-[15px]">{t("stepForm.selectItemsDescription")}</p>
      </div>

      {/* Tab Selection */}
      <div className="flex items-center gap-4">
        <ToggleTabs
          tabs={["Services", "Parts"]}
          activeTab={activeTab}
          onTabChange={(tab) => {
            onTabChange(tab as "Services" | "Parts")
          }}
        />
      </div>

      {/* Search */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">Search {activeTab}</label>
        <div className="relative group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            className="pl-12 bg-slate-50/50 border-slate-200 h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all text-[15px]"
          />
        </div>
      </div>

      {/* Catalog Results */}
      <div className="grid gap-3 max-h-[400px] overflow-y-auto">
        {isSearching ? (
          <div className="p-8 text-center text-slate-400 font-medium">Searching...</div>
        ) : localResults.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p>No {activeTab.toLowerCase()} found</p>
          </div>
        ) : (
          localResults.map((item) => {
            const existingSelection = selections.find((s) => s.item._id === item._id)
            return (
              <div
                key={item._id}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{item.title || item.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-500">{activeTab === "Parts" && `Stock: ${item.stock || 0}`}</span>
                  <div className="flex items-center gap-2">
                    {existingSelection && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-transparent"
                          onClick={() => onRemoveItem(item._id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-slate-900">
                          {existingSelection.quantity}
                        </span>
                      </>
                    )}
                    <Button
                      size="sm"
                      className="h-8 bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => onAddItem(item)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
