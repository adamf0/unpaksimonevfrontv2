export interface FAQItem {
  id: string;
  category: "umum" | "kuesioner" | "rekap" | "akses";
  question: string;
  answer: string;
  steps?: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
}

export interface GuideBookItem {
  id: string;
  role: "admin" | "fakultas" | "prodi" | "semua";
  title: string;
  description: string;
  version: string;
  fileSize: string;
  chapters: string[];
}

export interface TutorialItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnailGradient: string;
  icon: string;
  summary: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "umum",
    question: "Apa itu Sistem Simonev Unpak?",
    answer:
      "Simonev Unpak adalah Sistem Informasi Monitoring dan Evaluasi Universitas Pakuan yang memudahkan LPPM, Fakultas, dan Program Studi dalam membuat instrumen kuesioner evaluasi, mengumpulkan jawaban responden (mahasiswa, dosen, tendik), serta melihat rekapitulasi penilaian secara otomatis dan cepat.",
  },
  {
    id: "faq-2",
    category: "kuesioner",
    question: "Bagaimana cara membuat kuesioner evaluasi baru?",
    answer:
      "Anda dapat membuat kuesioner baru melalui menu Bank Soal. Cukup buat judul kuesioner, lalu tambahkan pertanyaan-pertanyaan penilaian sesuai kebutuhan unit atau fakultas Anda.",
    steps: [
      {
        stepNumber: 1,
        title: "Buka Menu Bank Soal",
        description: "Pilih menu 'Bank Soal' pada sidebar navigasi di sebelah kiri.",
      },
      {
        stepNumber: 2,
        title: "Buat Judul Kuesioner",
        description: "Klik tombol 'Tambah Bank Soal', isi nama kuesioner, deskripsi, dan semester aktif.",
      },
      {
        stepNumber: 3,
        title: "Tambahkan Pertanyaan",
        description: "Masuk ke detail kuesioner dan tambahkan butir pertanyaan serta opsi jawaban.",
      },
    ],
  },
  {
    id: "faq-3",
    category: "akses",
    question: "Siapa saja yang dapat mengelola pertanyaan kuesioner?",
    answer:
      "Pengelolaan kuesioner terbagi menjadi 3 tingkat wewenang (LPPM Universitas, Fakultas, dan Program Studi). Setiap tingkat akun hanya dapat mengelola instrumen pertanyaan dan melihat data responden sesuai wilayah tugasnya masing-masing.",
  },
  {
    id: "faq-4",
    category: "rekap",
    question: "Bagaimana cara mengunduh (Export) Rekap Responden ke Excel?",
    answer:
      "Anda dapat mengunduh rekap hasil pengisian kuesioner dalam format Excel secara otomatis dan praktis. Pemrosesan dilakukan secara efisien tanpa mewajibkan Anda tetap berada di halaman tersebut, sehingga Anda bebas melihat data lain atau berpindah menu.",
    steps: [
      {
        stepNumber: 1,
        title: "Pilih Kuesioner",
        description: "Buka menu 'Rekap Responden' dan pilih judul kuesioner yang ingin diunduh.",
      },
      {
        stepNumber: 2,
        title: "Klik Export Excel (Job)",
        description: "Klik tombol hijau 'Export Excel (Job)' di bagian kanan atas tabel.",
      },
      {
        stepNumber: 3,
        title: "Pantau Status Pemrosesan",
        description: "Kotak status indikator akan muncul di pojok kanan bawah layar menunjukkan proses pembuatan file.",
      },
      {
        stepNumber: 4,
        title: "File Otomatis Terunduh",
        description: "Setelah selesai (100%), file Excel (.xlsx) akan otomatis tersimpan di perangkat komputer Anda.",
      },
    ],
  },
  {
    id: "faq-5",
    category: "kuesioner",
    question: "Mengapa responden dari fakultas lain tidak melihat pertanyaan fakultas kami?",
    answer:
      "Sistem Simonev secara otomatis menyaring pertanyaan sesuai identitas responden. Pertanyaan yang dibuat oleh Fakultas Hukum hanya akan tampil saat responden dari Fakultas Hukum mengisi kuesioner.",
  },
  {
    id: "faq-6",
    category: "rekap",
    question: "Bagaimana cara melihat isian jawaban dari salah satu responden?",
    answer:
      "Pada menu Rekap Responden, cari nama atau NIDN/NPM responden yang bersangkutan, kemudian klik tombol View pada kolom Aksi.",
    steps: [
      {
        stepNumber: 1,
        title: "Pilih Kuesioner",
        description: "Pilih Bank Soal kuesioner yang ingin diperiksa.",
      },
      {
        stepNumber: 2,
        title: "Cari Responden",
        description: "Gunakan kolom pencarian untuk menemukan nama atau NPM/NIDN responden.",
      },
      {
        stepNumber: 3,
        title: "Klik Tombol View",
        description: "Klik tombol 'View' di sebelah kanan tabel untuk membuka lembar pratinjau kuesioner responden.",
      },
    ],
  },
];

export const GUIDE_BOOKS: GuideBookItem[] = [
  {
    id: "guide-admin",
    role: "admin",
    title: "Buku Panduan Administrator (LPPM)",
    description:
      "Panduan lengkap pengoperasian Simonev bagi tim Administrator LPPM Universitas Pakuan, mencakup manajemen Bank Soal, Template Pertanyaan, Kategori, dan Akun Pengguna.",
    version: "v2.4.0",
    fileSize: "3.2 MB",
    chapters: [
      "Manajemen Akun Pengguna & Hak Akses",
      "Pengelolaan Master Data Bank Soal & Kategori",
      "Penjadwalan & Pengaktifan Kuesioner Semester",
      "Pemantauan Rekap Responden & Dashboard Evaluasi",
    ],
  },
  {
    id: "guide-fakultas",
    role: "fakultas",
    title: "Buku Panduan Pengelola Fakultas",
    description:
      "Pedoman penggunaan Simonev untuk pimpinan dan staf unit jaminan mutu Fakultas dalam mengelola instrumen kuesioner tingkat fakultas.",
    version: "v2.1.0",
    fileSize: "2.1 MB",
    chapters: [
      "Mengenal Ruang Lingkup Kuesioner Fakultas",
      "Cara Menambahkan Pertanyaan Khusus Fakultas",
      "Melihat & Memfilter Rekap Responden Fakultas",
      "Export Data Rekapitulasi Penilaian Fakultas",
    ],
  },
  {
    id: "guide-prodi",
    role: "prodi",
    title: "Buku Panduan Pengelola Program Studi",
    description:
      "Panduan praktis pengoperasian Simonev untuk Ketua Program Studi dan Gugus Penjaminan Mutu (GPM) Prodi.",
    version: "v2.0.0",
    fileSize: "1.8 MB",
    chapters: [
      "Navigasi Modul Simonev Bagi User Prodi",
      "Membuat Pertanyaan Spesifik Program Studi",
      "Mengevaluasi Hasil Kuesioner Responden Prodi",
      "Mengunduh Laporan Hasil Evaluasi Prodi",
    ],
  },
];

export const TUTORIAL_DATA: TutorialItem[] = [
  {
    id: "tut-1",
    title: "Cara Membuat Bank Soal & Menambahkan Pertanyaan",
    category: "Bank Soal & Template",
    duration: "3 Menit",
    thumbnailGradient: "from-blue-600 to-indigo-700",
    icon: "quiz",
    summary:
      "Langkah demi langkah membuat Bank Soal baru dan menyusun pertanyaan kuesioner dengan bobot penilaian.",
    steps: [
      {
        stepNumber: 1,
        title: "Buka Menu Bank Soal",
        description:
          "Navigasi ke menu 'Bank Soal' di sidebar kiri dan klik tombol 'Tambah Bank Soal'.",
      },
      {
        stepNumber: 2,
        title: "Isi Informasi Dasar Bank Soal",
        description:
          "Masukkan Judul Bank Soal, Deskripsi singkat, Semester (Ganjil/Genap), dan atur Status menjadi Aktif.",
      },
      {
        stepNumber: 3,
        title: "Tambahkan Pertanyaan Template",
        description:
          "Masuk ke detail Bank Soal, klik 'Tambah Pertanyaan', pilih Kategori, jenis skala pilihan (Rating/Skala 1-5), dan tentukan Bobot Soal.",
      },
    ],
  },
  {
    id: "tut-2",
    title: "Cara Kerja Filter Rekap Responden & Export Excel Job",
    category: "Rekap & Laporan",
    duration: "4 Menit",
    thumbnailGradient: "from-emerald-600 to-teal-700",
    icon: "download_for_offline",
    summary:
      "Memahami cara melihat rekapitulasi pengisian kuesioner dan mengeksport data ke Excel via pemrosesan otomatis.",
    steps: [
      {
        stepNumber: 1,
        title: "Akses Menu Rekap Responden",
        description:
          "Pilih menu 'Rekap Responden' dari sidebar navigasi.",
      },
      {
        stepNumber: 2,
        title: "Pilih Bank Soal",
        description:
          "Pilih Bank Soal pada dropdown filter. Tabel akan menampilkan daftar responden sesuai cakupan akun Anda.",
      },
      {
        stepNumber: 3,
        title: "Klik Export Excel (Job)",
        description:
          "Klik tombol 'Export Excel (Job)'. Indikator pemrosesan akan muncul di kanan bawah dan file akan terunduh otomatis saat selesai.",
      },
    ],
  },
  {
    id: "tut-3",
    title: "Pengaturan Kuesioner Spesifik Fakultas & Prodi",
    category: "Hak Akses & Organisasi",
    duration: "5 Menit",
    thumbnailGradient: "from-purple-600 to-pink-700",
    icon: "account_tree",
    summary:
      "Panduan mengelompokkan pertanyaan kuesioner agar tampil tepat sasaran di tingkat LPPM, Fakultas, maupun Prodi.",
    steps: [
      {
        stepNumber: 1,
        title: "Login dengan Akun Fakultas/Prodi",
        description:
          "Login menggunakan akun yang terdaftar pada Fakultas atau Prodi tertentu.",
      },
      {
        stepNumber: 2,
        title: "Buat Pertanyaan di Modul Template",
        description:
          "Pertanyaan yang Anda buat otomatis tersimpan dengan atribut fakultas/prodi akun Anda.",
      },
      {
        stepNumber: 3,
        title: "Uji Coba pada Pratinjau Kuesioner",
        description:
          "Buka pratinjau kuesioner 3-step (LPPM -> Fakultas -> Prodi) untuk memastikan pertanyaan Anda tampil pada tab yang sesuai.",
      },
    ],
  },
];
