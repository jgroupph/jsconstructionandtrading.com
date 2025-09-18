import { Facebook } from "lucide-react"

export function Footer() {
  return (
  <footer className="bg-[#3A2D28] text-[#EBE3DB] py-16 px-6">
  <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[#EBE3DB]">FIND US</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#CBAD8D] mb-2">Address</h4>
              <div className="text-[#D1C7BD] space-y-1">
                <p className="font-medium">Head Office:</p>
                <p>Civic Prime Building</p>
                <p>2301 Civic Drive,</p>
                <p>Filinvest Corporate City,</p>
                <p>Alabang Muntinlupa City,</p>
                <p>Philippines 1781</p>
              </div>
              <div className="text-[#D1C7BD] space-y-1 mt-4">
                <p className="font-medium">Satellite Office:</p>
                <p>Verdana Center,</p>
                <p>Daang Hari Molino IV,</p>
                <p>Bacoor City, Cavite</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-[#CBAD8D] mb-2">Contact</h4>
            <div className="text-[#D1C7BD] space-y-1">
              <p>Landline: +63925 551 0987</p>
              <p>Mobile: +628 788 1613</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#CBAD8D] mb-2">Email</h4>
            <div className="text-[#D1C7BD] space-y-1">
              <p>info.jprimeconstruction@gmail.com</p>
              <p>info.sconstruction@trading@gmail.com</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#EBE3DB] mb-4">SOCIAL MEDIA</h3>
            <a href="https://www.facebook.com/js.primeconstruction" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-6 h-6 text-[#D1C7BD] hover:text-[#EBE3DB] cursor-pointer transition-colors" />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <a href="https://jsprimeconstruction.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/logo-pages.png"
              alt="J's Prime Construction"
              className="h-16 w-16"
            />
          </a>
          <div className="text-[#D1C7BD] text-sm">
            <p>Copyright J's Prime Construction</p>
            <p>© 2024 All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
