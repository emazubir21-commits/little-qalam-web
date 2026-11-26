import { ArrowDown } from 'lucide-react';
import { LEARNING_PILLARS } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onDirectOrder: () => void;
}

export function HeroSection({ onExploreCatalog, onDirectOrder }: HeroSectionProps) {
  return (
    <section id="beranda" className="pt-10 pb-14 lg:pt-14 lg:pb-20 border-b border-[#E5DEC9]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* 2-Column Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-6">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm font-medium text-[#2E6F65] mb-5">
              <span>Banda Aceh</span>
              <span aria-hidden="true" className="text-[#C7BCA3]">
                ·
              </span>
              <span>Usia 3–7 Tahun</span>
              <span aria-hidden="true" className="text-[#C7BCA3]">
                ·
              </span>
              <span>Orang Tua &amp; Guru PAUD/TK</span>
            </div>

            <h1 className="font-display text-[clamp(2.4rem,4.5vw,3.85rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-[#1B2A27] [text-wrap:balance] mb-5">
              Little Steps,{' '}
              <span className="text-[#2E6F65] underline decoration-[#F4B942] decoration-[4px] underline-offset-[8px]">
                Big Learning
              </span>
            </h1>

            <p className="text-base sm:text-[17px] leading-[1.68] text-[#52635F] max-w-[54ch] mb-8">
              Media belajar ramah anak dari UMKM Little Qalam untuk menemani masa emas usia 3–7
              tahun. Dirancang lembut untuk menumbuhkan{' '}
              <strong className="font-semibold text-[#1B2A27]">
                literasi, life skill, kreativitas, dan nilai Islami
              </strong>{' '}
              dengan harga terjangkau mulai Rp5.000–Rp40.000.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreCatalog}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#2E6F65] hover:bg-[#23574F] rounded-xl transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F65]"
              >
                <span>Lihat Katalog Produk</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onDirectOrder}
                className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-semibold text-[#1B2A27] hover:text-[#2E6F65] border border-[#D8CEB8] hover:border-[#2E6F65] bg-transparent rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F65]"
              >
                Langsung Pesan
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5DEC9] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#52635F]">
              <span className="tabular-nums font-medium text-[#1B2A27]">
                Harga Rp5.000–Rp40.000
              </span>
              <span aria-hidden="true" className="text-[#C7BCA3] hidden sm:inline">
                ·
              </span>
              <span>Ramah untuk Belajar di Rumah &amp; Kelas PAUD/TK</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[440px] rounded-2xl overflow-hidden bg-[#F2EBDD] border border-[#E5DEC9]">
              <ResilientImage
                src="/src/assets/images/hero_little_qalam_learning_1795660463134.jpg"
                alt="Meja belajar Little Qalam berisi buku cerita anak bergambar, busy book kain taktil, flashcard edukatif, dan pensil kayu"
                title="Little Qalam — Media Belajar Anak"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-column Learning Pillars strip below hero split */}
        <div id="pilar" className="mt-14 lg:mt-16 pt-10 border-t border-[#E5DEC9] scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <p className="text-xs font-semibold text-[#2E6F65] mb-1.5">
                Empat Pilar Pembelajaran Little Qalam
              </p>
              <h2 className="font-display text-2xl sm:text-[28px] font-semibold text-[#1B2A27] [text-wrap:balance]">
                Langkah kecil setiap hari untuk tumbuh kembang menyeluruh
              </h2>
            </div>
            <p className="text-sm text-[#52635F] max-w-sm">
              Disusun khusus mengikuti tahap perkembangan anak usia 3–7 tahun.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {LEARNING_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="pt-5 border-t border-[#D8CEB8] flex flex-col gap-2"
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-base font-semibold text-[#D99E26] tabular-nums">
                    {pillar.number}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-[#1B2A27]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm leading-[1.6] text-[#52635F]">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
