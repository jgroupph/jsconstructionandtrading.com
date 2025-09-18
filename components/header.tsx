"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/heavy-equipment-rental", label: "Heavy Equipment Rental" },
    { href: "/contact", label: "Contact" },
  ]

  return (
  <header className="bg-[#3A2D28] shadow-lg sticky top-0 z-50 backdrop-blur-sm">
  <nav className="max-w-7xl mx-auto px-6 py-4">
  <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              width={48}
              height={48}
              src="logo-pages.png"
              alt="J's Prime Construction"
              className="h-12 w-12 transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-[#EBE3DB] group-hover:text-[#CBAD8D] transition-colors">
                J's Prime
              </div>
              <div className="text-sm text-[#CBAD8D] group-hover:text-[#A48374] transition-colors">CONSTRUCTION</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#A48374]/20 text-[#EBE3DB] hover:text-[#CBAD8D] ${
                  isActive(item.href) ? "active bg-[#A48374]/20 text-[#CBAD8D]" : ""
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#CBAD8D] rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#EBE3DB] hover:bg-[#A48374]/20 transition-all duration-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-white/10 text-white hover:text-orange-300 ${
                    isActive(item.href) ? "active bg-white/10 text-orange-300" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
