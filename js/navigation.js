/**
 * Nama file       : navigation.js
 * Deskripsi       : Logika untuk menentukan bab sebelumnya/selanjutnya dan merender tombol navigasi.
 */

// Daftar urutan bab dan judul yang digunakan untuk navigasi
const CHAPTER_ORDER = [
    { id: 'bab1', title: 'BAB 1 - PENDAHULUAN WEB DEVELOPMENT' },
    { id: 'bab2', title: 'BAB 2 - FONDASI HTML5' },
    { id: 'bab3', title: 'BAB 3 - STYLING MODERN DENGAN TAILWIND CSS' },
    { id: 'bab4', title: 'BAB 4 - JAVASCRIPT ES6+: DASAR HINGGA INTERAKTIVITAS' },
    { id: 'bab5', 'title': 'BAB 5 - INTEGRASI HTML5, TAILWIND CSS, JAVASCRIPT' },
    { id: 'bab6', title: 'BAB 6 - BEST PRACTICES & TREN MODERN' },
    { id: 'bab7', title: 'BAB 7 - PROYEK MINI' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Cari elemen utama konten bab yang memiliki data-chapter-id
    const mainContent = document.querySelector('main.main-content');
    if (!mainContent) return;

    const currentChapterId = mainContent.getAttribute('data-chapter-id');
    if (!currentChapterId) return;

    // TARGET BARU: Cari elemen .card di dalam mainContent
    const targetContainer = mainContent.querySelector('.card');
    if (!targetContainer) return;

    const currentIndex = CHAPTER_ORDER.findIndex(chapter => chapter.id === currentChapterId);
    if (currentIndex === -1) return;

    const prevChapter = CHAPTER_ORDER[currentIndex - 1];
    const nextChapter = CHAPTER_ORDER[currentIndex + 1];

    const navContainer = document.createElement('div');
    navContainer.className = 'chapter-nav-container';

    // 1. Tombol Bab Sebelumnya
    if (prevChapter) {
        const prevLink = document.createElement('a');
        prevLink.href = `${prevChapter.id}.html`;
        prevLink.className = 'chapter-nav-btn prev-btn';
        // Menggunakan struktur teks yang sesuai dengan CSS V2: <span> dan <strong>
        prevLink.innerHTML = `
            <div class="icon-wrapper"><i class="fas fa-arrow-left"></i></div>
            <div class="text-content">
                <span>Bab Sebelumnya:</span>
                <strong>${prevChapter.title}</strong>
            </div>
        `;
        navContainer.appendChild(prevLink);
    } else {
        // Placeholder untuk menjaga tata letak jika ini adalah bab pertama
        const placeholder = document.createElement('div');
        placeholder.className = 'chapter-nav-placeholder';
        navContainer.appendChild(placeholder);
    }

    // 2. Tombol Bab Selanjutnya
    if (nextChapter) {
        const nextLink = document.createElement('a');
        nextLink.href = `${nextChapter.id}.html`;
        nextLink.className = 'chapter-nav-btn next-btn';
        // Menggunakan struktur teks yang sesuai dengan CSS V2: <span> dan <strong>
        nextLink.innerHTML = `
            <div class="text-content">
                <span>Bab Selanjutnya:</span>
                <strong>${nextChapter.title}</strong>
            </div>
            <div class="icon-wrapper"><i class="fas fa-arrow-right"></i></div>
        `;
        navContainer.appendChild(nextLink);
    }

    // Tambahkan container navigasi ke akhir elemen .card
    targetContainer.appendChild(navContainer);
});