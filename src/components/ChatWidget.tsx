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
import { PRODUCTS, WEBHOOK_URL, formatRupiah } from '../data/catalog';

interface ChatWidgetProps {
  onGoToOrderForm: () => void;
  onSelectProductFromChat?: (productId: string) => void;
}

type MessageSender = 'bot' | 'user';
type MessageVariant = 'default' | 'confirmation' | 'error';

interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  time: string;
  variant?: MessageVariant;
}

const QUICK_REPLIES = [
  'Katalog & Harga',
  'Untuk Guru PAUD/TK',
  'Usia 3–7 Tahun',
  'Cara Pesan',
] as const;

function getCurrentTimeLabel(): string {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function generateBotReply(input: string): string {
  const normalized = input.toLowerCase();

  if (
    normalized.includes('katalog') ||
    normalized.includes('harga') ||
    normalized.includes('daftar produk') ||
    normalized.includes('produk apa')
  ) {
    const productList = PRODUCTS.map(
      (p) => `• ${p.name} — ${formatRupiah(p.price)} (${p.ageRange})`
    ).join('\n');
    return `Berikut katalog produk utama Little Qalam (rentang Rp5.000–Rp40.000):\n\n${productList}\n\nSemua media dirancang untuk menumbuhkan literasi, life skill, kreativitas, dan nilai Islami. Ada produk tertentu yang ingin Ayah/Bunda atau Ustadz/Ustadzah tanyakan lebih detail?`;
  }

  if (
    normalized.includes('worksheet') ||
    normalized.includes('printable') ||
    normalized.includes('lembar')
  ) {
    return `Printable Worksheet (${formatRupiah(10000)}) cocok untuk usia 3–6 tahun. Berisi 20 lembar aktivitas tematik A4 (tracing garis, huruf, angka 1–20, dan logika dasar). Tersedia versi cetak HVS 100 gsm maupun file PDF siap cetak untuk rumah dan kelas PAUD/TK.`;
  }

  if (normalized.includes('flashcard') || normalized.includes('kartu')) {
    return `Flashcard Edukatif (${formatRupiah(15000)}) cocok untuk usia 3–7 tahun. Berisi 30 kartu bolak-balik berbahan art carton 310 gsm laminasi matte sudut tumpul yang aman bagi anak, dilengkapi kotak simpan kraft rapi untuk melatih kosakata harian & huruf hijaiyah.`;
  }

  if (normalized.includes('busy book') || normalized.includes('busybook')) {
    return `Busy Book (${formatRupiah(35000)}) adalah favorit orang tua untuk usia 3–6 tahun. Memiliki 8 halaman aktivitas lepas-pasang untuk melatih motorik halus, koordinasi tangan-mata, serta life skill harian seperti mengikat tali, mencocokkan bentuk, dan berhitung.`;
  }

  if (
    normalized.includes('buku cerita') ||
    normalized.includes('cerita') ||
    normalized.includes('dongeng')
  ) {
    return `Buku Cerita Anak (${formatRupiah(25000)}) dirancang untuk usia 4–7 tahun. Terdiri dari 24 halaman bergambar penuh warna lembut dengan kisah akhlak mulia, rasa syukur, dan panduan refleksi ringan untuk dibacakan nyaring bersama orang tua atau saat circle time di TK.`;
  }

  if (
    normalized.includes('guru') ||
    normalized.includes('paud') ||
    normalized.includes('tk') ||
    normalized.includes('lembaga') ||
    normalized.includes('sekolah') ||
    normalized.includes('kelas')
  ) {
    return `Untuk Guru PAUD/TK & lembaga pendidikan di Banda Aceh maupun luar daerah, Little Qalam melayani pemesanan paket kelas (bundling Printable Worksheet, Flashcard Edukatif, Busy Book, dan Buku Cerita Anak) dalam rentang Rp5.000–Rp40.000 per item.\n\nSilakan pilih peran "Guru PAUD-TK" pada Form Pesanan dan tulis jumlah kebutuhan kelas di kolom catatan, atau kirim pertanyaan langsung ke Admin.`;
  }

  if (
    normalized.includes('usia') ||
    normalized.includes('umur') ||
    normalized.includes('3–7') ||
    normalized.includes('3-7') ||
    normalized.includes('anak')
  ) {
    return `Rekomendasi produk Little Qalam berdasarkan tahap usia 3–7 tahun:\n\n• Usia 3–4 tahun: Busy Book (${formatRupiah(35000)}) & Flashcard Edukatif (${formatRupiah(15000)}) untuk motorik halus dan kosakata.\n• Usia 4–6 tahun: Printable Worksheet (${formatRupiah(10000)}) untuk pra-menulis, huruf, dan angka.\n• Usia 4–7 tahun: Buku Cerita Anak (${formatRupiah(25000)}) untuk literasi membaca & pembiasaan nilai Islami.`;
  }

  if (
    normalized.includes('cara pesan') ||
    normalized.includes('pesan') ||
    normalized.includes('order') ||
    normalized.includes('beli') ||
    normalized.includes('kirim') ||
    normalized.includes('ongkir') ||
    normalized.includes('aceh')
  ) {
    return `Cara pesan di Little Qalam sangat mudah:\n1. Klik tombol "Isi Form Pesanan" di bawah ini.\n2. Lengkapi Nama, Peran (Orang Tua / Guru PAUD-TK), Kontak WA, Produk, dan Catatan.\n3. Klik "Kirim Pesanan" — tim kami di Banda Aceh akan segera menghubungi Anda via WhatsApp untuk konfirmasi stok & pengiriman (kurir lokal Banda Aceh/Aceh Besar atau ekspedisi reguler).`;
  }

  return `Terima kasih atas pertanyaannya! Little Qalam Banda Aceh menyediakan media belajar anak usia 3–7 tahun:\n• Printable Worksheet (${formatRupiah(10000)})\n• Flashcard Edukatif (${formatRupiah(15000)})\n• Busy Book (${formatRupiah(35000)})\n• Buku Cerita Anak (${formatRupiah(25000)})\n\nAnda dapat memilih topik cepat di atas, mengisi Form Pesanan, atau klik "Kirim Pertanyaan ke Admin" agar pesan Anda langsung diteruskan ke tim kami.`;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: 'Assalamu’alaikum! Selamat datang di Little Qalam Banda Aceh ("Little Steps, Big Learning").\n\nKami siap membantu Ayah/Bunda, Guru PAUD/TK, serta lembaga pendidikan memilih media belajar literasi, life skill, kreativitas, dan nilai Islami untuk anak usia 3–7 tahun. Ada yang bisa kami bantu hari ini?',
    time: getCurrentTimeLabel(),
  },
];

export function ChatWidget({ onGoToOrderForm }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isSendingAdmin, setIsSendingAdmin] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const appendUserAndBotReply = (question: string) => {
    const cleanText = question.trim();
    if (!cleanText) return;

    const now = getCurrentTimeLabel();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      time: now,
    };

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: generateBotReply(cleanText),
      time: now,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isSendingAdmin) return;
    const text = inputValue.trim();
    setInputValue('');
    appendUserAndBotReply(text);
  };

  const handleQuickReply = (topic: string) => {
    if (isSendingAdmin) return;
    appendUserAndBotReply(topic);
  };

  const handleGoToOrderForm = () => {
    onGoToOrderForm();
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleSendToAdmin = async () => {
    if (isSendingAdmin) return;

    const typedText = inputValue.trim();
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.sender === 'user')?.text;

    const messageToSend = typedText || lastUserMessage;

    if (!messageToSend) {
      setMessages((prev) => [
        ...prev,
        {
          id: `hint-${Date.now()}`,
          sender: 'bot',
          text: 'Silakan ketik pertanyaan Anda pada kolom pesan di bawah (misalnya kebutuhan kelas PAUD/TK atau stok produk), lalu klik "Kirim Pertanyaan ke Admin".',
          time: getCurrentTimeLabel(),
        },
      ]);
      inputRef.current?.focus();
      return;
    }

    const nowLabel = getCurrentTimeLabel();

    if (typedText) {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-admin-${Date.now()}`,
          sender: 'user',
          text: typedText,
          time: nowLabel,
        },
      ]);
      setInputValue('');
    }

    setIsSendingAdmin(true);

    const payload = {
      type: 'chat_inquiry',
      message: messageToSend,
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
        ...prev,
        {
          id: `confirm-${Date.now()}`,
          sender: 'bot',
          variant: 'confirmation',
          text: `Pertanyaan Anda ("${messageToSend}") telah berhasil dikirim ke Admin Little Qalam Banda Aceh. Terima kasih sudah menghubungi kami! Jika ingin langsung memesan atau menyertakan nomor WhatsApp agar segera kami balas, silakan klik "Isi Form Pesanan".`,
          time: getCurrentTimeLabel(),
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
          text: `Maaf, pertanyaan belum berhasil diteruskan ke Admin${detail}. Silakan periksa koneksi Anda lalu coba tekan "Kirim Pertanyaan ke Admin" kembali, atau langsung gunakan Form Pesanan.`,
          time: getCurrentTimeLabel(),
        },
      ]);
    } finally {
      setIsSendingAdmin(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Chat Drawer Panel */}
      {isOpen && (
        <section
          id="little-qalam-chatbot"
          role="dialog"
          aria-label="Obrolan Tanya Little Qalam"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[390px] max-h-[min(600px,calc(100vh-6.5rem))] flex flex-col bg-[#FAF6EE] border border-[#D8CEB8] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#2E6F65] text-[#FAF6EE] px-5 py-4 flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0">
              <h2 className="font-display text-base font-semibold tracking-tight text-white truncate">
                Tanya Little Qalam
              </h2>
              <p className="text-xs text-[#D7E6E3] truncate">
                Banda Aceh · Orang Tua, Guru PAUD/TK &amp; Lembaga
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

          {/* Quick Replies Strip */}
          <div className="px-4 py-3 bg-[#F2EBDD] border-b border-[#E5DEC9] shrink-0">
            <p className="text-[11px] font-semibold text-[#52635F] mb-2">
              Pertanyaan Cepat
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleQuickReply(topic)}
                  disabled={isSendingAdmin}
                  className="px-3 py-1.5 text-xs font-medium text-[#1B2A27] bg-white hover:bg-[#EBF3F1] hover:text-[#2E6F65] border border-[#D8CEB8] hover:border-[#2E6F65]/40 rounded-lg transition-colors duration-150 whitespace-nowrap cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[#2E6F65]"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div
            aria-live="polite"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-[#FAF6EE]"
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isConfirmation = msg.variant === 'confirmation';
              const isError = msg.variant === 'error';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.55] whitespace-pre-line ${
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
                        <span>Terkirim ke Admin Little Qalam</span>
                      </div>
                    )}
                    <p>{msg.text}</p>
                  </div>
                  <span className="mt-1 px-1 text-[11px] text-[#73827E] tabular-nums">
                    {isUser ? 'Anda' : 'Little Qalam'} · {msg.time}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Direct Actions + Input Bar */}
          <div className="bg-white border-t border-[#E5DEC9] px-4 pt-3 pb-3.5 space-y-2.5 shrink-0">
            {/* Two Requested Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleGoToOrderForm}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1B2A27] bg-[#F4B942] hover:bg-[#E7AB32] rounded-xl transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2E6F65]"
              >
                <span>Isi Form Pesanan</span>
                <ArrowDownRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleSendToAdmin}
                disabled={isSendingAdmin}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#2E6F65] bg-[#EBF3F1] hover:bg-[#DCECE8] border border-[#2E6F65]/25 rounded-xl transition-colors duration-150 whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#2E6F65]"
              >
                {isSendingAdmin ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <UserRoundCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Kirim Pertanyaan ke Admin</span>
                  </>
                )}
              </button>
            </div>

            {/* Text Input Form */}
            <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
              <label htmlFor="little-qalam-chat-input" className="sr-only">
                Tulis pertanyaan untuk Little Qalam
              </label>
              <input
                ref={inputRef}
                id="little-qalam-chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tulis pertanyaan produk atau kelas..."
                disabled={isSendingAdmin}
                className="flex-1 min-w-0 px-3.5 py-2.5 text-sm text-[#1B2A27] placeholder:text-[#8E9B97] bg-[#FAF6EE] border border-[#D8CEB8] rounded-xl focus:bg-white focus:border-[#2E6F65] focus:outline-none focus:ring-2 focus:ring-[#2E6F65]/20 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isSendingAdmin}
                aria-label="Kirim pesan chat"
                className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-[#2E6F65] hover:bg-[#23574F] text-white disabled:opacity-45 disabled:cursor-not-allowed transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2E6F65]"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="little-qalam-chatbot"
        className="inline-flex items-center gap-2.5 px-5 py-3 text-sm font-semibold text-white bg-[#2E6F65] hover:bg-[#23574F] border border-[#F4B942]/60 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F65]"
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
