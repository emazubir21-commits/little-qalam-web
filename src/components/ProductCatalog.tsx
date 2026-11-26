import { useState } from 'react';
import { Check, Eye, X } from 'lucide-react';
import {
  PRODUCTS,
  PRODUCT_CATEGORIES,
  Product,
  ProductCategory,
  formatRupiah,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface ProductCatalogProps {
  selectedProductId: string;
  onSelectProduct: (product: Product) => void;
}

export function ProductCatalog({
  selectedProductId,
  onSelectProduct,
}: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('Semua');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const filteredProducts =
    activeCategory === 'Semua'
      ? PRODUCTS
      : PRODUCTS.filter((item) => item.category === activeCategory);

  return (
    <section id="katalog" className="py-16 lg:py-24 border-b border-[#E5DEC9] scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Catalog Header + Functional Category Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm font-medium text-[#2E6F65] mb-2">
              <span>Katalog Produk</span>
              <span aria-hidden="true" className="text-[#C7BCA3]">
                ·
              </span>
              <span className="tabular-nums">Rentang Harga Rp5.000–Rp40.000</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B2A27] [text-wrap:balance]">
              Media belajar pilihan untuk rumah &amp; kelas PAUD/TK
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter kategori produk"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F2EBDD] rounded-xl border border-[#E5DEC9] self-start lg:self-auto"
          >
            {PRODUCT_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2E6F65] ${
                    isActive
                      ? 'bg-[#2E6F65] text-white'
                      : 'text-[#52635F] hover:text-[#1B2A27]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isSelected = selectedProductId === product.id;

            return (
              <article
                key={product.id}
                className={`group flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-[#2E6F65] ring-2 ring-[#2E6F65]/15'
                    : 'border-[#E5DEC9] hover:border-[#CFC4AA]'
                }`}
              >
                {/* Uniform 4:3 Image Frame */}
                <div className="relative aspect-[4/3] bg-[#F2EBDD] overflow-hidden">
                  <ResilientImage
                    src={product.image}
                    alt={`${product.name} Little Qalam untuk anak ${product.ageRange}`}
                    title={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#52635F] mb-2">
                    <span className="truncate">{product.category}</span>
                    <span aria-hidden="true" className="text-[#C7BCA3]">
                      ·
                    </span>
                    <span className="whitespace-nowrap shrink-0">{product.ageRange}</span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[#1B2A27] mb-2">
                    {product.name}
                  </h3>

                  <p className="text-sm leading-[1.58] text-[#52635F] mb-5 flex-1">
                    {product.shortDesc}
                  </p>

                  {/* Price & Specs Baseline */}
                  <div className="pt-4 border-t border-[#F0E9DA]">
                    <div className="flex items-baseline justify-between gap-2 mb-4">
                      <span className="text-xl font-bold text-[#2E6F65] tabular-nums">
                        {formatRupiah(product.price)}
                      </span>
                      <span className="text-xs text-[#52635F] truncate">
                        {product.availabilityNote}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F65] ${
                          isSelected
                            ? 'bg-[#F4B942] text-[#1B2A27] hover:bg-[#E7AB32]'
                            : 'bg-[#2E6F65] text-white hover:bg-[#23574F]'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>Produk Dipilih</span>
                          </>
                        ) : (
                          <span>Pilih Produk</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDetailProduct(product)}
                        aria-label={`Lihat detail ${product.name}`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#E5DEC9] text-[#52635F] hover:text-[#1B2A27] hover:bg-[#FAF6EE] transition-colors duration-150 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2E6F65]"
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Quiet note for custom PAUD/TK packages */}
        <p className="mt-8 text-sm text-[#52635F] text-center sm:text-left">
          Tersedia pula lembar satuan mulai{' '}
          <span className="font-semibold text-[#1B2A27] tabular-nums">Rp5.000</span> hingga paket
          bundling kelas PAUD/TK maksimal{' '}
          <span className="font-semibold text-[#1B2A27] tabular-nums">Rp40.000</span> — cantumkan
          kebutuhan khusus pada kolom catatan pemesanan.
        </p>
      </div>

      {/* Product Detail Quick-View Modal */}
      {detailProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-product-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2A27]/55 backdrop-blur-[2px]"
          onClick={() => setDetailProduct(null)}
        >
          <div
            className="bg-[#FAF6EE] border border-[#E5DEC9] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 bg-[#F2EBDD] min-h-[220px]">
                <ResilientImage
                  src={detailProduct.image}
                  alt={detailProduct.name}
                  title={detailProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-xs font-medium text-[#2E6F65] mb-1">
                        {detailProduct.category} · {detailProduct.ageRange}
                      </p>
                      <h3
                        id="modal-product-title"
                        className="font-display text-2xl font-semibold text-[#1B2A27]"
                      >
                        {detailProduct.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDetailProduct(null)}
                      aria-label="Tutup detail produk"
                      className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#52635F] hover:text-[#1B2A27] hover:bg-[#EFE8D8] transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xl font-bold text-[#2E6F65] tabular-nums mb-4">
                    {formatRupiah(detailProduct.price)}
                  </p>

                  <p className="text-sm leading-relaxed text-[#52635F] mb-5">
                    {detailProduct.fullDesc}
                  </p>

                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-semibold text-[#1B2A27]">
                      Rincian &amp; Spesifikasi
                    </p>
                    <ul className="space-y-1.5 text-sm text-[#52635F]">
                      {detailProduct.specs.map((spec) => (
                        <li key={spec} className="flex items-start gap-2">
                          <Check
                            className="w-4 h-4 text-[#2E6F65] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5DEC9] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setDetailProduct(null)}
                    className="px-4 py-2.5 text-sm font-medium text-[#52635F] hover:text-[#1B2A27] cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProduct(detailProduct);
                      setDetailProduct(null);
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2E6F65] hover:bg-[#23574F] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Pilih &amp; Pesan Produk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
