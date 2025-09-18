"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2, Download } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  projectTitle?: string;
}

export function ImageSlider({ images, isOpen, onClose, initialIndex = 0, projectTitle = "" }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
    setImageLoaded(false);
  }, [initialIndex, isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImageLoaded(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImageLoaded(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setImageLoaded(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-gradient-to-br from-[#3A2D28] via-[#2C1F1A] to-[#3A2D28] border-2 border-[#A48374]/30">
        <div className="relative w-full h-full flex flex-col overflow-hidden rounded-lg">
          
          {/* Enhanced Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-transparent p-6">
            <div className="flex justify-between items-start">
              <div className="text-white space-y-1">
                {projectTitle && (
                  <h3 className="text-xl font-bold text-[#CBAD8D] tracking-wide">
                    {projectTitle}
                  </h3>
                )}
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-[#A48374]/20 px-3 py-1 rounded-full text-[#EBE3DB] border border-[#CBAD8D]/30">
                    {currentIndex + 1} of {images.length}
                  </span>
                  <span className="text-gray-300">Project Gallery</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="text-white hover:bg-[#A48374]/20 hover:text-[#CBAD8D] border border-[#CBAD8D]/30 backdrop-blur-sm"
                >
                  {isZoomed ? <Maximize2 className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-red-500/20 hover:text-red-400 border border-red-400/30 backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="flex-1 relative overflow-hidden">
            {/* Loading State */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#3A2D28]/50">
                <div className="w-8 h-8 border-4 border-[#CBAD8D] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            <img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${projectTitle} - Image ${currentIndex + 1}`}
              className={`w-full h-full object-contain transition-all duration-500 cursor-pointer ${
                isZoomed ? 'scale-150' : 'scale-100'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setIsZoomed(!isZoomed)}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Enhanced Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={goToPrevious}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#3A2D28]/80 hover:bg-[#A48374]/90 text-[#EBE3DB] hover:text-white border-2 border-[#CBAD8D]/40 hover:border-[#CBAD8D] backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={goToNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#3A2D28]/80 hover:bg-[#A48374]/90 text-[#EBE3DB] hover:text-white border-2 border-[#CBAD8D]/40 hover:border-[#CBAD8D] backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Enhanced Bottom Controls */}
          {images.length > 1 && (
            <div className="bg-gradient-to-t from-[#3A2D28] via-[#3A2D28]/95 to-[#3A2D28]/80 border-t-2 border-[#A48374]/30 backdrop-blur-sm">
              
              {/* Thumbnail Navigation */}
              <div className="p-6">
                <div className="flex justify-center space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-[#A48374] scrollbar-track-[#3A2D28] pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                        index === currentIndex
                          ? "ring-3 ring-[#CBAD8D] ring-offset-2 ring-offset-[#3A2D28] scale-110 shadow-lg"
                          : "ring-2 ring-[#A48374]/30 hover:ring-[#CBAD8D]/60 hover:scale-105 shadow-md"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === currentIndex && (
                        <div className="absolute inset-0 bg-[#CBAD8D]/20 backdrop-blur-[1px]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="px-6 pb-4">
                <div className="w-full bg-[#A48374]/30 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#CBAD8D] to-[#A48374] h-2 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Close Button */}
              <div className="text-center pb-6">
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-[#A48374] to-[#CBAD8D] hover:from-[#CBAD8D] hover:to-[#A48374] text-[#3A2D28] px-8 py-3 font-bold border-2 border-[#CBAD8D]/30 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Close Gallery
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
