import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
  UserRoundCheck,
  X,
} from 'lucide-react';
import { WEBHOOK_URL } from '../data/catalog';

interface ChatWidgetProps {
  onGoToOrderForm: () => void;
}

type MessageSender = 'bot' | 'user';
type MessageVariant = 'default' | 'confirmation' | 'error';

interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  time: string;
  variant?: MessageVariant;
  inquiryPrompt?: string;
  inquirySent?: boolean;
  showOrderShortcut?: boolean;
}

interface BotReplyResult {
  text: string;
  suggestAdminInquiry: boolean;
  showOrderShortcut?: boolean;
}

const QUICK_REPLIES = [
  'Katalog & Harga',
  'Untuk Guru PAUD/TK',
  'Usia 3–7 Tahun',
  'Cara Pesan',
] as const;

const PRODUCT_CATALOG_SUMMARY = [
  '• Printable Worksheet (Rp10.000): latihan menulis, berhitung, dan motorik halus, praktis diunduh/dicetak.',
  '• Flashcard Edukatif (Rp15.000): pengenalan huruf, angka, dan kosakata untuk usia 3–7 tahun.',
  '• Busy Book (Rp35.000): aktivitas interaktif literasi, kreativitas, dan life skill.',
  '• Buku Cerita Anak (Rp25.000): kisah edukatif penuh hikmah dan nilai Islami.',
].join('\n');

function getCurrentTimeLabel(): string {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function hasAnyKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

function generateContextualReply(rawInput: string): BotReplyResult {
  const text = rawInput.toLowerCase().trim();

  // 1. Deteksi kebutuhan khusus, pesanan jumlah banyak, kendala, atau permintaan bantuan admin
  const isBulkOrSchoolSpecial = hasAnyKeyword(text, [
    'jumlah banyak',
    'banyak',
    'grosir',
    'lusin',
    'puluhan',
    'ratusan',
    'pengadaan',
    'borong',
    'diskon',
    'potongan',
    'kerja sama',
    'kerjasama',
    'mou',
    'proposal',
    'kwitansi',
    'faktur',
    'nota',
    'satu kelas',
    '1 kelas',
    'paket sekolah',
    'paket tk',
    'paket paud',
    'reseller',
  ]);

  const isCustomRequest = hasAnyKeyword(text, [
    'custom',
    'kustom',
    'request',
    'req ',
    'khusus',
    'nama sekolah',
    'logo',
    'tema lain',
    'tema sendiri',
    'ubah',
    'revisi',
    'preorder',
    'pre-order',
    'po ',
    'souvenir',
    'hampers',
    'kado',
  ]);

  const isIssueOrAdminNeed = hasAnyKeyword(text, [
    'kendala',
    'masalah',
    'rusak',
    'sob',
    'komplain',
    'error',
    'gagal',
    'belum sampai',
    'belum dikirim',
    'file tidak',
    'link tidak',
    'hubungi admin',
    'tanya admin',
    'bicara admin',
    'chat admin',
    'bantuan lanjutan',
    'admin',
    'cs',
  ]);

  if (isIssueOrAdminNeed) {
    return {
      text: 'Mohon maaf jika ada kendala atau hal yang perlu dibantu lebih lanjut. Supaya tim Little Qalam Banda Aceh dapat langsung mengecek dan membantu secara personal, silakan tekan tombol "Kirim Pertanyaan Ini ke Admin" di bawah ya.',
      suggestAdminInquiry: true,
    };
  }

  if (isBulkOrSchoolSpecial || isCustomRequest) {
    return {
      text: `Tentu, Little Qalam Banda Aceh dengan senang hati melayani kebutuhan khusus, permintaan custom tema/paket, maupun pemesanan jumlah banyak untuk kelas PAUD/TK dan lembaga pendidikan.\n\nSebagai gambaran katalog standar kami:\n${PRODUCT_CATALOG_SUMMARY}\n\nUntuk diskusi jumlah, penyesuaian materi, atau penawaran khusus sekolah/lembaga, silakan klik "Kirim Pertanyaan Ini ke Admin" di bawah agar langsung ditindaklanjuti tim kami.`,
      suggestAdminInquiry: true,
      showOrderShortcut: true,
    };
  }

  // 2. Deteksi produk spesifik (bisa menjawab satu atau beberapa produk sekaligus)
  const mentionedProducts: string[] = [];
  if (hasAnyKeyword(text, ['worksheet', 'printable', 'lembar', 'menulis', 'berhitung', 'tracing'])) {
    mentionedProducts.push(
      '• Printable Worksheet (Rp10.000): cocok untuk latihan menulis, berhitung, dan motorik halus. Sangat praktis karena bisa diunduh dalam bentuk file siap cetak atau dipesan versi cetaknya.'
    );
  }
  if (hasAnyKeyword(text, ['flashcard', 'flash card', 'kartu', 'kosakata', 'huruf', 'hijaiyah'])) {
    mentionedProducts.push(
      '• Flashcard Edukatif (Rp15.000): kartu belajar bergambar untuk pengenalan huruf, angka, dan kosakata anak usia 3–7 tahun. Mudah dimainkan bersama di rumah maupun di kelas.'
    );
  }
  if (hasAnyKeyword(text, ['busy book', 'busybook', 'interaktif', 'life skill', 'lifeskill', 'motorik'])) {
    mentionedProducts.push(
      '• Busy Book (Rp35.000): buku aktivitas interaktif yang melatih literasi awal, kreativitas, koordinasi tangan, dan life skill harian tanpa layar gawai.'
    );
  }
  if (hasAnyKeyword(text, ['buku cerita', 'cerita', 'dongeng', 'islami', 'hikmah', 'akhlak', 'adab'])) {
    mentionedProducts.push(
      '• Buku Cerita Anak (Rp25.000): kumpulan kisah edukatif bergambar penuh hikmah dan nilai Islami yang hangat dibacakan nyaring sebelum tidur atau saat sesi cerita di TK.'
    );
  }

  // 3. Deteksi topik cara cetak / penggunaan
  const asksUsageOrPrint = hasAnyKeyword(text, [
    'cetak',
    'print',
    'unduh',
    'download',
    'pdf',
    'cara pakai',
    'cara guna',
    'penggunaan',
    'cara main',
    'bahan',
    'kertas',
    'laminasi',
  ]);

  if (asksUsageOrPrint) {
    return {
      text: `Berikut panduan penggunaan & cetak media Little Qalam:\n\n• Printable Worksheet (Rp10.000): praktis diunduh dan dicetak mandiri di kertas HVS A4 (disarankan 80–100 gsm) atau dipesan versi cetaknya, bisa dipakai berulang jika dimasukkan ke map plastik wipe-clean.\n• Flashcard Edukatif (Rp15.000): gunakan 5–10 kartu per sesi singkat agar anak usia 3–7 tahun tetap antusias mengenal huruf, angka, dan kosakata.\n• Busy Book (Rp35.000) & Buku Cerita Anak (Rp25.000): langsung siap pakai untuk aktivitas interaktif harian dan membaca nyaring bersama orang tua atau guru.\n\nJika ada kebutuhan format file atau spesifikasi cetak khusus, Anda juga bisa mengirimkannya langsung ke Admin.`,
      suggestAdminInquiry: true,
      showOrderShortcut: true,
    };
  }

  // 4. Deteksi kebutuhan guru PAUD/TK / sekolah / lembaga di Banda Aceh
  const asksTeacherOrSchool = hasAnyKeyword(text, [
    'guru',
    'paud',
    'tk',
    'ra ',
    'sekolah',
    'lembaga',
    'kelas',
    'murid',
    'siswa',
    'mengajar',
    'pembelajaran',
  ]);

  if (asksTeacherOrSchool) {
    return {
      text: `Halo Ustadz/Ustadzah & Guru PAUD/TK! Produk Little Qalam sangat mendukung kegiatan belajar di kelas maupun program literasi sekolah di Banda Aceh:\n\n• Printable Worksheet (Rp10.000): lembar latihan menulis, berhitung, dan motorik halus yang praktis dicetak sesuai jumlah murid.\n• Flashcard Edukatif (Rp15.000): alat peraga kelas untuk pengenalan huruf, angka, dan kosakata.\n• Busy Book (Rp35.000): media sentra aktivitas interaktif literasi, kreativitas, dan life skill.\n• Buku Cerita Anak (Rp25.000): bahan bercerita (read-aloud) penuh hikmah dan nilai Islami.\n\nButuh pengadaan kelas atau paket khusus sekolah? Klik "Kirim Pertanyaan Ini ke Admin" atau langsung isi Form Pesanan dengan peran "Guru PAUD-TK".`,
      suggestAdminInquiry: true,
      showOrderShortcut: true,
    };
  }

  // 5. Deteksi pertanyaan kesesuaian usia 3-7 tahun
  const asksAge = hasAnyKeyword(text, [
    'usia',
    'umur',
    '3 tahun',
    '4 tahun',
    '5 tahun',
    '6 tahun',
    '7 tahun',
    '3–7',
    '3-7',
    'balita',
    'prasekolah',
    'cocok untuk',
    'rekomendasi',
  ]);

  if (asksAge) {
    let specificNote = '';
    if (text.includes('3 tahun') || text.includes('3th')) {
      specificNote =
        'Untuk usia 3 tahun, kami paling merekomendasikan Busy Book (Rp35.000) untuk motorik & life skill serta Flashcard Edukatif (Rp15.000) untuk pengenalan kosakata awal.\n\n';
    } else if (text.includes('4 tahun') || text.includes('5 tahun')) {
      specificNote =
        'Untuk usia 4–5 tahun, kombinasi Printable Worksheet (Rp10.000), Flashcard Edukatif (Rp15.000), dan Busy Book (Rp35.000) sangat pas melatih pra-menulis, berhitung, dan kreativitas.\n\n';
    } else if (text.includes('6 tahun') || text.includes('7 tahun')) {
      specificNote =
        'Untuk usia 6–7 tahun, Buku Cerita Anak (Rp25.000) dan Printable Worksheet (Rp10.000) sangat cocok memperkuat kelancaran membaca, berhitung, dan pemahaman nilai Islami.\n\n';
    }

    return {
      text: `${specificNote}Panduan kesesuaian produk Little Qalam untuk anak usia 3–7 tahun:\n• Usia 3–4 tahun: Busy Book (Rp35.000) & Flashcard Edukatif (Rp15.000).\n• Usia 4–6 tahun: Printable Worksheet (Rp10.000) & Busy Book (Rp35.000).\n• Usia 5–7 tahun: Buku Cerita Anak (Rp25.000) & Flashcard Edukatif (Rp15.000).\n\nSemua media dirancang bertahap ("Little Steps, Big Learning") agar anak belajar dengan gembira tanpa tekanan.`,
      suggestAdminInquiry: false,
      showOrderShortcut: true,
    };
  }

  // 6. Jika pengguna menanyakan produk spesifik
  if (mentionedProducts.length > 0) {
    return {
      text: `Berikut informasi produk yang Anda tanyakan:\n\n${mentionedProducts.join('\n\n')}\n\nJika sudah cocok, silakan klik "Isi Form Pesanan" di bawah untuk langsung memesan ya!`,
      suggestAdminInquiry: false,
      showOrderShortcut: true,
    };
  }

  // 7. Deteksi katalog & harga
  const asksCatalogOrPrice = hasAnyKeyword(text, [
    'katalog',
    'harga',
    'berapa',
    'daftar',
    'produk',
    'jual apa',
    'list',
    'murah',
    'rp',
  ]);

  if (asksCatalogOrPrice) {
    return {
      text: `Berikut katalog produk Little Qalam (rentang terjangkau Rp5.000–Rp40.000):\n\n${PRODUCT_CATALOG_SUMMARY}\n\nSemua produk dirancang untuk anak usia 3–7 tahun di rumah maupun PAUD/TK. Mau tahu detail salah satu produk atau langsung pesan?`,
      suggestAdminInquiry: false,
      showOrderShortcut: true,
    };
  }

  // 8. Deteksi cara pesan, pengiriman Banda Aceh, lokasi, pembayaran
  const asksOrderOrShipping = hasAnyKeyword(text, [
    'cara pesan',
    'pesan',
    'order',
    'beli',
    'bayar',
    'pembayaran',
    'transfer',
    'cod',
    'ongkir',
    'kirim',
    'pengiriman',
    'antar',
    'banda aceh',
    'aceh',
    'lokasi',
    'alamat',
    'toko',
    'wa',
    'whatsapp',
  ]);

  if (asksOrderOrShipping) {
    return {
      text: `Cara pemesanan di Little Qalam (Banda Aceh):\n1. Klik tombol "Isi Form Pesanan" di bawah.\n2. Lengkapi Nama, Peran (Orang Tua / Guru PAUD-TK), Kontak WhatsApp, Produk pilihan, dan Catatan.\n3. Setelah dikirim, tim kami di Banda Aceh akan mengonfirmasi stok, total biaya, dan opsi pengantaran (kurir lokal Banda Aceh & Aceh Besar, ekspedisi ke luar daerah, atau kirim file PDF untuk Printable Worksheet).`,
      suggestAdminInquiry: false,
      showOrderShortcut: true,
    };
  }

  // 9. Sapaan hangat atau ucapan terima kasih
  if (hasAnyKeyword(text, ['terima kasih', 'makasih', 'syukron', 'thanks', 'oke', 'baik'])) {
    return {
      text: 'Sama-sama! Senang sekali bisa menemani langkah belajar si kecil bersama Little Qalam. Jika sewaktu-waktu ingin memesan atau bertanya lagi, silakan langsung tulis di sini ya.',
      suggestAdminInquiry: false,
    };
  }

  if (hasAnyKeyword(text, ['halo', 'hai', 'assalam', 'pagi', 'siang', 'sore', 'malam', 'permisi'])) {
    return {
      text: 'Wa’alaikumussalam / Halo! Selamat datang di Little Qalam Banda Aceh. Silakan ketik pertanyaan apa saja seputar katalog (Printable Worksheet, Flashcard Edukatif, Busy Book, Buku Cerita Anak), rekomendasi usia 3–7 tahun, atau kebutuhan kelas PAUD/TK.',
      suggestAdminInquiry: false,
    };
  }

  // 10. Fallback ramah untuk pertanyaan di luar katalog standar -> tawarkan tombol Kirim Pertanyaan Ini ke Admin
  return {
    text: 'Terima kasih atas pertanyaannya! Karena topik ini membutuhkan informasi lebih rinci di luar panduan katalog standar kami, Ayah/Bunda atau Ustadz/Ustadzah dapat langsung meneruskannya agar dibantu tim Little Qalam Banda Aceh.\n\nSilakan tekan tombol "Kirim Pertanyaan Ini ke Admin" di bawah, atau langsung menuju "Isi Form Pesanan" jika ingin memesan produk.',
    suggestAdminInquiry: true,
    showOrderShortcut: true,
  };
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: 'Assalamu’alaikum! Selamat datang di Little Qalam Banda Aceh ("Little Steps, Big Learning").\n\nKami siap mendampingi Ayah/Bunda, Guru PAUD/TK, dan lembaga pendidikan memilih media belajar anak usia 3–7 tahun. Silakan pilih topik cepat di bawah atau langsung ketik pertanyaan bebas Anda.',
    time: getCurrentTimeLabel(),
  },
];

export function ChatWidget({ onGoToOrderForm }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [sendingMessageId, setSendingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const processUserMessage = (rawQuestion: string) => {
    const cleanText = rawQuestion.trim();
    if (!cleanText) return;

    const now = getCurrentTimeLabel();
    const reply = generateContextualReply(cleanText);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      time: now,
    };

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: reply.text,
      time: now,
      inquiryPrompt: reply.suggestAdminInquiry ? cleanText : undefined,
      inquirySent: false,
      showOrderShortcut: reply.showOrderShortcut,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');
    processUserMessage(text);
  };

  const handleQuickReply = (topic: string) => {
    processUserMessage(topic);
  };

  const handleGoToOrderForm = () => {
    onGoToOrderForm();
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleSendInquiryToAdmin = async (botMessageId: string, inquiryText: string) => {
    if (sendingMessageId !== null) return;

    setSendingMessageId(botMessageId);

    const payload = {
      type: 'chat_inquiry',
      message: inquiryText,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      setMessages((prev) => [
        ...prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, inquirySent: true } : msg
        ),
        {
          id: `confirm-${Date.now()}`,
          sender: 'bot',
          variant: 'confirmation',
          text: `Pertanyaan Anda ("${inquiryText}") sudah berhasil dikirim ke Admin Little Qalam Banda Aceh. Terima kasih telah menghubungi kami! Jika ingin sekaligus meninggalkan nomor WhatsApp atau memesan produk, silakan klik tombol "Isi Form Pesanan".`,
          time: getCurrentTimeLabel(),
          showOrderShortcut: true,
        },
      ]);
    } catch (err) {
      const detail = err instanceof Error && err.message ? ` (${err.message})` : '';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          variant: 'error',
          text: `Maaf, pertanyaan belum berhasil terkirim ke Admin${detail}. Silakan periksa koneksi internet Anda lalu klik kembali tombol "Kirim Pertanyaan Ini ke Admin".`,
          time: getCurrentTimeLabel(),
        },
      ]);
    } finally {
      setSendingMessageId(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Panel */}
      {isOpen && (
        <section
          id="little-qalam-chatbot"
          role="dialog"
          aria-label="Obrolan Tanya Little Qalam"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[min(620px,calc(100vh-6.25rem))] flex flex-col bg-[#FAF6EE] border border-[#D8CEB8] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#2E6F65] text-[#FAF6EE] px-5 py-4 flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0">
              <h2 className="font-display text-base font-semibold tracking-tight text-white truncate">
                Tanya Little Qalam
              </h2>
              <p className="text-xs text-[#D7E6E3] truncate">
                Little Steps, Big Learning · Banda Aceh
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup jendela chat"
              className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#FAF6EE] hover:bg-white/15 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#F4B942]"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Messages & Initial Quick Replies */}
          <div
            aria-live="polite"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-[#FAF6EE]"
          >
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              const isConfirmation = msg.variant === 'confirmation';
              const isError = msg.variant === 'error';
              const isSendingThis = sendingMessageId === msg.id;

              return (
                <div key={msg.id} className="space-y-2.5">
                  <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.58] whitespace-pre-line ${
                        isUser
                          ? 'bg-[#2E6F65] text-white rounded-br-sm'
                          : isConfirmation
                            ? 'bg-[#EBF3F1] border border-[#2E6F65]/35 text-[#1B2A27] rounded-bl-sm'
                            : isError
                              ? 'bg-[#FDF2F0] border border-[#EBC5BF] text-[#8E2A1E] rounded-bl-sm'
                              : 'bg-white border border-[#E5DEC9] text-[#1B2A27] rounded-bl-sm'
                      }`}
                    >
                      {isConfirmation && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E6F65] mb-1.5">
                          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>Konfirmasi Terkirim ke Admin</span>
                        </div>
                      )}

                      <p>{msg.text}</p>

                      {/* Contextual Inline Admin Inquiry Button */}
                      {!isUser && msg.inquiryPrompt && (
                        <div className="mt-3 pt-2.5 border-t border-[#EFE8D8] flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={msg.inquirySent || sendingMessageId !== null}
                            onClick={() =>
                              handleSendInquiryToAdmin(msg.id, msg.inquiryPrompt!)
                            }
                            className={`w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2E6F65] ${
                              msg.inquirySent
                                ? 'bg-[#EBF3F1] text-[#2E6F65] border border-[#2E6F65]/25 cursor-default'
                                : 'bg-[#2E6F65] hover:bg-[#23574F] text-white disabled:opacity-60 disabled:cursor-not-allowed'
                            }`}
                          >
                            {isSendingThis ? (
                              <>
                                <Loader2
                                  className="w-3.5 h-3.5 animate-spin shrink-0"
                                  aria-hidden="true"
                                />
                                <span>Mengirim ke Admin...</span>
                              </>
                            ) : msg.inquirySent ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>Sudah Dikirim ke Admin</span>
                              </>
                            ) : (
                              <>
                                <UserRoundCheck
                                  className="w-3.5 h-3.5 shrink-0"
                                  aria-hidden="true"
                                />
                                <span>Kirim Pertanyaan Ini ke Admin</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="mt-1 px-1 text-[11px] text-[#73827E] tabular-nums">
                      {isUser ? 'Anda' : 'Little Qalam'} · {msg.time}
                    </span>
                  </div>

                  {/* Quick Replies right below the initial welcome message */}
                  {index === 0 && (
                    <div className="pl-0.5 pt-0.5">
                      <p className="text-[11px] font-semibold text-[#52635F] mb-2">
                        Pilihan cepat untuk mulai bertanya:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_REPLIES.map((topic) => (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => handleQuickReply(topic)}
                            className="px-3 py-1.5 text-xs font-medium text-[#1B2A27] bg-white hover:bg-[#EBF3F1] hover:text-[#2E6F65] border border-[#D8CEB8] hover:border-[#2E6F65]/45 rounded-lg transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2E6F65]"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Persistent Footer: Order Form Shortcut + Always-Active Free Text Input */}
          <div className="bg-white border-t border-[#E5DEC9] px-4 pt-3 pb-3.5 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#52635F]">
                Siap memesan atau ingin tanya langsung?
              </span>
              <button
                type="button"
                onClick={handleGoToOrderForm}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#1B2A27] bg-[#F4B942] hover:bg-[#E7AB32] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2E6F65]"
              >
                <span>Isi Form Pesanan</span>
                <ArrowDownRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
              <label htmlFor="little-qalam-chat-input" className="sr-only">
                Ketik pertanyaan Anda untuk Little Qalam
              </label>
              <input
                ref={inputRef}
                id="little-qalam-chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pertanyaan apa saja lalu tekan Enter..."
                className="flex-1 min-w-0 px-3.5 py-2.5 text-sm text-[#1B2A27] placeholder:text-[#8E9B97] bg-[#FAF6EE] border border-[#D8CEB8] rounded-xl focus:bg-white focus:border-[#2E6F65] focus:outline-none focus:ring-2 focus:ring-[#2E6F65]/20 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                aria-label="Kirim pesan"
                className="px-3.5 h-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2E6F65] hover:bg-[#23574F] text-white text-xs font-semibold disabled:opacity-45 disabled:cursor-not-allowed transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2E6F65]"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Kirim</span>
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="little-qalam-chatbot"
        className="inline-flex items-center gap-2.5 px-5 py-3 text-sm font-semibold text-white bg-[#2E6F65] hover:bg-[#23574F] border border-[#F4B942]/70 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F65]"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4 text-[#F4B942] shrink-0" aria-hidden="true" />
            <span>Tutup Chat</span>
          </>
        ) : (
          <>
            <MessageCircle className="w-4 h-4 text-[#F4B942] shrink-0" aria-hidden="true" />
            <span>Tanya Little Qalam</span>
          </>
        )}
      </button>
    </div>
  );
}
