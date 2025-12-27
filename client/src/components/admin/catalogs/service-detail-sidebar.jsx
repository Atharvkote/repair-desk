"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Settings, DollarSign, FileText } from "lucide-react"

export function ServiceDetailSidebar({ service, open, onClose }) {
  if (!service) return null

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
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{service.name}</h2>
                <p className="text-primary-foreground/80 text-xs">Service Details</p>
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
                <Badge className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </Badge>
              </div>

              {/* Basic Info */}
              <div className="bg-primary/10 rounded-md p-4 border border-primary/20 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service Name</p>
                  <p className="font-semibold text-foreground mt-1">{service.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm text-foreground mt-1">{service.description || "No description provided"}</p>
                </div>
              </div>

              {/* Price */}
              <div className="bg-white rounded-md p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">Price</span>
                </div>
                <p className="text-3xl font-bold text-primary">₹{service.price}</p>
              </div>

              {/* Additional Info */}
              <div className="bg-secondary/50 rounded-md p-4 border border-secondary">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-foreground/60" />
                  <span className="font-semibold text-foreground">Details</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Service ID: <span className="text-foreground font-medium">{service.id}</span>
                  </p>
                  <p>
                    Status: <span className="text-foreground font-medium capitalize">{service.status}</span>
                  </p>
                </div>
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

export default ServiceDetailSidebar
