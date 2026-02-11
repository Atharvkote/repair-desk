

import Image from "next/image"
import { Phone, MapPin, Mail, ChevronRight, Wrench, Zap, Gauge, Droplets, Wind, Cpu, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Services | Mate Tractor Service & Repair",
  description: "Comprehensive tractor maintenance and repair services including engine diagnostics, transmission repair, hydraulics, and more.",
}

export default function ServicesPage() {
  const mainServices = [
    {
      icon: <Wrench className="h-12 w-12" />,
      title: "Engine Repair & Maintenance",
      description: "Complete engine diagnostics, repairs, and rebuilds. From routine maintenance to complex overhauls, our technicians handle all engine-related services with precision.",
      features: ["Full engine diagnostics", "Block rebuilding", "Head repair & resurfacing", "Oil change service", "Belt & hose replacement"],
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: "Electrical System Services",
      description: "Professional electrical troubleshooting and repairs. We diagnose and fix issues with your tractor's charging system, starter motor, and all electrical components.",
      features: ["Battery testing & replacement", "Alternator service", "Starter motor repair", "Wiring diagnostics", "Lighting system repair"],
    },
    {
      icon: <Gauge className="h-12 w-12" />,
      title: "Transmission & Drivetrain",
      description: "Specialized transmission repair and maintenance services. Our experts can handle manual, automatic, and hydrostatic transmissions.",
      features: ["Transmission diagnostics", "Clutch service", "Gear repair & replacement", "Drive shaft alignment", "PTO repair"],
    },
    {
      icon: <Droplets className="h-12 w-12" />,
      title: "Hydraulic Systems",
      description: "Complete hydraulic system maintenance and repair. We service pumps, cylinders, valves, and lines with precision and expertise.",
      features: ["Pump diagnostics & repair", "Cylinder seal replacement", "Hydraulic fluid service", "Pressure testing", "Leak detection & repair"],
    },
    {
      icon: <Wind className="h-12 w-12" />,
      title: "Cooling & Fuel Systems",
      description: "Essential services to keep your tractor running cool and efficiently. We handle radiator, cooling fan, and fuel system issues.",
      features: ["Radiator cleaning & repair", "Thermostat replacement", "Cooling fan service", "Fuel filter replacement", "Fuel injector cleaning"],
    },
    {
      icon: <Cpu className="h-12 w-12" />,
      title: "Diagnostic Services",
      description: "Advanced diagnostic equipment to identify issues quickly and accurately. Our state-of-the-art systems ensure precision repairs.",
      features: ["Computer diagnostics", "Performance testing", "Emission testing", "Pressure & temperature analysis", "Comprehensive reports"],
    },
  ]

  const additionalServices = [
    { name: "Brake System Service", description: "Comprehensive brake inspection and maintenance" },
    { name: "Tire & Axle Service", description: "Tire changes, alignment, and axle repairs" },
    { name: "AC & Climate Control", description: "Air conditioning system repair and maintenance" },
    { name: "Annual Inspections", description: "Complete seasonal inspections and preventative maintenance" },
    { name: "Field Support Services", description: "Emergency repair and on-farm service calls" },
    { name: "Genuine Parts Supply", description: "Original equipment manufacturer parts in stock" },
    { name: "Welding & Fabrication", description: "Custom fabrication and structural repairs" },
    { name: "Paint & Restoration", description: "Professional painting and cosmetic restoration" },
  ]

  return (
    <div className="flex min-h-screen flex-col google-sans leading-loose">
      {/* Top Header */}
      <header className="bg-white px-4 py-3 md:px-10 lg:px-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-white">
              <Image src="/white-logo.png" alt="Company Logo" width={100} height={100} className="h-9 w-9 rounded-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wide text-primary uppercase leading-none google-sans">Mate Tractor</h1>
              <p className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase leading-none mt-1">
                Service & Repair
              </p>
            </div>
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <div className="bg-secondary rounded-full p-2 text-primary">
              <Phone className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground text-xs uppercase font-bold">Call us anytime</p>
              <p className="font-black text-primary">800-2345-6789</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-primary text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-10 lg:px-20">
          <ul className="flex items-center overflow-x-auto">
            {[
              { name: "Home", href: "/" },
              { name: "About", href: "/about" },
              { name: "Services", href: "/services" , Flag: true},
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`block px-6 py-4 text-xs font-black uppercase tracking-widest
               transition-colors ${item.Flag ? "text-primary bg-secondary" : "text-white"} hover:bg-secondary hover:text-primary `}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] w-full overflow-hidden">
          <Image src="/massive-industrial-green-tractor-in-field.jpg" alt="Services" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 md:px-10 lg:px-20">
            <div className="max-w-2xl text-white">
              <h2 className="text-5xl font-black uppercase tracking-tighter md:text-7xl">
                Complete <br />
                <span className="text-secondary">Tractor Services</span> <br />
                You Can Trust
              </h2>
              <p className="mt-6 max-w-lg text-lg font-medium text-white/90">
                From routine maintenance to complex repairs, we have you covered with professional expertise.
              </p>
            </div>
          </div>
        </section>

        {/* Main Services Grid */}
        <section className="bg-white px-4 py-20 md:px-10 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">Our Expertise</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-tighter text-primary">
              Core Service Categories
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {mainServices.map((service, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border-2 border-primary/10 bg-muted p-8 transition-all hover:border-primary hover:shadow-lg"
                >
                  <div className="mb-4 inline-block rounded-full bg-secondary p-4 text-primary transition-transform group-hover:scale-110">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-6 space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="bg-primary px-4 py-20 text-white md:px-10 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-secondary">
              Additional Services
            </h2>
            <p className="mt-4 max-w-2xl text-white/90">
              Beyond our core services, we offer a comprehensive range of additional maintenance and repair solutions.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {additionalServices.map((service, index) => (
                <div
                  key={index}
                  className="group rounded-lg bg-white/10 p-6 backdrop-blur border border-white/20 transition-all hover:bg-white/20 hover:border-secondary"
                >
                  <h3 className="font-black uppercase tracking-tighter text-secondary group-hover:text-white">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/80">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="bg-muted px-4 py-20 md:px-10 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">How We Work</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-tighter text-primary">
              Our Service Process
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
              {[
                { step: "01", title: "Inspection", description: "Complete diagnostic evaluation of your tractor" },
                { step: "02", title: "Assessment", description: "Detailed report of findings and recommendations" },
                { step: "03", title: "Service", description: "Professional execution of agreed upon work" },
                { step: "04", title: "Follow-up", description: "Quality assurance and customer satisfaction check" },
              ].map((process, index) => (
                <div key={index} className="relative">
                  <div className="text-6xl font-black text-secondary mb-2">{process.step}</div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-primary">
                    {process.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{process.description}</p>
                  {index < 3 && (
                    <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block h-8 w-8 text-secondary/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative h-[400px] w-full overflow-hidden">
          <Image src="/green-tractor-working-in-sunset-field.jpg" alt="CTA Background" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white md:text-6xl">
              Need <span className="text-secondary">Professional Service?</span>
            </h2>
            <p className="mt-4 max-w-lg text-white/90 text-lg">
              Schedule your tractor service appointment today
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-secondary px-10 py-7 text-lg font-black uppercase tracking-widest text-primary hover:bg-white"
            >
              <Link href="/contact">Book Service Now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 py-10 text-white w-full flex items-center flex-col gap-8">
        <div className="flex justify-between w-full max-w-7xl px-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter uppercase text-white">
              MATE TRACTORS
            </h2>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-medium">
              Since 1995
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl w-full px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            © 2026 MATE TRACTOR. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
