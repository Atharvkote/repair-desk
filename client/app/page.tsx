import Image from "next/image"
import { Phone, MapPin, Mail, ChevronRight, Wrench, Gauge, Truck, Zap, ShieldCheck, Menu, Tractor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FaGears } from "react-icons/fa6";
import { MdOutlineSpeed } from "react-icons/md";
import { FaScrewdriverWrench } from "react-icons/fa6";

export default function TractorLandingPage() {
  return (
    <div className="flex min-h-screen flex-col google-sans leading-loose ">
      {/* Top Header */}
      <header className="bg-white px-4 py-3 md:px-10 lg:px-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-white">
              <Image src="/white-logo.png" alt="Company Logo" width={100} height={100} className="h-9 w-9 rounded-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wide text-primary uppercase leading-none google-sans">Mate Tractor</h1>
              <p className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase leading-none mt-1">
                Service & Repair
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <div className="flex items-center gap-2">
              <div className="bg-secondary rounded-full p-2 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground text-xs uppercase font-bold">Call us anytime</p>
                <p className="font-black text-primary">800-2345-6789</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-2 border-primary font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              Request a quote
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-8 w-8" />
          </Button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-primary text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-10 lg:px-20">
          <ul className="flex items-center overflow-x-auto">
            {["Home", "About", "Parts", "Rent", "Terms"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className={`block px-6 py-4 text-xs font-black uppercase tracking-widest transition-colors hover:bg-secondary hover:text-primary ${item === "Home" ? "bg-secondary text-primary" : ""}`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden md:block">
            <Button
              variant="ghost"
              className="text-xs font-black uppercase tracking-widest hover:bg-secondary hover:text-primary h-full rounded-none px-6"
            >
              Search
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] w-full overflow-hidden">
          <Image src="/massive-industrial-green-tractor-in-field.jpg" alt="Main Tractor Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 md:px-10 lg:px-20">
            <div className="max-w-2xl text-white">
              <h2 className="text-5xl font-black uppercase tracking-tighter md:text-7xl">
                You can <br />
                <span className="text-secondary">entrust your</span> <br />
                tractor to us
              </h2>
              <p className="mt-6 max-w-lg text-lg font-medium text-white/90">
                Professional maintenance, parts, and heavy-duty repairs for all agricultural machinery.
              </p>
              <Button
                size="lg"
                className="mt-8 bg-secondary px-10 py-7 text-lg font-black uppercase tracking-widest text-primary hover:bg-white"
              >
                Read More
              </Button>
            </div>
          </div>
        </section>

        {/* Services Teasers */}
        <section className="relative z-10 -mt-16 px-4 md:px-10 lg:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-3">
            {[
              { title: "Engines", icon: <FaGears className="h-8 w-8" />, query: "professional-mechanic-in-green-uniform-with-wrench.jpg" },
              {
                title: "Diagnostic Services",
                icon: <MdOutlineSpeed className="h-8 w-8" />,
                query: "green-tractor-working-in-sunset-field.jpg",
              },
              { title: "Machine Repairs", icon: <FaScrewdriverWrench className="h-8 w-8" />, query: "digital tractor diagnostics.jpeg" },
            ].map((service, i) => (
              <div key={i} className="group relative overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={`/${service.query}`}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="bg-secondary p-8 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">{service.title}</h3>
                    {service.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Our Company */}
        <section className="bg-muted px-4 py-20 md:px-10 lg:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">About</p>
              <h2 className="mt-2 text-4xl font-black uppercase tracking-tighter text-primary">Our Company</h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  With over 25 years of specialized experience in agricultural machinery, we have become the leading
                  choice for farmers and industrial operators. Our team of certified technicians understands the
                  critical importance of keeping your equipment running during peak season.
                </p>
                <p>
                  We utilize state-of-the-art diagnostic tools paired with old-school mechanical expertise to solve the
                  most complex tractor issues. Whether it's a routine engine check or a full transmission rebuild, we
                  treat every machine with professional precision.
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-8 border-2 border-primary px-8 py-6 font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white bg-transparent"
              >
                Read More
              </Button>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-sm shadow-xl">
              <Image src="/professional-mechanic-in-green-uniform-with-wrench.jpg" alt="Our Lead Mechanic" fill className="object-cover" />
            </div>
          </div>
        </section>

        {/* Maintenance Banner */}
        <section className="relative h-[400px] w-full">
          <Image src="/green-tractor-working-in-sunset-field.jpg" alt="Maintenance Banner" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white md:text-7xl">
              Quality Tractor <br />
              <span className="text-secondary">Maintenance</span>
            </h2>
            <Button
              size="lg"
              className="mt-8 bg-secondary px-10 py-7 text-lg font-black uppercase tracking-widest text-primary hover:bg-white"
            >
              Read More
            </Button>
          </div>
        </section>

        {/* Service Department List */}
        <section className="bg-primary px-4 py-20 text-white md:px-10 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-secondary">Service Department</h2>
            <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-3">
              {[
                "Engine Diagnostics",
                "Transmission Repair",
                "Hydraulic Systems",
                "Fuel Injection Service",
                "Electrical Troubleshooting",
                "Cooling Systems",
                "Brake Maintenance",
                "Tire & Axle Service",
                "AC & Climate Control",
                "Annual Inspections",
                "Field Support Services",
                "Genuine Parts Supply",
              ].map((service, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-white/10 pb-4 transition-colors hover:text-secondary"
                >
                  <div className="h-2 w-2 bg-secondary" />
                  <span className="font-bold uppercase tracking-wider">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & Map */}
        <section className="bg-white px-4 py-20 md:px-10 lg:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-primary">Contacts</h2>
              <div className="mt-10 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary rounded-full p-3 text-primary">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-primary">Location</h4>
                    <p className="mt-1 text-muted-foreground font-medium">8901 Marmora Road, Glasgow, D04 89GR</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary rounded-full p-3 text-primary">
                    <Phone className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-primary">Phones</h4>
                    <p className="mt-1 text-muted-foreground font-medium">800-2345-6789; 800-2345-6790</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary rounded-full p-3 text-primary">
                    <Mail className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-primary">Email</h4>
                    <p className="mt-1 text-muted-foreground font-medium">info@tractor-repair.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-sm border-4 border-muted shadow-lg">
              <Image
                src="/map-with-location-pin.png"
                alt="Location Map"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 animate-ping rounded-full bg-primary/20" />
                  <MapPin className="h-10 w-10 text-primary drop-shadow-lg" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-900 py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-10 lg:px-20">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              © 2026 Tractor Service. All Rights Reserved.
            </p>
            <div className="flex items-center gap-8">
              <ShieldCheck className="h-8 w-8 text-secondary" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-300">Certified Repair Center</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
