export type ProductCategory = 'Semua' | 'Literasi' | 'Motorik & Kreativitas' | 'Nilai Islami';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Exclude<ProductCategory, 'Semua'>;
  ageRange: string;
  shortDesc: string;
  fullDesc: string;
  specs: string[];
  pillars: string[];
  image: string;
  availabilityNote: string;
}

export interface LearningPillar {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
}

export const WEBHOOK_URL =
  'https://n8n-n8n.2bh70h.easypanel.host/webhook/little-qalam-order';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Semua',
  'Literasi',
  'Motorik & Kreativitas',
  'Nilai Islami',
];

export const PRODUCTS: Product[] = [
  {
    id: 'printable-worksheet',
    name: 'Printable Worksheet',
    price: 10000,
    category: 'Literasi',
    ageRange: '3–6 Tahun',
    shortDesc:
      'Lembar aktivitas siap cetak untuk melatih pra-menulis, mengenal huruf, angka, dan logika dasar anak secara bertahap.',
    fullDesc:
      'Dirancang ramah mata dengan ilustrasi lembut agar anak fokus tanpa distraksi berlebih. Cocok digunakan sebagai rutinitas belajar 15 menit di rumah maupun lembar kerja harian di kelas PAUD/TK.',
    specs: [
      '20 lembar aktivitas tematik siap cetak (A4)',
      'Tersedia versi cetak kertas HVS 100 gsm atau file PDF',
      'Fokus tracing garis, alfabet, angka 1–20, dan mencocokkan bentuk',
    ],
    pillars: ['Literasi', 'Kreativitas'],
    image: '/src/assets/images/product_printable_worksheet_1795660464446.jpg',
    availabilityNote: 'Tersedia Cetak & PDF',
  },
  {
    id: 'flashcard-edukatif',
    name: 'Flashcard Edukatif',
    price: 15000,
    category: 'Literasi',
    ageRange: '3–7 Tahun',
    shortDesc:
      'Kartu belajar bergambar sudut tumpul untuk memperkaya kosakata harian, huruf hijaiyah, dan pengenalan alam sekitar.',
    fullDesc:
      'Dicetak di atas kertas tebal berujung membulat yang aman digenggam tangan mungil. Membantu orang tua dan guru membangun interaksi tanya-jawab yang hangat dan menyenangkan.',
    specs: [
      '30 kartu bolak-balik ukuran ergonomis anak',
      'Art carton 310 gsm laminasi matte anti-silau',
      'Dilengkapi kotak simpan kraft rapi untuk ruang kelas atau rumah',
    ],
    pillars: ['Literasi', 'Nilai Islami'],
    image: '/src/assets/images/product_flashcard_edukatif_1795660464917.jpg',
    availabilityNote: 'Siap Kirim',
  },
  {
    id: 'busy-book',
    name: 'Busy Book',
    price: 35000,
    category: 'Motorik & Kreativitas',
    ageRange: '3–6 Tahun',
    shortDesc:
      'Buku aktivitas interaktif lepas-pasang untuk melatih motorik halus, koordinasi tangan-mata, dan kemandirian harian.',
    fullDesc:
      'Dibuat penuh ketelitian dengan aktivitas mengikat tali sepatu, mencocokkan bentuk, berhitung, dan rutinitas harian. Mengurangi ketergantungan gawai dengan permainan taktil yang awet dipakai berulang kali.',
    specs: [
      '8 halaman aktivitas interaktif dengan keping lepas-pasang',
      'Kombinasi laminasi tebal dan elemen sentuh aman untuk anak',
      'Melatih keterampilan hidup (life skill) dan konsentrasi mandiri',
    ],
    pillars: ['Life Skill', 'Kreativitas'],
    image: '/src/assets/images/product_busy_book_1795660466918.jpg',
    availabilityNote: 'Favorit Orang Tua',
  },
  {
    id: 'buku-cerita-anak',
    name: 'Buku Cerita Anak',
    price: 25000,
    category: 'Nilai Islami',
    ageRange: '4–7 Tahun',
    shortDesc:
      'Kisah bergambar penuh kehangatan yang menanamkan adab sehari-hari, rasa syukur, jujur, dan kasih sayang kepada sesama.',
    fullDesc:
      'Ditulis dengan kalimat pendek berirama yang mudah dibacakan nyaring sebelum tidur atau saat circle time di TK. Setiap akhir cerita memuat pertanyaan refleksi ringan untuk diskusi bersama anak.',
    specs: [
      '24 halaman ilustrasi warna lembut berkualitas cetak tinggi',
      'Bahasa Indonesia sederhana dengan panduan refleksi orang tua & guru',
      'Menanamkan adab Islami melalui teladan cerita yang dekat dengan keseharian',
    ],
    pillars: ['Literasi', 'Nilai Islami'],
    image: '/src/assets/images/product_buku_cerita_anak_1795660464486.jpg',
    availabilityNote: 'Edisi Terbaru',
  },
];

export const LEARNING_PILLARS: LearningPillar[] = [
  {
    number: '01.',
    title: 'Literasi',
    description:
      'Mengenalkan bunyi huruf, kosakata, dan kebiasaan membaca nyaring tanpa tekanan sejak usia dini.',
  },
  {
    number: '02.',
    title: 'Life Skill',
    description:
      'Aktivitas praktis seperti mengikat, mengelompokkan, dan merapikan untuk menumbuhkan kemandirian harian.',
  },
  {
    number: '03.',
    title: 'Kreativitas',
    description:
      'Ruang eksplorasi warna, bentuk, dan cerita terbuka agar imajinasi anak berkembang alami jauh dari layar.',
  },
  {
    number: '04.',
    title: 'Nilai Islami',
    description:
      'Pembiasaan adab, doa harian, syukur, dan akhlak baik yang dihadirkan lembut dalam setiap permainan.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Sebelum pakai media Little Qalam, saya sering butuh berjam-jam menyiapkan lembar belajar kelas B. Setelah memesan Printable Worksheet dan Flashcard Edukatif, anak-anak jauh lebih antusias saat sesi pagi dan guru punya lebih banyak waktu mendampingi.',
    name: 'Ustadzah Rahmawati, S.Pd.',
    role: 'Guru Kelompok B',
    location: 'TK IT Darul Hikmah, Banda Aceh',
  },
  {
    quote:
      'Anak saya usia 4 tahun dulunya sulit lepas dari tontonan saat sore hari. Sejak ada Busy Book dan Buku Cerita Anak dari Little Qalam, ia betah bermain pasang-lepas sendiri hampir setengah jam setiap sore.',
    name: 'Cut Nadia Maulida',
    role: 'Ibu dari Rayyan (4 tahun)',
    location: 'Lampineung, Banda Aceh',
  },
];

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}
