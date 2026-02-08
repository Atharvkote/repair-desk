"use client"

import Sidebar from "./side-bar"
import { Outlet } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Footer from "../client/blended-footer"

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden  antialiased text-slate-900 p-4">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
        {/* Independent scroll region for content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-none">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="px-2 md:px-4 lg:px-2 w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  )
}
