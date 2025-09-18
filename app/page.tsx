"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, Shield, Lightbulb } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import FeaturedSection from "@/components/FeaturedSection"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'


export default function HomePage() {
    useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic',
    })
  }, [])
  
  // Scroll to next section
  const handleGetStarted = () => {
    const nextSection = document.getElementById('featured-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#3A2D28] py-20 px-6 relative overflow-hidden">
        {/* Geometric SVG background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="100" y="50" width="300" height="120" rx="24" fill="#A48374" opacity="0.7" />
            <rect x="900" y="400" width="220" height="80" rx="20" fill="#CBAD8D" opacity="0.5" />
            <rect x="600" y="200" width="180" height="60" rx="16" fill="#EBE3DB" opacity="0.3" />
            <rect x="1200" y="100" width="120" height="40" rx="12" fill="#D1C7BD" opacity="0.4" />
          </svg>
        </div>
        {/* Floating shapes */}
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#A48374] rounded-full animate-float" />
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#CBAD8D] rounded-full animate-float-delayed" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#EBE3DB] rounded-full animate-float-slow" />
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-20">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-balance text-[#F1EDE6]" data-aos="fade-up" data-aos-delay="100">
              DESIGN. CONSTRUCT. MAINTAIN. REPAIR.{" "}
              <span className="hero-accent animate-pulse text-[#CBAD8D]" data-aos="zoom-in" data-aos-delay="200">HEAVY EQUIPMENT RENTAL.</span>
            </h1>
            <p
              className="text-xl leading-relaxed max-w-2xl text-[#EBE3DB]"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Our team specializes in designing, constructing, and delivering high-quality home and building
              innovations. Book us now and let's create a comfortable and stylish environment for your homes and
              business!
            </p>
            <Button
              size="lg"
              className="bg-[#CBAD8D] hover:bg-[#A48374] text-[#3A2D28] px-8 py-3 text-lg font-semibold border-2 border-[#EBE3DB] hover:border-[#A48374] transition-all duration-300 hover:scale-105"
              data-aos="zoom-in"
              data-aos-delay="500"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>
          <div className="relative" data-aos="fade-left" data-aos-delay="600">
            <div className="bg-[#D1C7BD] rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src="/homepage/projects-landing.png"
                alt="Modern interior design"
                className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Showcase Section */}
      <FeaturedSection />

      {/* Services Section */}
      <section id="services-section" className="py-20 px-6 bg-[#EBE3DB]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground leading-tight text-balance" data-aos="fade-right" data-aos-delay="100">
                A better way to start building your homes and businesses.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed" data-aos="fade-right" data-aos-delay="200">
                We combine years of expertise with innovative approaches to deliver exceptional construction and
                renovation services.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Building2,
                  title: "Services",
                  description:
                    "With our team of veteran specialists, we can help you construct, maintain, and repair your office in any field, industry, and aspect with our Civil Construction and Interior Design services.",
                },
                {
                  icon: Users,
                  title: "Business Aligned",
                  description:
                    "For start-up entrepreneurs and veteran businessmen who want to put up or improve their workplace, our lead consultants will provide expert advice on how to effectively implement any renovation requirements as well as execute the job with minimal delay.",
                },
                {
                  icon: Shield,
                  title: "Free of Risks",
                  description:
                    "Never again will you have to take unnecessary risks with safety hazards in the office or tolerate inconveniences from broken facilities.",
                },
                {
                  icon: Lightbulb,
                  title: "Innovation",
                  description:
                    "Let our teams help you live an easier life by actualizing your dreams of working in a safe and relaxing environment.",
                },
              ].map((service, index) => {
                const IconComponent = service.icon
                return (
                  <Card
                    key={service.title}
                    className="bg-[#F1EDE6] border-[#D1C7BD] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                    data-aos="fade-up"
                    data-aos-delay={100 + index * 150}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 bg-[#CBAD8D] rounded-lg flex items-center justify-center group-hover:bg-[#A48374] transition-colors" data-aos="zoom-in" data-aos-delay={200 + index * 150}>
                        <IconComponent className="w-6 h-6 text-[#3A2D28]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#3A2D28]" data-aos="fade-up" data-aos-delay={250 + index * 150}>{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed" data-aos="fade-up" data-aos-delay={300 + index * 150}>{service.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-6 bg-[#A48374]/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <blockquote className="text-2xl lg:text-3xl font-medium text-[#3A2D28] italic leading-relaxed text-balance" data-aos="fade-up" data-aos-delay="100">
            "You can dream, create, design, and build the most wonderful place in the world. But it requires people to
            make the dream a reality."
          </blockquote>
          <cite className="text-lg text-[#CBAD8D] font-semibold" data-aos="fade-up" data-aos-delay="200">— Walt Disney</cite>
        </div>
      </section>

      <Footer />
    </div>
  )
}
