export function Footer() {
  return (
    <footer className="bg-[#1F4B44] text-[#FAF6EE]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/15">
          <div className="space-y-2 max-w-md">
            <p className="font-display text-2xl font-semibold tracking-tight text-[#FAF6EE]">
              Little Qalam
            </p>
            <p className="text-sm text-[#D7E6E3] leading-relaxed">
              Little Steps, Big Learning — UMKM media belajar anak usia 3–7 tahun asal Banda
              Aceh untuk orang tua dan guru PAUD/TK.
            </p>
          </div>

          <nav
            aria-label="Tautan bawah"
            className="flex flex-wrap items-center gap-6 text-sm text-[#D7E6E3]"
          >
            <a href="#beranda" className="hover:text-[#F4B942] transition-colors whitespace-nowrap">
              Beranda
            </a>
            <a href="#pilar" className="hover:text-[#F4B942] transition-colors whitespace-nowrap">
              Pilar Belajar
            </a>
            <a href="#katalog" className="hover:text-[#F4B942] transition-colors whitespace-nowrap">
              Katalog
            </a>
            <a href="#pesan" className="hover:text-[#F4B942] transition-colors whitespace-nowrap">
              Pemesanan
            </a>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#BBD3CE]">
          <p>© {new Date().getFullYear()} Little Qalam Banda Aceh. Seluruh hak cipta dilindungi.</p>
          <p>Literasi · Life Skill · Kreativitas · Nilai Islami</p>
        </div>
      </div>
    </footer>
  );
}
