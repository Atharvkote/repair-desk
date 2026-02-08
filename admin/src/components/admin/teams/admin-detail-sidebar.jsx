"use client"

import { X, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

const AdminDetailSidebar = ({ admin, open, onClose }) => {
  if (!admin) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Slide-over */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full max-w-md z-[70] transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white p-5 rounded-md shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2 rounded">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{admin.name}</h2>
                <p className="text-teal-100 text-xs">Admin Details</p>
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
              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge
                  className={
                    admin.role === "superadmin"
                      ? "bg-red-100 text-red-800 border-red-300"
                      : "bg-teal-100 text-teal-800 border-real-300"
                  }
                >
                  {admin.role === "superadmin" ? "SUPER ADMIN" : "ADMIN"}
                </Badge>
              </div>

              {/* Basic Info */}
              <div className="bg-teal-50 rounded-md p-4 border border-teal-200 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Admin Name</p>
                  <p className="font-semibold text-foreground mt-1">{admin.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="text-sm text-foreground mt-1">IN +91{admin.phone}</p>
                </div>
              </div>

              {/* Admin Info */}
              <div className="bg-white rounded-md p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-foreground">Information</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-semibold">
                    Admin Id : <span className="text-foreground font-medium">{admin._id}</span>
                  </p>
                  <p className="font-semibold">
                    Status : <span className="text-foreground font-medium capitalize">Active</span>
                  </p>
                  <p className="text-xs text-teal-600 mt-3">
                    This admin has full access to system management and configuration.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-md p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-foreground">Socials</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-semibold">
                    Admin mail : <span className="text-foreground font-medium">{admin.email}</span>
                  </p>
                  <a
                    href={`mailto:${admin.email}`}
                    target="_blank"
                  >
                    <Button
                      className={'flex items-center gap-2'}
                    >
                      <ExternalLink className="h-4 w-4 text-white" />
                      Contact Admin
                    </Button></a>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border p-4 bg-white flex gap-2">
              <Button onClick={onClose} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminDetailSidebar
