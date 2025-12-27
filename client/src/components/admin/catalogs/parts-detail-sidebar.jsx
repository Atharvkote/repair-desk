"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Package, DollarSign, Box } from "lucide-react"

export function PartsDetailSidebar({ part, open, onClose }) {
  if (!part) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Slide-over */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full max-w-md z-[70] transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-5 rounded-md shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2 rounded">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{part.name}</h2>
                <p className="text-primary-foreground/80 text-xs">Part Details</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white rounded"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 mt-4 bg-white rounded-md shadow border border-border overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Status */}
              <div className="flex justify-center">
                <Badge
                  className={
                    part.status === "in-stock"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                  }
                >
                  {part.status === "in-stock" ? "In Stock" : "Low Stock"}
                </Badge>
              </div>

              {/* Basic Info */}
              <div className="bg-primary/10 rounded-md p-4 border border-primary/20 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Part Name</p>
                  <p className="font-semibold text-foreground mt-1">{part.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm text-foreground mt-1">{part.description || "No description provided"}</p>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-md p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Price</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">₹{part.price}</p>
                </div>
                <div className="bg-white rounded-md p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Box className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Stock</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{part.stock}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-secondary/50 rounded-md p-4 border border-secondary space-y-2 text-sm text-muted-foreground">
                <p>
                  Part ID: <span className="text-foreground font-medium">{part.id}</span>
                </p>
                <p>
                  Status:{" "}
                  <span className="text-foreground font-medium capitalize">
                    {part.status === "in-stock" ? "In Stock" : "Low Stock"}
                  </span>
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border p-4 bg-white flex gap-2">
              <Button onClick={onClose} className="flex-1 bg-primary hover:bg-primary/90 text-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default PartsDetailSidebar
