"use client";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Our Mobile Number",
      details: ["+63925 551 0987"],
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Phone,
      title: "Our Landline Number",
      details: ["+628 788 1613"],
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Mail,
      title: "Email Us Here",
      details: ["info.jsprimeconstruction@gmail.com", "info.jsconstructionandtrading@gmail.com"],
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: MapPin,
      title: "Our Address",
      details: [
        "Head Office:",
        "Civic Prime Building, 2301 Civic Drive,",
        "Filinvest Corporate City, Alabang",
        "Muntinlupa City Philippines 1781",
        "",
        "Satellite Office:",
        "Verdana Center, Daang Hari Molino IV,",
        "Bacoor City, Cavite",
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3A2D28] via-[#A48374] to-[#3A2D28] py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#A48374] rounded-full animate-float" />
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#CBAD8D] rounded-full animate-float-delayed" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#EBE3DB] rounded-full animate-float-slow" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-6" data-aos="fade-up">
            <Badge className="bg-[#CBAD8D] text-[#3A2D28] px-4 py-2 text-sm font-semibold">Get In Touch</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance text-[#EBE3DB]">
              Contact <span className="text-[#CBAD8D]">J's Prime Construction</span>
            </h1>
            <p
              className="text-xl text-white leading-relaxed"
              data-aos="fade-up"
              style={{ animationDelay: "200ms" }}
            >
              Ready to start your construction project? Get in touch with our team for professional consultation and
              quality construction services.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-[#CBAD8D] hover:bg-[#A48374] text-[#3A2D28] px-8 py-3 text-lg font-semibold border-2 border-[#EBE3DB] hover:border-[#A48374] transition-all duration-300 hover:scale-105"
            data-aos="zoom-in"
            style={{ animationDelay: "400ms" }}
            onClick={() => window.open('tel:+639255510987')}
          >
            Call Us Now
          </Button>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0">
        <div className="w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d966.0397265328708!2d121.04332891856315!3d14.41800154359728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d0370b94827b%3A0x476639e09c165bb5!2sCivic%20Prime%20Condominium!5e0!3m2!1sen!2sph!4v1719562752538!5m2!1sen!2sph"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground animate-fade-in-up">Get In Touch With Us</h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Multiple ways to reach our team for your construction needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactMethods.slice(0, 3).map((method, index) => {
              const IconComponent = method.icon
              return (
                <Card
                  key={method.title}
                  className="text-center shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-8 space-y-6">
                    <div
                      className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className={`w-8 h-8 ${method.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{method.title}</h3>
                    <div className="space-y-1">
                      {method.details.map((detail, detailIndex) => (
                        <p
                          key={detailIndex}
                          className="text-muted-foreground text-sm leading-relaxed break-words"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Business Hours & Social Media */}
      <section className="py-20 px-6 flex justify-center items-center">
        <div className="w-full max-w-lg mx-auto">
          <Card
            className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Facebook className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Connect With Us</h3>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Follow us on social media for project updates, construction tips, and company news.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open('https://www.facebook.com/js.primeconstruction', '_blank')}>
                  <Facebook className="w-5 h-5 mr-2" />
                  Follow on Facebook
                </Button>
              </div>
              <div className="pt-6 border-t border-muted space-y-4">
                <h4 className="font-semibold text-foreground">Quick Contact</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => window.open('tel:+639255510987')}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call: +63925 551 0987
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="break-all">Email: info.jsprimeconstruction@gmail.com</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
  {/* Call to Action section removed as requested */}

      {/* Our Address Full Width Section */}
      <section className="py-16 px-6 bg-[#EBE3DB]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <MapPin className="w-12 h-12 mx-auto text-[#A48374]" data-aos="fade-down" />
            <h2 className="text-3xl font-bold text-[#3A2D28]" data-aos="fade-up">Our Address</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-8 text-center" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-xl font-bold text-[#A48374] mb-2">Head Office</h3>
              <p className="text-[#3A2D28]">
                Civic Prime Building, 2301 Civic Drive,<br />
                Filinvest Corporate City, Alabang<br />
                Muntinlupa City Philippines 1781
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-8 text-center" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-xl font-bold text-[#A48374] mb-2">Satellite Office</h3>
              <p className="text-[#3A2D28]">
                Verdana Center, Daang Hari Molino IV,<br />
                Bacoor City, Cavite
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
