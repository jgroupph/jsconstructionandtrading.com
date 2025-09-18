"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import '../styles/featured-section.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AOS from 'aos';

export default function FeaturedSection() {
  const router = useRouter();
  
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic',
    });
  }, []);

  const getNavigationPath = (type: string) => {
    switch (type) {
      case 'equipment':
        return '/heavy-equipment-rental';
      case 'project':
        return '/projects';
      case 'road-painting':
        return '/projects';
      default:
        return '#';
    }
  };

  const allFeaturedItems = [
    // Heavy Equipment
    {
      id: 1,
      type: "equipment",
      title: "Bulldozer",
      image: "/homepage/bulldozer.jpg",
      description: "Heavy-duty earthmoving equipment for construction and excavation projects",
      badge: "Heavy Equipment",
      badgeColor: "bg-[#CBAD8D] text-[#3A2D28]"
    },
    {
      id: 2,
      type: "equipment",
      title: "Road Roller",
      image: "/homepage/road-roller.jpg",
      description: "Compaction equipment for road construction and asphalt laying",
      badge: "Heavy Equipment",
      badgeColor: "bg-[#CBAD8D] text-[#3A2D28]"
    },
    {
      id: 3,
      type: "equipment",
      title: "Excavator",
      image: "/homepage/excavator.jpg",
      description: "Versatile digging machine for various construction applications",
      badge: "Heavy Equipment",
      badgeColor: "bg-[#CBAD8D] text-[#3A2D28]"
    },
    // Featured Projects
    {
      id: 4,
      type: "project",
      title: "Robinsons Supermarket Renovation",
      image: "/homepage/robinson1.png",
      description: "Complete renovation and modernization of Robinsons Supermarket facility",
      badge: "Featured Project",
      badgeColor: "bg-[#A48374] text-white"
    },
    {
      id: 5,
      type: "project",
      title: "Robinsons Supermarket Renovation",
      image: "/homepage/robinson2.png",
      description: "Interior design and structural improvements for enhanced customer experience",
      badge: "Featured Project",
      badgeColor: "bg-[#A48374] text-white"
    },
    // Road Painting Projects
    {
      id: 6,
      type: "road-painting",
      title: "Thermoplastic Road Painting",
      image: "/homepage/p1.jpg",
      description: "Professional road marking with durable thermoplastic materials",
      badge: "Road Painting",
      badgeColor: "bg-[#3A2D28] text-white"
    },
    {
      id: 7,
      type: "road-painting",
      title: "Thermoplastic Road Painting",
      image: "/homepage/p2.jpg",
      description: "High-visibility road markings for improved traffic safety",
      badge: "Road Painting",
      badgeColor: "bg-[#3A2D28] text-white"
    },
    {
      id: 8,
      type: "road-painting",
      title: "Thermoplastic Road Painting",
      image: "/homepage/p3.jpg",
      description: "Complete road marking solution with long-lasting materials",
      badge: "Road Painting",
      badgeColor: "bg-[#3A2D28] text-white"
    }
  ];

  return (
    <section id="featured-section" className="featured-section py-20 px-6 bg-gradient-to-br from-[#F1EDE6] to-[#EBE3DB]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl  font-bold text-[#3A2D28] mb-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Featured <span className="text-[#A48374]">Showcase</span>
          </h2>
          <p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Discover our premium heavy equipment, successful projects, and specialized road painting services
          </p>
        </div>

        {/* Combined Slider */}
        <div data-aos="zoom-in" data-aos-delay="400">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={true}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="featured-combined-swiper"
          >
            {allFeaturedItems.map((item) => (
              <SwiperSlide key={item.id}>
                <Card 
                  className="featured-card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden border-[#D1C7BD] h-full cursor-pointer"
                  onClick={() => router.push(getNavigationPath(item.type))}
                >
                  <div className="relative">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="featured-image w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <Badge 
                      className={`absolute top-4 right-4 ${item.badgeColor} text-xs px-3 py-1 font-medium`}
                    >
                      {item.badge}
                    </Badge>
                  </div>
                  <CardHeader className="pb-6">
                    <CardTitle className="text-lg sm:text-xl text-[#3A2D28] group-hover:text-[#A48374] transition-colors text-center">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
