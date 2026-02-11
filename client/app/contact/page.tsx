import Image from "next/image"
import { Phone, MapPin, Mail, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export const metadata = {
  title: "Contact Us | Mate Tractor Service & Repair",
  description: "Get in touch with Mate Tractor for service inquiries, quotes, and emergency repairs. Phone, email, or visit us.",
}

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Call Us",
      details: ["(+91) 800-2345-6789", "(+91) 9876-543-210"],
      subtitle: "Available Mon-Sat, 8AM-6PM",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Visit Us",
      details: ["PF7J+MHH, Rabiya Nagar", "Rahata, Maharashtra 423107"],
      subtitle: "Service center location",
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email Us",
      details: ["info@matetrack.com", "support@matetrack.com"],
      subtitle: "We respond within 2 hours",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Business Hours",
      details: ["Monday - Saturday: 8:00 AM - 6:00 PM", "Sunday: 10:00 AM - 2:00 PM"],
      subtitle: "Emergency services available",
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
          <Image src="/massive-industrial-green-tractor-in-field.jpg" alt="Contact Mate Tractor" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 md:px-10 lg:px-20">
            <div className="max-w-2xl text-white">
              <h2 className="text-5xl font-black uppercase tracking-tighter md:text-7xl">
                Get in <br />
                <span className="text-secondary">Touch With Us</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg font-medium text-white/90">
                Have questions? Need service? We're here to help with professional tractor maintenance and repairs.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="bg-white px-4 py-20 md:px-10 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="group rounded-lg border-2 border-primary/10 bg-muted p-6 transition-all hover:border-primary hover:shadow-lg"
                >
                  <div className="mb-4 inline-block rounded-full bg-secondary p-3 text-primary transition-transform group-hover:scale-110">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tighter text-primary">
                    {info.title}
                  </h3>
                  <div className="mt-3 space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm font-semibold text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground/70 font-medium italic">
                    {info.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="bg-muted px-4 py-20 md:px-10 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {/* Contact Form */}
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">Send Us A Message</p>
                <h2 className="mt-2 text-4xl font-black uppercase tracking-tighter text-primary mb-8">
                  We'd Love to Hear From You
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-primary">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Full Name"
                        className="mt-2 border-2 border-primary/20 bg-white placeholder:text-muted-foreground/50 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-primary">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        placeholder="(+91) XXXX-XXXX-XXXX"
                        className="mt-2 border-2 border-primary/20 bg-white placeholder:text-muted-foreground/50 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-primary">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="mt-2 border-2 border-primary/20 bg-white placeholder:text-muted-foreground/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="text-xs font-black uppercase tracking-widest text-primary">
                      Service Type
                    </label>
                    <select
                      id="service"
                      className="w-full mt-2 border-2 border-primary/20 bg-white rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="">Select a service...</option>
                      <option value="engine">Engine Repair</option>
                      <option value="transmission">Transmission Service</option>
                      <option value="hydraulic">Hydraulic Systems</option>
                      <option value="electrical">Electrical Service</option>
                      <option value="diagnostic">Diagnostic Service</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-primary">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your tractor and service needs..."
                      className="mt-2 border-2 border-primary/20 bg-white placeholder:text-muted-foreground/50 focus:border-primary min-h-[120px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-secondary px-8 py-6 text-lg font-black uppercase tracking-widest text-primary hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>

              {/* Map */}
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">Visit Us</p>
                <h2 className="mt-2 text-4xl font-black uppercase tracking-tighter text-primary mb-8">
                  Our Location
                </h2>
                <div className="relative h-[400px] overflow-hidden rounded-lg shadow-lg border-4 border-primary/20">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3755.963109139527!2d74.47825837562833!3d19.71419470000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc590035d7842d%3A0xd67be3d1e936e4b1!2sMate%20Tractor%20Garage!5e0!3m2!1sen!2sin!4v1770832300655!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="mt-6 rounded-lg bg-white p-6 border-2 border-primary/10">
                  <h3 className="font-black uppercase tracking-tighter text-primary">Directions</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Located in Rahata, Maharashtra, our service center is easily accessible from major highways. Follow the GPS coordinates or use the map above for detailed directions.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                  >
                    <a
                      href="https://maps.google.com/?q=Mate+Tractor+Garage"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white px-4 py-20 md:px-10 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">FAQ</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-tighter text-primary mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                {
                  q: "How long does a typical repair take?",
                  a: "Repair time varies depending on the service. Simple maintenance takes 1-2 hours, while complex repairs can take 1-3 days. We always provide time estimates upfront.",
                },
                {
                  q: "Do you offer emergency repairs?",
                  a: "Yes! We offer 24/7 emergency repair services. Call us anytime for urgent tractor issues affecting your operations.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept cash, bank transfers, credit cards, and digital payment methods for your convenience.",
                },
                {
                  q: "Do you offer warranty on repairs?",
                  a: "Absolutely. All our repairs come with a comprehensive warranty. Parts are guaranteed for 12 months or as per manufacturer warranty.",
                },
                {
                  q: "Can you service all tractor brands?",
                  a: "Yes, our technicians are certified to service all major tractor brands and models. We work on agricultural, industrial, and compact tractors.",
                },
                {
                  q: "How can I schedule a service appointment?",
                  a: "You can call us directly at 800-2345-6789, fill out our contact form, or visit us in person. We'll arrange a convenient time for your service.",
                },
              ].map((faq, index) => (
                <div key={index} className="rounded-lg border-2 border-primary/10 bg-muted p-6 hover:border-primary hover:shadow-lg transition-all">
                  <h3 className="font-black text-lg text-primary uppercase tracking-tighter">
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
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
              Still Have <span className="text-secondary">Questions?</span>
            </h2>
            <p className="mt-4 max-w-lg text-white/90 text-lg">
              Don't hesitate to reach out. Our team is ready to assist you.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-secondary px-10 py-7 text-lg font-black uppercase tracking-widest text-primary hover:bg-white"
            >
              <a href="tel:+918002345678">Call Us Now</a>
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
