/**
 * Nama file       : script.js
 * Tanggal ngoding : 15 Desember 2025 (Pembaruan)
 * Deskripsi       : Berisi fungsi-fungsi JavaScript untuk interaktivitas (toggle menu, validasi form, show/hide kode, Dark Mode, Auth, Search, Active Nav, dan Progress Tracking).
 */

// Placeholder data pengguna
let mockUser = { // Diubah menjadi let agar bisa diperbarui
    username: 'MahasiswaPW',
    email: 'mhs@web-tutorial.com',
    password: 'web123', // Tambahkan password ke mockUser default
    status: 'Aktif',
    nim: '231011400727',
    profilePic: 'https://placehold.co/120x120/3f51b5/ffffff?text=MP' 
};

// Fungsi untuk mendapatkan semua data akun yang tersimpan
function getStoredUsers() {
    try {
        // Ambil list pengguna dari localStorage, atau kembalikan array kosong jika belum ada
        return JSON.parse(localStorage.getItem('userAccounts')) || [];
    } catch (e) {
        console.error("Gagal memuat akun pengguna dari localStorage:", e);
        return [];
    }
}

// Data untuk melacak progres (Key: Chapter ID, Value: true/false)
const CHAPTERS = {
    // NEW: Judul Bab Disesuaikan
    'bab1': 'BAB 1 - PENDAHULUAN WEB DEVELOPMENT',
    'bab2': 'BAB 2 - FONDASI HTML5',
    'bab3': 'BAB 3 - STYLING MODERN DENGAN TAILWIND CSS',
    'bab4': 'BAB 4 - JAVASCRIPT ES6+: DASAR HINGGA INTERAKTIVITAS',
    'bab5': 'BAB 5 - INTEGRASI HTML5, TAILWIND CSS, JAVASCRIPT',
    'bab6': 'BAB 6 - BEST PRACTICES & TREN MODERN',
    'bab7': 'BAB 7 - PROYEK MINI'
};

// PENTING: Panggil navigation.js di sini (melalui tag <script> di HTML), 
// tapi kita tambahkan CHAPTER_ORDER ke dalam navigation.js agar terpusat.

document.addEventListener('DOMContentLoaded', () => {
    
    // Inisialisasi: Pastikan mockUser default sudah ada di userAccounts jika belum ada
    let users = getStoredUsers();
    const defaultExists = users.some(user => user.email === mockUser.email);
    if (!defaultExists) {
        users.push(mockUser);
        localStorage.setItem('userAccounts', JSON.stringify(users));
    }

    // Memuat data pengguna yang sedang login dari localStorage jika ada
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        mockUser = JSON.parse(savedUserData);
    }
    
    // ===========================================
    // 1. DARK MODE TOGGLE & INITIAL CHECK
    // ===========================================
    // Menggunakan kelas untuk menargetkan semua tombol toggle
    const modeToggleBtns = document.querySelectorAll('.mode-toggle-btn');
    
    function setMode(mode) {
        if (mode === 'dark') {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            // Update semua tombol (mobile & desktop)
            modeToggleBtns.forEach(btn => btn.innerHTML = '<i class="fas fa-sun"></i>'); 
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            // Update semua tombol (mobile & desktop)
            modeToggleBtns.forEach(btn => btn.innerHTML = '<i class="fas fa-moon"></i>');
        }
    }

    // Cek preferensi saat memuat halaman
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setMode(savedTheme);

    modeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme');
            setMode(currentTheme === 'dark' ? 'light' : 'dark');
        });
    });

    // ===========================================
    // 2. FUNGSI AUTHENTIKASI & USER UI
    // ===========================================
    // Menggunakan ID untuk menargetkan semua link aksi pengguna
    const userActionLinks = document.querySelectorAll('#user-action-link');
    const userActionTexts = document.querySelectorAll('.user-action-text'); // Menggunakan kelas baru

    function checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        userActionLinks.forEach(link => {
             if (isLoggedIn) {
                // Arahkan ke profile.html
                link.href = (window.location.pathname.includes('/materi/')) ? '../profile.html' : 'profile.html';
                link.title = 'Lihat Profil';
            } else {
                link.href = (window.location.pathname.includes('/materi/')) ? '../login.html' : 'login.html';
                link.title = 'Login ke Akun Anda';
            }
        });
        userActionTexts.forEach(textElem => {
            textElem.textContent = isLoggedIn ? 'Profil' : 'Login';
        });
        return isLoggedIn;
    }

    checkAuthStatus(); // Panggil saat memuat halaman

    // Handle Login Form Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const statusMessage = document.getElementById('form-status');

            const users = getStoredUsers();
            // Cari pengguna yang cocok dengan email dan password
            const userFound = users.find(user => user.email === email && user.password === password);

            if (userFound) { 
                localStorage.setItem('isLoggedIn', 'true');
                // Simpan data lengkap pengguna yang ditemukan ke userData
                localStorage.setItem('userData', JSON.stringify(userFound)); 
                statusMessage.innerHTML = '<i class="fas fa-check-circle"></i> Login Berhasil! Mengalihkan...';
                statusMessage.style.backgroundColor = 'var(--success-color)';
                statusMessage.style.color = 'var(--text-light)';
                statusMessage.style.display = 'block';
                
                setTimeout(() => {
                    let redirectPath = 'profile.html';
                    if (window.location.pathname.includes('/materi/')) {
                         redirectPath = '../profile.html';
                    }
                    window.location.href = redirectPath;
                }, 1500);
            } else {
                // Jika tidak ditemukan, coba berikan hint untuk akun default
                let hintText = 'Login Gagal. Email atau Password salah.';
                const defaultUser = users.find(user => user.email === mockUser.email);
                if (defaultUser && email === defaultUser.email) {
                    hintText = 'Login Gagal. Password salah. Hint: password default adalah `' + defaultUser.password + '`';
                }
                
                statusMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + hintText;
                statusMessage.style.backgroundColor = '#dc3545';
                statusMessage.style.color = 'var(--text-light)';
                statusMessage.style.display = 'block';
            }
        });
    }

    // NEW LOGIC: Handle Register Form Submission (Simulasi)
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const statusMessage = document.getElementById('form-status');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            let users = getStoredUsers();

            // 1. Validasi Sederhana
            if (username.length < 3 || !emailPattern.test(email) || password.length < 6) {
                statusMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Pendaftaran Gagal. Pastikan nama > 3, email valid, dan password > 6 karakter.';
                statusMessage.style.backgroundColor = '#dc3545';
                statusMessage.style.color = 'var(--text-light)';
                statusMessage.style.display = 'block';
                return;
            }

            // 2. Cek apakah email sudah terdaftar
            if (users.some(user => user.email === email)) {
                statusMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Pendaftaran Gagal. Email sudah terdaftar.';
                statusMessage.style.backgroundColor = '#dc3545';
                statusMessage.style.color = 'var(--text-light)';
                statusMessage.style.display = 'block';
                return;
            }
            
            // 3. Buat objek pengguna baru
            const newUser = {
                username: username,
                email: email,
                password: password, // Menyimpan password dalam plaintext (Hanya untuk simulasi/demo!)
                status: 'Baru',
                nim: 'N/A', 
                profilePic: `https://placehold.co/120x120/1a73e8/ffffff?text=${username.charAt(0).toUpperCase()}`
            };

            // 4. Simpan pengguna baru ke userAccounts di localStorage
            users.push(newUser);
            localStorage.setItem('userAccounts', JSON.stringify(users));
            
            // 5. Otomatis Login (untuk simulasi)
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(newUser));
            
            statusMessage.innerHTML = '<i class="fas fa-check-circle"></i> Pendaftaran Berhasil! Akun Anda telah dibuat. Mengalihkan ke Profil...';
            statusMessage.style.backgroundColor = 'var(--success-color)';
            statusMessage.style.color = 'var(--text-light)';
            statusMessage.style.display = 'block';
            
            setTimeout(() => {
                let redirectPath = 'profile.html';
                if (window.location.pathname.includes('/materi/')) {
                     redirectPath = '../profile.html';
                }
                window.location.href = redirectPath;
            }, 1500);
        });
    }


    // NEW: Handle Social Login Button Clicks (Simulasi)
    const socialButtons = document.querySelectorAll('.social-login-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.classList.contains('google-btn') ? 'Google' : 'GitHub';
            console.log(`Simulasi: Anda mencoba Login/Daftar dengan ${provider}. (Fungsi OAuth belum diimplementasikan)`);
            const statusMessage = document.getElementById('form-status');
            
            // Tampilkan pesan status simulasi
            statusMessage.innerHTML = `<i class="fas fa-info-circle"></i> Simulasi Autentikasi dengan ${provider}. Gunakan form di bawah untuk demo.`;
            statusMessage.style.backgroundColor = 'var(--secondary-color)';
            statusMessage.style.color = 'var(--text-light)';
            statusMessage.style.display = 'block';

             setTimeout(() => {
                // Sembunyikan pesan setelah beberapa saat
                statusMessage.style.display = 'none'; 
            }, 3000);
        });
    });


    // NEW: Handle Profile Page Load dan Logika Edit
    const profilePage = document.getElementById('profile-page');
    const logoutBtn = document.getElementById('logout-btn');
    const updateProfileForm = document.getElementById('update-profile-form');

    if (profilePage) {
        if (checkAuthStatus()) {
            // Memastikan data dimuat ulang dari localStorage
            const user = JSON.parse(localStorage.getItem('userData')) || mockUser;
            
            document.getElementById('profile-pic').src = user.profilePic;
            document.getElementById('profile-username').textContent = user.username;
            document.getElementById('profile-email').textContent = user.email;
            document.getElementById('profile-nim').textContent = user.nim || 'N/A'; // Handle NIM yang mungkin N/A
            document.getElementById('profile-status').textContent = user.status;

            // Isi form edit (untuk form di profile.html)
            const inputUsername = document.getElementById('edit-username');
            if (inputUsername) {
                inputUsername.value = user.username;
            }
            
        } else {
            // Jika belum login, redirect ke halaman login
            window.location.href = (window.location.pathname.includes('/materi/')) ? '../login.html' : 'login.html';
        }
    }

    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newUsername = document.getElementById('edit-username').value.trim();
            const profileStatus = document.getElementById('profile-update-status');

            if (newUsername.length < 3) {
                profileStatus.textContent = "Nama pengguna minimal 3 karakter.";
                profileStatus.style.backgroundColor = '#dc3545';
                profileStatus.style.display = 'block';
                return;
            }

            // 1. Update data user yang sedang login di localStorage
            const user = JSON.parse(localStorage.getItem('userData')) || mockUser;
            user.username = newUsername;
            
            // 2. Simpan kembali ke localStorage
            localStorage.setItem('userData', JSON.stringify(user));
            
            // 3. Perbarui tampilan
            document.getElementById('profile-username').textContent = newUsername;

            profileStatus.textContent = "Nama pengguna berhasil diperbarui!";
            profileStatus.style.backgroundColor = 'var(--success-color)';
            profileStatus.style.display = 'block';

            setTimeout(() => {
                profileStatus.style.display = 'none';
            }, 3000);
        });
    }


    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            localStorage.removeItem('learningProgress'); // Reset progres juga
            
            console.log('Anda telah Logout.');
            
            // Penanganan path untuk logout
            let redirectPath = 'index.html';
            if (window.location.pathname.includes('/materi/')) {
                 redirectPath = '../index.html';
            }
            window.location.href = redirectPath;
        });
    }


    // ===========================================
    // 3. FUNGSI PROGRES BELAJAR & UI
    // ===========================================

    function getProgress() {
        try {
            return JSON.parse(localStorage.getItem('learningProgress')) || {};
        } catch (e) {
            return {};
        }
    }

    function saveProgress(chapterId) {
        const progress = getProgress();
        progress[chapterId] = true;
        localStorage.setItem('learningProgress', JSON.stringify(progress));
        updateProgressUI();
        updateChapterButton(chapterId);
    }
    
    /**
     * Menghapus semua progres belajar yang tersimpan.
     */
    function resetProgress() {
        // Menggunakan modal kustom sebagai ganti confirm()
        const isConfirmed = window.prompt("Apakah Anda yakin ingin mereset semua progres belajar? Tindakan ini tidak dapat dibatalkan. Ketik 'YA' untuk melanjutkan.") === 'YA';
        
        if (isConfirmed) {
            localStorage.removeItem('learningProgress');
            updateProgressUI(); // Perbarui UI
            
            // Refresh halaman atau redirect ke home
            if (document.getElementById('home-page')) {
                // Stay on page
            } else {
                let redirectPath = 'index.html';
                if (window.location.pathname.includes('/materi/')) {
                    redirectPath = '../index.html';
                }
                window.location.href = redirectPath;
            }
        }
    }

    // PENTING: Tambahkan event listener untuk tombol reset (misal, di halaman home)
    const resetBtn = document.getElementById('reset-progress-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetProgress);
    }
    
    function updateProgressUI() {
        const progress = getProgress();
        const chapterKeys = Object.keys(CHAPTERS);
        const totalChapters = chapterKeys.length;
        const completedChapters = chapterKeys.filter(key => progress[key]).length;
        const percentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
        
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${completedChapters} dari ${totalChapters} Bab Selesai (${Math.round(percentage)}%)`;
        }

        // Tambahkan badge "Selesai" ke kartu modul di home
        chapterKeys.forEach(chapterId => {
            const moduleCard = document.getElementById(`module-${chapterId}`);
            if (moduleCard) {
                if (progress[chapterId]) {
                    moduleCard.classList.add('completed');
                    let badge = moduleCard.querySelector('.completion-badge');
                    if (!badge) {
                         badge = document.createElement('span');
                         badge.className = 'completion-badge';
                         
                         // --- HANYA TEKS "Selesai" ---
                         badge.innerHTML = 'Selesai'; 
                         
                         moduleCard.appendChild(badge);
                    }
                } else {
                    moduleCard.classList.remove('completed');
                    const badge = moduleCard.querySelector('.completion-badge');
                    if (badge) badge.remove();
                }
            }
        });
        
        // Pastikan tombol reset terlihat jika ada progres (opsional)
        if (resetBtn) {
            resetBtn.style.display = completedChapters > 0 ? 'inline-block' : 'none';
        }
    }

    function updateChapterButton(chapterId) {
        const markCompleteBtn = document.getElementById('mark-complete-btn');
        const progress = getProgress();
        
        if (markCompleteBtn) {
            if (progress[chapterId]) {
                markCompleteBtn.textContent = 'Bab Sudah Selesai';
                markCompleteBtn.disabled = true;
                markCompleteBtn.style.backgroundColor = 'var(--success-color)';
                markCompleteBtn.style.boxShadow = 'none';
            } else {
                markCompleteBtn.textContent = 'Tandai Bab Ini Sebagai Selesai';
                markCompleteBtn.disabled = false;
                markCompleteBtn.style.backgroundColor = 'var(--primary-color)';
            }
        }
    }

    const currentPageMain = document.querySelector('main');
    if (currentPageMain) {
        const chapterId = currentPageMain.getAttribute('data-chapter-id');
        
        // Panggil fungsi untuk mengupdate UI progres dan tombol
        if (chapterId) {
            updateChapterButton(chapterId);
            
            const markCompleteBtn = document.getElementById('mark-complete-btn');
            if (markCompleteBtn) {
                markCompleteBtn.addEventListener('click', () => {
                    saveProgress(chapterId);
                });
            }
        }
        
        // Hanya panggil updateProgressUI di halaman yang relevan (Home)
        if (document.getElementById('home-page')) {
            updateProgressUI();
        }
    }
    
    // ===========================================
    // 4. ACTIVE NAVIGATION
    // ===========================================
    function setActiveNav() {
        // Path saat ini, diolah untuk mencocokkan link
        let currentPath = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPath.startsWith('bab') && !currentPath.includes('.')) {
             // Handle case where path is just /materi/bab1 (no extension)
             currentPath = currentPath + '.html';
        }
        
        const navLinks = document.querySelectorAll('.nav-menu a');

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            // Ambil path dari href, abaikan ../ atau ./
            const linkPath = link.href.split('/').pop() || 'index.html'; 
            
            if (currentPath === linkPath) {
                link.classList.add('active-link');
                
                // Jika link adalah bagian dari submenu, aktifkan juga parent-nya
                const parentLi = link.closest('.has-submenu');
                if (parentLi) {
                    const parentLink = parentLi.querySelector(':scope > a');
                    if (parentLink) {
                        parentLink.classList.add('active-link');
                    }
                }
            } 
        });
    }
    
    setActiveNav();


    // ===========================================
    // 5. FUNGSI BAWAAN (MENU, SEARCH, FORM)
    // ===========================================

    // 5.1 FUNGSI TOGGLE MENU RESPONSIF
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const subMenus = document.querySelectorAll('.has-submenu > a');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // 5.2 FUNGSI TOGGLE SUB-MENU
    subMenus.forEach(link => {
        link.addEventListener('click', (e) => {
            // Hanya aktifkan toggle di mode mobile (lebar < 768px)
            if (window.innerWidth < 768) {
                e.preventDefault();
                const sub = link.nextElementSibling;
                if (sub && sub.classList.contains('submenu')) {
                    sub.classList.toggle('active');
                    // Tutup submenu lain saat salah satu dibuka
                    document.querySelectorAll('.submenu').forEach(otherSub => {
                        if (otherSub !== sub) {
                            otherSub.classList.remove('active');
                        }
                    });
                }
            }
        });
    });

    // Tutup menu saat klik di luar (atau resize)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
             navMenu?.classList.remove('active');
             navToggle?.classList.remove('active');
             document.querySelectorAll('.submenu').forEach(sub => sub.classList.remove('active'));
        }
    });

    // 5.3 FUNGSI PENCARIAN KONTEN
    const searchInputs = document.querySelectorAll('.search-input');
    const mainContent = document.querySelector('.main-content');

    function removeHighlights(element) {
        // ... (Fungsi highlight lama)
        const highlights = element.querySelectorAll('.highlight');
        highlights.forEach(span => {
            const parent = span.parentNode;
            // Gunakan innerHTML untuk menghapus highlight di node yang kompleks
            parent.innerHTML = parent.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/g, '$1');
        });
    }

    function highlightText(text, term) {
        if (!term) return text;
        // Gunakan regex untuk menghindari highlight di dalam tag HTML
        const regex = new RegExp(term, 'gi');
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
    }

    searchInputs.forEach(searchInput => {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            if (!mainContent) return;
            
            // Sinkronkan nilai antar input (jika ada)
            searchInputs.forEach(input => {
                if(input !== e.target) input.value = searchTerm;
            });
            
            // Hapus highlight lama
            const contentContainers = mainContent.querySelectorAll('p, h1, h2, h3, li');
            contentContainers.forEach(node => {
                if (node.closest('.code-block') || node.closest('.nav-menu') || node.closest('.footer')) return;
                
                // Gunakan textContent untuk menghindari pemrosesan pada node yang sudah di-highlight
                const originalText = node.textContent;
                node.innerHTML = originalText; // Reset HTML (hapus highlight lama)

                if (searchTerm.length > 2) {
                    const highlightedHTML = highlightText(originalText, searchTerm);
                    node.innerHTML = highlightedHTML;
                }
            });
            
            // Logika penghitungan match (opsional)
            if (searchTerm.length > 2) {
                const matchCount = mainContent.querySelectorAll('.highlight').length;
                console.log(`Ditemukan ${matchCount} hasil pencarian.`);
            } else {
                console.log('Cari minimal 3 karakter.');
                removeHighlights(mainContent);
            }
        });
    });


    // 5.4 FUNGSI VALIDASI FORM KONTAK
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nama = document.getElementById('nama').value.trim();
            const email = document.getElementById('email').value.trim();
            const pesan = document.getElementById('pesan').value.trim();
            let isValid = true;
            let errorMessage = '';

            if (nama.length < 3) { errorMessage += 'Nama minimal 3 karakter. '; isValid = false; }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) { errorMessage += 'Format email tidak valid. '; isValid = false; }
            if (pesan.length < 10) { errorMessage += 'Pesan minimal 10 karakter.'; isValid = false; }

            const statusMessage = document.getElementById('form-status');
            
            if (isValid) {
                statusMessage.innerHTML = '<i class="fas fa-check-circle"></i> Pesan Anda berhasil dikirim! Terima kasih, ' + nama + '.';
                statusMessage.style.backgroundColor = 'var(--success-color)';
                statusMessage.style.color = 'var(--text-light)';
                this.reset();
            } else {
                statusMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Gagal mengirim: ' + errorMessage;
                statusMessage.style.backgroundColor = '#dc3545';
                statusMessage.style.color = 'var(--text-light)';
            }

            statusMessage.style.display = 'block';
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        });
    }

    // 5.5 FUNGSI TOGGLE CONTOH KODE (Materi Pages) 
    const codeToggleButtons = document.querySelectorAll('.code-toggle');
    codeToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.nextElementSibling;
            if (codeBlock && codeBlock.classList.contains('code-block')) {
                codeBlock.classList.toggle('hidden');
                button.textContent = codeBlock.classList.contains('hidden') ? 'Tampilkan Kode' : 'Sembunyikan Kode';
            }
        });
    });
});