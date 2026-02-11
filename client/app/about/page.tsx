import Image from "next/image"
import { Phone, MapPin, Mail, ChevronRight, Award, Users, Zap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "About Us | Mate Tractor Service & Repair",
  description: "Learn about Mate Tractor's 25+ years of experience in agricultural machinery maintenance and repair services.",
}

export default function AboutPage() {
  const milestones = [
    { year: "1995", title: "Founded", description: "Started with a passion for agricultural machinery" },
    { year: "2005", title: "Expansion", description: "Opened second service center and trained specialists" },
    { year: "2015", title: "Modernization", description: "Invested in state-of-the-art diagnostic equipment" },
    { year: "2024", title: "Industry Leaders", description: "Recognized as top tractor service center in region" },
  ]

  const values = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Excellence",
      description: "We maintain the highest standards in every repair and service we perform.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Team",
      description: "Certified technicians with decades of combined experience.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Fast Service",
      description: "Quick turnaround times without compromising on quality.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Guaranteed Work",
      description: "All work backed by comprehensive warranty coverage.",
    },
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
              { name: "Services", href: "/services" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block px-6 py-4 text-xs font-black uppercase tracking-widest
               transition-colors hover:bg-secondary hover:text-primary"
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
          <Image src="/massive-industrial-green-tractor-in-field.jpg" alt="About Mate Tractor" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 md:px-10 lg:px-20">
            <div className="max-w-2xl text-white">
              <h2 className="text-5xl font-black uppercase tracking-tighter md:text-7xl">
                About <br />
                <span className="text-secondary">Mate Tractor</span> <br />
                Service
              </h2>
              <p className="mt-6 max-w-lg text-lg font-medium text-white/90">
                Over 25 years of excellence in agricultural machinery maintenance and repair.
              </p>
            </div>
          </div>
        </section>

        {/* Company Story Section */}
        <section className="bg-white px-4 py-20 md:px-10 lg:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">Our Story</p>
              <h2 className="mt-2 text-4xl font-black uppercase tracking-tighter text-primary">From Passion to Excellence</h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Mate Tractor Service was founded in 1995 by a group of experienced mechanics who understood the critical need for reliable tractor maintenance in the agricultural community. What started as a small garage has grown into a premier service center recognized across the region.
                </p>
                <p>
                  Our founders believed that farmers and agricultural operators deserved access to world-class service without the hassle. They invested in building a team of certified technicians, acquiring state-of-the-art diagnostic equipment, and establishing relationships with parts suppliers to ensure every job is done right.
                </p>
                <p>
                  Today, we maintain that same commitment to excellence. We don't just fix tractors—we keep agricultural operations running, enabling farmers to focus on what they do best.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-sm shadow-xl">
              <Image src="/professional-mechanic-in-green-uniform-with-wrench.jpg" alt="Our Team" fill className="object-cover" />
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-muted px-4 py-20 md:px-10 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-primary">Our Journey</h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative border-l-4 border-primary pl-6 pb-8">
                  <div className="absolute left-[-12px] top-0 h-5 w-5 rounded-full bg-secondary border-2 border-white" />
                  <p className="text-3xl font-black text-secondary">{milestone.year}</p>
                  <h3 className="mt-2 text-xl font-black uppercase tracking-tighter text-primary">{milestone.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-white px-4 py-20 md:px-10 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">Why Choose Us</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-tighter text-primary">Our Core Values</h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <div key={index} className="rounded-lg border-2 border-primary/10 bg-muted p-6 hover:border-primary hover:shadow-lg transition-all">
                  <div className="mb-4 inline-block rounded-full bg-secondary p-3 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-primary">{value.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-primary px-4 py-20 text-white md:px-10 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-secondary">Our Expert Team</h2>
            <p className="mt-4 max-w-2xl text-white/90">
              Our certified technicians bring decades of combined experience in agricultural machinery maintenance and repair. Every team member is trained to the highest industry standards.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { role: "Lead Mechanic", expertise: "Engine Diagnostics & Rebuilds", years: "22 years" },
                { role: "Hydraulics Specialist", expertise: "Hydraulic Systems & Repairs", years: "18 years" },
                { role: "Electrical Expert", expertise: "Electrical Troubleshooting & Installation", years: "15 years" },
              ].map((member, index) => (
                <div key={index} className="rounded-lg bg-white/10 p-6 backdrop-blur border border-white/20">
                  <h3 className="text-xl font-black uppercase tracking-tighter">{member.role}</h3>
                  <p className="mt-2 text-sm text-secondary font-bold">{member.expertise}</p>
                  <p className="mt-3 text-sm text-white/70">{member.years} of experience</p>
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
              Ready to Experience <br />
              <span className="text-secondary">Exceptional Service?</span>
            </h2>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-secondary px-10 py-7 text-lg font-black uppercase tracking-widest text-primary hover:bg-white"
            >
              <Link href="/contact">Contact Us Today</Link>
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
