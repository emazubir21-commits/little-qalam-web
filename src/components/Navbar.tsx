import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOrderClick: () => void;
}

const NAV_LINKS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Pilar Belajar', href: '#pilar' },
  { label: 'Katalog', href: '#katalog' },
  { label: 'Pemesanan', href: '#pesan' },
];

export function Navbar({ onOrderClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-sm border-b border-[#E5DEC9]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#beranda"
          className="font-display text-xl font-bold tracking-tight text-[#2E6F65] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E6F65] rounded-sm"
        >
          Little Qalam
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52635F]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#1B2A27] transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#F4B942] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E6F65]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOrderClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#2E6F65] hover:bg-[#23574F] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F65]"
          >
            Pesan Sekarang
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#1B2A27] hover:bg-[#F2EBDD] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2E6F65]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5DEC9] bg-[#FAF6EE] px-5 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleMobileNav}
              className="block py-2.5 text-sm font-medium text-[#1B2A27] hover:text-[#2E6F65] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOrderClick();
              }}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#2E6F65] hover:bg-[#23574F] rounded-lg transition-colors cursor-pointer"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
