"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, Users, Award, Target, Eye, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { ObjectId } from "mongodb";

interface Milestone {
  id: ObjectId | string
  year: string
  title: string
  description: string
  createdAt: Date
}

export default function AboutPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [missionVision, setMissionVision] = useState<{ mission: string; vision: string }>({ mission: "", vision: "" });
  const [values, setValues] = useState<any[]>([]);
  const iconMap: Record<string, React.ComponentType<any>> = {
  Calendar,
  Users,
  Award,
  Target,
  Eye,
  Heart,
};


  useEffect(() => {
    // Fetch milestones from the API when the component mounts
    const fetchMilestones = async () => {
      try {
        const response = await fetch("/api/milestones");
        if (response.ok) {
          const data = await response.json();
          // Convert string dates to Date objects
          const formattedData = data.map((milestone: Milestone) => ({
            id: milestone.id,
            year: milestone.year,
            title: milestone.title,
            description: milestone.description,
            createdAt: new Date(milestone.createdAt),
          }));
          setMilestones(formattedData);
        } else {
          console.error("Failed to fetch milestones");
        }
      } catch (error) {
        console.error("Error fetching milestones:", error);
      }
    };

    const fetchMissionVision = async () => {
      try {
        const response = await fetch("/api/mission-vision");
        if (response.ok) {
          const data = await response.json();
          setMissionVision({ mission: data[0].mission, vision: data[0].vision });
        } else {
          console.error("Failed to fetch mission and vision");
        }
      } catch (error) {
        console.error("Error fetching mission and vision:", error);
      }
    };

    const fetchCoreValues = async () => {
      try {
        const response = await fetch("/api/core-values");
        if (response.ok) {
          const data = await response.json();
          setValues(data);
        } else {
          console.error("Failed to fetch core values");
        } 
      } catch (error) {
        console.error("Error fetching core values:", error);
      }   
    }

    fetchMissionVision();
    fetchCoreValues();
    fetchMilestones();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Mission Section */}
      <section className="bg-gradient-to-br from-[#3A2D28] via-[#A48374] to-[#3A2D28] py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#A48374] rounded-full animate-float" />
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#CBAD8D] rounded-full animate-float-delayed" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-6">
            <Badge className="bg-[#CBAD8D] text-[#3A2D28] px-4 py-2 text-sm font-semibold" data-aos="fade-down" data-aos-delay="100">
              About J's Prime Construction
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-balance leading-tight text-[#EBE3DB]" data-aos="fade-up" data-aos-delay="200">
              Our mission is to make your homes and buildings{" "}
              <span className="text-[#CBAD8D]">comfortable for everyone.</span>
            </h1>
            <p
              className="text-xl text-white leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              How our company evolved through the years of providing service and
              care for our dear customers and build their custom homes with full
              service and dedication.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-[#CBAD8D] hover:bg-[#A48374] text-[#3A2D28] px-8 py-3 text-lg font-semibold border-2 border-[#EBE3DB] hover:border-[#A48374] transition-all duration-300 hover:scale-105"
            data-aos="zoom-in"
            data-aos-delay="400"
            onClick={() => {
              const journeySection = document.getElementById('how-we-started');
              if (journeySection) {
                journeySection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Read our story
          </Button>
        </div>
      </section>

      {/* How We Started Section */}
      <section id="how-we-started" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: alternate content then image */}
          <div className="flex flex-col gap-12 lg:hidden">
            {/* How we started */}
            <div>
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-6 h-6 text-primary" />
                  <Badge variant="outline" className="text-primary border-primary">
                    Our Beginning
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold text-foreground">How we started</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Since 2012, our company has strategically diversified its business portfolio across various sectors. In 2016, we entered the Philippine construction industry, aiming for growth and innovation while upholding our core values of quality, reliability, and customer-centricity.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Over the years, our construction projects have garnered recognition for excellence, reflecting our commitment to continuous improvement and expansion in this sector. Simultaneously, our educational initiative, the 9.0 Niner franchise, founded by a former student, has flourished in Muntinlupa City and Cavite, becoming hubs of educational excellence dedicated to empowering students with quality education.
                </p>
              </div>
              <div className="relative mt-6">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  <img src="/construction-company-history-building-development.jpg" alt="Company history" className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105" data-aos="fade-up" data-aos-delay="100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          </div>
          {/* Desktop: keep original grid order */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-none">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img src="/construction-company-history-building-development.jpg" alt="Company history" className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105" data-aos="fade-up" data-aos-delay="100" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            <div className="space-y-6 order-1 lg:order-none">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <Badge variant="outline" className="text-primary border-primary">
                  Our Beginning
                </Badge>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">How we started</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Since 2012, our company has strategically diversified its business portfolio across various sectors. In 2016, we entered the Philippine construction industry, aiming for growth and innovation while upholding our core values of quality, reliability, and customer-centricity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Over the years, our construction projects have garnered recognition for excellence, reflecting our commitment to continuous improvement and expansion in this sector. Simultaneously, our educational initiative, the 9.0 Niner franchise, founded by a former student, has flourished in Muntinlupa City and Cavite, becoming hubs of educational excellence dedicated to empowering students with quality education.
              </p>
            </div>
          </div>
        </div>
      </section>



            {/* The Day We Expanded Our Business Section */}
            <section className="py-20 px-6 bg-muted/30">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                {/* Content left, image right for desktop; content then image for mobile */}
                <div className="space-y-6" data-aos="fade-right" data-aos-delay="200">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-6 h-6 text-primary" />
                    <Badge variant="outline" className="text-primary border-primary">
                      The day we expanded our business
                    </Badge>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground">The day we expanded our business</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    In the automotive sector, our journey began with an online platform in 2012, evolving into physical stores offering specialized components and establishing personal connections with customers. This expansion included renowned brands like TEIN, HKS, and BC Racing, meeting the demands for performance parts and suspension solutions. Post-pandemic in 2021, we launched 'J's Heavy Equipment Rental Hub,' providing a wide range of heavy equipment rental services. This venture, marked by partnerships with leading suppliers and successful project completions, underscores our commitment to quality and customer satisfaction.
                  </p>
                </div>
                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                    <img
                      src="/expansion.jpg"
                      alt="Business Expansion"
                      className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                      data-aos="zoom-in-up"
                      data-aos-delay="200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </section>


      {/* Our Step Into Success Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-none">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <img
                src="/construction-success-modern-building-project.jpg"
                alt="Success story"
                className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                data-aos="zoom-in-up"
                data-aos-delay="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div
            className="space-y-6"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-primary" />
              <Badge variant="outline" className="text-primary border-primary">
                Growth & Innovation
              </Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Our step into success
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              In 2019, we ventured into the VIP & Bridal Car industry, focusing
              on delivering elegance for weddings and special events, expanding
              our service offerings while maintaining exceptional standards.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Additionally, "J's Printing Press," established in 2016,
              solidified our presence in printing and publishing by delivering
              high-quality print and digital solutions across diverse clientele.
              Looking ahead, our latest initiative starting in December 2024
              aims to offer vocational training in technology, contributing to
              the career aspirations of Filipinos and aligning with global
              demands for skilled professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Our Mission */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6" data-aos="fade-up" data-aos-delay="400">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <Badge
                  variant="outline"
                  className="text-primary border-primary"
                >
                  Our Mission
                </Badge>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                { missionVision.mission || "To provide high-quality construction services that prioritize customer satisfaction, safety, and innovation, while fostering a collaborative and growth-oriented work environment for our employees." }
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    Innovation-Driven
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Leading with cutting-edge solutions
                  </div>
                </div>
              </div>
            </div>
            <div
              className="relative"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img
                  src="/construction-mission-planning-design-innovation.jpg"
                  alt="Our mission"
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  data-aos="zoom-in-up"
                  data-aos-delay="400"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>

          {/* Our Vision */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1" data-aos="fade-up" data-aos-delay="500">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img
                  src="/construction-vision-philippines-number-one-contrac.jpg"
                  alt="Our vision"
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  data-aos="zoom-in-up"
                  data-aos-delay="500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            <div
              className="space-y-6 order-1 lg:order-2"
              data-aos="fade-left"
              data-aos-delay="500"
            >
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-primary" />
                <Badge
                  variant="outline"
                  className="text-primary border-primary"
                >
                  Our Vision
                </Badge>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                { missionVision.vision || "To be the Philippines' Number 1 contractor of choice by consistently delivering projects in the most cost-effective, time-efficient, and structurally-secure manner." }
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    Excellence-Focused
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Setting industry standards nationwide
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#3A2D28] via-[#A48374] to-[#EBE3DB] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold" data-aos="fade-up">OUR CORE VALUES</h2>
            <p className="text-xl text-[#D1C7BD]" data-aos="fade-up" data-aos-delay="100">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = iconMap[value.icon] || Award;
              return (
                <Card
                  key={value.title}
                  className={`bg-gradient-to-br from-[#A48374] via-[#CBAD8D] to-[#EBE3DB] text-[#3A2D28] border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-4 group`}
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 150}
                >
                  <CardContent className="p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-[#EBE3DB]/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#EBE3DB]/30 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-[#3A2D28]" />
                    </div>
                    <h3 className="text-2xl font-bold">{value.title}</h3>
                    <p className="text-[#A48374] leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
  <section id="journey-section" className="py-20 px-6 bg-[#EBE3DB]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#3A2D28]" data-aos="fade-up">Our Journey</h2>
            <p className="text-xl text-[#A48374]" data-aos="fade-up" data-aos-delay="100">Milestones that shaped our company's growth and success</p>
          </div>
          <div className="relative">
            {/* Desktop timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#A48374]/20"></div>
            {/* Mobile timeline line */}
            <div className="md:hidden absolute left-8 top-0 h-full w-1 bg-[#A48374]/20"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`flex items-center ${index % 2 === 0 ? "md:flex-row flex-row" : "md:flex-row-reverse flex-row"}`}
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 150}
                >
                  {/* Desktop layout */}
                  <div
                    className={`hidden md:block w-5/12 ${
                      index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                    }`}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <Badge
                            variant="outline"
                            className="text-primary border-primary"
                          >
                            {milestone.year}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden flex items-start gap-4 w-full">
                    <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg mt-6"></div>
                    <Card className="flex-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <Badge
                            variant="outline"
                            className="text-primary border-primary"
                          >
                            {milestone.year}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Desktop center dot */}
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                  </div>
                  <div className="hidden md:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
