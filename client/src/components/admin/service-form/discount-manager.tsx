"use client"
import { JSX } from "react"
import { useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { useTranslation } from "react-i18next"

interface CatalogItem {
  readonly _id: string
  readonly title: string
  readonly price: number
  readonly description?: string
  readonly status?: "AVAILABLE" | "UNAVAILABLE"
}

interface Selection {
  readonly item: CatalogItem
  readonly quantity: number
}

type DiscountMap = Readonly<Record<string, number>>

interface DiscountManagerProps {
  readonly selections: ReadonlyArray<Selection>
  readonly discounts: DiscountMap
  readonly onDiscountChange: (itemId: string, delta: number) => void
}

interface TranslationFunction {
  (key: string): string
}

type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>

interface DiscountDetails {
  readonly itemId: string
  readonly discountPercent: number
  readonly discountAmount: number
  readonly subtotal: number
  readonly finalAmount: number
}

const DISCOUNT_INCREMENT = 5 as const
const DISCOUNT_DECREMENT = -5 as const
const DEFAULT_DISCOUNT_PERCENT = 0 as const
const DECIMAL_PLACES = 2 as const
const CURRENCY_SYMBOL = "$" as const
const PERCENT_SYMBOL = "%" as const

function formatCurrency(value: number, decimals: number = DECIMAL_PLACES): string {
  return value.toFixed(decimals)
}

function calculateDiscountDetails(selection: Selection, discountPercent: number): DiscountDetails {
  const subtotal: number = selection.item.price * selection.quantity
  const discountAmount: number = (subtotal * discountPercent) / 100
  const finalAmount: number = subtotal - discountAmount

  return {
    itemId: selection.item._id,
    discountPercent,
    discountAmount,
    subtotal,
    finalAmount,
  }
}

function getDiscountForItem(discounts: DiscountMap, itemId: string): number {
  return discounts[itemId] ?? DEFAULT_DISCOUNT_PERCENT
}

export function DiscountManager({ 
  selections, 
  discounts, 
  onDiscountChange 
}: DiscountManagerProps): JSX.Element {
  const { t } = useTranslation("pages") as { t: TranslationFunction }

  const hasSelections = useMemo<boolean>(
    (): boolean => selections.length > 0,
    [selections.length]
  )

  const discountDetailsMap = useMemo<Map<string, DiscountDetails>>(
    (): Map<string, DiscountDetails> => {
      const detailsMap = new Map<string, DiscountDetails>()
      
      selections.forEach((selection: Selection): void => {
        const discountPercent: number = getDiscountForItem(discounts, selection.item._id)
        const details: DiscountDetails = calculateDiscountDetails(selection, discountPercent)
        detailsMap.set(selection.item._id, details)
      })
      
      return detailsMap
    },
    [selections, discounts]
  )

  const handleDiscountIncrease = useCallback(
    (itemId: string): (event: ButtonClickEvent) => void => {
      return (event: ButtonClickEvent): void => {
        event.preventDefault()
        onDiscountChange(itemId, DISCOUNT_INCREMENT)
      }
    },
    [onDiscountChange]
  )

  const handleDiscountDecrease = useCallback(
    (itemId: string): (event: ButtonClickEvent) => void => {
      return (event: ButtonClickEvent): void => {
        event.preventDefault()
        onDiscountChange(itemId, DISCOUNT_DECREMENT)
      }
    },
    [onDiscountChange]
  )

  const renderEmptyState = (): JSX.Element => (
    <div className="text-center py-12">
      <p className="text-slate-400">No items to apply discounts</p>
    </div>
  )

  const renderDiscountControls = (
    itemId: string,
    discountPercent: number
  ): JSX.Element => (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="h-9 bg-transparent"
        onClick={handleDiscountDecrease(itemId)}
        aria-label={`Decrease discount by ${Math.abs(DISCOUNT_DECREMENT)}%`}
        disabled={discountPercent <= DEFAULT_DISCOUNT_PERCENT}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="text-sm font-semibold text-slate-900 w-12 text-center">
        {discountPercent}{PERCENT_SYMBOL}
      </span>
      <Button
        size="sm"
        className="h-9 bg-teal-600 hover:bg-teal-700 text-white"
        onClick={handleDiscountIncrease(itemId)}
        aria-label={`Increase discount by ${DISCOUNT_INCREMENT}%`}
        disabled={discountPercent >= 100}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )

  const renderPriceBreakdown = (
    selection: Selection,
    formattedSubtotal: string
  ): JSX.Element => (
    <p className="text-sm text-slate-500 mt-1">
      {selection.quantity} × {CURRENCY_SYMBOL}{formatCurrency(selection.item.price)} ={" "}
      <span className="font-semibold text-slate-900">
        {CURRENCY_SYMBOL}{formattedSubtotal}
      </span>
    </p>
  )

  const renderDiscountSummary = (
    discountPercent: number,
    formattedDiscountAmount: string
  ): JSX.Element => (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-semibold text-slate-700">
        Discount: {discountPercent}{PERCENT_SYMBOL}
      </span>
      <span className="text-sm font-bold text-red-600">
        -{CURRENCY_SYMBOL}{formattedDiscountAmount}
      </span>
    </div>
  )

  const renderSelectionItem = (selection: Selection): JSX.Element => {
    const details: DiscountDetails | undefined = discountDetailsMap.get(selection.item._id)
    
    if (!details) {
      return <></>
    }
    const formattedSubtotal: string = formatCurrency(details.subtotal)
    const formattedDiscountAmount: string = formatCurrency(details.discountAmount)

    return (
      <div 
        key={selection.item._id} 
        className="bg-white border border-slate-200 rounded-xl p-5"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold text-slate-900">
              {selection.item.title ? selection.item.title : "N/A"}
            </h4>
            {renderPriceBreakdown(selection, formattedSubtotal)}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          {renderDiscountSummary(details.discountPercent, formattedDiscountAmount)}
          {renderDiscountControls(selection.item._id, details.discountPercent)}
        </div>
      </div>
    )
  }

  if (!hasSelections) {
    return renderEmptyState()
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {t("stepForm.applyDiscounts")}
        </h3>
        <p className="text-slate-500 text-[15px]">
          {t("stepForm.applyDiscountsDescription")}
        </p>
      </div>

      <div className="space-y-4">
        {selections.map((selection: Selection): JSX.Element => renderSelectionItem(selection))}
      </div>
    </div>
  )
}

export type {
  DiscountManagerProps,
  Selection,
  CatalogItem,
  DiscountMap,
  DiscountDetails,
}