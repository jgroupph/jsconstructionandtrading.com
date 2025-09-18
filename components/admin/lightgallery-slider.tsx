"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface LightGallerySliderProps {
  images: string[]
  className?: string
}

export function LightGallerySlider({ images, className = "" }: LightGallerySliderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openGallery = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const closeGallery = () => {
    setIsOpen(false)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid grid-cols-2 gap-2 h-full ${className}`}>
        {images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            onClick={() => openGallery(index)}
            className={`relative cursor-pointer group ${
              index === 0 && images.length === 1 ? "col-span-2" : index === 0 && images.length >= 2 ? "row-span-2" : ""
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg transition-opacity group-hover:opacity-80"
            />
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-[#3A2D28] bg-opacity-70 flex items-center justify-center rounded-lg">
                <span className="text-[#F1EDE6] font-medium text-sm">+{images.length - 4} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Modal Gallery */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#3A2D28] bg-opacity-95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 z-60 p-2 rounded-full bg-[#3A2D28] text-[#F1EDE6] hover:bg-[#A48374] transition-colors"
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-2 rounded-full bg-[#3A2D28] text-[#F1EDE6] hover:bg-[#A48374] transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-2 rounded-full bg-[#3A2D28] text-[#F1EDE6] hover:bg-[#A48374] transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="max-w-4xl max-h-[80vh] mx-4">
            <img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden transition-all ${
                    index === currentIndex
                      ? "border-[#CBAD8D] opacity-100"
                      : "border-[#A48374] opacity-60 hover:opacity-80"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#3A2D28] bg-opacity-80 px-3 py-1 rounded-full">
            <span className="text-[#F1EDE6] text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      )}
    </>
  )
}
