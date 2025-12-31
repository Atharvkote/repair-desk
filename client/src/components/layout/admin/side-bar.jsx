"use client"

import {
  ClipboardList,
  Mail,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  Users2,
  FileText,
  UserPlus,
  ChevronDown,
  BookOpen,
  Package,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { AppWindowMacIcon } from "lucide-react"
import { SiBookstack } from "react-icons/si";
import { IoBarChartSharp } from "react-icons/io5";
import { FaChevronCircleRight, FaCloudDownloadAlt, FaExternalLinkSquareAlt, FaHome } from "react-icons/fa";
import { MdFolderShared } from "react-icons/md";
import { FaBoxArchive, FaCircleNodes, FaFolderOpen, FaInbox, FaLocationArrow, FaStaylinked, FaUserClock, } from "react-icons/fa6"
import { useTranslation } from "react-i18next"
import { BsFillCloudHaze2Fill } from "react-icons/bs";


export default function Sidebar() {
  const { t } = useTranslation('sidebar')
  const { pathname } = useLocation()
  const [openMenus, setOpenMenus] = useState({
    catalog: pathname.startsWith("/admin/catalog"),
  })

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const sections = [
    {
      title: t("workspace"),
      items: [
        { label: t("overview"), icon: FaHome, href: "/admin" },
        {
          label: t("services"),
          icon: FaFolderOpen ,
          href: "#",
          id: "services",
          subItems: [
            { label: t("newService"), icon: PlusIcon, href: "/admin/service" },
            { label: t("activeServices"), icon: FaLocationArrow   , href: "/admin/service/list" },
          ],
        },
        { label: t("history"), icon: FaUserClock , href: "/admin/history" },
        {
          label: t("catalog"),
          icon: SiBookstack,
          href: "#",
          id: "catalog",
          subItems: [
            { label: t("serviceCatalog"), icon: FaCircleNodes    , href: "/admin/catalog/services" },
            { label: t("partsCatalog"), icon: FaInbox   , href: "/admin/catalog/parts" },
          ],
        },
        { label: t("reports"), icon: IoBarChartSharp, href: "/admin/reports" },
      ],
    },
    {
      title: t("admin"),
      items: [
        { label: t("company"), icon: AppWindowMacIcon, href: "/admin/company" },
        { label: t("teams"), icon: Users2, href: "/admin/teams" },
        { label: t("settings"), icon: Settings, href: "/admin/settings" },
      ],
    },
  ]

  const isActive = (href) => pathname === href

  return (
    <aside className="w-[280px] h-screen bg-white border-r rounded-xl border-slate-200/60 flex flex-col shrink-0 relative z-40 transition-all duration-300 ease-in-out shadow-[1px_0_10px_rgba(0,0,0,0.02)] ">
      {/* Branding Section */}
      <div className="h-24 px-6 flex items-center border-b-2 border-slate-200 mx-1 ">
        <Link to="/admin" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 group-hover:scale-105 transition-transform duration-200">
            <img src="/logo.png" alt="logo" className="w-11 h-11 rounded-md" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-[17px] text-slate-900 tracking-tight leading-tight">{t("mateTractors")}</h1>
            <p className="text-[11px] font-extrabold text-teal-600/80 uppercase tracking-widest  mt-0.5">{t("serviceAdmin")}</p>
          </div>
        </Link>
      </div>

      {/* Navigation - Independent Scroll */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 scrollbar-none">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400/80">{section.title}</p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const hasSubItems = item.subItems && item.subItems.length > 0
                const isOpen = openMenus[item.id]
                const active = isActive(item.href) || (hasSubItems && item.subItems.some((sub) => isActive(sub.href)))

                return (
                  <div key={item.label} className="space-y-1">
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex font-semibold items-center gap-3.5 cursor-pointer px-4 py-2.5 rounded-xl transition-all duration-200 group relative
                          ${active
                            ? "bg-teal-100/60 text-teal-700 font-semibold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                      >
                        {active && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-2 bottom-2 w-1 bg-teal-600 rounded-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <Icon
                          className={`w-[18px] h-[18px] transition-colors duration-200 ${active ? "text-teal-600" : "text-teal-600 "}`}
                        />
                        <span className="text-[14px]">{item.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 ml-auto transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    ) : (
                      <Link to={item.href} className="relative block cursor-pointer">
                        <motion.div
                          whileHover={{ x: 4 }}
                          className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 group relative
                            ${active
                              ? "bg-teal-100/60 text-teal-700 font-semibold"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                          {active && (
                            <motion.div
                              layoutId="sidebar-active"
                              className="absolute left-0 top-2 bottom-2 w-1 bg-teal-600 rounded-full"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <Icon
                            className={`w-[18px] h-[18px] transition-colors duration-200 ${active ? "text-teal-600" : "text-teal-600 "}`}
                          />
                          <span className="text-[14px]">{item.label}</span>
                          {active && <ChevronRight className="w-4 h-4 ml-auto text-teal-600 " />}
                        </motion.div>
                      </Link>
                    )}

                    <AnimatePresence initial={false}>
                      {hasSubItems && isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden ml-4 pl-4 border-l border-slate-100 space-y-1"
                        >
                          {item.subItems.map((subItem) => {
                            const SubIcon = subItem.icon
                            const subActive = isActive(subItem.href)
                            return (
                              <Link key={subItem.href} to={subItem.href} className="block cursor-pointer">
                                <div
                                  className={`flex items-center gap-3 font-semibold px-3 py-2 rounded-lg text-[13px] transition-all duration-200
                                    ${subActive
                                      ? "text-teal-600 bg-teal-50/40 font-medium"
                                      : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                  <SubIcon className={`w-4 h-4 ${subActive ? "text-teal-500" : "text-slate-600"}`} />
                                  {subItem.label}
                                </div>
                              </Link>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User / Bottom Section */}
      <div className="p-4 mt-auto bg-slate-50/50 border-t border-slate-100">
        <div className="space-y-1">
          <button className="flex items-center gap-3.5 px-4 py-2.5 w-full rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all duration-200 group">
            <Bell className="w-[18px] h-[18px] text-slate-400 group-hover:text-teal-500" />
            <span className="text-[13.5px] font-medium">{t("notifications")}</span>
            <span className="ml-auto w-5 h-5 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <button className="flex items-center gap-3.5 px-4 py-2.5 w-full rounded-xl text-rose-600 hover:bg-rose-50/80 transition-all duration-200 group">
            <LogOut className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform" />
            <span className="text-[13.5px] font-medium">{t("signOut")}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
