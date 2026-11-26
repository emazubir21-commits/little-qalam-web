import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MapPin,
  RotateCcw,
  Send,
} from 'lucide-react';
import {
  PRODUCTS,
  TESTIMONIALS,
  WEBHOOK_URL,
  formatRupiah,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';

export type CustomerRole = 'Orang Tua' | 'Guru PAUD-TK';

interface OrderFormSectionProps {
  selectedProductId: string;
  onChangeProductId: (productId: string) => void;
}

interface SubmittedOrder {
  orderRef: string;
  nama: string;
  peran: CustomerRole;
  kontakWa: string;
  produkLabel: string;
  catatan: string;
  submittedAt: string;
}

const CUSTOM_PRODUCT_ID = 'paket-campuran';

export function OrderFormSection({
  selectedProductId,
  onChangeProductId,
}: OrderFormSectionProps) {
  const [nama, setNama] = useState('');
  const [peran, setPeran] = useState<CustomerRole>('Orang Tua');
  const [kontakWa, setKontakWa] = useState('');
  const [catatan, setCatatan] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);

  const activeProduct = PRODUCTS.find((p) => p.id === selectedProductId) ?? null;

  const getProductLabel = (id: string) => {
    if (id === CUSTOM_PRODUCT_ID) {
      return 'Paket Campuran / Custom (Rp5.000–Rp40.000)';
    }
    const found = PRODUCTS.find((p) => p.id === id);
    return found ? `${found.name} (${formatRupiah(found.price)})` : '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = nama.trim();
    const trimmedWa = kontakWa.trim();
    const trimmedNotes = catatan.trim();

    if (!trimmedName) {
      setErrorMessage('Mohon isi nama lengkap Anda terlebih dahulu.');
      return;
    }

    const digitsOnly = trimmedWa.replace(/\D/g, '');
    if (digitsOnly.length < 9 || digitsOnly.length > 15) {
      setErrorMessage('Mohon masukkan nomor WhatsApp yang valid (minimal 9 digit).');
      return;
    }

    if (!selectedProductId) {
      setErrorMessage('Mohon pilih produk yang ingin dipesan.');
      return;
    }

    const produkLabel = getProductLabel(selectedProductId);
    const payload = {
      nama: trimmedName,
      peran,
      kontak_wa: trimmedWa,
      produk: produkLabel,
      harga: activeProduct ? activeProduct.price : null,
      catatan: trimmedNotes || '-',
      sumber: 'Web Katalog Little Qalam',
      kota: 'Banda Aceh',
      waktu_pesan: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server merespons dengan status ${response.status}.`);
      }

      const refNumber = `LQ-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedOrder({
        orderRef: refNumber,
        nama: trimmedName,
        peran,
        kontakWa: trimmedWa,
        produkLabel,
        catatan: trimmedNotes || '-',
        submittedAt: new Intl.DateTimeFormat('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date()),
      });
    } catch (err) {
      const detail =
        err instanceof Error && err.message
          ? err.message
          : 'Gagal terhubung ke server pesanan.';
      setErrorMessage(
        `Pesanan belum dapat terkirim (${detail}). Silakan periksa koneksi internet Anda dan coba kirim ulang.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedOrder(null);
    setNama('');
    setPeran('Orang Tua');
    setKontakWa('');
    setCatatan('');
    setErrorMessage(null);
  };

  return (
    <section id="pesan" className="py-16 lg:py-24 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Selected Product Preview + Banda Aceh Trust & Testimonials */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#2E6F65] mb-2">
                Form Pemesanan Langsung · Banda Aceh
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B2A27] [text-wrap:balance] mb-4">
                Pesan media belajar Little Qalam hari ini
              </h2>
              <p className="text-sm sm:text-base leading-[1.65] text-[#52635F]">
                Isi data singkat di samping. Tim Little Qalam di Banda Aceh akan
                mengonfirmasi ketersediaan stok, total ongkir, dan rincian pembayaran
                melalui WhatsApp Anda.
              </p>
            </div>

            {/* Active Product Summary Box */}
            {activeProduct ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F2EBDD]/75 border border-[#E5DEC9] flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#E5DEC9] shrink-0">
                  <ResilientImage
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    title={activeProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#2E6F65]">Produk terpilih</p>
                  <p className="font-display text-base font-semibold text-[#1B2A27] truncate">
                    {activeProduct.name}
                  </p>
                  <p className="text-sm font-bold text-[#2E6F65] tabular-nums mt-0.5">
                    {formatRupiah(activeProduct.price)}
                  </p>
                  <p className="text-xs text-[#52635F] mt-0.5">
                    {activeProduct.ageRange} · {activeProduct.availabilityNote}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#F2EBDD]/75 border border-[#E5DEC9]">
                <p className="text-xs font-medium text-[#2E6F65] mb-1">
                  Paket Campuran / Custom
                </p>
                <p className="font-display text-base font-semibold text-[#1B2A27]">
                  Rentang Harga Rp5.000–Rp40.000
                </p>
                <p className="text-xs text-[#52635F] mt-1">
                  Tuliskan kombinasi produk atau jumlah paket kelas PAUD/TK di kolom catatan.
                </p>
              </div>
            )}

            {/* Local UMKM Info */}
            <div className="pt-6 border-t border-[#E5DEC9] space-y-2 text-sm text-[#52635F]">
              <div className="flex items-center gap-2 text-[#1B2A27] font-semibold">
                <MapPin className="w-4 h-4 text-[#2E6F65] shrink-0" aria-hidden="true" />
                <span>Studio &amp; Produksi UMKM Little Qalam — Banda Aceh</span>
              </div>
              <p className="leading-relaxed">
                Melayani pengantaran langsung area Banda Aceh &amp; Aceh Besar, serta pengiriman
                ekspedisi reguler ke seluruh Indonesia. Tersedia harga khusus pengadaan kelas
                PAUD/TK.
              </p>
            </div>

            {/* Adjacent Testimonials (Claim-to-Proof Adjacency) */}
            <div className="pt-6 border-t border-[#E5DEC9] space-y-5">
              <p className="text-xs font-semibold text-[#2E6F65]">
                Dipercaya Orang Tua &amp; Guru PAUD/TK di Banda Aceh
              </p>
              {TESTIMONIALS.map((item) => (
                <figure key={item.name} className="space-y-2">
                  <blockquote className="text-sm leading-[1.6] text-[#1B2A27]">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="text-xs text-[#52635F]">
                    <span className="font-semibold text-[#1B2A27]">{item.name}</span> ·{' '}
                    {item.role}, {item.location}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Right Column: Order Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5DEC9] rounded-2xl p-6 sm:p-8 lg:p-10">
              {submittedOrder ? (
                <div role="status" aria-live="polite" className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EBF3F1] text-[#2E6F65] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#2E6F65] mb-1">
                        Pesanan Terkirim · Nomor Referensi {submittedOrder.orderRef}
                      </p>
                      <h3 className="font-display text-2xl font-semibold text-[#1B2A27]">
                        Terima kasih, pesanan Anda berhasil diterima
                      </h3>
                      <p className="text-sm text-[#52635F] mt-1.5 leading-relaxed">
                        Data pesanan telah kami terima. Tim Little Qalam Banda Aceh akan segera
                        menghubungi Anda melalui WhatsApp untuk konfirmasi pengiriman.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#FAF6EE] border border-[#E5DEC9] p-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-4 border-b border-[#E5DEC9] pb-2.5">
                      <span className="text-[#52635F]">Nama Pemesan</span>
                      <span className="font-semibold text-[#1B2A27] text-right">
                        {submittedOrder.nama}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#E5DEC9] pb-2.5">
                      <span className="text-[#52635F]">Peran</span>
                      <span className="font-semibold text-[#1B2A27] text-right">
                        {submittedOrder.peran}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#E5DEC9] pb-2.5">
                      <span className="text-[#52635F]">Kontak WhatsApp</span>
                      <span className="font-semibold text-[#1B2A27] tabular-nums text-right">
                        {submittedOrder.kontakWa}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#E5DEC9] pb-2.5">
                      <span className="text-[#52635F]">Produk</span>
                      <span className="font-semibold text-[#2E6F65] text-right">
                        {submittedOrder.produkLabel}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#E5DEC9] pb-2.5">
                      <span className="text-[#52635F]">Catatan</span>
                      <span className="font-medium text-[#1B2A27] text-right max-w-[65%]">
                        {submittedOrder.catatan}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[#52635F]">Waktu Pesan</span>
                      <span className="text-xs text-[#52635F] tabular-nums text-right">
                        {submittedOrder.submittedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#2E6F65] hover:bg-[#23574F] rounded-xl transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                      <span>Buat Pesanan Baru</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="border-b border-[#F0E9DA] pb-5">
                    <h3 className="font-display text-2xl font-semibold text-[#1B2A27]">
                      Formulir Pemesanan
                    </h3>
                    <p className="text-sm text-[#52635F] mt-1">
                      Lengkapi formulir berikut untuk memesan produk Little Qalam.
                    </p>
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 p-4 rounded-xl bg-[#FDF2F0] border border-[#EBC5BF] text-[#8E2A1E] text-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Field 1: Nama */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="order-nama"
                      className="block text-sm font-semibold text-[#1B2A27]"
                    >
                      Nama Lengkap <span className="text-[#B4412E]">*</span>
                    </label>
                    <input
                      id="order-nama"
                      name="nama"
                      type="text"
                      required
                      autoComplete="name"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Ibu Siti Rahmah atau Ustadzah Aisyah"
                      className="w-full px-4 py-3 text-sm text-[#1B2A27] placeholder:text-[#8E9B97] bg-[#FAF6EE]/60 border border-[#D8CEB8] rounded-xl focus:bg-white focus:border-[#2E6F65] focus:outline-none focus:ring-2 focus:ring-[#2E6F65]/20 transition-colors"
                    />
                  </div>

                  {/* Field 2: Peran (Orang Tua / Guru PAUD-TK) */}
                  <fieldset className="space-y-2">
                    <legend className="block text-sm font-semibold text-[#1B2A27]">
                      Peran Pemesan <span className="text-[#B4412E]">*</span>
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                      {(['Orang Tua', 'Guru PAUD-TK'] as CustomerRole[]).map((roleOption) => {
                        const selected = peran === roleOption;
                        return (
                          <button
                            key={roleOption}
                            type="button"
                            onClick={() => setPeran(roleOption)}
                            aria-pressed={selected}
                            className={`py-3 px-4 text-sm font-semibold rounded-xl border transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F65] ${
                              selected
                                ? 'bg-[#EBF3F1] border-[#2E6F65] text-[#2E6F65]'
                                : 'bg-[#FAF6EE]/60 border-[#D8CEB8] text-[#52635F] hover:border-[#2E6F65]/50 hover:text-[#1B2A27]'
                            }`}
                          >
                            {roleOption}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Field 3: Kontak WA */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="order-wa"
                      className="block text-sm font-semibold text-[#1B2A27]"
                    >
                      Kontak WhatsApp <span className="text-[#B4412E]">*</span>
                    </label>
                    <input
                      id="order-wa"
                      name="kontak_wa"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={kontakWa}
                      onChange={(e) => setKontakWa(e.target.value)}
                      placeholder="Contoh: 081269001234"
                      className="w-full px-4 py-3 text-sm text-[#1B2A27] tabular-nums placeholder:text-[#8E9B97] bg-[#FAF6EE]/60 border border-[#D8CEB8] rounded-xl focus:bg-white focus:border-[#2E6F65] focus:outline-none focus:ring-2 focus:ring-[#2E6F65]/20 transition-colors"
                    />
                    <p className="text-xs text-[#52635F]">
                      Pastikan nomor aktif di WhatsApp agar konfirmasi pesanan berjalan cepat.
                    </p>
                  </div>

                  {/* Field 4: Produk */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="order-produk"
                      className="block text-sm font-semibold text-[#1B2A27]"
                    >
                      Produk yang Dipilih <span className="text-[#B4412E]">*</span>
                    </label>
                    <select
                      id="order-produk"
                      name="produk"
                      required
                      value={selectedProductId}
                      onChange={(e) => onChangeProductId(e.target.value)}
                      className="w-full px-4 py-3 text-sm font-medium text-[#1B2A27] bg-[#FAF6EE]/60 border border-[#D8CEB8] rounded-xl focus:bg-white focus:border-[#2E6F65] focus:outline-none focus:ring-2 focus:ring-[#2E6F65]/20 transition-colors cursor-pointer"
                    >
                      {PRODUCTS.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} — {formatRupiah(item.price)}
                        </option>
                      ))}
                      <option value={CUSTOM_PRODUCT_ID}>
                        Paket Campuran / Custom (Rp5.000–Rp40.000)
                      </option>
                    </select>
                  </div>

                  {/* Field 5: Catatan */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="order-catatan"
                      className="block text-sm font-semibold text-[#1B2A27]"
                    >
                      Catatan Pesanan
                    </label>
                    <textarea
                      id="order-catatan"
                      name="catatan"
                      rows={4}
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Tuliskan jumlah eksemplar, usia anak (3–7 th), pilihan cetak/PDF, atau alamat pengantaran di Banda Aceh..."
                      className="w-full px-4 py-3 text-sm text-[#1B2A27] placeholder:text-[#8E9B97] bg-[#FAF6EE]/60 border border-[#D8CEB8] rounded-xl focus:bg-white focus:border-[#2E6F65] focus:outline-none focus:ring-2 focus:ring-[#2E6F65]/20 transition-colors resize-y"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs text-[#52635F] leading-relaxed">
                      Tidak ada pembayaran otomatis di halaman ini. Konfirmasi total &amp; ongkir
                      dilakukan via WhatsApp.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#2E6F65] hover:bg-[#23574F] disabled:opacity-65 disabled:cursor-not-allowed rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F65]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          <span>Mengirim Pesanan...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" aria-hidden="true" />
                          <span>Kirim Pesanan</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
