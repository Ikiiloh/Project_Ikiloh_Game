# Project Ikiiloh_Game - Pencari Penawaran Game Terbaik

Selamat datang di Project Ikiiloh_Game! Ini adalah aplikasi web sederhana yang dirancang untuk membantu Anda menemukan penawaran video game terbaik dari berbagai toko online. Dengan antarmuka yang terinspirasi dari game retro, mencari game favorit Anda dengan harga terbaik menjadi pengalaman yang menyenangkan.

## Deskripsi

Project Ikiiloh_Game adalah sebuah *aggregator* penawaran game yang memanfaatkan API dari CheapShark. Aplikasi ini menampilkan daftar game yang sedang diskon, memungkinkan pengguna untuk mencari game berdasarkan judul, dan memfilter berdasarkan persentase diskon minimum. Semua disajikan dalam tampilan yang responsif dengan sentuhan estetika *pixel art* dan *retro*.

## Fitur Utama

* **Daftar Penawaran Game:** Menampilkan game dalam format tabel yang rapi, mencakup informasi seperti:
    * Toko (Store)
    * Penghematan (Savings %)
    * Harga (Price - Sale & Original)
    * Sampul (Cover)
    * Judul (Title)
    * Peringkat Penawaran (Deal Rating)
    * Tanggal Rilis (Release)
    * Ulasan (Reviews)
    * Waktu Penawaran (Recent)
* **Pencarian Game:** Pengguna dapat dengan mudah mencari game spesifik berdasarkan judulnya melalui bilah pencarian.
* **Filter Diskon:** Terdapat *slider* interaktif untuk memfilter game berdasarkan persentase diskon minimum yang diinginkan.
* **Desain Retro:** Menggunakan *font* seperti 'Press Start 2P' dan 'Pixelify Sans' serta skema warna navy blue untuk memberikan nuansa retro.
* **Musik Latar:** Dilengkapi dengan musik latar (BGM) untuk menambah suasana, beserta tombol kontrol untuk memutar atau menghentikannya. Tombol ini memiliki animasi dan berubah tampilan sesuai status musik.
* **Desain Responsif:** Tampilan web dirancang agar dapat beradaptasi dengan baik di berbagai ukuran layar, mulai dari desktop hingga perangkat mobile.
* **Scrollbar Kustom (Mobile):** Untuk kenyamanan pengguna mobile, tabel yang lebar dilengkapi dengan *scrollbar* horizontal kustom yang mengambang (floating) dan mudah digunakan.
* **Link Langsung:** Setiap judul game merupakan tautan yang akan mengarahkan pengguna ke halaman penawaran di CheapShark.

## Teknologi yang Digunakan

* **HTML5:** Untuk struktur dasar halaman web.
* **CSS3:** Untuk styling, tata letak, animasi, dan desain responsif.
* **JavaScript (dengan jQuery):** Untuk fungsionalitas dinamis, interaksi API, filter, pencarian, dan kontrol elemen.
* **Bootstrap 4:** Sebagai kerangka kerja CSS untuk membantu dalam tata letak dan komponen dasar.
* **Font Awesome:** Untuk ikon (misalnya, tombol musik).
* **Google Fonts:** Untuk menyediakan font retro ('Press Start 2P', 'Pixelify Sans', dll.).

## Sumber Data

Aplikasi ini mengambil data penawaran game secara *real-time* dari **[CheapShark API](https://www.cheapshark.com/api/)**.

## Cara Menggunakan

1.  **Buka Aplikasi:** Cukup buka file `index.html` di browser web favorit Anda.
2.  **Jelajahi Penawaran:** Secara *default*, aplikasi akan menampilkan daftar penawaran game terbaru. Anda bisa *scroll* tabel untuk melihat lebih banyak. Di perangkat mobile, gunakan *scrollbar* bawah jika tabel terlalu lebar.
3.  **Cari Game:** Ketikkan judul game yang Anda cari di kolom "Find Games" dan klik tombol "Show" atau tekan Enter.
4.  **Filter Diskon:** Geser *slider* "Min. Discount" untuk menampilkan game dengan diskon di atas nilai yang Anda tentukan. Persentase akan ditampilkan di sebelah kanan *slider*.
5.  **Kontrol Musik:** Klik tombol bulat di pojok kanan bawah untuk memutar atau menghentikan musik latar.
6.  **Kunjungi Penawaran:** Klik judul game di tabel untuk membuka halaman penawaran tersebut.

Terima kasih telah mengunjungi Project Ikiiloh_Game!
