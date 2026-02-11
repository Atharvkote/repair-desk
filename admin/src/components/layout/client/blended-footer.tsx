import { Link } from "react-router-dom"
import { Facebook, Twitter, Rss, Globe } from "lucide-react"
import { FaFacebook, FaGoogle, FaInstagram, FaTwitter } from "react-icons/fa"


function Footer() {
  const footerLinks = [
    {
      title: "Services",
      links: [
        { label: "Create Services", to: "/service" },
        { label: "Active Services", to: "/service/list" },
        { label: "Completed Services", to: "/history" },
        { label: "Service Catalog", to: "/catalog/services" },
        { label: "Parts Catalog", to: "/catalog/parts" },
        { label: "Reports", to: "" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Company", to: "/company" },
        { label: "Admin Team", to: "/teams" },
        { label: "Terms & Conditions", to: "/teams" },
      ],
    },
    {
      title: "Setting",
      links: [
        { label: "Accout Settings", to: "/settings" },
        { label: "Perferences", to: "/settings" },
        { label: "Notifications", to: "/settings" },
        { label: "Permissions", to: "/settings" },
      ],
    },
    {
      title: "About Us",
      links: [
        { label: "Contact Us", to: "#" },
        { label: "About Us", to: "#" },

      ],
    },
  ]

  const socialLinks = [
    { icon: FaFacebook, to: "#" },
    { icon: FaTwitter, to: "#" },
    { icon: FaInstagram, to: "#" },
    { icon: FaGoogle, to: "#" },
  ]

  return (
    <footer className="bg-white text-foreground py-16 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">

          {/* Logo */}
          <div>
            <h2 className="text-2xl font-bold tracking-tighter uppercase text-primary">
              MATE TRACTORS
            </h2>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-medium">
              Repair Desk
            </p>
          </div>

          {/* Dynamic Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em]">
                {section.title}
              </h3>

              <ul className="space-y-3 text-[11px] uppercase tracking-wider font-semibold  text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-border mb-12" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-8">

          {/* Social Icons */}
          <div className="flex gap-5">
            {socialLinks.map(({ icon: Icon, to }, i) => (
              <Link
                key={i}
                to={to}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Icon size={18} />
              </Link>
            ))}

            {/* More Icon */}
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
           {new Date().getFullYear()} Copyright. All rights reserved. @Team BYPAS@07
          </p>

        </div>
      </div>
    </footer>
  )
}

export default Footer
