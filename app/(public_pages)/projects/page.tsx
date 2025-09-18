"use client";
import { useRef, useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Eye } from "lucide-react";
import { ProjectsSkeleton, BrandsSkeleton } from "@/components/admin/projects-skeleton";
import { ImageSlider } from "@/components/admin/image-slider";

export default function ProjectsPage() {
  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [currentProjectTitle, setCurrentProjectTitle] = useState("");
  const [brands, setBrands] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
      // Fetch brands from API when component mounts
      const fetchBrands = async () => {
        try {
          setBrandsLoading(true);
          const res = await fetch("/api/brands")
          if (!res.ok) {
            console.error("Failed to fetch brands")
            return
          }
          const data: any = await res.json()
          // Sort brands by createdAt ascending
          data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          
          setBrands(data.map((b: any) => ({
            ...b,
            createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
            brand_img: b.brandImage || "",
            brand_name: b.brandName || ""
          })))
        }
        catch (error) {
          console.error("Error fetching brands:", error)
        } finally {
          setBrandsLoading(false);
        }
      }

      const fetchProjects = async () => {
        try {
          setProjectsLoading(true);
          const res = await fetch("/api/projects")
          if (!res.ok) {
            console.error("Failed to fetch projects")
            return
          }
          const data: any = await res.json()
          setProjects(data)
        }
        catch (error) {
          console.error("Error fetching projects:", error)
        } finally {
          setProjectsLoading(false);
        }
      }

      fetchProjects()
      fetchBrands()
    }, [])

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3A2D28] via-[#A48374] to-[#3A2D28] py-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="space-y-4" data-aos="fade-up">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-balance text-[#EBE3DB]">
              Our <span className="text-[#CBAD8D]">Projects</span>
            </h1>
            <p className="text-xl text-white leading-relaxed max-w-3xl mx-auto">
              Discover our portfolio of successful construction and renovation projects across the Philippines. From
              residential developments to commercial spaces, we bring excellence to every build.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-[#CBAD8D] hover:bg-[#A48374] text-[#3A2D28] px-8 py-3 text-lg font-semibold border-2 border-[#EBE3DB] hover:border-[#A48374] transition-all duration-300 hover:scale-105"
            data-aos="zoom-in"
            style={{ animationDelay: "200ms" }}
            onClick={() => {
              const nextSection = document.getElementById('projects-gallery');
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Explore Our Projects
          </Button>
        </div>
      </section>

      {/* Trusted Clients Section */}
      <section className="py-16 px-6 bg-[#EBE3DB]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-[#3A2D28]" data-aos="fade-up">Trusted by Leading Brands</h2>
            {brandsLoading ? (
              <BrandsSkeleton />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center">
                {brands.map((brand, index) => (
                  <div
                    key={brand.id}
                    className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                    data-aos="fade-up"
                    data-aos-delay={100 + index * 100}
                  >
                    <img
                      src={process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/" + brand.brand_img || "/placeholder.svg"}
                      alt={`${brand.brand_name} logo`}
                      className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section id="projects-gallery" className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground animate-fade-in-up">Featured Projects</h2>
            <p
              className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              Explore our recent construction and renovation projects that showcase our commitment to quality and
              innovation.
            </p>
          </div>

          {projectsLoading ? (
            <ProjectsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <Card
                  key={project.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group bg-white border-2 border-[#D1C7BD] hover:border-[#A48374]"
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 150}
                >
                  <CardContent className="p-0">
                    {/* Enhanced Project Images Display */}
                    <div className="relative">
                      <div className="grid grid-cols-2 gap-1">
                        {project.images.slice(0, 2).map((image: any, imgIndex: number) => (
                          <div 
                            key={imgIndex} 
                            className="relative overflow-hidden cursor-pointer group/image"
                            onClick={() => {
                              const fullImages = project.images.map((img: any) => 
                                process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/" + img
                              );
                              setSliderImages(fullImages);
                              setSliderIndex(imgIndex);
                              setCurrentProjectTitle(project.title);
                              setSliderOpen(true);
                            }}
                          >
                            <img
                              src={process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/" + image || "/placeholder.svg"}
                              alt={`${project.title} - Image ${imgIndex + 1}`}
                              className="w-full h-48 object-cover transition-all duration-500 group-hover/image:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3A2D28]/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300">
                              <div className="bg-[#CBAD8D]/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover/image:scale-100 transition-transform duration-300">
                                <Eye className="w-6 h-6 text-[#3A2D28]" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Image Count Indicator */}
                      {project.images.length > 2 && (
                        <div className="absolute top-3 right-3 bg-[#3A2D28]/80 backdrop-blur-sm text-[#EBE3DB] px-3 py-1 rounded-full text-sm font-medium border border-[#CBAD8D]/30">
                          +{project.images.length - 2} more
                        </div>
                      )}
                      
                      {/* View Gallery Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <Button
                          onClick={() => {
                            const fullImages = project.images.map((img: any) => 
                              process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/" + img
                            );
                            setSliderImages(fullImages);
                            setSliderIndex(0);
                            setCurrentProjectTitle(project.title);
                            setSliderOpen(true);
                          }}
                          className="bg-[#CBAD8D] hover:bg-[#A48374] text-[#3A2D28] font-semibold px-6 py-2 rounded-lg border-2 border-[#EBE3DB] transform scale-90 group-hover:scale-100 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Gallery ({project.images.length})
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced Project Details */}
                    <div className="p-6 space-y-4 bg-gradient-to-b from-white to-[#F8F6F3]">
                      <h3 className="text-xl font-bold text-[#3A2D28] leading-tight group-hover:text-[#A48374] transition-colors duration-300">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[#A48374]">
                        <div className="bg-[#CBAD8D]/20 p-2 rounded-full">
                          <MapPin className="w-4 h-4 text-[#A48374]" />
                        </div>
                        <span className="text-sm font-medium">{project.location}</span>
                      </div>
                      
                      {/* Project Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#D1C7BD]">
                        <div className="text-xs text-[#A48374] bg-[#EBE3DB] px-3 py-1 rounded-full">
                          {project.images.length} Photos
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const fullImages = project.images.map((img: any) => 
                              process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/" + img
                            );
                            setSliderImages(fullImages);
                            setSliderIndex(0);
                            setCurrentProjectTitle(project.title);
                            setSliderOpen(true);
                          }}
                          className="text-[#A48374] hover:text-[#3A2D28] hover:bg-[#CBAD8D]/20 transition-all duration-300"
                        >
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Enhanced Image Slider Modal */}
          <ImageSlider
            images={sliderImages}
            isOpen={sliderOpen}
            onClose={() => setSliderOpen(false)}
            initialIndex={sliderIndex}
            projectTitle={currentProjectTitle}
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#3A2D28] via-[#A48374] to-[#3A2D28] text-[#EBE3DB]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-balance animate-fade-in-up">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl text-white leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Let's discuss how we can bring your construction vision to life with our expertise and dedication.
          </p>
          <Button
            size="lg"
            className="bg-[#CBAD8D] text-[#3A2D28] hover:bg-[#A48374] px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            data-aos="zoom-in"
            style={{ animationDelay: "200ms" }}
            onClick={() => { window.location.href = '/contact'; }}
          >
            Contact Us Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
