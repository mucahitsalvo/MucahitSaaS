// Initialize Data from LocalStorage partition based on user email
let mockData = {
    cariler: [],
    urunler: [],
    faturalar: [],
    takvimNotlari: {},
    tickets: [],
    kasalar: [],
    cekSenetler: [],
    personeller: [],
    maasOdemeleri: [],
    teklifler: []
};

function initUserData() {
    const email = localStorage.getItem('user_email') || 'demo@kullanici.com';
    const isDemo = (email === 'demo@kullanici.com' || !localStorage.getItem('session_expiry'));
    
    const localData = localStorage.getItem(`saas_erp_data_${email}`) || localStorage.getItem('saas_erp_data');
    mockData = localData ? JSON.parse(localData) : {
        cariler: [],
        urunler: [],
        faturalar: [],
        takvimNotlari: {},
        tickets: [],
        kasalar: [],
        cekSenetler: [],
        personeller: [],
        maasOdemeleri: [],
        teklifler: [],
        giderler: [],
        gelenEFaturalar: [],
        depolar: [],
        depoTransferleri: [],
        gidenIrsaliyeler: [],
        gelenIrsaliyeler: [],
        fiyatListeleri: [],
        stokGecmisi: [],
        eticaretSiparisler: [],
        eticaretEntegrasyonlar: [],
        eticaretEslesmeler: [],
        eticaretAyarlar: {},
        installedUygulamalar: [],
        kullanicilar: [],
        etiketler: [],
        sablonlar: {}
    };
    
    // Safety check / lazy init of all fields to prevent crashes on old stored structures
    if (!mockData.cariler) mockData.cariler = [];
    if (!mockData.urunler) mockData.urunler = [];
    if (!mockData.faturalar) mockData.faturalar = [];
    if (!mockData.takvimNotlari) mockData.takvimNotlari = {};
    if (!mockData.tickets) mockData.tickets = [];
    if (!mockData.kasalar) mockData.kasalar = [];
    if (!mockData.cekSenetler) mockData.cekSenetler = [];
    if (!mockData.personeller) mockData.personeller = [];
    if (!mockData.maasOdemeleri) mockData.maasOdemeleri = [];
    if (!mockData.teklifler) mockData.teklifler = [];
    if (!mockData.giderler) mockData.giderler = [];
    if (!mockData.gelenEFaturalar) mockData.gelenEFaturalar = [];
    if (!mockData.depolar) mockData.depolar = [];
    if (!mockData.depoTransferleri) mockData.depoTransferleri = [];
    if (!mockData.gidenIrsaliyeler) mockData.gidenIrsaliyeler = [];
    if (!mockData.gelenIrsaliyeler) mockData.gelenIrsaliyeler = [];
    if (!mockData.fiyatListeleri) mockData.fiyatListeleri = [];
    if (!mockData.stokGecmisi) mockData.stokGecmisi = [];
    if (!mockData.eticaretSiparisler) mockData.eticaretSiparisler = [];
    if (!mockData.eticaretEntegrasyonlar) mockData.eticaretEntegrasyonlar = [];
    if (!mockData.eticaretEslesmeler) mockData.eticaretEslesmeler = [];
    if (!mockData.eticaretAyarlar || typeof mockData.eticaretAyarlar !== 'object') mockData.eticaretAyarlar = {};
    if (!mockData.installedUygulamalar) mockData.installedUygulamalar = [];
    if (!mockData.kullanicilar) mockData.kullanicilar = [];
    if (!mockData.etiketler) mockData.etiketler = [];
    if (!mockData.sablonlar || typeof mockData.sablonlar !== 'object') mockData.sablonlar = {};

    // Check and add default bank/safe box accounts
    if (mockData.kasalar.length === 0) {
        mockData.kasalar = [
            { ad: "Merkez TL Kasası", tur: "Kasa", bakiye: 0, para_birimi: "TRY" },
            { ad: "Garanti Bankası Ticari", tur: "Banka", bakiye: 0, para_birimi: "TRY" },
            { ad: "Dolar Kasası", tur: "Kasa", bakiye: 0, para_birimi: "USD" }
        ];
        if (isDemo) {
            mockData.kasalar[0].bakiye = 15000;
            mockData.kasalar[1].bakiye = 85000;
            mockData.kasalar[2].bakiye = 2500;
        }
    }
    
    // Seed mock data ONLY in demo mode
    if (isDemo) {
        if (mockData.cekSenetler.length === 0) {
            mockData.cekSenetler = [
                { tutar: 25000, vade_tarihi: "2026-06-15", cari: "Ahmet Yılmaz İnşaat", tur: "Alınan", tip: "Çek", durum: "Portföyde" },
                { tutar: 45000, vade_tarihi: "2026-05-28", cari: "Doruk Lojistik A.Ş.", tur: "Verilen", tip: "Çek", durum: "Portföyde" }
            ];
        }
        if (mockData.personeller.length === 0) {
            mockData.personeller = [
                { isim: "Mücahit Salvo", departman: "Yönetim", unvan: "Genel Müdür", maas: 75000, giris_tarihi: "2024-01-10" },
                { isim: "Elif Demir", departman: "Finans", unvan: "Muhasebe Uzmanı", maas: 45000, giris_tarihi: "2025-03-15" }
            ];
        }
        if (mockData.teklifler.length === 0) {
            mockData.teklifler = [
                { teklif_no: "TKF-2026-001", cari: "Ahmet Yılmaz İnşaat", tutar: 12000, tarih: "24.05.2026", durum: "Onaylandı", kalemler: [{ urun: "Web Tasarım Hizmeti", miktar: 1, fiyat: 10000 }, { urun: "Barındırma Hizmeti", miktar: 1, fiyat: 2000 }] },
                { teklif_no: "TKF-2026-002", cari: "Doruk Lojistik A.Ş.", tutar: 8500, tarih: "23.05.2026", durum: "Beklemede", kalemler: [{ urun: "SEO Danışmanlığı", miktar: 1, fiyat: 8500 }] }
            ];
        }
        if (mockData.cariler.length === 0) {
            mockData.cariler = [
                { unvan: "Ahmet Yılmaz İnşaat", tur: "Müşteri", bakiye: 12000 },
                { unvan: "Doruk Lojistik A.Ş.", tur: "Tedarikçi", bakiye: -8500 }
            ];
        }
        if (mockData.urunler.length === 0) {
            mockData.urunler = [
                { kod: "SRV-01", ad: "Web Tasarım Hizmeti", fiyat: 10000, stok: 999 },
                { kod: "SRV-02", ad: "Barındırma Hizmeti", fiyat: 2000, stok: 999 },
                { kod: "SRV-03", ad: "SEO Danışmanlığı", fiyat: 8500, stok: 999 }
            ];
        }
        if (mockData.faturalar.length === 0) {
            mockData.faturalar = [
                { tutar: 12000, kdv_orani: 20, kdv_tutari: 2400, genel_toplam: 14400, cari: "Ahmet Yılmaz İnşaat", tur: "Satış", tarih: "2026-05-24", durum: "Beklemede", kategori: "Hizmet Satışı", kalemler: [{ urun: "Web Tasarım Hizmeti", miktar: 1, fiyat: 10000 }, { urun: "Barındırma Hizmeti", miktar: 1, fiyat: 2000 }] },
                { tutar: 8500, kdv_orani: 20, kdv_tutari: 1700, genel_toplam: 10200, cari: "Doruk Lojistik A.Ş.", tur: "Alış", tarih: "2026-05-23", durum: "Ödendi", kategori: "Lojistik Gideri", kalemler: [{ urun: "SEO Danışmanlığı", miktar: 1, fiyat: 8500 }] }
            ];
        }
        if (mockData.giderler.length === 0) {
            mockData.giderler = [
                { tarih: "2026-05-10", kategori: "Kira", aciklama: "Merkez Ofis Mayıs Kira Bedeli", tutar: 20000, kasa: "Garanti Bankası Ticari", durum: "Ödendi" },
                { tarih: "2026-05-15", kategori: "Fatura / Abonelik", aciklama: "İnternet ve Telefon Faturaları", tutar: 1500, kasa: "Merkez TL Kasası", durum: "Ödendi" },
                { tarih: "2026-05-20", kategori: "Pazarlama / Reklam", aciklama: "Google Ads Reklam Ödemesi", tutar: 8000, kasa: "Garanti Bankası Ticari", durum: "Ödendi" },
                { tarih: "2026-05-25", kategori: "Ofis Giderleri", aciklama: "Ofis Mutfak ve Kırtasiye Alışverişi", tutar: 3200, kasa: "Merkez TL Kasası", durum: "Ödendi" }
            ];
        }
        if (mockData.gelenEFaturalar.length === 0) {
            mockData.gelenEFaturalar = [
                { fatura_no: "GFT-2026-0012", cari: "Turkcell İletişim A.Ş.", tutar: 1800, tarih: "2026-05-28", durum: "Beklemede", kategori: "Fatura / Abonelik" },
                { fatura_no: "GFT-2026-0013", cari: "Elektrik Dağıtım A.Ş.", tutar: 4200, tarih: "2026-05-27", durum: "Beklemede", kategori: "Fatura / Abonelik" }
            ];
        }
        if (mockData.depolar.length === 0) {
            mockData.depolar = [
                { ad: "Merkez Depo", konum: "İstanbul / Ümraniye", stok_adedi: 150, sorumlu: "Mücahit Salvo" },
                { ad: "E-Ticaret Deposu", konum: "Kocaeli / Gebze", stok_adedi: 220, sorumlu: "Elif Demir" }
            ];
        }
        if (mockData.depoTransferleri.length === 0) {
            mockData.depoTransferleri = [
                { tarih: "2026-05-18", urun: "Web Tasarım Hizmeti", miktar: 5, kaynak: "Merkez Depo", hedef: "E-Ticaret Deposu", durum: "Tamamlandı" },
                { tarih: "2026-05-24", urun: "SEO Danışmanlığı", miktar: 2, kaynak: "Merkez Depo", hedef: "E-Ticaret Deposu", durum: "Sevk Edildi" }
            ];
        }
        if (mockData.gidenIrsaliyeler.length === 0) {
            mockData.gidenIrsaliyeler = [
                { irsaliye_no: "IRS-2026-001", cari: "Ahmet Yılmaz İnşaat", tarih: "2026-05-22", urun: "Web Tasarım Hizmeti", miktar: 1, durum: "Faturalandırıldı" }
            ];
        }
        if (mockData.gelenIrsaliyeler.length === 0) {
            mockData.gelenIrsaliyeler = [
                { irsaliye_no: "GIR-2026-001", cari: "Doruk Lojistik A.Ş.", tarih: "2026-05-23", urun: "SEO Danışmanlığı", miktar: 1, durum: "Sevk Edildi" }
            ];
        }
        if (mockData.fiyatListeleri.length === 0) {
            mockData.fiyatListeleri = [
                { ad: "Genel Perakende Satış", indirim_orani: 0, baslangic: "2026-01-01", bitis: "2026-12-31", durum: "Aktif" },
                { ad: "Bayi Özel Fiyat Listesi", indirim_orani: 15, baslangic: "2026-01-01", bitis: "2026-12-31", durum: "Aktif" }
            ];
        }
        if (mockData.stokGecmisi.length === 0) {
            mockData.stokGecmisi = [
                { tarih: "2026-05-24", urun: "Web Tasarım Hizmeti", miktar: -1, tip: "Satış", aciklama: "TKF-2026-001 nolu teklif satışı" }
            ];
        }
        if (mockData.eticaretSiparisler.length === 0) {
            mockData.eticaretSiparisler = [
                { siparis_no: "TY-87219-92", pazar_yeri: "Trendyol", cari: "Mehmet Kaya", tutar: 450, tarih: "2026-05-29", durum: "ERP'ye Aktarıldı" },
                { siparis_no: "HB-12984-90", pazar_yeri: "Hepsiburada", cari: "Ayşe Yılmaz", tutar: 850, tarih: "2026-05-29", durum: "Beklemede" },
                { siparis_no: "WC-5412", pazar_yeri: "WooCommerce", cari: "Ali Demir", tutar: 1200, tarih: "2026-05-30", durum: "Beklemede" }
            ];
        }
        if (mockData.eticaretEntegrasyonlar.length === 0) {
            mockData.eticaretEntegrasyonlar = [
                { ad: "Trendyol Entegrasyonu", durum: false, satici_id: "", api_key: "", api_secret: "" },
                { ad: "Hepsiburada Entegrasyonu", durum: false, satici_id: "", api_key: "", api_secret: "" },
                { ad: "WooCommerce Entegrasyonu", durum: false, satici_id: "", api_key: "", api_secret: "" }
            ];
        }
        if (mockData.eticaretEslesmeler.length === 0) {
            mockData.eticaretEslesmeler = [
                { e_ticaret_ad: "WordPress Premium Tema Entegrasyonu", erp_kod: "SRV-01", tarih: "2026-05-25", durum: "Eşleşti" }
            ];
        }
        if (Object.keys(mockData.eticaretAyarlar).length === 0) {
            mockData.eticaretAyarlar = {
                depo: "E-Ticaret Deposu",
                oto_fatura: false,
                kargo_sablonu: "Yurtiçi Kargo Standart",
                fatura_seri: "ETC"
            };
        }
        if (mockData.installedUygulamalar.length === 0) {
            mockData.installedUygulamalar = ["SMS Bildirim Modülü", "E-Fatura Entegrasyonu"];
        }
        if (mockData.kullanicilar.length === 0) {
            mockData.kullanicilar = [
                { isim: "Mücahit Salvo", eposta: "demo@kullanici.com", rol: "Yönetici" },
                { isim: "Elif Demir", eposta: "elif.demir@firma.com", rol: "Muhasebe Uzmanı" }
            ];
        }
        if (mockData.etiketler.length === 0) {
            mockData.etiketler = [
                { ad: "Yazılım Projeleri", renk: "#6366f1", tip: "Gelir" },
                { ad: "Ofis Giderleri", renk: "#ef4444", tip: "Gider" },
                { ad: "VIP Müşteri", renk: "#10b981", tip: "Cari" }
            ];
        }
        if (Object.keys(mockData.sablonlar).length === 0) {
            mockData.sablonlar = {
                secili: "modern",
                logo_durumu: true
            };
        }
    }
}

// Initialize on script load
initUserData();

function saveData() {
    const email = localStorage.getItem('user_email') || 'demo@kullanici.com';
    localStorage.setItem(`saas_erp_data_${email}`, JSON.stringify(mockData));
    localStorage.setItem('saas_erp_data', JSON.stringify(mockData));
    loadPage(CURRENT_PAGE); // Refresh current page
}

const formatMoney = (amount) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

let CURRENT_PAGE = 'dashboard';

let CALENDAR_YEAR = new Date().getFullYear();
let CALENDAR_MONTH = new Date().getMonth(); // 0-indexed
let SELECTED_DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('app_theme', isLight ? 'light' : 'dark');
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.innerHTML = isLight ? `<i class='bx bx-sun'></i>` : `<i class='bx bx-moon'></i>`;
    }
    // Refresh page if logged in to apply new theme colors to charts and views
    const appContainer = document.getElementById('appContainer');
    if (appContainer && appContainer.style.display !== 'none') {
        loadPage(CURRENT_PAGE);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme
    const currentTheme = localStorage.getItem('app_theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        const themeBtn = document.getElementById('themeToggleBtn');
        if(themeBtn) themeBtn.innerHTML = `<i class='bx bx-sun'></i>`;
    }

    // Apply branding settings (App name, title slogan)
    applyBranding();

    const savedEmail = localStorage.getItem('user_email') || 'demo@kullanici.com';
    const emailEl = document.getElementById('sidebarUserEmail');
    if(emailEl) emailEl.innerText = savedEmail;
    
    if (typeof renderNotifications === 'function') renderNotifications();

    // Check Remember Me Session
    const sessionExpiry = localStorage.getItem('session_expiry');
    if(sessionExpiry && parseInt(sessionExpiry) > Date.now()) {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        loadPage('dashboard');
    }

    // Fetch daily exchange rates
    fetchExchangeRates();

    // Check if redirecting from Supabase Password Reset / Recovery link
    if (window.location.hash && window.location.hash.includes('type=recovery')) {
        toggleAuth('forgot');
        // Transition to Step 2 directly so they can enter the new password
        document.getElementById('forgotStep1').style.display = 'none';
        document.getElementById('forgotStep2').style.display = 'block';
        document.getElementById('forgotStep2Title').innerText = "Supabase bağlantısı doğrulandı. Lütfen yeni şifrenizi girin:";
        
        // Hide the "verification code" field because they already verified via email link!
        const codeInput = document.getElementById('forgotCode');
        if (codeInput) {
            codeInput.style.display = 'none';
            // Set activeSimCode to a dummy value and fill it in so it passes the local check
            activeSimCode = "supabase_recovery";
            codeInput.value = "supabase_recovery";
        }
    }

    // Auth Form Logic
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const pwd = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Giriş Yapılıyor...`;
            btn.disabled = true;

            if (supabase) {
                // Live Supabase Login
                supabase.auth.signInWithPassword({
                    email: email,
                    password: pwd
                }).then(({ data, error }) => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    if (error) {
                        alert("Supabase Giriş Hatası: " + error.message);
                    } else {
                        localStorage.setItem('user_email', email);
                        localStorage.setItem(`user_pwd_${email}`, pwd); // Keep password locally for fallback
                        
                        // Initialize user partition data immediately
                        initUserData();
                        
                        if(rememberMe) {
                            // 30 days expiry
                            localStorage.setItem('session_expiry', Date.now() + (30 * 24 * 60 * 60 * 1000));
                        } else {
                            localStorage.removeItem('session_expiry');
                        }
                        if(emailEl) emailEl.innerText = email;
                        
                        document.getElementById('authScreen').style.opacity = '0';
                        setTimeout(() => {
                            document.getElementById('authScreen').style.display = 'none';
                            document.getElementById('appContainer').style.display = 'flex';
                            loadPage('dashboard');
                        }, 300);
                    }
                });
            } else {
                btn.innerHTML = originalText;
                btn.disabled = false;

                // Validate password if registered
                const registeredPwd = localStorage.getItem(`user_pwd_${email}`);
                if (registeredPwd && registeredPwd !== pwd) {
                    return alert("E-posta veya şifre hatalı!");
                }
                
                // If email is not registered yet, we register this password as default
                if (!registeredPwd) {
                    localStorage.setItem(`user_pwd_${email}`, pwd);
                }
                
                localStorage.setItem('user_email', email);
                
                // Initialize user partition data immediately
                initUserData();
                
                if(rememberMe) {
                    // 30 days expiry
                    localStorage.setItem('session_expiry', Date.now() + (30 * 24 * 60 * 60 * 1000));
                } else {
                    localStorage.removeItem('session_expiry');
                }
                
                if(emailEl) emailEl.innerText = email;
                processAuth(loginForm);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('regEmail').value.trim();
            const pwd = document.getElementById('regPassword').value;
            
            const btn = registerForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Kayıt Yapılıyor...`;
            btn.disabled = true;

            if (supabase) {
                // Live Supabase SignUp
                supabase.auth.signUp({
                    email: email,
                    password: pwd
                }).then(({ data, error }) => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    if (error) {
                        alert("Supabase Kayıt Hatası: " + error.message);
                    } else {
                        localStorage.setItem('user_email', email);
                        localStorage.setItem(`user_pwd_${email}`, pwd);
                        
                        // Initialize user partition data immediately
                        initUserData();
                        
                        if(emailEl) emailEl.innerText = email;
                        
                        alert("Kayıt başarılı! Lütfen varsa gelen kutunuza gönderilen e-posta doğrulama linkine tıklayın.");
                        
                        // Proceed to dashboard
                        document.getElementById('authScreen').style.opacity = '0';
                        setTimeout(() => {
                            document.getElementById('authScreen').style.display = 'none';
                            document.getElementById('appContainer').style.display = 'flex';
                            loadPage('dashboard');
                        }, 300);
                    }
                });
            } else {
                localStorage.setItem('user_email', email);
                localStorage.setItem(`user_pwd_${email}`, pwd);
                
                // Initialize user partition data immediately
                initUserData();
                
                if(emailEl) emailEl.innerText = email;
                processAuth(registerForm);
            }
        });
    }

    // Navigation is handled via inline onclick attributes in HTML to prevent double firing and undefined pages.

    // Modal Form Submit
    document.getElementById('genericForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveModalData();
    });
});

let FINANCE_CHART = null;
let PIE_CHART = null;
let CATEGORY_CHART = null;

function processAuth(formElement) {
    const btn = formElement.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> İşleniyor...`;
    
    setTimeout(() => {
        document.getElementById('authScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('authScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'flex';
            btn.innerHTML = originalText;
            loadPage('dashboard');
        }, 300);
    }, 800);
}

function toggleAuth(type) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    const forgot = document.getElementById('forgotForm');
    if (forgot) forgot.style.display = 'none';
    
    if(type === 'login') document.getElementById('loginForm').style.display = 'block';
    else if(type === 'register') document.getElementById('registerForm').style.display = 'block';
    else if(type === 'forgot' && forgot) {
        forgot.style.display = 'block';
        document.getElementById('forgotStep1').style.display = 'block';
        document.getElementById('forgotStep2').style.display = 'none';
    }
}

function loadPage(page) {
    if (!page) return;
    CURRENT_PAGE = page;
    
    // Close any active mobile/collapsed popups
    document.querySelectorAll('.has-submenu').forEach(p => {
        p.classList.remove('active-popup');
    });
    const content = document.getElementById('contentArea');
    content.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;"><i class="bx bx-loader-alt bx-spin" style="font-size:40px;color:var(--primary)"></i></div>';

    // Synchronize sidebar active tab (both main items and submenu items)
    document.querySelectorAll('.nav-item, .submenu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find active element
    const activeEl = document.querySelector(`.nav-item[onclick*="'${page}'"], .submenu-item[onclick*="'${page}'"]`);
    if (activeEl) {
        activeEl.classList.add('active');
        // If it's a submenu item, also expand its parent submenu
        if (activeEl.classList.contains('submenu-item')) {
            const parentList = activeEl.closest('.submenu-list');
            if (parentList) {
                parentList.classList.add('open');
                const mainNavLink = parentList.parentElement.querySelector('.nav-item');
                if (mainNavLink) mainNavLink.classList.add('open');
            }
        }
    }

    setTimeout(() => {
        try {
            if (page === 'dashboard') renderDashboard(content);
            else if (page === 'cariler') renderCariler(content);
            else if (page === 'urunler') renderUrunler(content);
            else if (page === 'faturalar') renderFaturalar(content);
            else if (page === 'kasalar') renderKasalar(content);
            else if (page === 'cekSenetler') renderCekSenetler(content);
            else if (page === 'takvim') {
                CALENDAR_YEAR = new Date().getFullYear();
                CALENDAR_MONTH = new Date().getMonth();
                SELECTED_DATE = new Date().toISOString().split('T')[0];
                renderTakvim(content);
            }
            else if (page === 'personel') renderPersonel(content);
            else if (page === 'teklifler') renderTeklifler(content);
            else if (page === 'tickets') renderTickets(content);
            else if (page === 'ayarlar') renderAyarlar(content);
            else if (page === 'asistan') renderAsistan(content);
            else if (page === 'depolar') renderDepolar(content);
            else if (page === 'depo-transfer') renderDepoTransfer(content);
            else if (page === 'giden-irsaliye') renderGidenIrsaliye(content);
            else if (page === 'gelen-irsaliye') renderGelenIrsaliye(content);
            else if (page === 'fiyat-listeleri') renderFiyatListeleri(content);
            else if (page === 'stok-gecmisi') renderStokGecmisi(content);
            else if (page === 'eticaret-siparisler') renderETicaretSiparisler(content);
            else if (page === 'eticaret-entegrasyon') renderETicaretEntegrasyon(content);
            else if (page === 'eticaret-eslesme') renderETicaretEslesme(content);
            else if (page === 'eticaret-ayarlar') renderETicaretAyarlar(content);
            else if (page === 'uygulamalar') renderUygulamalar(content);
            else if (page === 'pazaryeri') renderPazaryeri(content);
            else if (page === 'ayarlar-etiketler') renderAyarlarEtiketler(content);
            else if (page === 'ayarlar-kullanicilar') renderAyarlarKullanicilar(content);
            else if (page === 'ayarlar-sablonlar') renderAyarlarSablonlar(content);
            else if (page.startsWith('rapor-')) renderReports(content, page);
            else if (page === 'giderler') renderGiderler(content);
            else if (page === 'gelen-efaturalar') renderGelenEFaturalar(content);
            else {
                content.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:60vh;flex-direction:column;gap:20px;">
                    <i class="bx bx-error-circle" style="font-size:60px;color:var(--warning)"></i>
                    <h3 style="color:#fff">Sayfa bulunamadı: ${page}</h3>
                    <button class="btn btn-primary" onclick="loadPage('dashboard')">Ana Sayfaya Dön</button>
                </div>`;
            }
        } catch(err) {
            console.error('Page render error for ' + page + ':', err);
            content.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:60vh;flex-direction:column;gap:20px;text-align:center;padding:20px;">
                <i class="bx bx-error-circle" style="font-size:60px;color:var(--danger)"></i>
                <h3 style="color:#fff">Sayfa yüklenirken bir hata oluştu</h3>
                <p style="color:var(--text-secondary);max-width:400px;">${err.message}</p>
                <button class="btn btn-primary" onclick="loadPage('dashboard')">Ana Sayfaya Dön</button>
            </div>`;
        }
    }, 200); 
}

function renderPlaceholderPage(container, title, description, icon) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">${title}</h1>
                <p style="color:var(--text-secondary)">${description}</p>
            </div>
        </div>
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:60vh; gap:20px; text-align:center;" class="fade-in">
            <div style="font-size:80px; color:rgba(255,255,255,0.05); background:rgba(255,255,255,0.01); width:160px; height:160px; display:flex; justify-content:center; align-items:center; border-radius:50%; border:1px solid var(--border-light);"><i class='bx ${icon || 'bx-wrench'}'></i></div>
            <div>
                <h3 style="color:#fff; font-size:18px; margin-bottom:8px;">Bu modül çok yakında hizmetinizde olacak!</h3>
                <p style="color:var(--text-secondary); font-size:13px; max-width:400px; line-height:1.5;">Geliştirme aşamasında olan bu sayfa, bir sonraki güncelleme adımlarında tam işlevsel olarak sisteme entegre edilecektir.</p>
            </div>
        </div>
    `;
}

function renderAsistan(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">MücahitSaaS Asistan</h1>
                <p style="color:var(--text-secondary)">Deneysel akıllı finans yardımcınız (Simüle Edilmiştir)</p>
            </div>
        </div>
        
        <div style="max-width: 600px; margin: 40px auto; text-align: center; display: flex; flex-direction: column; gap: 20px; align-items: center;" class="fade-in">
            <div style="font-size: 50px; color: var(--primary);"><i class='bx bx-sparkles'></i></div>
            <h2 style="color: #fff; font-size: 24px; font-weight: 700;">MücahitSaaS Asistan</h2>
            <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">
                Size nasıl yardımcı olabilirim? Aşağıdaki sorulardan bir seçim yapabilirsiniz.
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 10px;">
                <button class="btn" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); color: #fff; padding: 14px; border-radius: 12px; font-size: 14px; text-align: left; justify-content: flex-start; display: flex; align-items: center; gap: 10px; transition: 0.2s;" onclick="askAsistan('ciro')" onmouseover="this.style.background='rgba(99,102,241,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                    <i class='bx bx-trending-up' style='color:var(--primary)'></i> Bu ayki cirom nedir?
                </button>
                <button class="btn" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); color: #fff; padding: 14px; border-radius: 12px; font-size: 14px; text-align: left; justify-content: flex-start; display: flex; align-items: center; gap: 10px; transition: 0.2s;" onclick="askAsistan('kar')" onmouseover="this.style.background='rgba(99,102,241,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                    <i class='bx bx-pie-chart-alt-2' style='color:var(--primary)'></i> Bu ay toplam kârım nedir?
                </button>
                <button class="btn" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); color: #fff; padding: 14px; border-radius: 12px; font-size: 14px; text-align: left; justify-content: flex-start; display: flex; align-items: center; gap: 10px; transition: 0.2s;" onclick="askAsistan('tahsilat')" onmouseover="this.style.background='rgba(99,102,241,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                    <i class='bx bx-wallet' style='color:var(--primary)'></i> Bu ay ne kadar tahsilat yaptım?
                </button>
                <button class="btn" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); color: #fff; padding: 14px; border-radius: 12px; font-size: 14px; text-align: left; justify-content: flex-start; display: flex; align-items: center; gap: 10px; transition: 0.2s;" onclick="askAsistan('giris')" onmouseover="this.style.background='rgba(99,102,241,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                    <i class='bx bx-credit-card' style='color:var(--primary)'></i> Bu ayki toplam kasa ve banka girişim nedir?
                </button>
                <button class="btn" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); color: #fff; padding: 14px; border-radius: 12px; font-size: 14px; text-align: left; justify-content: flex-start; display: flex; align-items: center; gap: 10px; transition: 0.2s;" onclick="askAsistan('musteri')" onmouseover="this.style.background='rgba(99,102,241,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                    <i class='bx bx-group' style='color:var(--primary)'></i> Bu ay kaç tekil müşteri alışveriş yaptı?
                </button>
            </div>
            
            <div id="asistanResult" style="display: none; width: 100%; margin-top: 15px; padding: 18px; border-radius: 12px; background: rgba(99,102,241,0.05); border: 1px solid rgba(99,102,241,0.15); text-align: left; line-height: 1.5; color: #fff;" class="fade-in">
                <!-- Response will appear here -->
            </div>
            
            <span style="font-size: 11px; color: var(--text-secondary); margin-top: 10px;">
                MücahitSaaS asistan deneysel bir üründür, lütfen sonuçları doğrulayın.
            </span>
        </div>
    `;
}

function askAsistan(topic) {
    const resultDiv = document.getElementById('asistanResult');
    if (!resultDiv) return;
    
    let responseText = '';
    
    // Simple calculations based on mockData
    let totalGelir = 0;
    let totalGider = 0;
    let totalTahsilat = 0;
    let uniqueCustomers = new Set();
    
    mockData.faturalar.forEach(f => {
        const amt = parseFloat(f.genel_toplam || f.tutar) || 0;
        if (f.tur === 'Satış') {
            totalGelir += amt;
            uniqueCustomers.add(f.cari.toLowerCase().trim());
            if (f.durum !== 'Ödendi') {
                totalTahsilat += amt;
            }
        } else if (f.tur === 'Alış') {
            totalGider += amt;
        }
    });

    let totalKasaInput = mockData.kasalar.reduce((a, b) => a + (parseFloat(b.bakiye) || 0), 0);

    if (topic === 'ciro') {
        responseText = `🤖 <strong>MücahitSaaS Asistan:</strong> Bu ayki toplam cironuz (satış faturalarınızın genel toplamı) <strong>\${formatMoney(totalGelir)}</strong> olarak hesaplanmıştır.`;
    } else if (topic === 'kar') {
        const netKar = totalGelir - totalGider;
        responseText = `🤖 <strong>MücahitSaaS Asistan:</strong> Bu ayki net kârınız (Gelir: \${formatMoney(totalGelir)} - Gider: \${formatMoney(totalGider)}) <strong>\${formatMoney(netKar)}</strong> olarak hesaplanmıştır.`;
    } else if (topic === 'tahsilat') {
        responseText = `🤖 <strong>MücahitSaaS Asistan:</strong> Bu ay henüz tahsil edilmemiş (bekleyen) toplam fatura tutarınız <strong>\${formatMoney(totalTahsilat)}</strong> olarak görünmektedir.`;
    } else if (topic === 'giris') {
        responseText = `🤖 <strong>MücahitSaaS Asistan:</strong> Kasa ve banka hesaplarınızda bulunan güncel toplam mevduat/bakiye <strong>\${formatMoney(totalKasaInput)}</strong> olarak hesaplanmıştır.`;
    } else if (topic === 'musteri') {
        responseText = `🤖 <strong>MücahitSaaS Asistan:</strong> Bu ay fatura kesilmiş toplam <strong>\${uniqueCustomers.size} adet tekil müşteri</strong> alışveriş yapmıştır.`;
    }
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = responseText;
}

function renderDashboard(container) {
    let gelir = 0, gider = 0, tahsilat = 0, tahsilatAdet = 0;
    mockData.faturalar.forEach(f => {
        const total = parseFloat(f.genel_toplam || f.tutar) || 0;
        if(f.tur === 'Satış' && f.durum === 'Ödendi') gelir += total;
        if(f.tur === 'Satış' && f.durum !== 'Ödendi') { tahsilat += total; tahsilatAdet++; }
        if(f.tur === 'Alış') gider += total;
    });

    // Check upcoming Cheques / Notes
    let upcomingCekAlertHTML = '';
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const upcomingCeks = mockData.cekSenetler.filter(c => {
        if (c.durum !== 'Portföyde') return false;
        const vDate = new Date(c.vade_tarihi);
        return vDate >= today && vDate <= nextWeek;
    });

    if (upcomingCeks.length > 0) {
        upcomingCekAlertHTML = `
            <div style="background:linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15)); border:1px solid rgba(245, 158, 11, 0.3); border-radius:14px; padding:15px; margin-bottom:20px; display:flex; align-items:center; gap:12px; animation: fadeIn 0.4s ease;">
                <i class='bx bx-alarm-exclamation' style='font-size:24px; color:var(--warning);'></i>
                <div style="flex:1; font-size:13px; color:var(--text-primary);">
                    <strong>Vadesi Yaklaşan Evraklar Var!</strong> Önümüzdeki 7 gün içerisinde vadesi gelen <strong>${upcomingCeks.length} adet</strong> çek/senet bulunuyor. Detaylar için Çek & Senet sekmesini ziyaret edin.
                </div>
                <button class="btn btn-sm" onclick="loadPage('cekSenetler')" style="background:rgba(255,255,255,0.05); color:#fff; border:1px solid var(--border-light);">İncele</button>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">Finansal Özet</h1>
                <p style="color:var(--text-secondary)">MücahitSaaS Yönetim Paneli</p>
            </div>
            <button class="btn btn-primary" onclick="downloadFaturalarCSV()"><i class='bx bx-cloud-download'></i> Rapor İndir</button>
        </div>

        ${getTickerBandHTML()}
        
        ${upcomingCekAlertHTML}

        <div class="stats-grid fade-in" style="animation-delay: 0.1s">
            <div class="stat-card glass-panel c-primary">
                <div class="stat-header"><span>Toplam Gelir (Tahsil Edilen)</span><div class="stat-icon"><i class='bx bx-wallet'></i></div></div>
                <div class="stat-value">${formatMoney(gelir)}</div>
            </div>
            <div class="stat-card glass-panel c-warning">
                <div class="stat-header"><span>Bekleyen Tahsilat</span><div class="stat-icon"><i class='bx bx-time'></i></div></div>
                <div class="stat-value">${formatMoney(tahsilat)}</div>
                <div style="font-size:13px; color:var(--text-secondary)">${tahsilatAdet} adet açık fatura</div>
            </div>
            <div class="stat-card glass-panel c-danger">
                <div class="stat-header"><span>Toplam Gider</span><div class="stat-icon"><i class='bx bx-trending-down'></i></div></div>
                <div class="stat-value">${formatMoney(gider)}</div>
            </div>
        </div>

        <div class="dashboard-grid fade-in" style="animation-delay: 0.2s; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
            <div class="glass-panel chart-container" style="height: 380px; display: flex; flex-direction: column;">
                <div class="table-header" style="flex-shrink: 0; margin-bottom: 10px;"><h3>Nakit Akışı (Gelir vs Gider)</h3></div>
                <div style="position: relative; flex: 1; min-height: 0; width: 100%;">
                    <canvas id="financeChart"></canvas>
                </div>
            </div>
            
            <div class="glass-panel chart-container" style="height: 380px; display:flex; flex-direction:column; justify-content:space-between; position:relative;">
                <div class="table-header" style="margin-bottom:0;"><h3>Kasa & Banka Dağılımı</h3></div>
                <div style="position:relative; flex:1; min-height:0; display:flex; align-items:center; justify-content:center;">
                    <canvas id="pieChart"></canvas>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -60%); text-align: center; pointer-events: none; display:flex; flex-direction:column; gap:2px;">
                        <span style="font-size: 20px; font-weight: 800; color: #fff;" id="pieChartCenterVal">0.00 ₺</span>
                        <span style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Toplam Bakiye</span>
                    </div>
                </div>
            </div>

            <div class="glass-panel chart-container" style="height: 380px; display:flex; flex-direction:column; justify-content:space-between; position:relative;">
                <div class="table-header" style="margin-bottom:0;"><h3>Gider Dağılımı (Kategori)</h3></div>
                <div style="position:relative; flex:1; min-height:0; display:flex; align-items:center; justify-content:center;">
                    <canvas id="categoryChart"></canvas>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -60%); text-align: center; pointer-events: none; display:flex; flex-direction:column; gap:2px;">
                        <span style="font-size: 20px; font-weight: 800; color: #fff;" id="categoryChartCenterVal">0.00 ₺</span>
                        <span style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Toplam Gider</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="dashboard-grid fade-in" style="animation-delay: 0.3s; grid-template-columns: 1fr; margin-top: 24px;">
            <div class="glass-panel table-container">
                <div class="table-header"><h3>Son İşlemler</h3></div>
                <table>
                    <thead><tr><th>Cari</th><th>Tutar</th><th>Durum</th></tr></thead>
                    <tbody>
                        ${mockData.faturalar.length === 0 ? '<tr><td colspan="3" style="text-align:center;">Henüz veri yok</td></tr>' : 
                          mockData.faturalar.slice(-4).reverse().map(f => `
                            <tr>
                                <td style="font-weight:600">${f.cari}</td>
                                <td>${formatMoney(f.genel_toplam || f.tutar)}</td>
                                <td><span class="status-badge status-${f.durum === 'Ödendi' ? 'success' : (f.durum === 'Ödenmedi' ? 'warning' : 'danger')}">${f.durum}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setTimeout(() => {
        const isLightTheme = document.body.classList.contains('light-theme');
        const chartTextColor = isLightTheme ? '#475569' : '#cbd5e1';
        const chartGridColor = isLightTheme ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)';

        // Set global Chart.js defaults to ensure all text elements (including legend and axes) use the correct theme color
        if (typeof Chart !== 'undefined') {
            Chart.defaults.color = chartTextColor;
            Chart.defaults.borderColor = chartGridColor;
            
            // Set scale ticks and grid default color (v3/v4)
            if (Chart.defaults.scale) {
                if (Chart.defaults.scale.ticks) Chart.defaults.scale.ticks.color = chartTextColor;
                if (Chart.defaults.scale.grid) Chart.defaults.scale.grid.color = chartGridColor;
            }
            
            // Set legend default color (v3/v4)
            if (Chart.defaults.plugins && Chart.defaults.plugins.legend && Chart.defaults.plugins.legend.labels) {
                Chart.defaults.plugins.legend.labels.color = chartTextColor;
            }
            
            // Fallbacks for older Chart.js versions (v2) just in case
            if (Chart.defaults.global) {
                Chart.defaults.global.defaultFontColor = chartTextColor;
                Chart.defaults.global.defaultLineColor = chartGridColor;
            }
        }

        const ctx = document.getElementById('financeChart');
        if (ctx) {
            if (FINANCE_CHART) FINANCE_CHART.destroy();
            const monthlyData = getMonthlyFinanceData();
            
            const gradientGelir = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
            gradientGelir.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
            gradientGelir.addColorStop(1, 'rgba(99, 102, 241, 0.2)');

            const gradientGider = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
            gradientGider.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
            gradientGider.addColorStop(1, 'rgba(236, 72, 153, 0.2)');

            FINANCE_CHART = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
                    datasets: [
                        {
                            label: 'Gelirler',
                            data: monthlyData.monthlyGelir,
                            backgroundColor: gradientGelir,
                            borderRadius: 6,
                            barPercentage: 0.6
                        },
                        {
                            label: 'Giderler',
                            data: monthlyData.monthlyGider,
                            backgroundColor: gradientGider,
                            borderRadius: 6,
                            barPercentage: 0.6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: true, labels: { color: chartTextColor } } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: chartTextColor } },
                        y: { 
                            grid: { color: chartGridColor }, 
                            ticks: { color: chartTextColor },
                            suggestedMax: 10000,
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        const pieCtx = document.getElementById('pieChart');
        if (pieCtx) {
            if (PIE_CHART) PIE_CHART.destroy();
            
            const labels = mockData.kasalar.map(k => k.ad);
            const data = mockData.kasalar.map(k => k.bakiye);
            const bgColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
            
            const totalBakiye = data.reduce((a, b) => a + b, 0);
            const isAllZero = data.length === 0 || data.every(v => v === 0);

            // Update center absolute div val
            const centerEl = document.getElementById('pieChartCenterVal');
            if (centerEl) {
                centerEl.innerText = formatMoney(totalBakiye);
            }

            PIE_CHART = new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: isAllZero ? ['Bakiye Yok'] : labels,
                    datasets: [{
                        data: isAllZero ? [1] : data,
                        backgroundColor: isAllZero ? ['rgba(255,255,255,0.06)'] : bgColors.slice(0, data.length),
                        borderWidth: 0,
                        hoverOffset: isAllZero ? 0 : 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: { 
                        legend: { position: 'bottom', labels: { color: chartTextColor } } 
                    }
                }
            });
        }

        const categoryCtx = document.getElementById('categoryChart');
        if (categoryCtx) {
            if (CATEGORY_CHART) CATEGORY_CHART.destroy();
            
            const catMap = {
                "Kira": 0,
                "Fatura / Abonelik": 0,
                "Personel / Maaş": 0,
                "Pazarlama / Reklam": 0,
                "Ofis Giderleri": 0,
                "Diğer": 0
            };
            mockData.faturalar.forEach(f => {
                if (f.tur === 'Alış') {
                    const amt = parseFloat(f.genel_toplam || f.tutar) || 0;
                    const cat = f.kategori || "Diğer";
                    if (catMap[cat] !== undefined) {
                        catMap[cat] += amt;
                    } else {
                        catMap["Diğer"] += amt;
                    }
                }
            });

            const labels = Object.keys(catMap);
            const data = Object.values(catMap);
            const bgColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'];

            const totalExpense = data.reduce((a, b) => a + b, 0);
            const isAllZero = data.length === 0 || data.every(v => v === 0);

            // Update center absolute div val
            const centerEl = document.getElementById('categoryChartCenterVal');
            if (centerEl) {
                centerEl.innerText = formatMoney(totalExpense);
            }

            CATEGORY_CHART = new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: isAllZero ? ['Gider Yok'] : labels,
                    datasets: [{
                        data: isAllZero ? [1] : data,
                        backgroundColor: isAllZero ? ['rgba(255,255,255,0.06)'] : bgColors,
                        borderWidth: 0,
                        hoverOffset: isAllZero ? 0 : 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: { 
                        legend: { position: 'bottom', labels: { color: chartTextColor } } 
                    }
                }
            });
        }
    }, 100);
}

function renderCariler(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Cari Hesaplar</h1><p style="color:var(--text-secondary)">Müşteri ve tedarikçi yönetimi (Detay için unvana tıklayın)</p></div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-primary btn-sm" onclick="downloadCarilerCSV()"><i class='bx bx-download'></i> Listeyi İndir</button>
                <button class="btn btn-primary btn-sm" onclick="openModal('cari')"><i class='bx bx-plus'></i> Yeni Cari Ekle</button>
            </div>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Ünvan</th><th>Tür</th><th>Bakiye Durumu</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.cariler.length === 0 ? '<tr><td colspan="4" style="text-align:center;">Henüz veri eklenmedi.</td></tr>' : 
                      mockData.cariler.map((c, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary); cursor:pointer;" onclick="viewCariDetail('${c.unvan}')" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-primary)'">
                                <i class='bx bx-user-pin' style="margin-right:8px; color:var(--primary);"></i>${c.unvan}
                            </td>
                            <td>${c.tur}</td>
                            <td style="font-weight:600; color:${c.bakiye >= 0 ? 'var(--success)' : 'var(--danger)'}">${formatMoney(Math.abs(c.bakiye))} ${c.bakiye >= 0 ? '(Alacaklı)' : '(Borçlu)'}</td>
                            <td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('cariler', ${i})"><i class='bx bx-trash'></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderUrunler(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Ürün ve Hizmetler</h1><p style="color:var(--text-secondary)">Stok ve hizmet kartı yönetimi</p></div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-primary btn-sm" onclick="downloadUrunlerCSV()"><i class='bx bx-download'></i> Listeyi İndir</button>
                <button class="btn btn-primary btn-sm" onclick="openModal('topluUrun')"><i class='bx bx-upload'></i> Toplu Ürün Yükle</button>
                <button class="btn btn-primary btn-sm" onclick="openModal('urun')"><i class='bx bx-plus'></i> Yeni Ürün Ekle</button>
            </div>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Kod</th><th>Ürün/Hizmet Adı</th><th>Fiyat</th><th>Stok</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.urunler.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Henüz veri eklenmedi.</td></tr>' : 
                      mockData.urunler.map((u, i) => `
                        <tr>
                            <td style="color:var(--text-secondary)">${u.kod}</td>
                            <td style="font-weight:600; color:var(--text-primary);">${u.ad}</td>
                            <td style="color:var(--primary); font-weight:600">${formatMoney(u.fiyat)}</td>
                            <td>${u.stok}</td>
                            <td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('urunler', ${i})"><i class='bx bx-trash'></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderFaturalar(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Faturalar</h1><p style="color:var(--text-secondary)">Kesilen ve alınan faturalar</p></div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-primary btn-sm" onclick="downloadFaturalarCSV()"><i class='bx bx-download'></i> Rapor İndir</button>
                <button class="btn btn-primary btn-sm" onclick="openModal('fatura')"><i class='bx bx-plus'></i> Fatura Oluştur</button>
            </div>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Tarih</th><th>Tür</th><th>Cari</th><th>Net Tutar</th><th>Genel Toplam (KDV Dahil)</th><th>Durum</th><th>İşlemler</th></tr></thead>
                <tbody>
                    ${mockData.faturalar.length === 0 ? '<tr><td colspan="7" style="text-align:center;">Henüz veri eklenmedi.</td></tr>' : 
                      mockData.faturalar.map((f, i) => `
                        <tr>
                            <td style="color:var(--text-secondary)">${f.tarih}</td>
                            <td>${f.tur}</td>
                            <td>${f.cari}</td>
                            <td>${formatMoney(f.tutar)}</td>
                            <td style="font-weight:600; color:var(--text-primary);">${formatMoney(f.genel_toplam || f.tutar)}</td>
                            <td><span class="status-badge status-${f.durum === 'Ödendi' ? 'success' : (f.durum === 'Ödenmedi' ? 'warning' : 'danger')}">${f.durum}</span></td>
                            <td style="display:flex; gap:6px; flex-wrap:wrap;">
                                <button class="btn btn-sm" style="background:var(--primary);color:#fff" onclick="printInvoice(${i})"><i class='bx bx-printer'></i> Detay / Yazdır</button>
                                ${f.tur === 'Satış' && f.durum === 'Ödenmedi' ? `
                                    <button class="btn btn-sm" style="background:var(--success);color:#fff" onclick="openSanalPos(${i})"><i class='bx bx-credit-card'></i> Ödeme Al</button>
                                ` : ''}
                                <button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('faturalar', ${i})"><i class='bx bx-trash'></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderTickets(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Destek Talepleri</h1></div>
            <button class="btn btn-primary" onclick="openModal('ticket')"><i class='bx bx-plus'></i> Ticket Aç</button>
        </div>
        <div class="glass-panel table-container fade-in">
            <table>
                <thead><tr><th>Konu</th><th>Öncelik</th><th>Durum</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.tickets.length === 0 ? '<tr><td colspan="4" style="text-align:center;">Talep bulunmuyor.</td></tr>' : 
                      mockData.tickets.map((t, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);">${t.konu}</td>
                            <td><span style="color:${t.oncelik === 'Yüksek' ? 'var(--danger)' : 'var(--success)'}">${t.oncelik}</span></td>
                            <td><span class="status-badge status-${t.durum === 'Çözüldü' ? 'success' : 'warning'}">${t.durum}</span></td>
                            <td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('tickets', ${i})"><i class='bx bx-trash'></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderTakvim(container) {
    const MONTHS_TR = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    
    // Month options
    let monthOptions = MONTHS_TR.map((m, idx) => `<option value="${idx}" ${idx === CALENDAR_MONTH ? 'selected' : ''}>${m}</option>`).join('');
    
    // Year options (from 2024 to 2032)
    let yearOptions = '';
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 3; y <= currentYear + 5; y++) {
        yearOptions += `<option value="${y}" ${y === CALENDAR_YEAR ? 'selected' : ''}>${y}</option>`;
    }

    let html = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">Takvim ve Ajanda</h1>
                <p style="color:var(--text-secondary)">Önemli tarihler ve notlar</p>
            </div>
            <button class="btn btn-primary" onclick="document.getElementById('noteInput').focus()"><i class='bx bx-plus'></i> Not Ekle</button>
        </div>
        
        <div class="dashboard-grid fade-in" style="animation-delay: 0.1s; grid-template-columns: 1.5fr 1fr;">
            <!-- Calendar Section -->
            <div class="glass-panel" style="padding: 24px;">
                <div class="calendar-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:10px; flex-wrap:wrap;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button class="icon-btn" onclick="prevMonth()" style="width:36px; height:36px; border-radius:10px;"><i class='bx bx-chevron-left'></i></button>
                        <button class="icon-btn" onclick="nextMonth()" style="width:36px; height:36px; border-radius:10px;"><i class='bx bx-chevron-right'></i></button>
                        <button class="btn btn-sm" onclick="goToday()" style="background:rgba(255,255,255,0.05); color:#fff; border:1px solid var(--border-light); border-radius:10px; padding: 6px 12px; font-size:13px; font-weight:500;">Bugün</button>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <select id="selectMonth" onchange="changeCalendarMonthYear()" style="padding:8px 12px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid var(--border-light); border-radius:10px; outline:none; font-family:var(--font-heading); font-weight:500; cursor:pointer;">
                            ${monthOptions}
                        </select>
                        <select id="selectYear" onchange="changeCalendarMonthYear()" style="padding:8px 12px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid var(--border-light); border-radius:10px; outline:none; font-family:var(--font-heading); font-weight:500; cursor:pointer;">
                            ${yearOptions}
                        </select>
                    </div>
                </div>
                
                <div id="calendarGrid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-top: 10px;">
                    <!-- Calendar days will be generated here -->
                </div>
            </div>
            
            <!-- Notes Section -->
            <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between; min-height: 480px;">
                <div>
                    <div class="table-header" style="margin-bottom: 15px;"><h3 id="selectedDateTitle">Seçili Tarih Notları</h3></div>
                    <div id="notesList" style="display:flex; flex-direction:column; gap:12px; overflow-y:auto; max-height:280px; padding-right:5px;">
                        <!-- Notes will be listed here -->
                    </div>
                </div>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-light);">
                    <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                        <div style="flex: 1; position: relative;">
                            <i class='bx bx-calendar' style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); font-size: 16px;"></i>
                            <input type="date" id="noteDate" style="width:100%; padding:10px 10px 10px 32px; border-radius:8px; border:1px solid var(--border-light); background:rgba(0,0,0,0.3); color:#fff; outline:none; font-size:13px;">
                        </div>
                    </div>
                    <div style="position: relative; margin-bottom: 10px;">
                        <i class='bx bx-edit-alt' style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); font-size: 16px;"></i>
                        <input type="text" id="noteInput" placeholder="Yeni not ekle..." style="width:100%; padding:10px 10px 10px 32px; border-radius:8px; border:1px solid var(--border-light); background:rgba(0,0,0,0.3); color:#fff; outline:none; font-size:13px;">
                    </div>
                    <button class="btn btn-primary w-100" style="padding: 10px; font-size:14px; border-radius:8px;" onclick="addNote()">Notu Kaydet</button>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
    
    updateCalendarGrid();
    selectDate(SELECTED_DATE);
}

function formatTurkishDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIndex = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const months = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    return `${day} ${months[monthIndex]} ${year}`;
}

function updateCalendarGrid() {
    const calGrid = document.getElementById('calendarGrid');
    if (!calGrid) return;
    
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    let calHtml = days.map(d => `<div style="text-align:center; font-weight:bold; color:var(--text-secondary); margin-bottom:10px; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">${d}</div>`).join('');
    
    let daysInMonth = new Date(CALENDAR_YEAR, CALENDAR_MONTH + 1, 0).getDate();
    let firstDayIndex = new Date(CALENDAR_YEAR, CALENDAR_MONTH, 1).getDay();
    let paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    // Previous month's trailing days
    let prevMonthYear = CALENDAR_MONTH === 0 ? CALENDAR_YEAR - 1 : CALENDAR_YEAR;
    let prevMonth = CALENDAR_MONTH === 0 ? 11 : CALENDAR_MONTH - 1;
    let prevMonthDays = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    
    for (let i = paddingDays - 1; i >= 0; i--) {
        let prevDay = prevMonthDays - i;
        let dateStr = `${prevMonthYear}-${(prevMonth + 1).toString().padStart(2, '0')}-${prevDay.toString().padStart(2, '0')}`;
        let hasNote = mockData.takvimNotlari[dateStr] ? '<div class="note-dot" style="width:6px;height:6px;background:var(--success);border-radius:50%;margin:4px auto 0; box-shadow: 0 0 8px var(--success); transition: 0.2s;"></div>' : '';
        
        calHtml += `
            <div onclick="changeMonthAndSelectDate(${prevMonthYear}, ${prevMonth}, '${dateStr}')" 
                 class="calendar-day-cell"
                 data-date="${dateStr}"
                 data-other-month="true"
                 style="cursor:pointer; padding:15px 5px; text-align:center; border-radius:12px; background:rgba(255,255,255,0.01); border:1px solid var(--border-light); transition:0.2s; color:rgba(255,255,255,0.25);" 
                 onmouseover="this.style.background='rgba(255,255,255,0.05)'" 
                 onmouseout="if(this.dataset.date !== SELECTED_DATE) this.style.background='rgba(255,255,255,0.01)'">
                <span style="font-size:15px; font-weight:400;">${prevDay}</span>
                ${hasNote}
            </div>
        `;
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        let dateStr = `${CALENDAR_YEAR}-${(CALENDAR_MONTH + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        let hasNote = mockData.takvimNotlari[dateStr] ? '<div class="note-dot" style="width:6px;height:6px;background:var(--success);border-radius:50%;margin:4px auto 0; box-shadow: 0 0 8px var(--success); transition: 0.2s;"></div>' : '';
        
        let isSelected = dateStr === SELECTED_DATE;
        let isToday = dateStr === new Date().toISOString().split('T')[0];
        let bgStyle = isSelected ? 'linear-gradient(135deg, var(--primary), var(--primary-hover))' : 'rgba(255,255,255,0.03)';
        let borderStyle = isSelected ? '1px solid var(--primary)' : (isToday ? '1px solid var(--secondary)' : '1px solid var(--border-light)');
        let shadowStyle = isSelected ? 'box-shadow: 0 0 15px var(--primary-glow);' : '';
        let textColor = isSelected ? '#fff' : (isToday ? 'var(--secondary)' : '#fff');
        
        calHtml += `
            <div onclick="selectDate('${dateStr}')" 
                 class="calendar-day-cell"
                 data-date="${dateStr}"
                 data-other-month="false"
                 style="cursor:pointer; padding:15px 5px; text-align:center; border-radius:12px; background:${bgStyle}; border:${borderStyle}; ${shadowStyle} transition:0.2s; color:${textColor};" 
                 onmouseover="if(this.dataset.date !== SELECTED_DATE) this.style.background='rgba(99,102,241,0.2)'" 
                 onmouseout="if(this.dataset.date !== SELECTED_DATE) this.style.background='rgba(255,255,255,0.03)'">
                <span style="font-size:16px; font-weight:500;">${i}</span>
                ${hasNote}
            </div>
        `;
    }
    
    // Next month's trailing days (to fill up 42 cells)
    let totalCells = paddingDays + daysInMonth;
    let remainingCells = 42 - totalCells;
    let nextMonthYear = CALENDAR_MONTH === 11 ? CALENDAR_YEAR + 1 : CALENDAR_YEAR;
    let nextMonth = CALENDAR_MONTH === 11 ? 0 : CALENDAR_MONTH + 1;
    
    for (let i = 1; i <= remainingCells; i++) {
        let dateStr = `${nextMonthYear}-${(nextMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        let hasNote = mockData.takvimNotlari[dateStr] ? '<div class="note-dot" style="width:6px;height:6px;background:var(--success);border-radius:50%;margin:4px auto 0; box-shadow: 0 0 8px var(--success); transition: 0.2s;"></div>' : '';
        
        calHtml += `
            <div onclick="changeMonthAndSelectDate(${nextMonthYear}, ${nextMonth}, '${dateStr}')" 
                 class="calendar-day-cell"
                 data-date="${dateStr}"
                 data-other-month="true"
                 style="cursor:pointer; padding:15px 5px; text-align:center; border-radius:12px; background:rgba(255,255,255,0.01); border:1px solid var(--border-light); transition:0.2s; color:rgba(255,255,255,0.25);" 
                 onmouseover="this.style.background='rgba(255,255,255,0.05)'" 
                 onmouseout="if(this.dataset.date !== SELECTED_DATE) this.style.background='rgba(255,255,255,0.01)'">
                <span style="font-size:15px; font-weight:400;">${i}</span>
                ${hasNote}
            </div>
        `;
    }
    
    calGrid.innerHTML = calHtml;
}

function changeCalendarMonthYear() {
    CALENDAR_MONTH = parseInt(document.getElementById('selectMonth').value);
    CALENDAR_YEAR = parseInt(document.getElementById('selectYear').value);
    updateCalendarGrid();
}

function prevMonth() {
    CALENDAR_MONTH--;
    if (CALENDAR_MONTH < 0) {
        CALENDAR_MONTH = 11;
        CALENDAR_YEAR--;
    }
    const selectMonth = document.getElementById('selectMonth');
    const selectYear = document.getElementById('selectYear');
    if (selectMonth && selectYear) {
        selectMonth.value = CALENDAR_MONTH;
        selectYear.value = CALENDAR_YEAR;
    }
    updateCalendarGrid();
}

function nextMonth() {
    CALENDAR_MONTH++;
    if (CALENDAR_MONTH > 11) {
        CALENDAR_MONTH = 0;
        CALENDAR_YEAR++;
    }
    const selectMonth = document.getElementById('selectMonth');
    const selectYear = document.getElementById('selectYear');
    if (selectMonth && selectYear) {
        selectMonth.value = CALENDAR_MONTH;
        selectYear.value = CALENDAR_YEAR;
    }
    updateCalendarGrid();
}

function goToday() {
    const today = new Date();
    CALENDAR_YEAR = today.getFullYear();
    CALENDAR_MONTH = today.getMonth();
    SELECTED_DATE = today.toISOString().split('T')[0];
    
    const selectMonth = document.getElementById('selectMonth');
    const selectYear = document.getElementById('selectYear');
    if (selectMonth && selectYear) {
        selectMonth.value = CALENDAR_MONTH;
        selectYear.value = CALENDAR_YEAR;
    }
    
    updateCalendarGrid();
    selectDate(SELECTED_DATE);
}

function changeMonthAndSelectDate(year, month, dateStr) {
    CALENDAR_YEAR = year;
    CALENDAR_MONTH = month;
    SELECTED_DATE = dateStr;
    
    const selectMonth = document.getElementById('selectMonth');
    const selectYear = document.getElementById('selectYear');
    if (selectMonth && selectYear) {
        selectMonth.value = CALENDAR_MONTH;
        selectYear.value = CALENDAR_YEAR;
    }
    
    updateCalendarGrid();
    selectDate(dateStr);
}

function selectDate(dateStr) {
    SELECTED_DATE = dateStr;
    
    const allDays = document.querySelectorAll('.calendar-day-cell');
    allDays.forEach(cell => {
        if (cell.dataset.date === dateStr) {
            cell.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-hover))';
            cell.style.border = '1px solid var(--primary)';
            cell.style.boxShadow = '0 0 15px var(--primary-glow)';
            cell.style.color = '#fff';
            
            const dot = cell.querySelector('.note-dot');
            if (dot) {
                dot.style.background = '#fff';
                dot.style.boxShadow = '0 0 8px #fff';
            }
        } else {
            const isToday = cell.dataset.date === new Date().toISOString().split('T')[0];
            const isOtherMonth = cell.dataset.otherMonth === 'true';
            
            cell.style.background = isOtherMonth ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)';
            cell.style.border = isToday ? '1px solid var(--secondary)' : '1px solid var(--border-light)';
            cell.style.boxShadow = 'none';
            cell.style.color = isOtherMonth ? 'rgba(255,255,255,0.25)' : (isToday ? 'var(--secondary)' : '#fff');
            
            const dot = cell.querySelector('.note-dot');
            if (dot) {
                dot.style.background = 'var(--success)';
                dot.style.boxShadow = '0 0 8px var(--success)';
            }
        }
    });

    const selectedDateTitle = document.getElementById('selectedDateTitle');
    if (selectedDateTitle) selectedDateTitle.innerText = `${formatTurkishDate(dateStr)} Notları`;
    
    const noteDateInput = document.getElementById('noteDate');
    if (noteDateInput) noteDateInput.value = dateStr;
    
    const notesList = document.getElementById('notesList');
    if (notesList) {
        const notes = mockData.takvimNotlari[dateStr] || [];
        if(notes.length === 0) {
            notesList.innerHTML = '<div style="color:var(--text-secondary); font-size:14px; text-align:center; padding:20px;">Bu tarihe ait not bulunmuyor.</div>';
        } else {
            notesList.innerHTML = notes.map((n, idx) => `
                <div style="padding:12px 16px; background:rgba(255,255,255,0.05); border-left:3px solid var(--primary); border-radius:8px; display:flex; justify-content:space-between; align-items:center; gap: 10px;">
                    <span style="font-size:14px; word-break: break-word;">${n}</span>
                    <i class='bx bx-trash' style="color:var(--danger); cursor:pointer; font-size:16px; transition: 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'" onclick="deleteNote('${dateStr}', ${idx})"></i>
                </div>
            `).join('');
        }
    }
}

function getLicenseStatus() {
    const key = localStorage.getItem('saas_license_key') || '';
    if (!key) {
        return { active: false, type: 'Demo Sürüm', text: 'Lisanssız - Ticari Kullanım Yasaktır', color: 'var(--danger)', icon: 'bx-shield-x' };
    }
    // Check if key is valid (must start with MS- and be at least 12 chars, or contain UNLOCKED)
    if (key.startsWith('MS-') || key.includes('UNLOCKED') || key.length >= 12) {
        return { active: true, type: 'Kurumsal Lisans', text: 'Lisans Etkinleştirildi (Sınırsız Ticari Lisans)', color: 'var(--success)', icon: 'bx-shield-quarter' };
    }
    return { active: false, type: 'Geçersiz Lisans', text: 'Hatalı veya Süresi Dolmuş Lisans Anahtarı', color: 'var(--danger)', icon: 'bx-error-circle' };
}

function applyBranding() {
    const appName = localStorage.getItem('saas_app_name') || 'MücahitSaaS';
    const slogan = localStorage.getItem('saas_company_slogan') || 'Geleceğin Finans Yönetimi';
    
    // Update Document Title
    document.title = appName + " | " + slogan;
    
    // Update Sidebar Logo
    const logoEl = document.getElementById('sidebarLogo');
    if (logoEl) {
        if (appName.toLowerCase().endsWith('saas')) {
            const base = appName.substring(0, appName.length - 4);
            logoEl.innerHTML = `<i class='bx bx-cube-alt'></i><span>${base}<span class="pro">SaaS</span></span>`;
        } else {
            logoEl.innerHTML = `<i class='bx bx-cube-alt'></i><span>${appName}</span>`;
        }
    }
}

function renderAyarlar(container) {
    const currentEmail = localStorage.getItem('user_email') || 'demo@kullanici.com';
    const appName = localStorage.getItem('saas_app_name') || 'MücahitSaaS';
    const companyName = localStorage.getItem('saas_company_name') || 'MücahitSaaS Ltd. Şti.';
    const companySlogan = localStorage.getItem('saas_company_slogan') || 'Geleceğin Finans Yönetimi';
    const companyAddress = localStorage.getItem('saas_company_address') || 'Hürriyet Mah. Hürriyet Cad. No:12 D:4, İstanbul';
    const companyPhone = localStorage.getItem('saas_company_phone') || '+90 216 123 45 67';
    const companyTaxOffice = localStorage.getItem('saas_company_tax_office') || 'Kadıköy';
    const companyTaxNo = localStorage.getItem('saas_company_tax_no') || '1234567890';
    const licenseKey = localStorage.getItem('saas_license_key') || 'DEMO-UNLOCKED-2026';
    
    // Supabase URL & Key default values
    const customUrl = localStorage.getItem('saas_supabase_url');
    const customKey = localStorage.getItem('saas_supabase_key');
    const supabaseUrl = customUrl !== null ? customUrl : "https://qjnqehrcybnlxxrzkykn.supabase.co";
    const supabaseKey = customKey !== null ? customKey : "sb_publishable_8CPQD1mEl6pl9j85Om7XqQ_v0aSAnWE";

    const license = getLicenseStatus();

    // Check database status
    let dbStatusHTML = '';
    if (supabase) {
        dbStatusHTML = `<span class="status-badge status-success" style="padding: 4px 10px; font-size:11px;">ÇEVRİMİÇİ (SUPABASE BULUT)</span>`;
    } else {
        dbStatusHTML = `<span class="status-badge status-warning" style="padding: 4px 10px; font-size:11px;">ÇEVRİMDIŞI (YEREL LOCALSTORAGE)</span>`;
    }

    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">Sistem & Lisans Ayarları</h1>
                <p style="color:var(--text-secondary)">White-Label marka, lisans ve veritabanı ayarları</p>
            </div>
            <button class="btn btn-primary" onclick="saveSettings()"><i class='bx bx-save'></i> Tüm Ayarları Kaydet</button>
        </div>
        
        <div class="settings-grid fade-in">
            <!-- 1. PANEL: LİSANS VE GÜVENLİK -->
            <div class="glass-panel settings-panel">
                <h3><i class='bx bx-key' style="color:var(--primary)"></i> Lisans & Ürün Doğrulama</h3>
                <div class="license-status-card">
                    <div class="license-status-icon" style="background:rgba(255,255,255,0.03); color:${license.color};">
                        <i class='bx ${license.icon}'></i>
                    </div>
                    <div>
                        <div style="font-weight:700; font-size:14px; color:#fff;">${license.type}</div>
                        <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${license.text}</div>
                    </div>
                </div>
                <div class="settings-group">
                    <label for="set_license_key">Ürün Lisans Anahtarı</label>
                    <input type="text" id="set_license_key" value="${licenseKey}" placeholder="MS-XXXX-XXXX-XXXX">
                </div>
                <div style="font-size:12px; color:var(--text-secondary); line-height:1.4; padding: 10px; background:rgba(255,255,255,0.01); border-radius:8px;">
                    💡 <strong>Not:</strong> Ticari satış veya white-label dağıtım yaptığınızda, müşteriye bir ürün lisans anahtarı tanımlayarak yazılımı doğrulatabilirsiniz.
                </div>
            </div>

            <!-- 2. PANEL: WHITE-LABEL MARKA VE FİRMA BİLGİLERİ -->
            <div class="glass-panel settings-panel">
                <h3><i class='bx bx-building-house' style="color:var(--primary)"></i> White-Label & Firma Bilgileri</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                    <div class="settings-group">
                        <label for="set_app_name">Uygulama Adı</label>
                        <input type="text" id="set_app_name" value="${appName}">
                    </div>
                    <div class="settings-group">
                        <label for="set_company_slogan">Uygulama Sloganı</label>
                        <input type="text" id="set_company_slogan" value="${companySlogan}">
                    </div>
                </div>
                <div class="settings-group">
                    <label for="set_company_name">Firma Resmi Ünvanı</label>
                    <input type="text" id="set_company_name" value="${companyName}">
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                    <div class="settings-group">
                        <label for="set_company_tax_office">Vergi Dairesi</label>
                        <input type="text" id="set_company_tax_office" value="${companyTaxOffice}">
                    </div>
                    <div class="settings-group">
                        <label for="set_company_tax_no">Vergi Numarası</label>
                        <input type="text" id="set_company_tax_no" value="${companyTaxNo}">
                    </div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                    <div class="settings-group">
                        <label for="set_company_phone">Firma Telefonu</label>
                        <input type="text" id="set_company_phone" value="${companyPhone}">
                    </div>
                    <div class="settings-group">
                        <label for="set_company_address">Firma Adresi</label>
                        <input type="text" id="set_company_address" value="${companyAddress}">
                    </div>
                </div>
            </div>

            <!-- 3. PANEL: VERİTABANI BAĞLANTILARI -->
            <div class="glass-panel settings-panel">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3><i class='bx bx-data' style="color:var(--primary)"></i> Supabase Veritabanı</h3>
                    ${dbStatusHTML}
                </div>
                <p style="font-size:12px; color:var(--text-secondary); margin-top:-10px; line-height:1.4;">
                    Müşterinizin verilerini bulutta yedeklemek ve canlı eşitlemek için kendi Supabase veritabanı parametrelerini girin. Çevrimdışı yerel modda çalıştırmak için alanları tamamen boş bırakıp kaydedin.
                </p>
                <div class="settings-group">
                    <label for="set_supabase_url">Supabase URL</label>
                    <input type="text" id="set_supabase_url" value="${supabaseUrl}" placeholder="https://xxxx.supabase.co">
                </div>
                <div class="settings-group">
                    <label for="set_supabase_key">Supabase Anon Key</label>
                    <input type="password" id="set_supabase_key" value="${supabaseKey}" placeholder="sb_publishable_xxxx">
                </div>
                <div style="font-size:12px; color:var(--warning); line-height:1.4; border:1px solid rgba(245,158,11,0.2); padding:10px; background:rgba(245,158,11,0.03); border-radius:8px;">
                    ⚠️ <strong>Uyarı:</strong> Veritabanı kimlik bilgileri değiştirildiğinde, yeni veritabanı bağlantısının kurulabilmesi için sayfa otomatik olarak yeniden yüklenecektir.
                </div>
            </div>

            <!-- 4. PANEL: HESAP YÖNETİMİ VE TEMİZLİK -->
            <div class="glass-panel settings-panel">
                <h3><i class='bx bx-user' style="color:var(--primary)"></i> Kullanıcı Güvenliği</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                    <div class="settings-group">
                        <label for="set_email">E-posta Adresi</label>
                        <input type="email" id="set_email" value="${currentEmail}">
                    </div>
                    <div class="settings-group">
                        <label for="set_password">Yeni Şifre (İsteğe Bağlı)</label>
                        <input type="password" id="set_password" placeholder="••••••••">
                    </div>
                </div>

                <h3 style="margin-top:20px; border-bottom:1px solid var(--border-light); padding-bottom:10px;"><i class='bx bx-shield-quarter' style="color:var(--danger)"></i> Veritabanı Bakım Araçları</h3>
                <div style="display:flex; gap:12px; margin-top:5px;">
                    <button class="btn btn-primary w-100" onclick="loadDemoData()" style="background:linear-gradient(135deg, var(--success), #047857); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25);"><i class='bx bx-pulse'></i> Demo Veri Yükle</button>
                    <button class="btn btn-primary w-100" onclick="resetDatabase()" style="background:linear-gradient(135deg, var(--danger), #b91c1c); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25);"><i class='bx bx-trash'></i> Fabrika Ayarlarına Sıfırla</button>
                </div>
                <div style="font-size:12px; color:var(--text-secondary); line-height:1.4;">
                    💡 Sıfırlama işlemi tüm test verilerini silip sıfır bakiye ile temiz bir ticari kurulum sağlar. Demo Yükle butonu ise sunum yapabilmek için sistemi örnek verilerle doldurur.
                </div>
            </div>
        </div>
    `;
}

function saveSettings() {
    const newEmail = document.getElementById('set_email').value.trim();
    const newPassword = document.getElementById('set_password').value;
    const newAppName = document.getElementById('set_app_name').value.trim();
    const newCompanySlogan = document.getElementById('set_company_slogan').value.trim();
    const newCompanyName = document.getElementById('set_company_name').value.trim();
    const newCompanyTaxOffice = document.getElementById('set_company_tax_office').value.trim();
    const newCompanyTaxNo = document.getElementById('set_company_tax_no').value.trim();
    const newCompanyPhone = document.getElementById('set_company_phone').value.trim();
    const newCompanyAddress = document.getElementById('set_company_address').value.trim();
    const newLicenseKey = document.getElementById('set_license_key').value.trim();
    const newSupabaseUrl = document.getElementById('set_supabase_url').value.trim();
    const newSupabaseKey = document.getElementById('set_supabase_key').value.trim();

    // Check if Supabase parameters changed
    const oldUrl = localStorage.getItem('saas_supabase_url') !== null ? localStorage.getItem('saas_supabase_url') : "https://qjnqehrcybnlxxrzkykn.supabase.co";
    const oldKey = localStorage.getItem('saas_supabase_key') !== null ? localStorage.getItem('saas_supabase_key') : "sb_publishable_8CPQD1mEl6pl9j85Om7XqQ_v0aSAnWE";

    const dbChanged = (newSupabaseUrl !== oldUrl || newSupabaseKey !== oldKey);

    // Save all to localStorage
    localStorage.setItem('user_email', newEmail);
    localStorage.setItem('saas_app_name', newAppName);
    localStorage.setItem('saas_company_slogan', newCompanySlogan);
    localStorage.setItem('saas_company_name', newCompanyName);
    localStorage.setItem('saas_company_tax_office', newCompanyTaxOffice);
    localStorage.setItem('saas_company_tax_no', newCompanyTaxNo);
    localStorage.setItem('saas_company_phone', newCompanyPhone);
    localStorage.setItem('saas_company_address', newCompanyAddress);
    localStorage.setItem('saas_license_key', newLicenseKey);
    localStorage.setItem('saas_supabase_url', newSupabaseUrl);
    localStorage.setItem('saas_supabase_key', newSupabaseKey);

    // Save new password if provided
    if (newPassword) {
        localStorage.setItem(`user_pwd_${newEmail}`, newPassword);
        if (supabase) {
            // If live Supabase, update it too
            supabase.auth.updateUser({ password: newPassword }).then(({ error }) => {
                if (error) console.error("Supabase password update error:", error);
            });
        }
    }

    // Apply branding changes immediately
    applyBranding();

    // Update sidebar email
    const emailEl = document.getElementById('sidebarUserEmail');
    if (emailEl) emailEl.innerText = newEmail;

    alert('Sistem ayarları başarıyla kaydedildi!');

    // If database settings changed, reload page to re-initialize Supabase client
    if (dbChanged) {
        alert('Veritabanı parametreleri değişti! Değişikliklerin geçerli olması için sayfa yeniden yükleniyor.');
        window.location.reload();
    } else {
        // Redraw current page to update license badges or status
        loadPage(CURRENT_PAGE);
    }
}

function resetDatabase() {
    if (confirm("Tüm cari hesaplar, ürünler, faturalar, teklifler, çek-senetler, personel kayıtları ve takvim notları silinecektir. Kasa bakiyeleri sıfırlanacaktır. Bu işlemi onaylıyor musunuz?")) {
        mockData = {
            cariler: [],
            urunler: [],
            faturalar: [],
            takvimNotlari: {},
            tickets: [],
            kasalar: [
                { ad: "Merkez TL Kasası", tur: "Kasa", bakiye: 0, para_birimi: "TRY" },
                { ad: "Garanti Bankası Ticari", tur: "Banka", bakiye: 0, para_birimi: "TRY" }
            ],
            cekSenetler: [],
            personeller: [],
            maasOdemeleri: [],
            teklifler: []
        };
        saveData();
        alert("Sistem başarıyla sıfırlandı! Temiz kurulum durumuna geçildi.");
    }
}

function loadDemoData() {
    if (confirm("Mevcut verilerinizin üzerine demo veri yazılacaktır. Devam etmek istiyor musunuz?")) {
        mockData = {
            cariler: [
                { unvan: "Ahmet Yılmaz İnşaat", tur: "Müşteri", bakiye: 12000 },
                { unvan: "Doruk Lojistik A.Ş.", tur: "Tedarikçi", bakiye: -8500 },
                { unvan: "Yıldız Holding A.Ş.", tur: "Müşteri", bakiye: 94000 },
                { unvan: "Vatan Bilgisayar San. Tic.", tur: "Tedarikçi", bakiye: -14500 }
            ],
            urunler: [
                { kod: "SRV-01", ad: "Web Tasarım Hizmeti", fiyat: 10000, stok: 999 },
                { kod: "SRV-02", ad: "Barındırma Hizmeti", fiyat: 2000, stok: 999 },
                { kod: "SRV-03", ad: "SEO Danışmanlığı", fiyat: 8500, stok: 999 },
                { kod: "UR-01", ad: "Dell Latitude 5520 Dizüstü", fiyat: 32000, stok: 15 },
                { kod: "UR-02", ad: "Logitech MX Master 3S Fare", fiyat: 3500, stok: 45 }
            ],
            faturalar: [
                { tutar: 12000, kdv_orani: 20, kdv_tutari: 2400, genel_toplam: 14400, cari: "Ahmet Yılmaz İnşaat", tur: "Satış", tarih: "2026-05-24", durum: "Beklemede", kategori: "Hizmet Satışı", kalemler: [{ urun: "Web Tasarım Hizmeti", miktar: 1, fiyat: 10000 }, { urun: "Barındırma Hizmeti", miktar: 1, fiyat: 2000 }] },
                { tutar: 8500, kdv_orani: 20, kdv_tutari: 1700, genel_toplam: 10200, cari: "Doruk Lojistik A.Ş.", tur: "Alış", tarih: "2026-05-23", durum: "Ödendi", kategori: "Lojistik Gideri", kalemler: [{ urun: "SEO Danışmanlığı", miktar: 1, fiyat: 8500 }] },
                { tutar: 94000, kdv_orani: 20, kdv_tutari: 18800, genel_toplam: 112800, cari: "Yıldız Holding A.Ş.", tur: "Satış", tarih: "2026-05-20", durum: "Ödendi", kategori: "Donanım Satışı", kalemler: [{ urun: "Dell Latitude 5520 Dizüstü", miktar: 2, fiyat: 32000 }, { urun: "Logitech MX Master 3S Fare", miktar: 10, fiyat: 3000 }] }
            ],
            takvimNotlari: {
                "2026-05-24": ["Firma Aylık Muhasebe Kapanış Raporu hazırlanacak", "Yeni teklif revizyonu teslim edilecek"],
                "2026-05-28": ["Doruk Lojistik A.Ş. Ödemesi Yapılacak"]
            },
            tickets: [
                { konu: "Sanal POS Entegrasyonu Hakkında", mesaj: "Merhabalar, Sanal POS simülasyonunu test ettim fakat gerçek API anahtarlarını nereye gireceğimi sormak istedim.", durum: "Yanıtlandı", tarih: "2026-05-24" }
            ],
            kasalar: [
                { ad: "Merkez TL Kasası", tur: "Kasa", bakiye: 150000, para_birimi: "TRY" },
                { ad: "Garanti Bankası Ticari", tur: "Banka", bakiye: 485000, para_birimi: "TRY" },
                { ad: "Dolar Kasası", tur: "Kasa", bakiye: 5400, para_birimi: "USD" }
            ],
            cekSenetler: [
                { tutar: 25000, vade_tarihi: "2026-06-15", cari: "Ahmet Yılmaz İnşaat", tur: "Alınan", tip: "Çek", durum: "Portföyde" },
                { tutar: 45000, vade_tarihi: "2026-05-28", cari: "Doruk Lojistik A.Ş.", tur: "Verilen", tip: "Çek", durum: "Portföyde" }
            ],
            personeller: [
                { isim: "Mücahit Salvo", departman: "Yönetim", unvan: "Genel Müdür", maas: 75000, giris_tarihi: "2024-01-10" },
                { isim: "Elif Demir", departman: "Finans", unvan: "Muhasebe Uzmanı", maas: 45000, giris_tarihi: "2025-03-15" }
            ],
            maasOdemeleri: [
                { personel_isim: "Elif Demir", tutar: 45000, tarih: "2026-05-01", kasa_banka: "Merkez TL Kasası" }
            ],
            teklifler: [
                { teklif_no: "TKF-2026-001", cari: "Ahmet Yılmaz İnşaat", tutar: 12000, tarih: "24.05.2026", durum: "Onaylandı", kalemler: [{ urun: "Web Tasarım Hizmeti", miktar: 1, fiyat: 10000 }, { urun: "Barındırma Hizmeti", miktar: 1, fiyat: 2000 }] },
                { teklif_no: "TKF-2026-002", cari: "Doruk Lojistik A.Ş.", tutar: 8500, tarih: "23.05.2026", durum: "Beklemede", kalemler: [{ urun: "SEO Danışmanlığı", miktar: 1, fiyat: 8500 }] }
            ]
        };
        saveData();
        alert("Demo veri paketi başarıyla yüklendi! Sistem verileri dolduruldu.");
    }
}

function addNote() {
    const date = document.getElementById('noteDate').value;
    const note = document.getElementById('noteInput').value.trim();
    if(!date || !note) return alert('Lütfen tarih ve not girin.');
    
    if(!mockData.takvimNotlari[date]) mockData.takvimNotlari[date] = [];
    mockData.takvimNotlari[date].push(note);
    document.getElementById('noteInput').value = '';
    
    SELECTED_DATE = date;
    const parts = date.split('-');
    if (parts.length === 3) {
        CALENDAR_YEAR = parseInt(parts[0]);
        CALENDAR_MONTH = parseInt(parts[1]) - 1;
    }
    
    saveData();
}

function deleteNote(date, idx) {
    if (supabase) {
        const noteText = mockData.takvimNotlari[date][idx];
        dbDeleteItem('takvimNotlari', { date: date, note: noteText });
    }

    mockData.takvimNotlari[date].splice(idx, 1);
    if(mockData.takvimNotlari[date].length === 0) delete mockData.takvimNotlari[date];
    
    SELECTED_DATE = date;
    const parts = date.split('-');
    if (parts.length === 3) {
        CALENDAR_YEAR = parseInt(parts[0]);
        CALENDAR_MONTH = parseInt(parts[1]) - 1;
    }
    
    saveData();
}

// --- SUPABASE DATABASE SYNC HELPERS ---
async function syncFromSupabase() {
    if (!supabase || !supabase.auth.getUser) return;
    try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr || !user) return;

        let loadedData = { ...mockData };
        let anyLoaded = false;

        // Fetch Cariler
        const carilerRes = await supabase.from('saas_cariler').select('*');
        if (!carilerRes.error && carilerRes.data && carilerRes.data.length > 0) {
            loadedData.cariler = carilerRes.data;
            anyLoaded = true;
        }
        
        // Fetch Urunler
        const urunlerRes = await supabase.from('saas_urunler').select('*');
        if (!urunlerRes.error && urunlerRes.data && urunlerRes.data.length > 0) {
            loadedData.urunler = urunlerRes.data;
            anyLoaded = true;
        }

        // Fetch Faturalar
        const faturalarRes = await supabase.from('saas_faturalar').select('*');
        if (!faturalarRes.error && faturalarRes.data && faturalarRes.data.length > 0) {
            loadedData.faturalar = faturalarRes.data.map(f => ({
                tarih: f.tarih ? f.tarih.split('-').reverse().join('.') : '', // YYYY-MM-DD -> DD.MM.YYYY
                tur: f.tur,
                cari: f.cari,
                tutar: parseFloat(f.tutar),
                kdv_orani: parseFloat(f.kdv_orani || 20),
                kdv_tutari: parseFloat(f.kdv_tutari || 0),
                genel_toplam: parseFloat(f.genel_toplam || f.tutar),
                durum: f.durum,
                kalemler: typeof f.kalemler === 'string' ? JSON.parse(f.kalemler) : (f.kalemler || [])
            }));
            anyLoaded = true;
        }

        // Fetch Kasalar
        const kasalarRes = await supabase.from('saas_kasalar').select('*');
        if (!kasalarRes.error && kasalarRes.data && kasalarRes.data.length > 0) {
            loadedData.kasalar = kasalarRes.data;
            anyLoaded = true;
        }

        // Fetch Tickets
        const ticketsRes = await supabase.from('saas_tickets').select('*');
        if (!ticketsRes.error && ticketsRes.data && ticketsRes.data.length > 0) {
            loadedData.tickets = ticketsRes.data.map(t => ({
                konu: t.konu,
                musteri: '-',
                oncelik: t.oncelik,
                durum: t.durum,
                tarih: t.tarih ? t.tarih.split('-').reverse().join('.') : ''
            }));
            anyLoaded = true;
        }

        // Fetch Calendar Notes
        const notesRes = await supabase.from('saas_notlar').select('*');
        if (!notesRes.error && notesRes.data && notesRes.data.length > 0) {
            const notesMap = {};
            notesRes.data.forEach(n => {
                if (!notesMap[n.tarih]) notesMap[n.tarih] = [];
                notesMap[n.tarih].push(n.not_icerik);
            });
            loadedData.takvimNotlari = notesMap;
            anyLoaded = true;
        }

        if (anyLoaded) {
            mockData = loadedData;
            localStorage.setItem('saas_erp_data', JSON.stringify(mockData));
        }
    } catch (e) {
        console.warn("Supabase sync failed, using localStorage cache:", e);
    }
}

async function dbSaveItem(type, item) {
    if (!supabase) return;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (type === 'cariler') {
            await supabase.from('saas_cariler').upsert({
                user_id: user.id,
                unvan: item.unvan,
                tur: item.tur,
                bakiye: parseFloat(item.bakiye || 0)
            }, { onConflict: 'user_id,unvan' });
        } else if (type === 'urunler') {
            await supabase.from('saas_urunler').upsert({
                user_id: user.id,
                kod: item.kod,
                ad: item.ad,
                fiyat: parseFloat(item.fiyat),
                stok: parseInt(item.stok)
            }, { onConflict: 'user_id,kod' });
        } else if (type === 'faturalar') {
            await supabase.from('saas_faturalar').insert({
                user_id: user.id,
                tarih: item.tarih ? item.tarih.split('.').reverse().join('-') : new Date().toISOString().split('T')[0],
                tur: item.tur,
                cari: item.cari,
                tutar: parseFloat(item.tutar),
                kdv_orani: parseFloat(item.kdv_orani || 20),
                kdv_tutari: parseFloat(item.kdv_tutari || 0),
                genel_toplam: parseFloat(item.genel_toplam || item.tutar),
                durum: item.durum,
                kalemler: item.kalemler || []
            });
        } else if (type === 'kasalar') {
            await supabase.from('saas_kasalar').upsert({
                user_id: user.id,
                ad: item.ad,
                tur: item.tur,
                bakiye: parseFloat(item.bakiye || 0),
                para_birimi: item.para_birimi || 'TRY'
            }, { onConflict: 'user_id,ad' });
        } else if (type === 'tickets') {
            await supabase.from('saas_tickets').insert({
                user_id: user.id,
                konu: item.konu,
                oncelik: item.oncelik,
                durum: item.durum,
                tarih: item.tarih ? item.tarih.split('.').reverse().join('-') : new Date().toISOString().split('T')[0]
            });
        } else if (type === 'takvimNotlari') {
            await supabase.from('saas_notlar').insert({
                user_id: user.id,
                tarih: item.date,
                not_icerik: item.note
            });
        }
    } catch (e) {
        console.error("Supabase write failed:", e);
    }
}

async function dbDeleteItem(type, item) {
    if (!supabase) return;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (type === 'cariler') {
            await supabase.from('saas_cariler').delete().eq('unvan', item.unvan).eq('user_id', user.id);
        } else if (type === 'urunler') {
            await supabase.from('saas_urunler').delete().eq('kod', item.kod).eq('user_id', user.id);
        } else if (type === 'faturalar') {
            await supabase.from('saas_faturalar').delete()
                .eq('cari', item.cari)
                .eq('tutar', parseFloat(item.tutar))
                .eq('user_id', user.id);
        } else if (type === 'kasalar') {
            await supabase.from('saas_kasalar').delete().eq('ad', item.ad).eq('user_id', user.id);
        } else if (type === 'tickets') {
            await supabase.from('saas_tickets').delete().eq('konu', item.konu).eq('user_id', user.id);
        } else if (type === 'takvimNotlari') {
            await supabase.from('saas_notlar').delete()
                .eq('tarih', item.date)
                .eq('not_icerik', item.note)
                .eq('user_id', user.id);
        }
    } catch (e) {
        console.error("Supabase delete failed:", e);
    }
}

// --- CURRENCY CONVERTER & TICKER ---
let exchangeRates = { USD: 32.50, EUR: 35.20, GBP: 41.10 };
let prevExchangeRates = { USD: 32.50, EUR: 35.20, GBP: 41.10 };
let liveCurrencyInterval = null;

async function fetchExchangeRates() {
    try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data && data.rates && data.rates.TRY) {
            const tryRate = data.rates.TRY;
            exchangeRates.USD = parseFloat((tryRate).toFixed(2));
            exchangeRates.EUR = parseFloat((tryRate / data.rates.EUR).toFixed(2));
            exchangeRates.GBP = parseFloat((tryRate / data.rates.GBP).toFixed(2));
            
            // Sync previous rates to match
            prevExchangeRates.USD = exchangeRates.USD;
            prevExchangeRates.EUR = exchangeRates.EUR;
            prevExchangeRates.GBP = exchangeRates.GBP;
            
            console.log("Live rates loaded:", exchangeRates);
        }
    } catch (e) {
        console.warn("Currency exchange rates fetch failed, using fallbacks.", e);
    }
    // Start the live ticker band updater simulation
    startLiveCurrencySimulation();
}

function startLiveCurrencySimulation() {
    if (liveCurrencyInterval) clearInterval(liveCurrencyInterval);
    
    liveCurrencyInterval = setInterval(() => {
        const tickerEl = document.getElementById('liveTickerBand');
        
        // Capture previous values
        prevExchangeRates.USD = exchangeRates.USD;
        prevExchangeRates.EUR = exchangeRates.EUR;
        prevExchangeRates.GBP = exchangeRates.GBP;
        
        // Random micro fluctuations (+/- 0.01 to 0.03 TRY)
        const diffUSD = (Math.random() - 0.5) * 0.04;
        const diffEUR = (Math.random() - 0.5) * 0.04;
        const diffGBP = (Math.random() - 0.5) * 0.05;
        
        exchangeRates.USD = parseFloat((exchangeRates.USD + diffUSD).toFixed(2));
        exchangeRates.EUR = parseFloat((exchangeRates.EUR + diffEUR).toFixed(2));
        exchangeRates.GBP = parseFloat((exchangeRates.GBP + diffGBP).toFixed(2));
        
        if (tickerEl) {
            tickerEl.innerHTML = renderTickerItemsOnly();
        }
    }, 5000);
}

function getTickerItemHTML(label, val, prevVal) {
    const isUp = val >= prevVal;
    const arrow = isUp ? `<i class='bx bxs-up-arrow'></i>` : `<i class='bx bxs-down-arrow'></i>`;
    const trendClass = isUp ? 'ticker-up' : 'ticker-down';
    return `
        <div class="ticker-item">
            <span>${label}</span>
            <span class="ticker-val">${val.toFixed(2)} ₺</span>
            <span class="${trendClass}">${arrow}</span>
        </div>
    `;
}

function renderTickerItemsOnly() {
    return `
        <div style="font-weight:600; font-family:var(--font-heading); color:var(--primary); display:flex; align-items:center; gap:5px; flex-shrink: 0;">
            <i class='bx bx-trending-up'></i> Döviz Piyasası (Canlı):
        </div>
        ${getTickerItemHTML('USD/TRY', exchangeRates.USD, prevExchangeRates.USD)}
        ${getTickerItemHTML('EUR/TRY', exchangeRates.EUR, prevExchangeRates.EUR)}
        ${getTickerItemHTML('GBP/TRY', exchangeRates.GBP, prevExchangeRates.GBP)}
    `;
}

function getTickerBandHTML() {
    return `
        <div class="ticker-band fade-in" id="liveTickerBand">
            ${renderTickerItemsOnly()}
        </div>
    `;
}

function getMonthlyFinanceData() {
    const monthlyGelir = [0, 0, 0, 0, 0, 0];
    const monthlyGider = [0, 0, 0, 0, 0, 0];
    mockData.faturalar.forEach(f => {
        if (!f.tarih) return;
        let monthIdx = -1;
        // Support both DD.MM.YYYY and YYYY-MM-DD formats
        if (f.tarih.includes('.')) {
            const parts = f.tarih.split('.');
            if (parts.length === 3) monthIdx = parseInt(parts[1]) - 1;
        } else if (f.tarih.includes('-')) {
            const parts = f.tarih.split('-');
            if (parts.length === 3) monthIdx = parseInt(parts[1]) - 1;
        }
        if (monthIdx >= 0 && monthIdx < 6) {
            const amt = parseFloat(f.genel_toplam || f.tutar) || 0;
            if (f.tur === 'Satış' && f.durum === 'Ödendi') {
                monthlyGelir[monthIdx] += amt;
            } else if (f.tur === 'Alış') {
                monthlyGider[monthIdx] += amt;
            }
        }
    });
    return { monthlyGelir, monthlyGider };
}

// --- KASA & BANKA MODULE RENDERING ---
function renderKasalar(container) {
    let totalTRY = 0;
    mockData.kasalar.forEach(k => {
        let rate = 1;
        if (k.para_birimi === 'USD') rate = exchangeRates.USD;
        if (k.para_birimi === 'EUR') rate = exchangeRates.EUR;
        totalTRY += parseFloat(k.bakiye || 0) * rate;
    });

    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">Kasa & Banka Hesapları</h1>
                <p style="color:var(--text-secondary)">Kasa ve banka nakit akışı yönetimi</p>
            </div>
            <button class="btn btn-primary" onclick="openModal('kasa')"><i class='bx bx-plus'></i> Yeni Hesap Ekle</button>
        </div>

        <div class="stats-grid fade-in" style="animation-delay: 0.1s">
            <div class="stat-card glass-panel c-success">
                <div class="stat-header"><span>Toplam Likidite (TRY Karşılığı)</span><div class="stat-icon"><i class='bx bx-dollar-circle'></i></div></div>
                <div class="stat-value">${formatMoney(totalTRY)}</div>
            </div>
        </div>

        <div class="glass-panel table-container fade-in" style="animation-delay: 0.2s; margin-top:25px;">
            <div class="table-header"><h3>Kasa ve Banka Hesaplarınız</h3></div>
            <table>
                <thead><tr><th>Hesap Adı</th><th>Hesap Türü</th><th>Para Birimi</th><th>Bakiye</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.kasalar.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Henüz hesap eklenmedi.</td></tr>' : 
                      mockData.kasalar.map((k, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);">${k.ad}</td>
                            <td><span class="status-badge ${k.tur === 'Banka' ? 'status-success' : 'status-warning'}">${k.tur}</span></td>
                            <td style="font-weight:600">${k.para_birimi}</td>
                            <td style="font-weight:600; color:${k.bakiye >= 0 ? 'var(--success)' : 'var(--danger)'}">
                                ${k.para_birimi === 'TRY' ? formatMoney(k.bakiye) : new Intl.NumberFormat('en-US', { style: 'currency', currency: k.para_birimi }).format(k.bakiye)}
                            </td>
                            <td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('kasalar', ${i})"><i class='bx bx-trash'></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// --- ÇEK & SENET TAKİBİ MODULE ---
function renderCekSenetler(container) {
    let toplamAlinan = 0;
    let toplamVerilen = 0;
    let vadesiYaklasan = 0;
    const bugun = new Date();
    const limitGun = new Date();
    limitGun.setDate(bugun.getDate() + 7);

    mockData.cekSenetler.forEach(c => {
        const tutarVal = parseFloat(c.tutar) || 0;
        if (c.tur === 'Alınan') {
            toplamAlinan += tutarVal;
        } else {
            toplamVerilen += tutarVal;
        }
        if (c.durum === 'Portföyde') {
            const vDate = new Date(c.vade_tarihi);
            if (vDate >= bugun && vDate <= limitGun) {
                vadesiYaklasan++;
            }
        }
    });

    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">Çek & Senet Takibi</h1>
                <p style="color:var(--text-secondary)">Portföydeki alınan çekler ve ödenmesi gereken kendi senet/çekleriniz</p>
            </div>
            <button class="btn btn-primary" onclick="openModal('cekSenet')"><i class='bx bx-plus'></i> Yeni Evrak Ekle</button>
        </div>

        <div class="stats-grid fade-in" style="animation-delay: 0.1s">
            <div class="stat-card glass-panel c-success">
                <div class="stat-header"><span>Toplam Alınan Evraklar (TL)</span><div class="stat-icon"><i class='bx bx-log-in-circle'></i></div></div>
                <div class="stat-value">${formatMoney(toplamAlinan)}</div>
            </div>
            <div class="stat-card glass-panel c-danger">
                <div class="stat-header"><span>Toplam Verilen Evraklar (TL)</span><div class="stat-icon"><i class='bx bx-log-out-circle'></i></div></div>
                <div class="stat-value">${formatMoney(toplamVerilen)}</div>
            </div>
            <div class="stat-card glass-panel c-warning">
                <div class="stat-header"><span>Vadesi Yaklaşanlar (Son 7 Gün)</span><div class="stat-icon"><i class='bx bx-alarm'></i></div></div>
                <div class="stat-value">${vadesiYaklasan} Adet</div>
            </div>
        </div>

        <div class="cek-senet-grid fade-in" style="animation-delay: 0.2s">
            ${mockData.cekSenetler.length === 0 ? '<div class="glass-panel" style="grid-column: 1/-1; padding:40px; text-align:center; color:var(--text-secondary);">Kayıtlı çek veya senet bulunmuyor.</div>' : 
              mockData.cekSenetler.map((c, i) => {
                let badgeClass = 'status-warning';
                if (c.durum === 'Tahsil Edildi' || c.durum === 'Ödendi') badgeClass = 'status-success';
                if (c.durum === 'Karşılıksız') badgeClass = 'status-danger';
                if (c.durum === 'Ciro Edildi') badgeClass = 'status-primary';

                return `
                    <div class="cek-card">
                        <div class="cek-card-header">
                            <span class="cek-card-title">${c.tip} - #${1000 + i}</span>
                            <span class="status-badge ${badgeClass}">${c.durum}</span>
                        </div>
                        <div class="cek-card-body">
                            <div><strong>Cari Hesap:</strong> ${c.cari}</div>
                            <div><strong>İşlem Türü:</strong> ${c.tur === 'Alınan' ? 'Müşteriden Alınan' : 'Firmamıza Ait Verilen'}</div>
                            <div><strong>Vade Tarihi:</strong> ${formatTurkishDate(c.vade_tarihi)}</div>
                        </div>
                        <div class="cek-card-footer">
                            <span class="cek-amount">${formatMoney(c.tutar)}</span>
                            <div style="display:flex; gap:6px;">
                                ${c.durum === 'Portföyde' ? `
                                    <button class="btn btn-sm btn-primary" style="padding:6px 10px; font-size:12px;" onclick="tahsilEtCek(${i})">
                                        <i class='bx bx-check-circle'></i> ${c.tur === 'Alınan' ? 'Tahsil Et' : 'Öde'}
                                    </button>
                                ` : ''}
                                <button class="btn btn-sm" style="background:var(--danger); color:#fff; padding:6px 10px;" onclick="deleteData('cekSenetler', ${i})">
                                    <i class='bx bx-trash'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function tahsilEtCek(index) {
    const c = mockData.cekSenetler[index];
    if (!c) return;

    let options = mockData.kasalar.map((k, idx) => `${idx + 1}- ${k.ad} (${k.para_birimi})`).join('\n');
    let selection = prompt(`Lütfen tahsilat/ödeme hesabı seçin (Sayı girin):\n\n${options}`);
    if (selection === null) return;
    
    let kIdx = parseInt(selection) - 1;
    if (isNaN(kIdx) || kIdx < 0 || kIdx >= mockData.kasalar.length) {
        alert("Geçersiz seçim yaptınız!");
        return;
    }
    
    const kasa = mockData.kasalar[kIdx];
    let rate = 1;
    if (kasa.para_birimi === 'USD') rate = exchangeRates.USD;
    if (kasa.para_birimi === 'EUR') rate = exchangeRates.EUR;

    const amountInKasaCur = c.tutar / rate;

    if (c.tur === 'Alınan') {
        c.durum = 'Tahsil Edildi';
        kasa.bakiye = parseFloat((parseFloat(kasa.bakiye) + amountInKasaCur).toFixed(2));
        dbSaveItem('kasalar', kasa);
        // Create an automatic invoice or income record
        const autoFatura = {
            tarih: new Date().toLocaleDateString('tr-TR'),
            tur: 'Satış',
            cari: c.cari,
            tutar: c.tutar,
            kdv_orani: 0,
            kdv_tutari: 0,
            genel_toplam: c.tutar,
            durum: 'Ödendi',
            kategori: 'Hizmet Satışı',
            kalemler: [{ urun: `${c.tip} Tahsilatı`, miktar: 1, fiyat: c.tutar }]
        };
        mockData.faturalar.push(autoFatura);
        dbSaveItem('faturalar', autoFatura);
        alert(`${c.tip} başarıyla tahsil edildi. Para ${kasa.ad} hesabına aktarıldı ve işlem faturası kesildi.`);
    } else {
        c.durum = 'Ödendi';
        kasa.bakiye = parseFloat((parseFloat(kasa.bakiye) - amountInKasaCur).toFixed(2));
        dbSaveItem('kasalar', kasa);
        // Create auto expense record
        const autoFatura = {
            tarih: new Date().toLocaleDateString('tr-TR'),
            tur: 'Alış',
            cari: c.cari,
            tutar: c.tutar,
            kdv_orani: 0,
            kdv_tutari: 0,
            genel_toplam: c.tutar,
            durum: 'Ödendi',
            kategori: 'Diğer',
            kalemler: [{ urun: `${c.tip} Ödemesi`, miktar: 1, fiyat: c.tutar }]
        };
        mockData.faturalar.push(autoFatura);
        dbSaveItem('faturalar', autoFatura);
        alert(`${c.tip} başarıyla ödendi. Para ${kasa.ad} hesabından düşüldü ve gider faturası kesildi.`);
    }

    dbSaveItem('cekSenetler', c);
    saveData();
}



// --- TEKLİF & SİPARİŞ MODULE ---
function renderTeklifler(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">Teklif & Sipariş Yönetimi</h1>
                <p style="color:var(--text-secondary)">Müşterilere hazırlanan teklifler ve sipariş süreci</p>
            </div>
            <button class="btn btn-primary" onclick="openModal('teklif')"><i class='bx bx-plus'></i> Yeni Teklif Hazırla</button>
        </div>

        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <div class="table-header"><h3>Teklifler</h3></div>
            <table>
                <thead><tr><th>Teklif No</th><th>Cari</th><th>Tarih</th><th>Tutar</th><th>Durum</th><th>İşlemler</th></tr></thead>
                <tbody>
                    ${mockData.teklifler.length === 0 ? '<tr><td colspan="6" style="text-align:center;">Henüz teklif eklenmedi.</td></tr>' : 
                      mockData.teklifler.map((t, i) => {
                        let badgeClass = 'status-warning';
                        if (t.durum === 'Onaylandı') badgeClass = 'status-success';
                        if (t.durum === 'Reddedildi') badgeClass = 'status-danger';
                        if (t.durum === 'Faturalandı') badgeClass = 'status-primary';

                        return `
                            <tr>
                                <td style="font-weight:600; color:var(--primary);">${t.teklif_no}</td>
                                <td style="font-weight:600; color:var(--text-primary);">${t.cari}</td>
                                <td>${t.tarih}</td>
                                <td style="font-weight:600;">${formatMoney(t.tutar)}</td>
                                <td><span class="status-badge ${badgeClass}">${t.durum}</span></td>
                                <td style="display:flex; gap:6px;">
                                    ${t.durum === 'Beklemede' ? `
                                        <button class="btn btn-sm btn-primary" style="background:var(--success); color:#fff; padding:6px 10px;" onclick="onaylaTeklif(${i})"><i class='bx bx-check'></i> Onayla</button>
                                        <button class="btn btn-sm btn-primary" style="background:var(--danger); color:#fff; padding:6px 10px;" onclick="reddetTeklif(${i})"><i class='bx bx-x'></i> Reddet</button>
                                    ` : ''}
                                    ${t.durum === 'Onaylandı' ? `
                                        <button class="btn btn-sm btn-primary" onclick="faturayaDonusturTeklif(${i})"><i class='bx bx-receipt'></i> Faturaya Dönüştür</button>
                                    ` : ''}
                                    <button class="btn btn-sm" style="background:var(--danger); color:#fff;" onclick="deleteData('teklifler', ${i})"><i class='bx bx-trash'></i></button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function onaylaTeklif(index) {
    mockData.teklifler[index].durum = 'Onaylandı';
    dbSaveItem('teklifler', mockData.teklifler[index]);
    alert("Teklif onaylandı!");
    saveData();
}

function reddetTeklif(index) {
    mockData.teklifler[index].durum = 'Reddedildi';
    dbSaveItem('teklifler', mockData.teklifler[index]);
    alert("Teklif reddedildi.");
    saveData();
}

function faturayaDonusturTeklif(index) {
    const t = mockData.teklifler[index];
    if (!t) return;

    const cariIdx = mockData.cariler.findIndex(c => c.unvan === t.cari);
    if (cariIdx === -1) {
        alert("Teklifteki cari hesap sistemde bulunamadı!");
        return;
    }

    const subtotal = t.tutar;
    const kdvRate = 20;
    const kdvAmount = subtotal * (kdvRate / 100);
    const grandTotal = subtotal + kdvAmount;

    const newFatura = {
        tarih: new Date().toLocaleDateString('tr-TR'),
        tur: 'Satış',
        cari: t.cari,
        tutar: subtotal,
        kdv_orani: kdvRate,
        kdv_tutari: kdvAmount,
        genel_toplam: grandTotal,
        durum: 'Ödenmedi',
        kategori: 'Hizmet Satışı',
        kalemler: t.kalemler || []
    };

    mockData.faturalar.push(newFatura);
    dbSaveItem('faturalar', newFatura);

    mockData.cariler[cariIdx].bakiye = parseFloat((parseFloat(mockData.cariler[cariIdx].bakiye) + grandTotal).toFixed(2));
    dbSaveItem('cariler', mockData.cariler[cariIdx]);

    if (t.kalemler) {
        t.kalemler.forEach(item => {
            const prodIdx = mockData.urunler.findIndex(p => p.ad === item.urun);
            if (prodIdx !== -1) {
                mockData.urunler[prodIdx].stok = Math.max(0, parseInt(mockData.urunler[prodIdx].stok) - parseInt(item.miktar));
                dbSaveItem('urunler', mockData.urunler[prodIdx]);
            }
        });
    }

    t.durum = 'Faturalandı';
    dbSaveItem('teklifler', t);

    alert(`Teklif başarıyla faturaya dönüştürüldü! Satış faturası oluşturuldu ve cari borçlandırıldı.`);
    saveData();
}

// --- PERSONEL YÖNETİMİ MODULE ---
function renderPersonel(container) {
    let toplamPersonel = mockData.personeller.length;
    let aylikMaasYuku = mockData.personeller.reduce((acc, p) => acc + (parseFloat(p.maas) || 0), 0);
    let odenenMaasBuAy = mockData.maasOdemeleri.reduce((acc, o) => {
        const oDate = o.tarih ? o.tarih.split('.') : [];
        if (oDate.length === 3 && parseInt(oDate[1]) === (new Date().getMonth() + 1)) {
            return acc + (parseFloat(o.tutar) || 0);
        }
        return acc;
    }, 0);

    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">Personel Yönetimi</h1>
                <p style="color:var(--text-secondary)">Çalışan listeleri, maaş bilgileri ve ödeme takibi</p>
            </div>
            <button class="btn btn-primary" onclick="openModal('personel')"><i class='bx bx-plus'></i> Yeni Personel Ekle</button>
        </div>

        <div class="stats-grid fade-in" style="animation-delay: 0.1s">
            <div class="stat-card glass-panel c-primary">
                <div class="stat-header"><span>Aktif Personel Sayısı</span><div class="stat-icon"><i class='bx bx-user'></i></div></div>
                <div class="stat-value">${toplamPersonel} Kişi</div>
            </div>
            <div class="stat-card glass-panel c-warning">
                <div class="stat-header"><span>Aylık Toplam Maaş Yükü</span><div class="stat-icon"><i class='bx bx-money'></i></div></div>
                <div class="stat-value">${formatMoney(aylikMaasYuku)}</div>
            </div>
            <div class="stat-card glass-panel c-success">
                <div class="stat-header"><span>Bu Ay Ödenen Toplam Maaş</span><div class="stat-icon"><i class='bx bx-check-double'></i></div></div>
                <div class="stat-value">${formatMoney(odenenMaasBuAy)}</div>
            </div>
        </div>

        <div class="glass-panel table-container fade-in" style="animation-delay: 0.2s; margin-top:25px;">
            <div class="table-header"><h3>Çalışan Listesi</h3></div>
            <table>
                <thead><tr><th>Personel İsim</th><th>Departman</th><th>Unvan</th><th>Giriş Tarihi</th><th>Maaş (Aylık Net)</th><th>İşlemler</th></tr></thead>
                <tbody>
                    ${mockData.personeller.length === 0 ? '<tr><td colspan="6" style="text-align:center;">Kayıtlı personel bulunmuyor.</td></tr>' : 
                      mockData.personeller.map((p, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);">${p.isim}</td>
                            <td>${p.departman}</td>
                            <td>${p.unvan}</td>
                            <td>${formatTurkishDate(p.giris_tarihi)}</td>
                            <td style="font-weight:600; color:var(--primary);">${formatMoney(p.maas)}</td>
                            <td style="display:flex; gap:6px;">
                                <button class="btn btn-sm btn-primary" onclick="odeMaas(${i})"><i class='bx bx-money-withdraw'></i> Maaş Öde</button>
                                <button class="btn btn-sm" style="background:var(--danger); color:#fff;" onclick="deleteData('personeller', ${i})"><i class='bx bx-trash'></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="glass-panel table-container fade-in" style="animation-delay: 0.3s; margin-top:30px;">
            <div class="table-header"><h3>Maaş Ödeme Geçmişi</h3></div>
            <table>
                <thead><tr><th>Tarih</th><th>Personel</th><th>Tutar</th><th>Ödeme Hesabı</th><th>Durum</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.maasOdemeleri.length === 0 ? '<tr><td colspan="6" style="text-align:center;">Henüz maaş ödemesi yapılmadı.</td></tr>' : 
                      mockData.maasOdemeleri.slice().reverse().map((o, idx) => `
                        <tr>
                            <td>${o.tarih}</td>
                            <td style="font-weight:600; color:var(--text-primary);">${o.personel_isim}</td>
                            <td style="font-weight:600; color:var(--danger);">${formatMoney(o.tutar)}</td>
                            <td>${o.kasa_banka}</td>
                            <td><span class="status-badge status-success">Başarılı</span></td>
                            <td>
                                <button class="btn btn-sm" style="background:var(--danger); color:#fff; padding:4px 8px;" onclick="deleteData('maasOdemeleri', ${mockData.maasOdemeleri.length - 1 - idx})">
                                    <i class='bx bx-trash'></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function odeMaas(index) {
    const p = mockData.personeller[index];
    if (!p) return;

    let options = mockData.kasalar.map((k, idx) => `${idx + 1}- ${k.ad} (${k.para_birimi})`).join('\n');
    let selection = prompt(`${p.isim} için ${formatMoney(p.maas)} maaş ödemesi yapılacak.\nLütfen ödeme hesabını seçin (Sayı girin):\n\n${options}`);
    if (selection === null) return;
    
    let kIdx = parseInt(selection) - 1;
    if (isNaN(kIdx) || kIdx < 0 || kIdx >= mockData.kasalar.length) {
        alert("Geçersiz seçim yaptınız!");
        return;
    }
    
    const kasa = mockData.kasalar[kIdx];
    let rate = 1;
    if (kasa.para_birimi === 'USD') rate = exchangeRates.USD;
    if (kasa.para_birimi === 'EUR') rate = exchangeRates.EUR;

    const amountInKasaCur = p.maas / rate;

    if (kasa.bakiye < amountInKasaCur) {
        if (!confirm("Seçilen hesapta maaşı ödemek için yeterli bakiye bulunmuyor! Yine de devam etmek istiyor musunuz?")) {
            return;
        }
    }

    kasa.bakiye = parseFloat((parseFloat(kasa.bakiye) - amountInKasaCur).toFixed(2));
    dbSaveItem('kasalar', kasa);

    const payment = {
        personel_isim: p.isim,
        tutar: p.maas,
        tarih: new Date().toLocaleDateString('tr-TR'),
        kasa_banka: kasa.ad
    };
    mockData.maasOdemeleri.push(payment);
    dbSaveItem('maasOdemeleri', payment);

    const autoFatura = {
        tarih: new Date().toLocaleDateString('tr-TR'),
        tur: 'Alış',
        cari: `${p.isim} (Personel)`,
        tutar: p.maas,
        kdv_orani: 0,
        kdv_tutari: 0,
        genel_toplam: p.maas,
        durum: 'Ödendi',
        kategori: 'Personel / Maaş',
        kalemler: [{ urun: `${p.isim} - Maaş Ödemesi`, miktar: 1, fiyat: p.maas }]
    };
    mockData.faturalar.push(autoFatura);
    dbSaveItem('faturalar', autoFatura);

    alert(`${p.isim} maaş ödemesi başarıyla gerçekleştirildi. ${kasa.ad} hesabından ${formatMoney(p.maas)} düşüldü.`);
    saveData();
}

// --- CARI HESAP DETAYI & EKSTRE ---
function viewCariDetail(unvan) {
    const cari = mockData.cariler.find(c => c.unvan === unvan);
    if (!cari) return;
    
    const relatedInvoices = mockData.faturalar.filter(f => f.cari === unvan);
    let totalSales = 0, totalSalesCount = 0;
    let totalPurchases = 0, totalPurchasesCount = 0;
    
    relatedInvoices.forEach(f => {
        const amt = parseFloat(f.genel_toplam || f.tutar) || 0;
        if (f.tur === 'Satış') {
            totalSales += amt;
            totalSalesCount++;
        } else {
            totalPurchases += amt;
            totalPurchasesCount++;
        }
    });

    const content = document.getElementById('contentArea');
    content.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;"><i class='bx bx-user' style='color:var(--primary); margin-right:10px;'></i>${cari.unvan}</h1>
                <p style="color:var(--text-secondary)">Cari hesap hareketleri ve bakiye dökümleri</p>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-sm" onclick="loadPage('cariler')"><i class='bx bx-arrow-back'></i> Geri Dön</button>
                <button class="btn btn-primary btn-sm" onclick="downloadCariStatement('${cari.unvan}')"><i class='bx bx-download'></i> Ekstre İndir</button>
            </div>
        </div>

        <div class="stats-grid fade-in" style="animation-delay: 0.1s">
            <div class="stat-card glass-panel c-primary">
                <div class="stat-header"><span>Satış Faturaları</span><div class="stat-icon"><i class='bx bx-trending-up'></i></div></div>
                <div class="stat-value">${formatMoney(totalSales)}</div>
                <div style="font-size:13px; color:var(--text-secondary)">${totalSalesCount} adet fatura</div>
            </div>
            <div class="stat-card glass-panel c-danger">
                <div class="stat-header"><span>Alış Faturaları</span><div class="stat-icon"><i class='bx bx-trending-down'></i></div></div>
                <div class="stat-value">${formatMoney(totalPurchases)}</div>
                <div style="font-size:13px; color:var(--text-secondary)">${totalPurchasesCount} adet fatura</div>
            </div>
            <div class="stat-card glass-panel c-warning">
                <div class="stat-header"><span>Bakiye Durumu</span><div class="stat-icon"><i class='bx bx-wallet'></i></div></div>
                <div class="stat-value" style="color:${cari.bakiye >= 0 ? 'var(--success)' : 'var(--danger)'}">${formatMoney(Math.abs(cari.bakiye))}</div>
                <div style="font-size:13px; color:var(--text-secondary)">${cari.bakiye >= 0 ? 'Alacaklı' : 'Borçlu'}</div>
            </div>
        </div>

        <div class="glass-panel table-container fade-in" style="animation-delay: 0.2s; margin-top:25px;">
            <div class="table-header"><h3>İşlem Geçmişi (Fatura Listesi)</h3></div>
            <table>
                <thead><tr><th>Tarih</th><th>Tür</th><th>Genel Toplam</th><th>KDV Tutarı</th><th>Durum</th><th>Yazdır</th></tr></thead>
                <tbody>
                    ${relatedInvoices.length === 0 ? '<tr><td colspan="6" style="text-align:center;">Cariye ait işlem geçmişi bulunamadı.</td></tr>' : 
                      relatedInvoices.map((f, i) => `
                        <tr>
                            <td>${f.tarih}</td>
                            <td><span class="status-badge ${f.tur === 'Satış' ? 'status-success' : 'status-danger'}">${f.tur}</span></td>
                            <td style="font-weight:600; color:var(--text-primary);">${formatMoney(f.genel_toplam || f.tutar)}</td>
                            <td>${formatMoney(f.kdv_tutari || 0)}</td>
                            <td><span class="status-badge status-${f.durum === 'Ödendi' ? 'success' : 'warning'}">${f.durum}</span></td>
                            <td><button class="btn btn-sm" onclick="printInvoice(${mockData.faturalar.findIndex(o => o === f)})"><i class='bx bx-printer'></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function downloadCariStatement(unvan) {
    const cari = mockData.cariler.find(c => c.unvan === unvan);
    if (!cari) return;
    const relatedInvoices = mockData.faturalar.filter(f => f.cari === unvan);
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Cari Hesap Ekstresi\n";
    csvContent += `Cari Unvanı;${cari.unvan}\n`;
    csvContent += `Cari Türü;${cari.tur}\n`;
    csvContent += `Mevcut Bakiye;${cari.bakiye} TL (${cari.bakiye >= 0 ? 'Alacaklı' : 'Borçlu'})\n\n`;
    csvContent += "Tarih;İşlem Türü;KDV Dahil Tutar (TL);KDV Tutarı (TL);Durum\n";
    relatedInvoices.forEach(f => {
        csvContent += `${f.tarih};${f.tur};${f.genel_toplam || f.tutar};${f.kdv_tutari || 0};${f.durum}\n`;
    });
    triggerCSVDownload(csvContent, `${cari.unvan.replace(/ /g, "_")}_Cari_Ekstre.csv`);
}

// --- CSV EXPORT HELPERS ---
function downloadCarilerCSV() {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Ünvan;Tür;Bakiye (TL)\n";
    mockData.cariler.forEach(c => {
        csvContent += `${c.unvan};${c.tur};${c.bakiye}\n`;
    });
    triggerCSVDownload(csvContent, "Cari_Hesaplar.csv");
}

function downloadUrunlerCSV() {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Ürün Kodu;Ürün Adı;Fiyat (TL);Stok Miktarı\n";
    mockData.urunler.forEach(u => {
        csvContent += `${u.kod};${u.ad};${u.fiyat};${u.stok}\n`;
    });
    triggerCSVDownload(csvContent, "Urun_Stok_Listesi.csv");
}

function downloadFaturalarCSV() {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Tarih;İşlem Türü;Cari Hesap;KDV Dahil Tutar (TL);KDV Tutarı (TL);Durum\n";
    mockData.faturalar.forEach(f => {
        csvContent += `${f.tarih};${f.tur};${f.cari};${f.genel_toplam || f.tutar};${f.kdv_tutari || 0};${f.durum}\n`;
    });
    triggerCSVDownload(csvContent, "Faturalar_Raporu.csv");
}

function triggerCSVDownload(content, filename) {
    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- BULK IMPORT FUNCTIONS ---
function downloadCSVTemplate() {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "ürün kodu;ürün adı;fiyatı;stok miktarı\n";
    csvContent += "UR-001;Kablosuz Klavye;450.00;120\n";
    csvContent += "UR-002;Oyuncu Faresi;320.00;85\n";
    csvContent += "UR-003;USB Hub;150.00;200\n";
    triggerCSVDownload(csvContent, "toplu_urun_sablonu.csv");
}

function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return null;
    
    // Detect delimiter (comma or semicolon)
    const firstLine = lines[0];
    let delimiter = ',';
    if (firstLine.includes(';')) {
        delimiter = ';';
    }
    
    const rawHeaders = firstLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
    
    // Map headers dynamically
    const headerMapping = {};
    rawHeaders.forEach((h, idx) => {
        const cleaned = h.toLowerCase().trim();
        if (cleaned.includes('kod') || cleaned.includes('sku')) {
            headerMapping.kod = idx;
        } else if (cleaned.includes('ad')) {
            headerMapping.ad = idx;
        } else if (cleaned.includes('fiyat') || cleaned.includes('price')) {
            headerMapping.fiyat = idx;
        } else if (cleaned.includes('stok') || cleaned.includes('miktar') || cleaned.includes('adet') || cleaned.includes('stock')) {
            headerMapping.stok = idx;
        }
    });

    // Check if we mapped all required columns
    if (headerMapping.kod === undefined || headerMapping.ad === undefined) {
        return { error: 'CSV sütun başlıkları anlaşılamadı. Lütfen "ürün kodu" ve "ürün adı" sütunlarını içeren şablonu kullanın.' };
    }

    const items = [];
    for (let i = 1; i < lines.length; i++) {
        const rowText = lines[i];
        let columns = [];
        let inQuotes = false;
        let currentColumn = '';
        
        for (let charIdx = 0; charIdx < rowText.length; charIdx++) {
            const char = rowText[charIdx];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
                columns.push(currentColumn.trim().replace(/^["']|["']$/g, ''));
                currentColumn = '';
            } else {
                currentColumn += char;
            }
        }
        columns.push(currentColumn.trim().replace(/^["']|["']$/g, ''));

        if (columns.length < 2) continue; // Skip empty/broken lines

        const item = {
            kod: columns[headerMapping.kod] || '',
            ad: columns[headerMapping.ad] || '',
            fiyat: parseFloat(columns[headerMapping.fiyat]) || 0,
            stok: parseInt(columns[headerMapping.stok]) || 0
        };

        items.push(item);
    }

    return { items };
}

let PARSED_BULK_PRODUCTS = []; // Holds items parsed from CSV

function initBulkUploadHandlers() {
    PARSED_BULK_PRODUCTS = [];
    const dropzone = document.getElementById('csvDropzone');
    const fileInput = document.getElementById('csvFileInput');
    const submitBtn = document.querySelector('#genericForm button[type="submit"]');
    
    // Default submit button is disabled initially
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Dosya Yükleyin';
    }

    if (!dropzone || !fileInput) return;

    // Clicking the dropzone triggers file dialog
    dropzone.addEventListener('click', () => fileInput.click());

    // Drag-over styling
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(evt => {
        dropzone.addEventListener(evt, () => dropzone.classList.remove('dragover'));
    });

    // Drop handler
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleUploadedCSVFile(e.dataTransfer.files[0]);
        }
    });

    // File change handler
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleUploadedCSVFile(e.target.files[0]);
        }
    });
}

function handleUploadedCSVFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(evt) {
        const text = evt.target.result;
        const result = parseCSV(text);
        
        if (!result) {
            alert('Dosya boş veya okunamadı.');
            return;
        }
        
        if (result.error) {
            alert(result.error);
            return;
        }

        // Validate and preview products
        validateAndShowCSVPreview(result.items);
    };
    
    reader.readAsText(file, 'UTF-8');
}

function validateAndShowCSVPreview(items) {
    const previewArea = document.getElementById('csvPreviewArea');
    const tbody = document.getElementById('csvPreviewTableBody');
    const summaryText = document.getElementById('csvSummaryText');
    const submitBtn = document.querySelector('#genericForm button[type="submit"]');
    
    if (!previewArea || !tbody || !summaryText) return;
    
    tbody.innerHTML = '';
    PARSED_BULK_PRODUCTS = [];
    
    let validCount = 0;
    let errCount = 0;
    
    const uploadedCodes = new Set();
    const existingCodes = new Set(mockData.urunler.map(u => u.kod.toLowerCase().trim()));

    const maxPreview = 10;

    items.forEach((item, idx) => {
        const cleanedCode = (item.kod || '').toLowerCase().trim();
        const cleanedName = (item.ad || '').trim();
        
        let statusText = 'Geçerli';
        let statusClass = 'badge-status-ok';
        let isValid = true;

        if (!cleanedCode || !cleanedName) {
            statusText = 'Hata: Boş alan';
            statusClass = 'badge-status-err';
            isValid = false;
        } else if (existingCodes.has(cleanedCode)) {
            statusText = 'Hata: Kodu zaten var';
            statusClass = 'badge-status-err';
            isValid = false;
        } else if (uploadedCodes.has(cleanedCode)) {
            statusText = 'Hata: Çift Kod (CSV)';
            statusClass = 'badge-status-err';
            isValid = false;
        } else if (isNaN(item.fiyat) || item.fiyat < 0) {
            statusText = 'Hata: Geçersiz fiyat';
            statusClass = 'badge-status-err';
            isValid = false;
        } else if (isNaN(item.stok) || item.stok < 0) {
            statusText = 'Hata: Geçersiz stok';
            statusClass = 'badge-status-err';
            isValid = false;
        }

        if (isValid) {
            validCount++;
            uploadedCodes.add(cleanedCode);
            PARSED_BULK_PRODUCTS.push(item);
        } else {
            errCount++;
        }

        // Render preview row
        if (idx < maxPreview) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding:6px; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-primary); font-weight:600;">${item.kod || '-'}</td>
                <td style="padding:6px; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-secondary);">${item.ad || '-'}</td>
                <td style="padding:6px; border-bottom:1px solid rgba(255,255,255,0.05);">${formatMoney(item.fiyat)}</td>
                <td style="padding:6px; border-bottom:1px solid rgba(255,255,255,0.05);">${item.stok}</td>
                <td style="padding:6px; border-bottom:1px solid rgba(255,255,255,0.05);"><span class="badge-status ${statusClass}">${statusText}</span></td>
            `;
            tbody.appendChild(tr);
        }
    });

    if (items.length > maxPreview) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="5" style="padding:8px; text-align:center; color:var(--text-secondary); font-style:italic;">
                ... ve ${items.length - maxPreview} ürün daha
            </td>
        `;
        tbody.appendChild(tr);
    }

    summaryText.innerHTML = `<i class='bx bx-list-check' style='color:var(--primary); margin-right:5px;'></i> Ön İzleme (${items.length} ürün yüklendi)`;
    
    let footerSummaryDiv = document.getElementById('csvPreviewFooterSummary');
    if (!footerSummaryDiv) {
        footerSummaryDiv = document.createElement('div');
        footerSummaryDiv.id = 'csvPreviewFooterSummary';
        footerSummaryDiv.setAttribute('style', 'margin-top:12px; font-size:12px; display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px dashed var(--border-light);');
        previewArea.appendChild(footerSummaryDiv);
    }
    footerSummaryDiv.innerHTML = `
        <span style="color:var(--text-secondary);"><strong style="color:var(--success);">${validCount}</strong> ürün yüklenebilir, <strong style="color:var(--danger);">${errCount}</strong> satır hatalı.</span>
    `;

    previewArea.style.display = 'block';

    if (submitBtn) {
        if (validCount > 0) {
            submitBtn.disabled = false;
            submitBtn.innerText = `Seçilen ${validCount} Ürünü Yükle`;
        } else {
            submitBtn.disabled = true;
            submitBtn.innerText = 'Yüklenecek Geçerli Ürün Yok';
        }
    }
}

let activePrintInvoiceIndex = null;

function printInvoice(index) {
    activePrintInvoiceIndex = index;
    document.getElementById('printPreviewModal').style.display = 'flex';
    document.getElementById('printThemeSelector').value = 'modern';
    updatePrintPreviewTheme();
}

function closePrintPreview() {
    document.getElementById('printPreviewModal').style.display = 'none';
}

function updatePrintPreviewTheme() {
    const index = activePrintInvoiceIndex;
    const f = mockData.faturalar[index];
    if (!f) return;

    const theme = document.getElementById('printThemeSelector').value;
    const previewContent = document.getElementById('printPreviewContent');

    const subtotal = parseFloat(f.tutar) || 0;
    const kdvRate = parseFloat(f.kdv_orani) || 20;
    const kdvAmount = parseFloat(f.kdv_tutari) || 0;
    const grandTotal = parseFloat(f.genel_toplam) || subtotal;

    let itemsHTML = '';
    if (f.kalemler && f.kalemler.length > 0) {
        itemsHTML = f.kalemler.map(item => `
            <tr>
                <td style="padding:10px; border-bottom:1px solid #eee;">${item.urun}</td>
                <td style="text-align:center; padding:10px; border-bottom:1px solid #eee;">${item.miktar}</td>
                <td style="text-align:right; padding:10px; border-bottom:1px solid #eee;">${formatMoney(item.fiyat)}</td>
                <td style="text-align:right; padding:10px; border-bottom:1px solid #eee;">${formatMoney(item.miktar * item.fiyat)}</td>
            </tr>
        `).join('');
    } else {
        itemsHTML = `
            <tr>
                <td style="padding:10px; border-bottom:1px solid #eee;">Genel Hizmet Bedeli</td>
                <td style="text-align:center; padding:10px; border-bottom:1px solid #eee;">1</td>
                <td style="text-align:right; padding:10px; border-bottom:1px solid #eee;">${formatMoney(subtotal)}</td>
                <td style="text-align:right; padding:10px; border-bottom:1px solid #eee;">${formatMoney(subtotal)}</td>
            </tr>
        `;
    }

    const currentEmail = localStorage.getItem('user_email') || 'demo@kullanici.com';
    const appName = localStorage.getItem('saas_app_name') || 'MücahitSaaS';
    const companyName = localStorage.getItem('saas_company_name') || 'MücahitSaaS Ltd. Şti.';
    const companySlogan = localStorage.getItem('saas_company_slogan') || 'Geleceğin Finans Yönetimi';
    const companyAddress = localStorage.getItem('saas_company_address') || 'Hürriyet Mah. Hürriyet Cad. No:12 D:4, İstanbul';
    const companyPhone = localStorage.getItem('saas_company_phone') || '+90 216 123 45 67';
    const companyTaxOffice = localStorage.getItem('saas_company_tax_office') || 'Kadıköy';
    const companyTaxNo = localStorage.getItem('saas_company_tax_no') || '1234567890';

    let themeStyles = '';
    if (theme === 'modern') {
        themeStyles = `
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            background: #fff;
        `;
    } else if (theme === 'classic') {
        themeStyles = `
            font-family: 'Georgia', serif;
            color: #111827;
            background: #fafafa;
        `;
    } else if (theme === 'minimal') {
        themeStyles = `
            font-family: monospace;
            color: #000;
            background: #fff;
        `;
    }

    let headerHTML = '';
    if (theme === 'modern') {
        let logoBrandHTML = '';
        if (appName.toLowerCase().endsWith('saas')) {
            const base = appName.substring(0, appName.length - 4);
            logoBrandHTML = `${base}<span style="color:#0f172a;">SaaS</span>`;
        } else {
            logoBrandHTML = appName;
        }
        headerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #6366f1; padding-bottom:15px; margin-bottom:20px;">
                <div>
                    <h2 style="margin:0; font-size:28px; font-weight:800; color:#6366f1;">${logoBrandHTML}</h2>
                    <div style="font-size:11px; color:#64748b;">${companySlogan}</div>
                </div>
                <div style="text-align:right;">
                    <h1 style="margin:0; font-size:22px; color:#1e293b; font-weight:700;">SATIŞ FATURASI</h1>
                    <div style="font-size:12px; color:#64748b; margin-top:4px;">No: #MS-${1000 + index} | Tarih: ${f.tarih}</div>
                </div>
            </div>
        `;
    } else if (theme === 'classic') {
        headerHTML = `
            <div style="border:2px solid #991b1b; padding:15px; margin-bottom:20px; border-radius:6px; color:#000;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h2 style="margin:0; font-size:24px; font-weight:bold; color:#991b1b;">${companyName.toUpperCase()}</h2>
                        <div style="font-size:12px; font-style:italic; color:#555;">${companySlogan}</div>
                    </div>
                    <div style="text-align:right; border-left:1px solid #ccc; padding-left:15px; color:#000;">
                        <h2 style="margin:0; font-size:20px; color:#000;">E-FATURA</h2>
                        <div style="font-size:12px; color:#000;"><strong>Fatura No:</strong> MS-${1000 + index}</div>
                        <div style="font-size:12px; color:#000;"><strong>Düzenleme Tarihi:</strong> ${f.tarih}</div>
                    </div>
                </div>
            </div>
        `;
    } else if (theme === 'minimal') {
        headerHTML = `
            <div style="border-bottom:1px dashed #000; padding-bottom:10px; margin-bottom:20px; color:#000;">
                <pre style="margin:0; font-size:14px; font-weight:bold; color:#000;">${appName.toUpperCase()}</pre>
                <pre style="margin:5px 0 0 0; font-size:11px; color:#000;">FATURA NO: #MS-${1000 + index} | TARIH: ${f.tarih}</pre>
            </div>
        `;
    }

    let detailsHTML = '';
    if (theme === 'modern') {
        detailsHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:30px; font-size:13px;">
                <div style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0; color:#1e293b; line-height:1.5;">
                    <h4 style="margin:0 0 8px 0; color:#6366f1; text-transform:uppercase; font-size:11px; letter-spacing:0.5px;">Fatura Kesen Yetkili</h4>
                    <strong>${companyName}</strong><br>
                    E-posta: ${currentEmail}<br>
                    Telefon: ${companyPhone}<br>
                    Vergi Dairesi: ${companyTaxOffice} | V.N: ${companyTaxNo}<br>
                    Adres: ${companyAddress}
                </div>
                <div style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0; color:#1e293b;">
                    <h4 style="margin:0 0 8px 0; color:#6366f1; text-transform:uppercase; font-size:11px; letter-spacing:0.5px;">Müşteri / Alıcı</h4>
                    <strong>${f.cari}</strong><br>
                    Tür: ${f.tur === 'Satış' ? 'Müşteri' : 'Tedarikçi'}<br>
                    Durum: <span style="font-weight:600; color:${f.durum === 'Ödendi' ? '#10b981' : '#f59e0b'}">${f.durum}</span>
                </div>
            </div>
        `;
    } else if (theme === 'classic') {
        detailsHTML = `
            <div style="display:flex; gap:20px; margin-bottom:30px; font-size:12px; color:#000;">
                <div style="flex:1; border:1px solid #ccc; padding:10px; border-radius:4px; color:#000; line-height:1.5;">
                    <h4 style="margin:0 0 5px 0; color:#991b1b; text-decoration:underline;">GÖNDERİCİ BİLGİLERİ</h4>
                    <strong>${companyName}</strong><br>
                    E-posta: ${currentEmail}<br>
                    Tel: ${companyPhone}<br>
                    Vergi: ${companyTaxOffice} V.D. | V.N: ${companyTaxNo}<br>
                    Adres: ${companyAddress}
                </div>
                <div style="flex:1; border:1px solid #ccc; padding:10px; border-radius:4px; color:#000;">
                    <h4 style="margin:0 0 5px 0; color:#991b1b; text-decoration:underline;">ALICI CARİ HESAP</h4>
                    <strong>${f.cari}</strong><br>
                    Fatura Türü: ${f.tur === 'Satış' ? 'Satış' : 'Alış'}<br>
                    Fatura Durumu: ${f.durum}
                </div>
            </div>
        `;
    } else if (theme === 'minimal') {
        detailsHTML = `
            <div style="margin-bottom:20px; font-size:11px; color:#000;">
                <pre style="margin:0 0 10px 0; color:#000;">KAYNAK: ${companyName} [${currentEmail}]
Tel: ${companyPhone} | V.D: ${companyTaxOffice} | V.N: ${companyTaxNo}
Adres: ${companyAddress}</pre>
                <pre style="margin:0; color:#000;">HEDEF CARI: ${f.cari} | TUR: ${f.tur} | DURUM: ${f.durum}</pre>
            </div>
        `;
    }

    let summaryHTML = '';
    if (theme === 'modern') {
        summaryHTML = `
            <div style="display: flex; justify-content: flex-end; margin-top:20px; color:#1e293b;">
                <div style="width: 250px; display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:13px; text-align:right;">
                    <div style="color:#64748b;">Ara Toplam:</div>
                    <div style="font-weight:600; color:#1e293b;">${formatMoney(subtotal)}</div>
                    <div style="color:#64748b;">KDV (%${kdvRate}):</div>
                    <div style="font-weight:600; color:#1e293b;">${formatMoney(kdvAmount)}</div>
                    <div style="border-top:1px solid #e2e8f0; padding-top:10px; font-size:15px; font-weight:700; color:#6366f1;">Genel Toplam:</div>
                    <div style="border-top:1px solid #e2e8f0; padding-top:10px; font-size:15px; font-weight:700; color:#6366f1;">${formatMoney(grandTotal)}</div>
                </div>
            </div>
        `;
    } else if (theme === 'classic') {
        summaryHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-top:25px; color:#000;">
                <div style="border: 1px dashed #777; padding: 10px; border-radius: 4px; font-size: 11px; width: 250px; color:#000;">
                    <div style="text-align:center; font-weight:bold; margin-bottom:5px; color:#000;">KAŞE & İMZA</div>
                    <div style="height:60px;"></div>
                </div>
                <div style="width: 240px; display:grid; grid-template-columns: 1.2fr 1fr; gap:6px; font-size:12px; text-align:right; border-top:1px solid #000; padding-top:10px; color:#000;">
                    <div>Matrah Toplamı:</div>
                    <div style="color:#000;">${formatMoney(subtotal)}</div>
                    <div>Hesaplanan KDV (%${kdvRate}):</div>
                    <div style="color:#000;">${formatMoney(kdvAmount)}</div>
                    <div style="font-weight:bold; font-size:14px; color:#991b1b;">Genel Toplam:</div>
                    <div style="font-weight:bold; font-size:14px; color:#991b1b;">${formatMoney(grandTotal)}</div>
                </div>
            </div>
        `;
    } else if (theme === 'minimal') {
        summaryHTML = `
            <div style="margin-top:20px; font-size:11px; border-top:1px dashed #000; padding-top:10px; color:#000;">
                <pre style="margin:0; text-align:right; color:#000;">MATRAH:        ${formatMoney(subtotal)}</pre>
                <pre style="margin:4px 0 0 0; text-align:right; color:#000;">KDV (%${kdvRate}):     ${formatMoney(kdvAmount)}</pre>
                <pre style="margin:8px 0 0 0; text-align:right; font-weight:bold; color:#000;">TOPLAM TUTAR:   ${formatMoney(grandTotal)}</pre>
            </div>
        `;
    }

    let itemsTableHTML = '';
    if (theme === 'minimal') {
        itemsTableHTML = `
            <div style="border-top:1px solid #000; border-bottom:1px solid #000; padding:10px 0; margin-bottom:20px; color:#000;">
                <table style="width:100%; border-collapse:collapse; font-size:11px; color:#000;">
                    <thead>
                        <tr style="border-bottom:1px dashed #000; color:#000;">
                            <th style="text-align:left; padding:5px 0; color:#000;">ACIKLAMA</th>
                            <th style="width:50px; text-align:center; padding:5px 0; color:#000;">ADET</th>
                            <th style="width:100px; text-align:right; padding:5px 0; color:#000;">FİYAT</th>
                            <th style="width:100px; text-align:right; padding:5px 0; color:#000;">TUTAR</th>
                        </tr>
                    </thead>
                    <tbody style="color:#000;">
                        ${itemsHTML}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        itemsTableHTML = `
            <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:13px; color:#1e293b;">
                <thead>
                    <tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1; color:#1e293b;">
                        <th style="padding:12px 10px; text-align:left; color:#1e293b;">Ürün / Açıklama</th>
                        <th style="width:80px; text-align:center; padding:12px 10px; color:#1e293b;">Miktar</th>
                        <th style="width:120px; text-align:right; padding:12px 10px; color:#1e293b;">Birim Fiyat</th>
                        <th style="width:120px; text-align:right; padding:12px 10px; color:#1e293b;">Toplam</th>
                    </tr>
                </thead>
                <tbody style="color:#1e293b;">
                    ${itemsHTML}
                </tbody>
            </table>
        `;
    }

    previewContent.setAttribute('style', themeStyles);
    previewContent.innerHTML = `
        <div style="padding:10px;">
            ${headerHTML}
            ${detailsHTML}
            ${itemsTableHTML}
            ${summaryHTML}
        </div>
    `;

    const printContainer = document.getElementById('printContainer');
    if (printContainer) {
        printContainer.innerHTML = previewContent.innerHTML;
    }
}

function executePrint() {
    window.print();
}

// --- INVOICE DYNAMIC ITEM INPUT BUILDERS ---
function addInvoiceItemRow() {
    const tableBody = document.getElementById('invoiceItemsTableBody');
    if (!tableBody) return;
    const rowId = Date.now() + Math.random().toString(36).substr(2, 5);
    let productOptions = mockData.urunler.map(p => `<option value="${p.ad}" data-fiyat="${p.fiyat}">${p.ad} (${p.stok} adet stok)</option>`).join('');
    
    const tr = document.createElement('tr');
    tr.id = `item-row-${rowId}`;
    tr.innerHTML = `
        <td>
            <select class="item-prod-select" onchange="onInvoiceItemProductChange('${rowId}', this)" style="width:100%;">
                <option value="">Seçin</option>
                ${productOptions}
            </select>
        </td>
        <td>
            <input type="number" class="item-qty-input" value="1" min="1" onchange="recalculateInvoiceModalTotals()" oninput="recalculateInvoiceModalTotals()" style="width:100%;">
        </td>
        <td>
            <input type="number" class="item-price-input" value="0" min="0" onchange="recalculateInvoiceModalTotals()" oninput="recalculateInvoiceModalTotals()" style="width:100%;">
        </td>
        <td>
            <button type="button" class="btn btn-sm" style="background:var(--danger); color:#fff; padding:6px 10px;" onclick="removeInvoiceItemRow('${rowId}')"><i class='bx bx-trash'></i></button>
        </td>
    `;
    tableBody.appendChild(tr);
    recalculateInvoiceModalTotals();
}

function onInvoiceItemProductChange(rowId, selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const price = selectedOption.dataset.fiyat || 0;
    const row = document.getElementById(`item-row-${rowId}`);
    if (row) {
        row.querySelector('.item-price-input').value = price;
    }
    recalculateInvoiceModalTotals();
}

function removeInvoiceItemRow(rowId) {
    const row = document.getElementById(`item-row-${rowId}`);
    if (row) row.remove();
    recalculateInvoiceModalTotals();
}

function recalculateInvoiceModalTotals() {
    let subtotal = 0;
    const rows = document.querySelectorAll('#invoiceItemsTableBody tr');
    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty-input').value) || 0;
        const price = parseFloat(row.querySelector('.item-price-input').value) || 0;
        subtotal += qty * price;
    });

    const kdvRate = parseFloat(document.getElementById('m_fkdv_rate').value) || 20;
    const kdvAmount = subtotal * (kdvRate / 100);
    const grandTotal = subtotal + kdvAmount;

    const subEl = document.getElementById('invoiceSubtotalDisplay');
    const kdvEl = document.getElementById('invoiceKdvDisplay');
    const totEl = document.getElementById('invoiceTotalDisplay');

    if (subEl) subEl.innerText = formatMoney(subtotal);
    if (kdvEl) kdvEl.innerText = formatMoney(kdvAmount);
    if (totEl) totEl.innerText = formatMoney(grandTotal);
}

/* --- MODAL LOGIC --- */
let currentModalType = '';
function openModal(type) {
    currentModalType = type;
    document.getElementById('appModal').style.display = 'flex';
    let title = '', body = '';

    if(type === 'cari') {
        title = 'Yeni Cari Hesap';
        body = `
            <div class="input-group"><input type="text" id="m_unvan" placeholder="Ünvan / İsim" required></div>
            <div class="input-group">
                <select id="m_tur" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="Müşteri">Müşteri</option>
                    <option value="Tedarikçi">Tedarikçi</option>
                </select>
            </div>
        `;
    } else if (type === 'urun') {
        title = 'Yeni Ürün';
        body = `
            <div class="input-group"><input type="text" id="m_kod" placeholder="Ürün Kodu" required></div>
            <div class="input-group"><input type="text" id="m_ad" placeholder="Ürün Adı" required></div>
            <div class="input-group"><input type="number" id="m_fiyat" placeholder="Fiyat (₺)" required></div>
            <div class="input-group"><input type="number" id="m_stok" placeholder="Stok Miktarı" required></div>
        `;
    } else if (type === 'fatura') {
        title = 'Yeni Fatura';
        let cariOptions = mockData.cariler.map(c => `<option value="${c.unvan}">${c.unvan}</option>`).join('');
        body = `
            <div class="input-group">
                <select id="m_ftur" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="Satış">Satış Faturası (Gelir)</option>
                    <option value="Alış">Alış Faturası (Gider)</option>
                </select>
            </div>
            <div class="input-group">
                <select id="m_fcari" required style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="">Cari Seçin</option>${cariOptions}
                </select>
            </div>
            <div class="input-group">
                <select id="m_fkategori" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="Hizmet Satışı">Hizmet Satışı (Gelir)</option>
                    <option value="Ürün Satışı">Ürün Satışı (Gelir)</option>
                    <option value="Kira">Kira (Gider)</option>
                    <option value="Fatura / Abonelik">Fatura / Abonelik (Gider)</option>
                    <option value="Personel / Maaş">Personel / Maaş (Gider)</option>
                    <option value="Pazarlama / Reklam">Pazarlama / Reklam (Gider)</option>
                    <option value="Ofis Giderleri">Ofis Giderleri (Gider)</option>
                    <option value="Diğer">Diğer Gider/Gelir</option>
                </select>
            </div>
            
            <div style="border:1px solid var(--border-light); border-radius:12px; padding:15px; margin-bottom:15px; background:rgba(0,0,0,0.2);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h4 style="font-size:14px; margin:0;">Fatura Kalemleri</h4>
                    <button type="button" class="btn btn-sm btn-primary" onclick="addInvoiceItemRow()"><i class='bx bx-plus'></i> Kalem Ekle</button>
                </div>
                <div style="overflow-x:auto;">
                    <table class="invoice-items-table">
                        <thead>
                            <tr>
                                <th>Ürün/Hizmet</th>
                                <th style="width:70px;">Miktar</th>
                                <th style="width:100px;">B.Fiyat</th>
                                <th style="width:40px;"></th>
                            </tr>
                        </thead>
                        <tbody id="invoiceItemsTableBody">
                            <!-- Rows added dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="input-group">
                <select id="m_fkdv_rate" onchange="recalculateInvoiceModalTotals()" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="20">KDV %20</option>
                    <option value="10">KDV %10</option>
                    <option value="1">KDV %1</option>
                    <option value="0">KDV %0</option>
                </select>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; font-size:13px; color:var(--text-secondary); background:rgba(255,255,255,0.02); padding:12px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-light);">
                <div style="display:flex; justify-content:space-between;"><span>Ara Toplam:</span><span id="invoiceSubtotalDisplay" style="font-weight:600; color:var(--text-primary);">0.00 ₺</span></div>
                <div style="display:flex; justify-content:space-between;"><span>KDV Tutarı:</span><span id="invoiceKdvDisplay" style="font-weight:600; color:var(--text-primary);">0.00 ₺</span></div>
                <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:700; color:var(--primary);"><span>Genel Toplam:</span><span id="invoiceTotalDisplay">0.00 ₺</span></div>
            </div>

            <div class="input-group">
                <select id="m_fdurum" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="Ödenmedi">Ödenmedi</option>
                    <option value="Ödendi">Ödendi</option>
                </select>
            </div>
            
            <div class="input-group">
                <select id="m_fkasa" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="">Tahsilat/Ödeme Hesabı (İsteğe Bağlı)</option>
                    ${mockData.kasalar.map(k => `<option value="${k.ad}">${k.ad} (${k.para_birimi})</option>`).join('')}
                </select>
            </div>
        `;
    } else if (type === 'kasa') {
        title = 'Yeni Kasa / Banka Hesabı';
        body = `
            <div class="input-group"><input type="text" id="m_kad" placeholder="Hesap Adı (örn: Akbank Ticari, Nakit Kasası)" required></div>
            <div class="input-group">
                <select id="m_ktur" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="Banka">Banka Hesabı</option>
                    <option value="Kasa">Nakit Kasası</option>
                </select>
            </div>
            <div class="input-group"><input type="number" id="m_kbakiye" placeholder="Açılış Bakiyesi" value="0" required></div>
            <div class="input-group">
                <select id="m_kcurr" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="TRY">TRY (₺)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                </select>
            </div>
        `;
    } else if (type === 'ticket') {
        title = 'Yeni Ticket';
        body = `
            <div class="input-group"><input type="text" id="m_tkonu" placeholder="Konu" required></div>
            <div class="input-group">
                <select id="m_toncelik" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="Düşük">Düşük Öncelik</option>
                    <option value="Orta">Orta Öncelik</option>
                    <option value="Yüksek">Yüksek Öncelik</option>
                </select>
            </div>
        `;
    } else if (type === 'cekSenet') {
        title = 'Yeni Çek & Senet Evrağı';
        let cariOptions = mockData.cariler.map(c => `<option value="${c.unvan}">${c.unvan}</option>`).join('');
        body = `
            <div class="input-group">
                <select id="m_cctur" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="Alınan">Müşteriden Alınan (Gelir getirecek)</option>
                    <option value="Verilen">Kendi Verdiğimiz (Ödeme yapılacak)</option>
                </select>
            </div>
            <div class="input-group">
                <select id="m_cctip" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="Çek">Çek</option>
                    <option value="Senet">Senet</option>
                </select>
            </div>
            <div class="input-group">
                <select id="m_cccari" required style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="">Cari Seçin</option>${cariOptions}
                </select>
            </div>
            <div class="input-group">
                <input type="number" id="m_cctutar" placeholder="Tutar (₺)" required>
            </div>
            <div class="input-group">
                <label style="font-size:12px;color:var(--text-secondary);display:block;margin-bottom:5px;">Vade Tarihi</label>
                <input type="date" id="m_ccvade" required>
            </div>
        `;
    } else if (type === 'personel') {
        title = 'Yeni Personel Kaydı';
        body = `
            <div class="input-group"><input type="text" id="m_pisim" placeholder="Ad Soyad" required></div>
            <div class="input-group"><input type="text" id="m_pdept" placeholder="Departman" required></div>
            <div class="input-group"><input type="text" id="m_punvan" placeholder="Unvan" required></div>
            <div class="input-group"><input type="number" id="m_pmaas" placeholder="Aylık Net Maaş (₺)" required></div>
            <div class="input-group">
                <label style="font-size:12px;color:var(--text-secondary);display:block;margin-bottom:5px;">İşe Giriş Tarihi</label>
                <input type="date" id="m_pgiris" required>
            </div>
        `;
    } else if (type === 'teklif') {
        title = 'Yeni Teklif Belgesi';
        let cariOptions = mockData.cariler.map(c => `<option value="${c.unvan}">${c.unvan}</option>`).join('');
        body = `
            <div class="input-group">
                <select id="m_tfcari" required style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="">Cari Seçin</option>${cariOptions}
                </select>
            </div>
            <div style="border:1px solid var(--border-light); border-radius:12px; padding:15px; margin-bottom:15px; background:rgba(0,0,0,0.2);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h4 style="font-size:14px; margin:0;">Teklif Kalemleri</h4>
                    <button type="button" class="btn btn-sm btn-primary" onclick="addInvoiceItemRow()"><i class='bx bx-plus'></i> Kalem Ekle</button>
                </div>
                <div style="overflow-x:auto;">
                    <table class="invoice-items-table">
                        <thead>
                            <tr>
                                <th>Ürün/Hizmet</th>
                                <th style="width:70px;">Miktar</th>
                                <th style="width:100px;">B.Fiyat</th>
                                <th style="width:40px;"></th>
                            </tr>
                        </thead>
                        <tbody id="invoiceItemsTableBody">
                            <!-- Reuse rows added dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; font-size:13px; color:var(--text-secondary); background:rgba(255,255,255,0.02); padding:12px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-light);">
                <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:700; color:var(--primary);"><span>Toplam Teklif Tutarı:</span><span id="invoiceTotalDisplay">0.00 ₺</span></div>
            </div>
        `;
    } else if (type === 'topluUrun') {
        title = 'Toplu Ürün Yükleme (CSV)';
        body = `
            <div style="margin-bottom: 15px; font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
                Excel veya diğer sistemlerden dışa aktardığınız ürün listesini toplu olarak yükleyebilirsiniz. 
                Lütfen Türkçe karakter uyumlu şablonu indirin ve alanları doldurun.
                <br><br>
                <a href="javascript:void(0)" onclick="downloadCSVTemplate()" style="color: var(--primary); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                    <i class='bx bx-download'></i> Örnek CSV Şablonunu İndir
                </a>
            </div>
            
            <div class="upload-dropzone" id="csvDropzone" style="border: 2px dashed rgba(255,255,255,0.15); border-radius: 12px; padding: 30px; text-align: center; background: rgba(255,255,255,0.02); transition: all 0.3s ease; cursor: pointer; position: relative;">
                <input type="file" id="csvFileInput" accept=".csv" style="display: none;">
                <i class='bx bx-cloud-upload' style="font-size: 40px; color: var(--primary); margin-bottom: 10px; display: block;"></i>
                <span style="font-size: 14px; color: var(--text-primary); font-weight: 600; display: block; margin-bottom: 5px;">Dosyayı buraya sürükleyin veya tıklayın</span>
                <span style="font-size: 11px; color: var(--text-secondary);">Sadece .csv dosyaları desteklenir</span>
            </div>

            <div id="csvPreviewArea" style="display: none; margin-top: 20px; border: 1px solid var(--border-light); border-radius: 12px; padding: 15px; background: rgba(0,0,0,0.15);">
                <h4 id="csvSummaryText" style="font-size: 14px; margin-top: 0; margin-bottom: 10px; display: flex; align-items: center; color: var(--text-primary);">
                    <i class='bx bx-list-check' style="color: var(--primary); margin-right: 5px;"></i> Ön İzleme
                </h4>
                <div style="overflow-x: auto; max-height: 200px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary);">
                                <th style="padding: 6px;">Kod</th>
                                <th style="padding: 6px;">Ürün Adı</th>
                                <th style="padding: 6px;">Fiyat</th>
                                <th style="padding: 6px;">Stok</th>
                                <th style="padding: 6px;">Durum</th>
                            </tr>
                        </thead>
                        <tbody id="csvPreviewTableBody">
                            <!-- Dinamik önizleme satırları -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (type === 'gider') {
        title = 'Yeni Gider Ekle';
        body = `
            <div class="input-group">
                <select id="m_gkat" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;" required>
                    <option value="Kira">Kira</option>
                    <option value="Fatura / Abonelik">Fatura / Abonelik</option>
                    <option value="Personel / Maaş">Personel / Maaş</option>
                    <option value="Pazarlama / Reklam">Pazarlama / Reklam</option>
                    <option value="Ofis Giderleri">Ofis Giderleri</option>
                    <option value="Diğer">Diğer Giderler</option>
                </select>
            </div>
            <div class="input-group"><input type="text" id="m_gaciklama" placeholder="Açıklama / Detay" required></div>
            <div class="input-group"><input type="number" id="m_gtutar" placeholder="Gider Tutarı (₺)" required></div>
            <div class="input-group">
                <select id="m_gkasa" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;" required>
                    ${mockData.kasalar.map(k => `<option value="${k.ad}">${k.ad}</option>`).join('')}
                </select>
            </div>
            <div class="input-group">
                <select id="m_gdurum" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="Ödendi">Ödendi</option>
                    <option value="Ödenecek">Ödenecek</option>
                </select>
            </div>
        `;
    } else if (type === 'depo') {
        title = 'Yeni Depo Ekle';
        body = `
            <div class="input-group"><input type="text" id="m_depoad" placeholder="Depo Adı" required></div>
            <div class="input-group"><input type="text" id="m_depokonum" placeholder="Depo Konumu / Adresi" required></div>
            <div class="input-group"><input type="text" id="m_deposorumlu" placeholder="Depo Sorumlusu" required></div>
        `;
    } else if (type === 'depoTransfer') {
        title = 'Yeni Depo Transferi';
        let prodOptions = mockData.urunler.map(u => `<option value="${u.ad}">${u.ad}</option>`).join('');
        let depoOptions = mockData.depolar.map(d => `<option value="${d.ad}">${d.ad}</option>`).join('');
        body = `
            <div class="input-group">
                <select id="m_dt_urun" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;" required>
                    <option value="">Ürün Seçin</option>${prodOptions}
                </select>
            </div>
            <div class="input-group"><input type="number" id="m_dt_miktar" placeholder="Transfer Miktarı" required></div>
            <div class="input-group">
                <select id="m_dt_kaynak" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;" required>
                    <option value="">Kaynak Depo</option>${depoOptions}
                </select>
            </div>
            <div class="input-group">
                <select id="m_dt_hedef" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;" required>
                    <option value="">Hedef Depo</option>${depoOptions}
                </select>
            </div>
        `;
    } else if (type === 'gidenIrsaliye') {
        title = 'Yeni Giden İrsaliye';
        let cariOptions = mockData.cariler.map(c => `<option value="${c.unvan}">${c.unvan}</option>`).join('');
        let prodOptions = mockData.urunler.map(u => `<option value="${u.ad}">${u.ad}</option>`).join('');
        body = `
            <div class="input-group"><input type="text" id="m_ir_no" placeholder="İrsaliye Numarası (örn: IRS-001)" required></div>
            <div class="input-group">
                <select id="m_ir_cari" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;" required>
                    <option value="">Cari Seçin</option>${cariOptions}
                </select>
            </div>
            <div class="input-group">
                <select id="m_ir_urun" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;" required>
                    <option value="">Ürün Seçin</option>${prodOptions}
                </select>
            </div>
            <div class="input-group"><input type="number" id="m_ir_miktar" placeholder="Miktar" required></div>
        `;
    } else if (type === 'fiyatListesi') {
        title = 'Yeni Fiyat Listesi';
        body = `
            <div class="input-group"><input type="text" id="m_fl_ad" placeholder="Fiyat Listesi Adı" required></div>
            <div class="input-group"><input type="number" id="m_fl_indirim" placeholder="İndirim Oranı (%)" value="0" required></div>
            <div class="input-group">
                <label style="font-size:12px;color:var(--text-secondary);display:block;margin-bottom:5px;">Başlangıç Tarihi</label>
                <input type="date" id="m_fl_baslangic" required>
            </div>
            <div class="input-group">
                <label style="font-size:12px;color:var(--text-secondary);display:block;margin-bottom:5px;">Bitiş Tarihi</label>
                <input type="date" id="m_fl_bitis" required>
            </div>
        `;
    } else if (type === 'kullanici') {
        title = 'Yeni Kullanıcı Davet Et';
        body = `
            <div class="input-group"><input type="text" id="m_kul_isim" placeholder="Ad Soyad" required></div>
            <div class="input-group"><input type="email" id="m_kul_eposta" placeholder="E-posta Adresi" required></div>
            <div class="input-group">
                <select id="m_kul_rol" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;" required>
                    <option value="Yönetici">Yönetici</option>
                    <option value="Muhasebe Uzmanı">Muhasebe Uzmanı</option>
                    <option value="Satış Temsilcisi">Satış Temsilcisi</option>
                </select>
            </div>
        `;
    } else if (type === 'etiket') {
        title = 'Yeni Kategori / Etiket Ekle';
        body = `
            <div class="input-group"><input type="text" id="m_et_ad" placeholder="Etiket / Kategori Adı" required></div>
            <div class="input-group"><input type="color" id="m_et_renk" value="#6366f1" style="height:50px; cursor:pointer;" required></div>
            <div class="input-group">
                <select id="m_et_tip" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;" required>
                    <option value="Gelir">Gelir İçi</option>
                    <option value="Gider">Gider İçi</option>
                    <option value="Cari">Cari İçi</option>
                </select>
            </div>
        `;
    }

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerHTML = body;

    if (type === 'topluUrun') {
        initBulkUploadHandlers();
    }
}

function closeModal() {
    document.getElementById('appModal').style.display = 'none';
}

function saveModalData() {
    if(currentModalType === 'cari') {
        const newItem = { unvan: document.getElementById('m_unvan').value, tur: document.getElementById('m_tur').value, bakiye: 0, durum: 'Aktif' };
        mockData.cariler.push(newItem);
        dbSaveItem('cariler', newItem);
    } else if (currentModalType === 'urun') {
        const newItem = { kod: document.getElementById('m_kod').value, ad: document.getElementById('m_ad').value, fiyat: parseFloat(document.getElementById('m_fiyat').value), stok: parseInt(document.getElementById('m_stok').value) };
        mockData.urunler.push(newItem);
        dbSaveItem('urunler', newItem);
    } else if (currentModalType === 'fatura') {
        const fTur = document.getElementById('m_ftur').value;
        const fCari = document.getElementById('m_fcari').value;
        const fDurum = document.getElementById('m_fdurum').value;
        const fKdvRate = parseFloat(document.getElementById('m_fkdv_rate').value) || 20;
        const fKasa = document.getElementById('m_fkasa').value;
        const fKategori = document.getElementById('m_fkategori').value;

        let subtotal = 0;
        let itemsList = [];
        const rows = document.querySelectorAll('#invoiceItemsTableBody tr');
        rows.forEach(row => {
            const prodName = row.querySelector('.item-prod-select').value;
            const qty = parseFloat(row.querySelector('.item-qty-input').value) || 0;
            const price = parseFloat(row.querySelector('.item-price-input').value) || 0;
            if (prodName && qty > 0) {
                subtotal += qty * price;
                itemsList.push({ urun: prodName, miktar: qty, fiyat: price });

                // Automatic Stock updates:
                const prodIndex = mockData.urunler.findIndex(p => p.ad === prodName);
                if (prodIndex !== -1) {
                    if (fTur === 'Satış') {
                        mockData.urunler[prodIndex].stok = Math.max(0, parseInt(mockData.urunler[prodIndex].stok) - parseInt(qty));
                    } else if (fTur === 'Alış') {
                        mockData.urunler[prodIndex].stok = parseInt(mockData.urunler[prodIndex].stok) + parseInt(qty);
                    }
                    dbSaveItem('urunler', mockData.urunler[prodIndex]); // Sync product stock
                }
            }
        });

        const kdvAmount = subtotal * (fKdvRate / 100);
        const grandTotal = subtotal + kdvAmount;

        const newFatura = {
            tarih: new Date().toLocaleDateString('tr-TR'),
            tur: fTur,
            cari: fCari,
            tutar: subtotal,
            kdv_orani: fKdvRate,
            kdv_tutari: kdvAmount,
            genel_toplam: grandTotal,
            durum: fDurum,
            kategori: fKategori,
            kalemler: itemsList
        };

        mockData.faturalar.push(newFatura);
        dbSaveItem('faturalar', newFatura);

        // Auto adjust Safe Box & Bank balances if transaction account selected & status is 'Ödendi'
        if (fKasa && fDurum === 'Ödendi') {
            const kasaIdx = mockData.kasalar.findIndex(k => k.ad === fKasa);
            if (kasaIdx !== -1) {
                let rate = 1;
                const kasaCur = mockData.kasalar[kasaIdx].para_birimi;
                if (kasaCur === 'USD') rate = exchangeRates.USD;
                if (kasaCur === 'EUR') rate = exchangeRates.EUR;

                const amountInKasaCur = grandTotal / rate;

                if (fTur === 'Satış') {
                    mockData.kasalar[kasaIdx].bakiye = parseFloat((parseFloat(mockData.kasalar[kasaIdx].bakiye) + amountInKasaCur).toFixed(2));
                } else {
                    mockData.kasalar[kasaIdx].bakiye = parseFloat((parseFloat(mockData.kasalar[kasaIdx].bakiye) - amountInKasaCur).toFixed(2));
                }
                dbSaveItem('kasalar', mockData.kasalar[kasaIdx]);
            }
        }

        // Adjust Cari balances
        const cariIdx = mockData.cariler.findIndex(c => c.unvan === fCari);
        if (cariIdx !== -1) {
            let changeAmount = grandTotal;
            if (fDurum === 'Ödendi') {
                changeAmount = 0;
            }
            if (changeAmount > 0) {
                if (fTur === 'Satış') {
                    mockData.cariler[cariIdx].bakiye = parseFloat((parseFloat(mockData.cariler[cariIdx].bakiye) + changeAmount).toFixed(2));
                } else {
                    mockData.cariler[cariIdx].bakiye = parseFloat((parseFloat(mockData.cariler[cariIdx].bakiye) - changeAmount).toFixed(2));
                }
                dbSaveItem('cariler', mockData.cariler[cariIdx]);
            }
        }
    } else if (currentModalType === 'kasa') {
        const newItem = {
            ad: document.getElementById('m_kad').value,
            tur: document.getElementById('m_ktur').value,
            bakiye: parseFloat(document.getElementById('m_kbakiye').value) || 0,
            para_birimi: document.getElementById('m_kcurr').value
        };
        mockData.kasalar.push(newItem);
        dbSaveItem('kasalar', newItem);
    } else if (currentModalType === 'ticket') {
        const newItem = { konu: document.getElementById('m_tkonu').value, musteri: '-', oncelik: document.getElementById('m_toncelik').value, durum: 'Açık', tarih: new Date().toLocaleDateString('tr-TR') };
        mockData.tickets.push(newItem);
        dbSaveItem('tickets', newItem);
    } else if (currentModalType === 'cekSenet') {
        const newItem = {
            tur: document.getElementById('m_cctur').value,
            tip: document.getElementById('m_cctip').value,
            cari: document.getElementById('m_cccari').value,
            tutar: parseFloat(document.getElementById('m_cctutar').value) || 0,
            vade_tarihi: document.getElementById('m_ccvade').value,
            durum: 'Portföyde'
        };
        mockData.cekSenetler.push(newItem);
        dbSaveItem('cekSenetler', newItem);
    } else if (currentModalType === 'personel') {
        const newItem = {
            isim: document.getElementById('m_pisim').value,
            departman: document.getElementById('m_pdept').value,
            unvan: document.getElementById('m_punvan').value,
            maas: parseFloat(document.getElementById('m_pmaas').value) || 0,
            giris_tarihi: document.getElementById('m_pgiris').value
        };
        mockData.personeller.push(newItem);
        dbSaveItem('personeller', newItem);
    } else if (currentModalType === 'teklif') {
        const fCari = document.getElementById('m_tfcari').value;
        let subtotal = 0;
        let itemsList = [];
        const rows = document.querySelectorAll('#invoiceItemsTableBody tr');
        rows.forEach(row => {
            const prodName = row.querySelector('.item-prod-select').value;
            const qty = parseFloat(row.querySelector('.item-qty-input').value) || 0;
            const price = parseFloat(row.querySelector('.item-price-input').value) || 0;
            if (prodName && qty > 0) {
                subtotal += qty * price;
                itemsList.push({ urun: prodName, miktar: qty, fiyat: price });
            }
        });
        const newItem = {
            teklif_no: `TKF-${new Date().getFullYear()}-${String(mockData.teklifler.length + 1).padStart(3, '0')}`,
            cari: fCari,
            tutar: subtotal,
            tarih: new Date().toLocaleDateString('tr-TR'),
            durum: 'Beklemede',
            kalemler: itemsList
        };
        mockData.teklifler.push(newItem);
        dbSaveItem('teklifler', newItem);
    } else if (currentModalType === 'topluUrun') {
        if (typeof PARSED_BULK_PRODUCTS === 'undefined' || !PARSED_BULK_PRODUCTS || PARSED_BULK_PRODUCTS.length === 0) {
            alert('Yüklenecek geçerli ürün bulunamadı.');
            return;
        }
        PARSED_BULK_PRODUCTS.forEach(item => {
            mockData.urunler.push(item);
            dbSaveItem('urunler', item);
        });
        alert(`${PARSED_BULK_PRODUCTS.length} adet ürün başarıyla eklendi.`);
        PARSED_BULK_PRODUCTS = [];
    } else if (currentModalType === 'gider') {
        const fTutar = parseFloat(document.getElementById('m_gtutar').value) || 0;
        const fKasa = document.getElementById('m_gkasa').value;
        const fDurum = document.getElementById('m_gdurum').value;
        const newItem = {
            tarih: new Date().toLocaleDateString('tr-TR'),
            kategori: document.getElementById('m_gkat').value,
            aciklama: document.getElementById('m_gaciklama').value,
            tutar: fTutar,
            kasa: fKasa,
            durum: fDurum
        };
        mockData.giderler.push(newItem);
        dbSaveItem('giderler', newItem);
        
        if (fKasa && fDurum === 'Ödendi') {
            const kasaIdx = mockData.kasalar.findIndex(k => k.ad === fKasa);
            if (kasaIdx !== -1) {
                mockData.kasalar[kasaIdx].bakiye = parseFloat((parseFloat(mockData.kasalar[kasaIdx].bakiye) - fTutar).toFixed(2));
                dbSaveItem('kasalar', mockData.kasalar[kasaIdx]);
            }
        }
    } else if (currentModalType === 'depo') {
        const newItem = {
            ad: document.getElementById('m_depoad').value,
            konum: document.getElementById('m_depokonum').value,
            stok_adedi: 0,
            sorumlu: document.getElementById('m_deposorumlu').value
        };
        mockData.depolar.push(newItem);
        dbSaveItem('depolar', newItem);
    } else if (currentModalType === 'depoTransfer') {
        const pName = document.getElementById('m_dt_urun').value;
        const qty = parseInt(document.getElementById('m_dt_miktar').value) || 0;
        const source = document.getElementById('m_dt_kaynak').value;
        const target = document.getElementById('m_dt_hedef').value;
        
        const newItem = {
            tarih: new Date().toLocaleDateString('tr-TR'),
            urun: pName,
            miktar: qty,
            kaynak: source,
            hedef: target,
            durum: 'Tamamlandı'
        };
        mockData.depoTransferleri.push(newItem);
        dbSaveItem('depoTransferleri', newItem);
        
        const logItem = {
            tarih: new Date().toLocaleDateString('tr-TR'),
            urun: pName,
            miktar: qty,
            tip: 'Transfer',
            aciklama: `${source} -> ${target} depo transferi`
        };
        mockData.stokGecmisi.push(logItem);
        dbSaveItem('stokGecmisi', logItem);
        
        const sourceDepoIdx = mockData.depolar.findIndex(d => d.ad === source);
        if (sourceDepoIdx !== -1) {
            mockData.depolar[sourceDepoIdx].stok_adedi = Math.max(0, mockData.depolar[sourceDepoIdx].stok_adedi - qty);
            dbSaveItem('depolar', mockData.depolar[sourceDepoIdx]);
        }
        const targetDepoIdx = mockData.depolar.findIndex(d => d.ad === target);
        if (targetDepoIdx !== -1) {
            mockData.depolar[targetDepoIdx].stok_adedi = mockData.depolar[targetDepoIdx].stok_adedi + qty;
            dbSaveItem('depolar', mockData.depolar[targetDepoIdx]);
        }
    } else if (currentModalType === 'gidenIrsaliye') {
        const pName = document.getElementById('m_ir_urun').value;
        const qty = parseInt(document.getElementById('m_ir_miktar').value) || 0;
        const newItem = {
            irsaliye_no: document.getElementById('m_ir_no').value,
            cari: document.getElementById('m_ir_cari').value,
            tarih: new Date().toLocaleDateString('tr-TR'),
            urun: pName,
            miktar: qty,
            durum: 'Sevk Edildi'
        };
        mockData.gidenIrsaliyeler.push(newItem);
        dbSaveItem('gidenIrsaliyeler', newItem);
        
        const logItem = {
            tarih: new Date().toLocaleDateString('tr-TR'),
            urun: pName,
            miktar: -qty,
            tip: 'Sevk',
            aciklama: `Giden İrsaliye: ${newItem.irsaliye_no}`
        };
        mockData.stokGecmisi.push(logItem);
        dbSaveItem('stokGecmisi', logItem);
    } else if (currentModalType === 'fiyatListesi') {
        const newItem = {
            ad: document.getElementById('m_fl_ad').value,
            indirim_orani: parseFloat(document.getElementById('m_fl_indirim').value) || 0,
            baslangic: document.getElementById('m_fl_baslangic').value,
            bitis: document.getElementById('m_fl_bitis').value,
            durum: 'Aktif'
        };
        mockData.fiyatListeleri.push(newItem);
        dbSaveItem('fiyatListeleri', newItem);
    } else if (currentModalType === 'kullanici') {
        const newItem = {
            isim: document.getElementById('m_kul_isim').value,
            eposta: document.getElementById('m_kul_eposta').value,
            rol: document.getElementById('m_kul_rol').value
        };
        mockData.kullanicilar.push(newItem);
        dbSaveItem('kullanicilar', newItem);
    } else if (currentModalType === 'etiket') {
        const newItem = {
            ad: document.getElementById('m_et_ad').value,
            renk: document.getElementById('m_et_renk').value,
            tip: document.getElementById('m_et_tip').value
        };
        mockData.etiketler.push(newItem);
        dbSaveItem('etiketler', newItem);
    }
    
    closeModal();
    saveData();
}

function deleteData(type, idx) {
    if(confirm('Silmek istediğinize emin misiniz?')) {
        const item = mockData[type][idx];
        dbDeleteItem(type, item); // Delete from Supabase async
        mockData[type].splice(idx, 1);
        saveData();
    }
}

function logout() {
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('authScreen').style.opacity = '1';
    document.getElementById('contentArea').innerHTML = '';
}

// --- NOTIFICATION LOGIC ---
let notifications = [
    { id: 1, title: "MücahitSaaS'a Hoş Geldiniz!", desc: "Finansal yönetim panelinizi keşfetmeye başlayabilirsiniz.", time: "Şimdi", icon: "bx-party", color: "var(--success)" },
    { id: 2, title: "Haftalık Rapor Hazır", desc: "Geçen haftanın gelir-gider raporu otomatik oluşturuldu.", time: "1 saat önce", icon: "bx-trending-up", color: "var(--primary)" },
    { id: 3, title: "Ajanda Hatırlatıcısı", desc: "Bugün için ajandanıza eklenmiş bir not bulunuyor.", time: "2 saat önce", icon: "bx-calendar-star", color: "var(--warning)" }
];

function toggleNotifications(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

function clearNotifications(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    notifications = [];
    renderNotifications();
}

function renderNotifications() {
    const badge = document.getElementById('notificationBadge');
    const list = document.getElementById('notificationList');
    if (!list) return;
    
    if (notifications.length === 0) {
        if (badge) badge.style.display = 'none';
        list.innerHTML = `<div style="text-align:center; padding:25px 10px; color:var(--text-secondary); font-size:13px;">Okunmamış bildiriminiz yok.</div>`;
        return;
    }
    
    if (badge) {
        badge.style.display = 'flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.innerText = notifications.length;
    }
    
    list.innerHTML = notifications.map(n => `
        <div style="padding:12px; background:rgba(255,255,255,0.02); border-radius:10px; border:1px solid var(--border-light); display:flex; gap:12px; align-items:start; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'">
            <div style="padding:8px; background:rgba(255,255,255,0.04); border-radius:8px; color:${n.color}; font-size:18px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i class='bx ${n.icon}'></i>
            </div>
            <div style="flex:1;">
                <h5 style="font-size:13px; font-weight:600; color:var(--text-primary); margin:0 0 3px 0; line-height:1.2;">${n.title}</h5>
                <p style="font-size:11px; color:var(--text-secondary); line-height:1.4; margin:0 0 5px 0;">${n.desc}</p>
                <span style="font-size:10px; color:rgba(255,255,255,0.3); font-weight:500;">${n.time}</span>
            </div>
        </div>
    `).join('');
}

// Global click listener to close notification dropdown when clicked outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notificationDropdown');
    const btn = document.getElementById('notificationBtn');
    if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// --- DATABASE & EMAIL API CONFIG ---
const WEB3FORMS_ACCESS_KEY = ""; // Paste your Web3Forms Access Key here to enable real password reset emails!

const customSupabaseUrl = localStorage.getItem('saas_supabase_url');
const customSupabaseKey = localStorage.getItem('saas_supabase_key');
const SUPABASE_URL = customSupabaseUrl !== null ? customSupabaseUrl : "https://qjnqehrcybnlxxrzkykn.supabase.co";
const SUPABASE_ANON_KEY = customSupabaseKey !== null ? customSupabaseKey : "sb_publishable_8CPQD1mEl6pl9j85Om7XqQ_v0aSAnWE";

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = () => {
        try {
            // Supabase v2 CDN exposes createClient via window.supabase namespace
            // but our local `supabase` variable is in scope - access via the global
            const supabaseLib = window['supabase'] || (typeof createClient !== 'undefined' ? { createClient } : null);
            if (supabaseLib && supabaseLib.createClient) {
                supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log("Supabase Auth initialized successfully!");
                syncFromSupabase().then(() => {
                    if (document.getElementById('appContainer') && document.getElementById('appContainer').style.display === 'flex') {
                        loadPage(CURRENT_PAGE);
                    }
                });
            } else {
                console.warn("Supabase library loaded but createClient not found. Running in offline mode.");
            }
        } catch (e) {
            console.error("Supabase client failed to initialize:", e);
        }
    };
    script.onerror = () => {
        console.warn("Supabase CDN failed to load. Running in offline/localStorage mode.");
    };
    document.head.appendChild(script);
}

// Global variable to store active simulation code
let activeSimCode = "";
let activeSimEmail = "";

function openForgotPassword(event) {
    if (event) event.preventDefault();
    toggleAuth('forgot');
}

function handleForgotSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    if (!email) return;
    
    const btn = event.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Kod Gönderiliyor...`;
    btn.disabled = true;

    setTimeout(() => {
        if (supabase) {
            // Live Supabase Auth Flow
            supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + window.location.pathname
            }).then(({ data, error }) => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                if (error) {
                    alert("Supabase Hatası: " + error.message);
                } else {
                    alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!");
                    toggleAuth('login');
                }
            });
        } else {
            // Beautiful Interactive Simulation Mode
            // Generate a 6-digit random code
            activeSimCode = Math.floor(100000 + Math.random() * 900000).toString();
            activeSimEmail = email;
            
            // Dispatch real email using Web3Forms or FormSubmit
            if (WEB3FORMS_ACCESS_KEY) {
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        name: "MücahitSaaS",
                        email: email,
                        subject: "🔑 MücahitSaaS Şifre Sıfırlama Kodu: " + activeSimCode,
                        message: `Şifre Sıfırlama Kodunuz: ${activeSimCode}\n\nE-posta Adresi: ${email}\n\nAçıklama: MücahitSaaS Şifre Sıfırlama Kodu. Lütfen bu kodu web sitesindeki ekrana girin.`
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log("Real email dispatched via Web3Forms:", data);
                })
                .catch(err => {
                    console.error("Web3Forms Error:", err);
                });
            } else {
                fetch('https://formsubmit.co/ajax/mucahitsalvo@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        "E-posta Adresi": email,
                        "Doğrulama Kodu": activeSimCode,
                        "Açıklama": "MücahitSaaS Şifre Sıfırlama Kodu. Lütfen bu kodu web sitesindeki ekrana girin.",
                        "_subject": "🔑 MücahitSaaS Şifre Sıfırlama Kodu: " + activeSimCode
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log("Real email dispatched via FormSubmit:", data);
                })
                .catch(err => {
                    console.error("FormSubmit Error:", err);
                });
            }

            btn.innerHTML = originalText;
            btn.disabled = false;

            // Transition to Step 2
            document.getElementById('forgotStep1').style.display = 'none';
            document.getElementById('forgotStep2').style.display = 'block';
            document.getElementById('forgotStep2Title').innerText = `Doğrulama kodunuz ${email} e-posta adresine başarıyla gönderildi!`;
            
            // Verification code is sent securely via email (on-screen toast disabled for production security)
        }
    }, 1200);
}

function verifyAndResetPassword() {
    const enteredCode = document.getElementById('forgotCode').value.trim();
    const newPassword = document.getElementById('forgotNewPassword').value.trim();
    
    if (!enteredCode || !newPassword) return alert("Lütfen kod ve yeni şifre girin.");
    
    // Support Supabase Live Password Update from Recovery Email
    if (supabase && activeSimCode === "supabase_recovery") {
        supabase.auth.updateUser({ password: newPassword }).then(({ data, error }) => {
            if (error) {
                alert("Supabase Şifre Güncelleme Hatası: " + error.message);
            } else {
                alert("Şifreniz Supabase üzerinde başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.");
                // Clean up hash
                window.location.hash = "";
                // Clear inputs and return to login screen
                document.getElementById('forgotEmail').value = "";
                document.getElementById('forgotCode').value = "";
                document.getElementById('forgotNewPassword').value = "";
                // Restore code input visibility
                const codeInput = document.getElementById('forgotCode');
                if (codeInput) codeInput.style.display = 'block';
                toggleAuth('login');
            }
        });
        return;
    }
    
    if (enteredCode !== activeSimCode) {
        return alert("Girdiğiniz doğrulama kodu hatalı! Lütfen kodu kontrol edin.");
    }
    
    // Success: Update the password in mock registration credentials in localStorage
    localStorage.setItem(`user_pwd_${activeSimEmail}`, newPassword);
    
    // Also save in mockData or global user settings
    alert("Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.");
    
    // Clear inputs and return to login screen
    document.getElementById('forgotEmail').value = "";
    document.getElementById('forgotCode').value = "";
    document.getElementById('forgotNewPassword').value = "";
    toggleAuth('login');
}

function showSimToast(message) {
    // Create a beautiful, glowing simulation notification toast
    const toast = document.createElement('div');
    toast.className = 'glass-panel';
    toast.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.25));
        border: 1px solid var(--primary);
        box-shadow: 0 0 15px var(--primary-glow);
        padding: 16px 24px;
        border-radius: 12px;
        color: #fff;
        z-index: 9999;
        font-family: var(--font-heading);
        font-weight: 600;
        font-size: 14px;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    toast.innerHTML = `
        <i class='bx bx-mail-send' style='font-size:20px; color:var(--secondary);'></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 10000);
}

// --- SANAL POS GATEWAY SIMULATOR ---
let activePosInvoiceIndex = null;

function openSanalPos(index) {
    activePosInvoiceIndex = index;
    const f = mockData.faturalar[index];
    if (!f) return;

    document.getElementById('sanalPosModal').style.display = 'flex';
    document.getElementById('posFormContainer').style.display = 'block';
    document.getElementById('posLoaderContainer').style.display = 'none';
    document.getElementById('pos3dContainer').style.display = 'none';

    document.getElementById('posInvoiceNo').innerText = `#MS-${1000 + index}`;
    document.getElementById('posCustomer').innerText = f.cari;
    document.getElementById('posAmount').innerText = formatMoney(f.genel_toplam || f.tutar);

    document.getElementById('posCardHolder').value = '';
    document.getElementById('posCardNumber').value = '';
    document.getElementById('posExpiry').value = '';
    document.getElementById('posCvv').value = '';
    document.getElementById('posSmsCode').value = '';

    updateCardMockup();
}

function closeSanalPos() {
    document.getElementById('sanalPosModal').style.display = 'none';
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formatted += ' ';
        }
        formatted += value[i];
    }
    input.value = formatted;
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) {
        input.value = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else {
        input.value = value;
    }
}

function updateCardMockup() {
    const holder = document.getElementById('posCardHolder').value.trim();
    const number = document.getElementById('posCardNumber').value.trim();
    const expiry = document.getElementById('posExpiry').value.trim();

    document.getElementById('mockCardHolder').innerText = holder ? holder.toUpperCase() : 'İSİM SOYİSİM';
    document.getElementById('mockCardNumber').innerText = number ? number : '•••• •••• •••• ••••';
    document.getElementById('mockCardExpiry').innerText = expiry ? expiry : 'MM/YY';

    const cleanNum = number.replace(/\s/g, '');
    const brandLogo = document.getElementById('mockCardBrand');
    const cardMockup = document.getElementById('cardMockup');

    if (cleanNum.startsWith('4')) {
        brandLogo.innerText = 'VISA';
        cardMockup.style.background = 'linear-gradient(135deg, #1e3a8a, #3b82f6, #1d4ed8)';
    } else if (cleanNum.startsWith('5')) {
        brandLogo.innerText = 'Mastercard';
        cardMockup.style.background = 'linear-gradient(135deg, #7c2d12, #ea580c, #431407)';
    } else {
        brandLogo.innerText = 'TROY';
        cardMockup.style.background = 'linear-gradient(135deg, #0f172a, #1e1b4b, #311042)';
    }
}

function processPosPayment(event) {
    event.preventDefault();

    document.getElementById('posFormContainer').style.display = 'none';
    document.getElementById('posLoaderContainer').style.display = 'block';

    setTimeout(() => {
        document.getElementById('posLoaderContainer').style.display = 'none';
        document.getElementById('pos3dContainer').style.display = 'block';
    }, 2000);
}

function verify3dCode() {
    const code = document.getElementById('posSmsCode').value.trim();
    if (code !== '123456') {
        alert("Hatalı doğrulama kodu! Lütfen tekrar deneyin. (Simülasyon şifresi: 123456)");
        return;
    }

    const index = activePosInvoiceIndex;
    const f = mockData.faturalar[index];
    if (!f) return;

    f.durum = 'Ödendi';
    dbSaveItem('faturalar', f);

    const cariIdx = mockData.cariler.findIndex(c => c.unvan === f.cari);
    if (cariIdx !== -1) {
        const amt = parseFloat(f.genel_toplam || f.tutar) || 0;
        mockData.cariler[cariIdx].bakiye = parseFloat((parseFloat(mockData.cariler[cariIdx].bakiye) - amt).toFixed(2));
        dbSaveItem('cariler', mockData.cariler[cariIdx]);
    }

    const bankIdx = mockData.kasalar.findIndex(k => k.ad.includes('Garanti Bankası'));
    if (bankIdx !== -1) {
        const amt = parseFloat(f.genel_toplam || f.tutar) || 0;
        mockData.kasalar[bankIdx].bakiye = parseFloat((parseFloat(mockData.kasalar[bankIdx].bakiye) + amt).toFixed(2));
        dbSaveItem('kasalar', mockData.kasalar[bankIdx]);
    }

    notifications.unshift({
        id: Date.now(),
        title: "Kredi Kartı Tahsilatı",
        desc: `${f.cari} firmasından ${formatMoney(f.genel_toplam || f.tutar)} kredi kartıyla tahsil edildi.`,
        time: "Şimdi",
        icon: "bx-credit-card",
        color: "var(--success)"
    });
    if (typeof renderNotifications === 'function') renderNotifications();

    alert("Ödeme başarıyla gerçekleştirildi! Fatura kapatıldı, cari bakiye düşürüldü ve banka hesabı güncellendi.");
    closeSanalPos();
    saveData();
}

function toggleSidebar(e) {
    if (e) e.preventDefault();
    const sidebar = document.getElementById('sidebarMenu');
    const toggleIcon = document.getElementById('sidebarToggleIcon');
    if (!sidebar) return;

    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebar_collapsed', isCollapsed ? 'true' : 'false');

    if (toggleIcon) {
        if (isCollapsed) {
            toggleIcon.className = 'bx bx-chevrons-right';
        } else {
            toggleIcon.className = 'bx bx-chevrons-left';
        }
    }
}

function toggleSubmenu(e, submenuId) {
    if (e) e.preventDefault();
    
    const sidebar = document.getElementById('sidebarMenu');
    const submenu = document.getElementById(submenuId);
    if (!submenu) return;
    const parentItem = submenu.parentElement;

    const isCollapsed = (sidebar && sidebar.classList.contains('collapsed')) || window.innerWidth <= 768;

    if (isCollapsed) {
        // Collapsed or mobile popup view
        const wasActive = parentItem.classList.contains('active-popup');
        
        // Close all other popups first
        document.querySelectorAll('.has-submenu').forEach(p => {
            p.classList.remove('active-popup');
        });
        
        if (!wasActive) {
            parentItem.classList.add('active-popup');
        }
        return;
    }

    const allSubmenus = document.querySelectorAll('.submenu-list');
    const allParents = document.querySelectorAll('.has-submenu');

    // Close all other submenus first to create accordion effect
    allSubmenus.forEach(sub => {
        if (sub.id !== submenuId) {
            sub.classList.remove('open');
        }
    });
    allParents.forEach(p => {
        if (p !== parentItem) {
            const navLink = p.querySelector('.nav-item');
            if (navLink) navLink.classList.remove('open');
        }
    });

    submenu.classList.toggle('open');
    if (parentItem) {
        const navLink = parentItem.querySelector('.nav-item');
        if (navLink) navLink.classList.toggle('open');
    }
}

// Close popups on click outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-submenu')) {
        document.querySelectorAll('.has-submenu').forEach(p => {
            p.classList.remove('active-popup');
        });
    }
});

// Check sidebar state on load
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebarMenu');
    const toggleIcon = document.getElementById('sidebarToggleIcon');
    const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';

    if (sidebar && isCollapsed) {
        sidebar.classList.add('collapsed');
        if (toggleIcon) {
            toggleIcon.className = 'bx bx-chevrons-right';
        }
    }
});

// ==========================================
// NEW MODULES AND DYNAMIC REPORT RENDERING
// ==========================================

function renderGiderler(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Gider Listesi</h1><p style="color:var(--text-secondary)">Firma giderleri ve harcama dökümleri</p></div>
            <button class="btn btn-primary btn-sm" onclick="openModal('gider')"><i class='bx bx-plus'></i> Yeni Gider Ekle</button>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Tarih</th><th>Kategori</th><th>Açıklama</th><th>Tutar</th><th>Kasa / Banka</th><th>Durum</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.giderler.length === 0 ? '<tr><td colspan="7" style="text-align:center;">Henüz gider eklenmedi.</td></tr>' : 
                      mockData.giderler.map((g, i) => `
                        <tr>
                            <td style="color:var(--text-secondary)">${g.tarih}</td>
                            <td><span class="status-badge" style="background:rgba(239, 68, 68, 0.08); color:var(--danger); border:1px solid rgba(239,68,68,0.15)">${g.kategori}</span></td>
                            <td style="font-weight:500;">${g.aciklama}</td>
                            <td style="font-weight:600; color:var(--danger);">${formatMoney(g.tutar)}</td>
                            <td>${g.kasa}</td>
                            <td><span class="status-badge status-${g.durum === 'Ödendi' ? 'success' : 'warning'}">${g.durum}</span></td>
                            <td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('giderler', ${i})"><i class='bx bx-trash'></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderGelenEFaturalar(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Gelen e-Faturalar</h1><p style="color:var(--text-secondary)">Tedarikçiler tarafından firmanıza kesilen e-Faturalar</p></div>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Fatura No</th><th>Cari (Tedarikçi)</th><th>Tarih</th><th>Tutar</th><th>Kategori</th><th>Durum</th><th>İşlemler</th></tr></thead>
                <tbody>
                    ${mockData.gelenEFaturalar.length === 0 ? '<tr><td colspan="7" style="text-align:center;">Gelen yeni e-Fatura bulunmuyor.</td></tr>' : 
                      mockData.gelenEFaturalar.map((g, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);">${g.fatura_no}</td>
                            <td style="font-weight:600;">${g.cari}</td>
                            <td style="color:var(--text-secondary)">${g.tarih}</td>
                            <td style="font-weight:600; color:var(--danger);">${formatMoney(g.tutar)}</td>
                            <td>${g.kategori}</td>
                            <td><span class="status-badge status-warning">${g.durum}</span></td>
                            <td style="display:flex; gap:8px;">
                                <button class="btn btn-sm" style="background:var(--success); color:#fff;" onclick="acceptEInvoice(${i})"><i class='bx bx-check'></i> Kabul Et</button>
                                <button class="btn btn-sm" style="background:var(--danger); color:#fff;" onclick="rejectEInvoice(${i})"><i class='bx bx-x'></i> Reddet</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function acceptEInvoice(idx) {
    const inv = mockData.gelenEFaturalar[idx];
    if (!inv) return;
    
    // Add new purchase invoice
    const newFatura = {
        tarih: new Date().toLocaleDateString('tr-TR'),
        tur: 'Alış',
        cari: inv.cari,
        tutar: inv.tutar,
        kdv_orani: 20,
        kdv_tutari: inv.tutar * 0.2,
        genel_toplam: inv.tutar * 1.2,
        durum: 'Ödenmedi',
        kategori: inv.kategori || 'Fatura / Abonelik',
        kalemler: [{ urun: inv.kategori || 'Hizmet Alımı', miktar: 1, fiyat: inv.tutar }]
    };
    
    mockData.faturalar.push(newFatura);
    dbSaveItem('faturalar', newFatura);
    
    // Increase supplier debt
    const cariIdx = mockData.cariler.findIndex(c => c.unvan === inv.cari);
    if (cariIdx !== -1) {
        mockData.cariler[cariIdx].bakiye = parseFloat((parseFloat(mockData.cariler[cariIdx].bakiye) - newFatura.genel_toplam).toFixed(2));
        dbSaveItem('cariler', mockData.cariler[cariIdx]);
    } else {
        const newCari = { unvan: inv.cari, tur: 'Tedarikçi', bakiye: -newFatura.genel_toplam, durum: 'Aktif' };
        mockData.cariler.push(newCari);
        dbSaveItem('cariler', newCari);
    }
    
    // Remove from incoming list
    mockData.gelenEFaturalar.splice(idx, 1);
    saveData();
    alert("e-Fatura kabul edildi! Fatura Alış faturası olarak kaydedildi ve tedarikçi borç bakiyesi güncellendi.");
}

function rejectEInvoice(idx) {
    if (confirm("Bu faturayı reddetmek istediğinize emin misiniz?")) {
        mockData.gelenEFaturalar.splice(idx, 1);
        saveData();
        alert("e-Fatura reddedildi.");
    }
}

function renderDepolar(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Depolar</h1><p style="color:var(--text-secondary)">Ürün depolama alanları ve depo listesi</p></div>
            <button class="btn btn-primary btn-sm" onclick="openModal('depo')"><i class='bx bx-plus'></i> Yeni Depo Ekle</button>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Depo Adı</th><th>Konum</th><th>Sorumlu</th><th>Stok Durumu</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.depolar.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Henüz depo eklenmedi.</td></tr>' : 
                      mockData.depolar.map((d, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);"><i class='bx bx-buildings' style="margin-right:8px; color:var(--primary);"></i>${d.ad}</td>
                            <td>${d.konum}</td>
                            <td>${d.sorumlu}</td>
                            <td style="font-weight:600; color:var(--success);">${d.stok_adedi || 0} Adet Ürün</td>
                            <td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('depolar', ${i})"><i class='bx bx-trash'></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderDepoTransfer(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Depolar Arası Transfer</h1><p style="color:var(--text-secondary)">Depolar arası stok hareket ve sevk fişleri</p></div>
            <button class="btn btn-primary btn-sm" onclick="openModal('depoTransfer')"><i class='bx bx-transfer'></i> Yeni Transfer Yap</button>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Tarih</th><th>Ürün Adı</th><th>Miktar</th><th>Kaynak Depo</th><th>Hedef Depo</th><th>Durum</th></tr></thead>
                <tbody>
                    ${mockData.depoTransferleri.length === 0 ? '<tr><td colspan="6" style="text-align:center;">Henüz transfer işlemi yapılmadı.</td></tr>' : 
                      mockData.depoTransferleri.map((t, i) => `
                        <tr>
                            <td style="color:var(--text-secondary)">${t.tarih}</td>
                            <td style="font-weight:600;">${t.urun}</td>
                            <td style="font-weight:600; color:var(--primary);">${t.miktar} Adet</td>
                            <td>${t.kaynak}</td>
                            <td><i class='bx bx-right-arrow-alt' style="margin-right:5px; color:var(--text-secondary);"></i>${t.hedef}</td>
                            <td><span class="status-badge status-${t.durum === 'Tamamlandı' ? 'success' : 'warning'}">${t.durum}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderGidenIrsaliye(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Giden İrsaliyeler</h1><p style="color:var(--text-secondary)">Müşterilere sevk edilen ürün irsaliyeleri</p></div>
            <button class="btn btn-primary btn-sm" onclick="openModal('gidenIrsaliye')"><i class='bx bx-plus'></i> Sevk İrsaliyesi Oluştur</button>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>İrsaliye No</th><th>Müşteri / Cari</th><th>Tarih</th><th>Ürün</th><th>Miktar</th><th>Durum</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.gidenIrsaliyeler.length === 0 ? '<tr><td colspan="7" style="text-align:center;">Henüz giden irsaliye yok.</td></tr>' : 
                      mockData.gidenIrsaliyeler.map((ir, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);">${ir.irsaliye_no}</td>
                            <td>${ir.cari}</td>
                            <td style="color:var(--text-secondary)">${ir.tarih}</td>
                            <td>${ir.urun}</td>
                            <td>${ir.miktar} Adet</td>
                            <td><span class="status-badge status-${ir.durum === 'Faturalandırıldı' ? 'success' : 'warning'}">${ir.durum}</span></td>
                            <td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('gidenIrsaliyeler', ${i})"><i class='bx bx-trash'></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderGelenIrsaliye(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Gelen İrsaliyeler</h1><p style="color:var(--text-secondary)">Tedarikçilerden gelen sevk irsaliyeleri</p></div>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>İrsaliye No</th><th>Tedarikçi / Cari</th><th>Tarih</th><th>Ürün</th><th>Miktar</th><th>Durum</th></tr></thead>
                <tbody>
                    ${mockData.gelenIrsaliyeler.length === 0 ? '<tr><td colspan="6" style="text-align:center;">Henüz gelen irsaliye yok.</td></tr>' : 
                      mockData.gelenIrsaliyeler.map((ir, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);">${ir.irsaliye_no}</td>
                            <td>${ir.cari}</td>
                            <td style="color:var(--text-secondary)">${ir.tarih}</td>
                            <td>${ir.urun}</td>
                            <td>${ir.miktar} Adet</td>
                            <td><span class="status-badge status-success">${ir.durum}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderFiyatListeleri(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Fiyat Listeleri</h1><p style="color:var(--text-secondary)">Bayi, toptan veya perakende özel fiyat listeleri</p></div>
            <button class="btn btn-primary btn-sm" onclick="openModal('fiyatListesi')"><i class='bx bx-plus'></i> Fiyat Listesi Ekle</button>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Liste Adı</th><th>Genel İndirim Oranı</th><th>Başlangıç Tarihi</th><th>Bitiş Tarihi</th><th>Durum</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.fiyatListeleri.length === 0 ? '<tr><td colspan="6" style="text-align:center;">Henüz fiyat listesi tanımlanmadı.</td></tr>' : 
                      mockData.fiyatListeleri.map((f, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);">${f.ad}</td>
                            <td style="font-weight:600; color:var(--primary);">%${f.indirim_orani}</td>
                            <td>${f.baslangic}</td>
                            <td>${f.bitis}</td>
                            <td><span class="status-badge status-success">${f.durum}</span></td>
                            <td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('fiyatListeleri', ${i})"><i class='bx bx-trash'></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderStokGecmisi(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Stok Geçmişi</h1><p style="color:var(--text-secondary)">Envanter hareketleri ve stok kartı denetim dökümleri</p></div>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Tarih</th><th>Ürün Adı</th><th>Miktar</th><th>Hareket Tipi</th><th>Açıklama</th></tr></thead>
                <tbody>
                    ${mockData.stokGecmisi.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Henüz envanter hareketi bulunmuyor.</td></tr>' : 
                      mockData.stokGecmisi.map((s, i) => `
                        <tr>
                            <td style="color:var(--text-secondary)">${s.tarih}</td>
                            <td style="font-weight:600;">${s.urun}</td>
                            <td style="font-weight:600; color:${s.miktar >= 0 ? 'var(--success)' : 'var(--danger)'};">${s.miktar >= 0 ? '+' : ''}${s.miktar} Adet</td>
                            <td><span class="status-badge" style="background:rgba(99, 102, 241, 0.08); color:var(--primary); border:1px solid rgba(99,102,241,0.15);">${s.tip || 'Düzeltme'}</span></td>
                            <td>${s.aciklama}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderETicaretSiparisler(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">e-Ticaret Siparişleri</h1><p style="color:var(--text-secondary)">Entegre pazaryerlerinden çekilen online siparişler</p></div>
            <button class="btn btn-primary btn-sm" id="syncOrdersBtn" onclick="syncETicaretOrders()"><i class='bx bx-sync bx-spin-hover'></i> Entegrasyondan Güncelle</button>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Sipariş No</th><th>Pazaryeri</th><th>Müşteri</th><th>Tutar</th><th>Tarih</th><th>Durum</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.eticaretSiparisler.length === 0 ? '<tr><td colspan="7" style="text-align:center;">Sipariş bulunmuyor. Entegrasyondan güncelle butonuna basarak çekebilirsiniz.</td></tr>' : 
                      mockData.eticaretSiparisler.map((s, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);">${s.siparis_no}</td>
                            <td>
                                <span class="status-badge" style="background:rgba(245, 158, 11, 0.08); color:var(--warning); border:1px solid rgba(245,158,11,0.15); font-weight:600;">
                                    ${s.pazar_yeri}
                                </span>
                            </td>
                            <td>${s.cari}</td>
                            <td style="font-weight:600; color:var(--primary);">${formatMoney(s.tutar)}</td>
                            <td style="color:var(--text-secondary)">${s.tarih}</td>
                            <td><span class="status-badge status-${s.durum === "ERP'ye Aktarıldı" ? 'success' : 'danger'}">${s.durum}</span></td>
                            <td>
                                ${s.durum === 'Beklemede' ? `
                                    <button class="btn btn-sm" style="background:var(--primary); color:#fff;" onclick="billETicaretOrder(${i})"><i class='bx bx-file'></i> Faturalandır</button>
                                ` : `<i class='bx bx-check-double' style="color:var(--success); font-size:20px;"></i>`}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function billETicaretOrder(idx) {
    const order = mockData.eticaretSiparisler[idx];
    if (!order) return;
    
    const newFatura = {
        tarih: new Date().toLocaleDateString('tr-TR'),
        tur: 'Satış',
        cari: order.cari,
        tutar: order.tutar / 1.2,
        kdv_orani: 20,
        kdv_tutari: (order.tutar / 1.2) * 0.2,
        genel_toplam: order.tutar,
        durum: 'Ödendi',
        kategori: 'Ürün Satışı',
        kalemler: [{ urun: 'E-Ticaret Siparişi: ' + order.siparis_no, miktar: 1, fiyat: order.tutar / 1.2 }]
    };
    
    mockData.faturalar.push(newFatura);
    dbSaveItem('faturalar', newFatura);
    
    if (mockData.kasalar.length > 0) {
        mockData.kasalar[0].bakiye = parseFloat((parseFloat(mockData.kasalar[0].bakiye) + order.tutar).toFixed(2));
        dbSaveItem('kasalar', mockData.kasalar[0]);
    }
    
    mockData.eticaretSiparisler[idx].durum = "ERP'ye Aktarıldı";
    saveData();
    alert("Sipariş başarıyla faturalandırıldı! Satış faturası oluşturuldu ve kasa bakiyesi güncellendi.");
}

function syncETicaretOrders() {
    const btn = document.getElementById('syncOrdersBtn');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class='bx bx-sync bx-spin'></i> Eşitleniyor...`;
        btn.disabled = true;
        setTimeout(() => {
            const newOrder = {
                siparis_no: 'TY-' + Math.floor(10000 + Math.random() * 90000) + '-99',
                pazar_yeri: 'Trendyol',
                cari: 'Selin Yurtseven',
                tutar: Math.floor(200 + Math.random() * 800),
                tarih: new Date().toLocaleDateString('tr-TR'),
                durum: 'Beklemede'
            };
            mockData.eticaretSiparisler.push(newOrder);
            saveData();
            alert("Entegrasyonlar başarıyla sorgulandı: 1 yeni sipariş çekildi!");
        }, 1200);
    }
}

function renderETicaretEntegrasyon(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">e-Ticaret Entegrasyonları</h1><p style="color:var(--text-secondary)">Trendyol, Hepsiburada ve e-Ticaret sitenizin API ayarları</p></div>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px;" class="fade-in">
            ${mockData.eticaretEntegrasyonlar.map((e, i) => `
                <div class="glass-panel integration-card" style="padding:24px; display:flex; flex-direction:column; gap:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-light); padding-bottom:10px;">
                        <h3 style="font-size:16px; margin:0; display:flex; align-items:center; gap:8px;"><i class='bx bx-rocket' style="color:var(--primary);"></i> ${e.ad}</h3>
                        <label class="switch" style="position:relative; display:inline-block; width:44px; height:24px;">
                            <input type="checkbox" ${e.durum ? 'checked' : ''} onchange="toggleEntegrasyon(${i}, this)" style="opacity:0; width:0; height:0;">
                            <span class="slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:rgba(255,255,255,0.1); transition:.4s; border-radius:34px;"></span>
                        </label>
                    </div>
                    <div>
                        <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:5px;">Satıcı ID / Mağaza Kodu</label>
                        <input type="text" class="m_int_satici" value="${e.satici_id || ''}" placeholder="örn: 12345" style="width:100%; padding:10px 12px; background:rgba(0,0,0,0.3); border:1px solid var(--border-light); border-radius:8px; color:#fff; outline:none;">
                    </div>
                    <div>
                        <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:5px;">API Key (Kullanıcı Adı)</label>
                        <input type="text" class="m_int_key" value="${e.api_key || ''}" placeholder="API Key" style="width:100%; padding:10px 12px; background:rgba(0,0,0,0.3); border:1px solid var(--border-light); border-radius:8px; color:#fff; outline:none;">
                    </div>
                    <div>
                        <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:5px;">API Secret (Şifre)</label>
                        <input type="password" class="m_int_secret" value="${e.api_secret || ''}" placeholder="••••••••••••••••" style="width:100%; padding:10px 12px; background:rgba(0,0,0,0.3); border:1px solid var(--border-light); border-radius:8px; color:#fff; outline:none;">
                    </div>
                    <button class="btn btn-primary w-100 btn-sm" onclick="saveEntegrasyonKeys(${i})"><i class='bx bx-save'></i> Ayarları Kaydet</button>
                </div>
            `).join('')}
        </div>
    `;
    
    const styleTagId = "custom-toggle-switch-style";
    if(!document.getElementById(styleTagId)) {
        const style = document.createElement('style');
        style.id = styleTagId;
        style.innerHTML = `
            .switch input:checked + .slider { background-color: var(--primary) !important; }
            .switch input:checked + .slider:before { transform: translateX(20px); }
            .slider:before {
                position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
                background-color: white; transition: .4s; border-radius: 50%;
            }
        `;
        document.head.appendChild(style);
    }
}

function toggleEntegrasyon(idx, checkbox) {
    mockData.eticaretEntegrasyonlar[idx].durum = checkbox.checked;
    saveData();
}

function saveEntegrasyonKeys(idx) {
    const card = document.querySelectorAll('.integration-card')[idx];
    if (card) {
        const saticiId = card.querySelector('.m_int_satici').value;
        const apiKey = card.querySelector('.m_int_key').value;
        const apiSecret = card.querySelector('.m_int_secret').value;
        
        mockData.eticaretEntegrasyonlar[idx].satici_id = saticiId;
        mockData.eticaretEntegrasyonlar[idx].api_key = apiKey;
        mockData.eticaretEntegrasyonlar[idx].api_secret = apiSecret;
        mockData.eticaretEntegrasyonlar[idx].durum = true;
        
        saveData();
        alert("Entegrasyon kimlik bilgileri başarıyla kaydedildi ve bağlantı aktif edildi.");
    }
}

function renderETicaretEslesme(container) {
    let erpProdOptions = mockData.urunler.map(u => `<option value="${u.kod}">${u.ad} (${u.kod})</option>`).join('');
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Eşleştirilen Ürünler</h1><p style="color:var(--text-secondary)">Pazaryerindeki ilanların local ERP ürün kartlarıyla eşleşmesi</p></div>
        </div>
        
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:24px;" class="fade-in">
            <div class="glass-panel" style="padding:24px; height:fit-content;">
                <h3 style="font-size:16px; margin-bottom:15px; border-bottom:1px solid var(--border-light); padding-bottom:10px;">Yeni Eşleşme Ekle</h3>
                <div style="display:flex; flex-direction:column; gap:14px;">
                    <div>
                        <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:5px;">Pazaryeri İlan Başlığı / SKU</label>
                        <input type="text" id="eslesme_title" placeholder="örn: Trend Ceket Kırmızı - L" style="width:100%; padding:10px 12px; background:rgba(0,0,0,0.3); border:1px solid var(--border-light); border-radius:8px; color:#fff; outline:none;">
                    </div>
                    <div>
                        <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:5px;">ERP Envanter Ürünü</label>
                        <select id="eslesme_code" style="width:100%; padding:10px 12px; background:rgba(0,0,0,0.3); border:1px solid var(--border-light); border-radius:8px; color:#fff; outline:none;">
                            ${erpProdOptions}
                        </select>
                    </div>
                    <button class="btn btn-primary w-100 btn-sm" onclick="addETicaretMatch()"><i class='bx bx-link'></i> Eşleştir</button>
                </div>
            </div>
            
            <div class="glass-panel table-container">
                <h3 style="font-size:16px; margin-bottom:15px;">Mevcut Eşleşme Eşikleri</h3>
                <table>
                    <thead><tr><th>Pazaryeri Ürün Adı / SKU</th><th>ERP Kod</th><th>Eşleşme Tarihi</th><th>Durum</th><th>İşlem</th></tr></thead>
                    <tbody>
                        ${mockData.eticaretEslesmeler.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Eşleştirilen ürün bulunmuyor.</td></tr>' : 
                          mockData.eticaretEslesmeler.map((e, i) => `
                            <tr>
                                <td style="font-weight:600;">${e.e_ticaret_ad}</td>
                                <td style="color:var(--primary); font-weight:600;">${e.erp_kod}</td>
                                <td style="color:var(--text-secondary)">${e.tarih}</td>
                                <td><span class="status-badge status-success">${e.durum}</span></td>
                                <td><button class="btn btn-sm" style="background:var(--danger); color:#fff;" onclick="deleteData('eticaretEslesmeler', ${i})"><i class='bx bx-trash'></i></button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function addETicaretMatch() {
    const title = document.getElementById('eslesme_title').value;
    const erpCode = document.getElementById('eslesme_code').value;
    if (!title || !erpCode) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }
    const newItem = {
        e_ticaret_ad: title,
        erp_kod: erpCode,
        tarih: new Date().toLocaleDateString('tr-TR'),
        durum: 'Eşleşti'
    };
    mockData.eticaretEslesmeler.push(newItem);
    saveData();
    alert("Ürün başarıyla eşleştirildi.");
}

function renderETicaretAyarlar(container) {
    let depoOptions = mockData.depolar.map(d => `<option value="${d.ad}" ${mockData.eticaretAyarlar.depo === d.ad ? 'selected' : ''}>${d.ad}</option>`).join('');
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">e-Ticaret Genel Ayarları</h1><p style="color:var(--text-secondary)">Entegrasyon otomasyon ve sevk parametreleri</p></div>
        </div>
        
        <form class="glass-panel fade-in" style="padding:30px; max-width:600px; margin:0 auto; display:flex; flex-direction:column; gap:20px;" onsubmit="saveETicaretSettings(event)">
            <div>
                <label style="font-size:13px; color:var(--text-secondary); display:block; margin-bottom:8px; font-weight:500;">Varsayılan Sevkiyat Deposu</label>
                <select id="m_et_depo" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-light); border-radius:12px; color:#fff; outline:none;">
                    ${depoOptions}
                </select>
            </div>
            
            <div>
                <label style="font-size:13px; color:var(--text-secondary); display:block; margin-bottom:8px; font-weight:500;">Fatura Seri Ön Eki</label>
                <input type="text" id="m_et_seri" value="${mockData.eticaretAyarlar.fatura_seri || 'ETC'}" placeholder="örn: ETC" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-light); border-radius:12px; color:#fff; outline:none;" required>
            </div>
            
            <div>
                <label style="font-size:13px; color:var(--text-secondary); display:block; margin-bottom:8px; font-weight:500;">Varsayılan Kargo Firması Şablonu</label>
                <select id="m_et_kargo" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-light); border-radius:12px; color:#fff; outline:none;">
                    <option value="Yurtiçi Kargo Standart" ${mockData.eticaretAyarlar.kargo_sablonu === 'Yurtiçi Kargo Standart' ? 'selected' : ''}>Yurtiçi Kargo Standart</option>
                    <option value="MNG Kargo Entegrasyonu" ${mockData.eticaretAyarlar.kargo_sablonu === 'MNG Kargo Entegrasyonu' ? 'selected' : ''}>MNG Kargo Entegrasyonu</option>
                    <option value="Aras Kargo API" ${mockData.eticaretAyarlar.kargo_sablonu === 'Aras Kargo API' ? 'selected' : ''}>Aras Kargo API</option>
                </select>
            </div>
            
            <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">
                <input type="checkbox" id="m_et_otofat" ${mockData.eticaretAyarlar.oto_fatura ? 'checked' : ''} style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
                <label for="m_et_otofat" style="font-size:14px; color:#fff; cursor:pointer;">Sipariş Geldiğinde Faturayı Otomatik Oluştur</label>
            </div>
            
            <button type="submit" class="btn btn-primary w-100" style="margin-top:10px;"><i class='bx bx-check-double'></i> Ayarları Güncelle</button>
        </form>
    `;
}

function saveETicaretSettings(e) {
    if (e) e.preventDefault();
    mockData.eticaretAyarlar = {
        depo: document.getElementById('m_et_depo').value,
        oto_fatura: document.getElementById('m_et_otofat').checked,
        kargo_sablonu: document.getElementById('m_et_kargo').value,
        fatura_seri: document.getElementById('m_et_seri').value
    };
    saveData();
    alert("e-Ticaret parametreleri kaydedildi.");
}

function renderUygulamalar(container) {
    const apps = [
        { ad: "E-Fatura Entegrasyonu", desc: "Gelir İdaresi Başkanlığı e-Fatura, e-Arşiv faturaları kesme eklentisi.", icon: "bx-envelope" },
        { ad: "SMS Bildirim Modülü", desc: "Müşterilere fatura ve ödeme bilgilerini otomatik SMS gönderme.", icon: "bx-message-rounded-dots" },
        { ad: "Barkod Okuyucu Entegrasyonu", desc: "Kamerayı veya el terminalini barkod okuyucu olarak kullanın.", icon: "bx-barcode-reader" },
        { ad: "Müşteri Portalı", desc: "Müşterilerinizin kendi cari ekstre ve borçlarını görebileceği portal.", icon: "bx-user-voice" }
    ];
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Uygulama Marketi</h1><p style="color:var(--text-secondary)">MucahitSaaS sisteminizi yeni eklenti ve uygulamalarla güçlendirin</p></div>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:24px;" class="fade-in">
            ${apps.map(a => {
                const isInstalled = mockData.installedUygulamalar.includes(a.ad);
                return `
                    <div class="glass-panel" style="padding:24px; display:flex; flex-direction:column; justify-content:space-between; gap:16px;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:48px; height:48px; border-radius:12px; background:rgba(99,102,241,0.1); color:var(--primary); font-size:24px; display:flex; align-items:center; justify-content:center;"><i class='bx ${a.icon}'></i></div>
                            <h3 style="font-size:15px; margin:0; color:#fff;">${a.ad}</h3>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin:0; flex:1;">${a.desc}</p>
                        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:12px; margin-top:10px;">
                            <span style="font-size:13px; font-weight:600; color:var(--success);">Ücretsiz</span>
                            <button class="btn btn-sm ${isInstalled ? '' : 'btn-primary'}" onclick="installApplication('${a.ad}')" style="${isInstalled ? 'background:rgba(255,255,255,0.05); color:#fff; border:1px solid var(--border-light);' : ''}">
                                ${isInstalled ? "<i class='bx bx-check-shield'></i> Kaldır" : "<i class='bx bx-plus'></i> Kur"}
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function installApplication(name) {
    if (mockData.installedUygulamalar.includes(name)) {
        mockData.installedUygulamalar = mockData.installedUygulamalar.filter(n => n !== name);
        saveData();
        alert(name + " eklentisi sistemden kaldırıldı.");
    } else {
        mockData.installedUygulamalar.push(name);
        saveData();
        alert(name + " eklentisi başarıyla kuruldu ve entegre edildi.");
    }
}

function renderPazaryeri(container) {
    const modules = [
        { ad: "Çoklu Depo Yönetim Modülü", desc: "Sınırsız sayıda depo ve depolar arası transfer yetenekleri kilidi.", fiyat: "499 ₺ / Yıl", icon: "bx-buildings" },
        { ad: "Excel Toplu Fatura Aktarımı", desc: "Excel veya XML faturalarınızı tek tıklamayla sisteme yükleyin.", fiyat: "299 ₺ / Ömür Boyu", icon: "bx-file-blank" },
        { ad: "Akıllı Finans Tahminleme (AI)", desc: "AI yardımıyla gelecek ayların nakit akışı ve ciro öngörüsü.", fiyat: "199 ₺ / Ay", icon: "bx-sparkles" }
    ];
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Eklenti Pazaryeri</h1><p style="color:var(--text-secondary)">Premium modüller ve kurumsal çözümler pazarı</p></div>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:24px;" class="fade-in">
            ${modules.map(m => `
                <div class="glass-panel" style="padding:24px; display:flex; flex-direction:column; justify-content:space-between; gap:16px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width:48px; height:48px; border-radius:12px; background:rgba(236,72,153,0.1); color:var(--secondary); font-size:24px; display:flex; align-items:center; justify-content:center;"><i class='bx ${m.icon}'></i></div>
                        <h3 style="font-size:15px; margin:0; color:#fff;">${m.ad}</h3>
                    </div>
                    <p style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin:0; flex:1;">${m.desc}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:12px; margin-top:10px;">
                        <span style="font-size:13px; font-weight:700; color:var(--secondary);">${m.fiyat}</span>
                        <button class="btn btn-primary btn-sm" onclick="alert('${m.ad} modülü başarıyla satın alındı ve hesabınıza tanımlandı!')"><i class='bx bx-shopping-bag'></i> Satın Al</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderAyarlarEtiketler(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Kategori ve Etiketler</h1><p style="color:var(--text-secondary)">İşlemleri gruplamak için özel renk etiketleri</p></div>
            <button class="btn btn-primary btn-sm" onclick="openModal('etiket')"><i class='bx bx-plus'></i> Etiket Ekle</button>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Etiket / Kategori Adı</th><th>Renk Kodu</th><th>İlişkili Modül</th><th>Görünüm</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.etiketler.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Etiket tanımlanmadı.</td></tr>' : 
                      mockData.etiketler.map((e, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);">${e.ad}</td>
                            <td style="font-family:monospace; color:var(--text-secondary)">${e.renk}</td>
                            <td>${e.tip} İşlemleri</td>
                            <td>
                                <span class="status-badge" style="background:${e.renk}20; color:${e.renk}; border:1px solid ${e.renk}50;">
                                    ${e.ad}
                                </span>
                            </td>
                            <td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('etiketler', ${i})"><i class='bx bx-trash'></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderAyarlarKullanicilar(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Kullanıcı Yetkilendirme</h1><p style="color:var(--text-secondary)">Sisteme erişebilen çalışma arkadaşlarınızın listesi</p></div>
            <button class="btn btn-primary btn-sm" onclick="openModal('kullanici')"><i class='bx bx-user-plus'></i> Kullanıcı Davet Et</button>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Kullanıcı Adı</th><th>E-posta</th><th>Rol / Yetki</th><th>Durum</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.kullanicilar.map((k, i) => `
                        <tr>
                            <td style="font-weight:600; color:var(--text-primary);"><i class='bx bx-user' style="margin-right:8px; color:var(--primary)"></i>${k.isim}</td>
                            <td>${k.eposta}</td>
                            <td><span class="status-badge" style="background:rgba(99, 102, 241, 0.08); color:var(--primary); border:1px solid rgba(99,102,241,0.15)">${k.rol}</span></td>
                            <td><span class="status-badge status-success">Aktif</span></td>
                            <td>
                                ${i > 0 ? `<button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('kullanicilar', ${i})"><i class='bx bx-trash'></i></button>` : 'System'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderAyarlarSablonlar(container) {
    const templates = [
        { id: "modern", ad: "Modern Indigo", desc: "Yarı saydam başlıklar, şık geometrik hatlar ve modern tipografi.", icon: "bx-layout" },
        { id: "classic", ad: "Klasik Kurumsal", desc: "Klasik, temiz kurumsal çizgiler ve geniş cari detay tabloları.", icon: "bx-list-check" },
        { id: "minimal", ad: "Minimalist Karbon", desc: "Yalnızca çizgi ve metin odaklı, mürekkep tasarruflu minimalist çıktı.", icon: "bx-minus" }
    ];
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Yazdırma Şablonları</h1><p style="color:var(--text-secondary)">Faturalarınızı çıktı alırken veya PDF kaydederken kullanılacak tasarım</p></div>
        </div>
        <div style="display:flex; flex-direction:column; gap:20px; max-width:600px; margin:0 auto;" class="fade-in">
            ${templates.map(t => {
                const isSelected = mockData.sablonlar.secili === t.id;
                return `
                    <div class="glass-panel" style="padding:20px; display:flex; align-items:center; justify-content:space-between; gap:20px; border:${isSelected ? '1px solid var(--primary)' : '1px solid var(--border-light)'};">
                        <div style="display:flex; align-items:center; gap:15px;">
                            <div style="font-size:30px; color:${isSelected ? 'var(--primary)' : 'var(--text-secondary)'};"><i class='bx ${t.icon}'></i></div>
                            <div>
                                <h3 style="font-size:15px; color:#fff; margin-bottom:4px;">${t.ad}</h3>
                                <p style="font-size:12px; color:var(--text-secondary); margin:0;">${t.desc}</p>
                            </div>
                        </div>
                        <button class="btn btn-sm ${isSelected ? '' : 'btn-primary'}" onclick="updatePrintTemplateSelection('${t.id}')" style="${isSelected ? 'background:rgba(255,255,255,0.05); color:#fff; border:1px solid var(--border-light);' : ''}">
                            ${isSelected ? "<i class='bx bx-check'></i> Seçili" : "Varsayılan Yap"}
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function updatePrintTemplateSelection(name) {
    mockData.sablonlar.secili = name;
    saveData();
    alert("Varsayılan fatura şablonu '" + name + "' olarak değiştirildi.");
}

function renderReports(container, page) {
    let title = '', description = '', icon = '';
    let metricTitle1 = '', metricVal1 = '';
    let metricTitle2 = '', metricVal2 = '';
    let metricTitle3 = '', metricVal3 = '';
    let tableHeaders = [], tableRowsHTML = '';
    
    let totalSales = 0, totalCollections = 0, outstandingSales = 0;
    mockData.faturalar.forEach(f => {
        const amt = parseFloat(f.genel_toplam || f.tutar) || 0;
        if (f.tur === 'Satış') {
            totalSales += amt;
            if (f.durum === 'Ödendi') totalCollections += amt;
            else outstandingSales += amt;
        }
    });

    let totalExpenses = mockData.giderler.reduce((a, b) => a + (parseFloat(b.tutar) || 0), 0);
    let paidExpenses = mockData.giderler.filter(g => g.durum === 'Ödendi').reduce((a, b) => a + (parseFloat(b.tutar) || 0), 0);
    
    let totalKdvIn = 0, totalKdvOut = 0;
    mockData.faturalar.forEach(f => {
        const kdv = parseFloat(f.kdv_tutari) || 0;
        if (f.tur === 'Satış') totalKdvOut += kdv;
        else totalKdvIn += kdv;
    });

    let inventoryValuation = mockData.urunler.reduce((a, b) => a + (parseFloat(b.fiyat) * parseInt(b.stok || 0)), 0);
    let totalStockCount = mockData.urunler.reduce((a, b) => a + parseInt(b.stok || 0), 0);

    let cashBalance = mockData.kasalar.reduce((a, b) => a + (parseFloat(b.bakiye) || 0), 0);

    let chartType = 'line';
    let chartLabels = [];
    let chartData = [];
    let chartDatasetLabel = '';

    if (page === 'rapor-satislar') {
        title = "Satışlar Raporu";
        description = "Aylık satış hacimleri ve performans analizi";
        icon = "bx-trending-up";
        metricTitle1 = "Toplam Satış Faturaları"; metricVal1 = formatMoney(totalSales);
        metricTitle2 = "Tahsil Edilen Tutar"; metricVal2 = formatMoney(totalCollections);
        metricTitle3 = "Bekleyen Tahsilat"; metricVal3 = formatMoney(outstandingSales);
        tableHeaders = ["Fatura Tarihi", "Cari Hesap", "Fatura Tutarı", "Durum"];
        tableRowsHTML = mockData.faturalar.filter(f => f.tur === 'Satış').map(f => `
            <tr><td>${f.tarih}</td><td style="font-weight:600">${f.cari}</td><td style="color:var(--primary); font-weight:600">${formatMoney(f.genel_toplam || f.tutar)}</td><td><span class="status-badge status-${f.durum === 'Ödendi' ? 'success' : 'warning'}">${f.durum}</span></td></tr>
        `).join('');
        chartLabels = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'];
        chartData = [totalSales * 0.1, totalSales * 0.15, totalSales * 0.2, totalSales * 0.18, totalSales * 0.25, totalSales * 0.3];
        chartDatasetLabel = 'Aylık Satış Tutarı';
    } 
    else if (page === 'rapor-tahsilatlar') {
        title = "Tahsilatlar Raporu";
        description = "Müşterilerden gelen ödemeler ve bekleyen borçlar";
        icon = "bx-wallet";
        metricTitle1 = "Toplam Kesilen Fatura"; metricVal1 = formatMoney(totalSales);
        metricTitle2 = "Toplam Yapılan Tahsilat"; metricVal2 = formatMoney(totalCollections);
        metricTitle3 = "Kalan Alacak Tutar"; metricVal3 = formatMoney(outstandingSales);
        tableHeaders = ["Tarih", "Müşteri / Cari", "Bekleyen Tutar", "Tahsilat Tipi"];
        tableRowsHTML = mockData.faturalar.filter(f => f.tur === 'Satış' && f.durum !== 'Ödendi').map(f => `
            <tr><td>${f.tarih}</td><td style="font-weight:600">${f.cari}</td><td style="color:var(--warning); font-weight:600">${formatMoney(f.genel_toplam || f.tutar)}</td><td>Açık Fatura</td></tr>
        `).join('');
        chartType = 'doughnut';
        chartLabels = ['Tahsil Edilen', 'Bekleyen'];
        chartData = [totalCollections, outstandingSales];
        chartDatasetLabel = 'Tahsilat Payı';
    }
    else if (page === 'rapor-gelirgider') {
        title = "Gelir Gider Raporu";
        description = "Net kâr ve finansal karlılık analizi";
        icon = "bx-calculator";
        metricTitle1 = "Toplam Gelir (Fatura)"; metricVal1 = formatMoney(totalSales);
        metricTitle2 = "Toplam Gider (Masraf)"; metricVal2 = formatMoney(totalExpenses);
        metricTitle3 = "Net Karlılık"; metricVal3 = formatMoney(totalSales - totalExpenses);
        tableHeaders = ["İşlem Tipi", "Kategori", "Tutar", "Açıklama"];
        tableRowsHTML = `
            <tr><td>Gelir</td><td>Ürün/Hizmet Satışı</td><td style="color:var(--success); font-weight:600">+${formatMoney(totalSales)}</td><td>Satış faturaları toplamı</td></tr>
            <tr><td>Gider</td><td>Genel Masraflar</td><td style="color:var(--danger); font-weight:600">-${formatMoney(totalExpenses)}</td><td>Şirket giderleri toplamı</td></tr>
        `;
        chartLabels = ['Gelir', 'Gider', 'Net Kâr'];
        chartData = [totalSales, totalExpenses, totalSales - totalExpenses];
        chartDatasetLabel = 'Finansal Durum';
        chartType = 'bar';
    }
    else if (page === 'rapor-giderler') {
        title = "Giderler Raporu";
        description = "Şirket harcamalarının kategori bazlı kırılımı";
        icon = "bx-trending-down";
        metricTitle1 = "Toplam Gider Masrafı"; metricVal1 = formatMoney(totalExpenses);
        metricTitle2 = "Ödenen Tutar"; metricVal2 = formatMoney(paidExpenses);
        metricTitle3 = "Ödenecek Tutar"; metricVal3 = formatMoney(totalExpenses - paidExpenses);
        tableHeaders = ["Gider Tarihi", "Kategori", "Açıklama", "Tutar"];
        tableRowsHTML = mockData.giderler.map(g => `
            <tr><td>${g.tarih}</td><td>${g.kategori}</td><td>${g.aciklama}</td><td style="color:var(--danger); font-weight:600">${formatMoney(g.tutar)}</td></tr>
        `).join('');
        chartType = 'pie';
        chartLabels = ['Kira', 'Fatura', 'Personel', 'Pazarlama', 'Ofis', 'Diğer'];
        let categoriesVal = [0,0,0,0,0,0];
        mockData.giderler.forEach(g => {
            if(g.kategori === 'Kira') categoriesVal[0] += g.tutar;
            else if(g.kategori === 'Fatura / Abonelik') categoriesVal[1] += g.tutar;
            else if(g.kategori === 'Personel / Maaş') categoriesVal[2] += g.tutar;
            else if(g.kategori === 'Pazarlama / Reklam') categoriesVal[3] += g.tutar;
            else if(g.kategori === 'Ofis Giderleri') categoriesVal[4] += g.tutar;
            else categoriesVal[5] += g.tutar;
        });
        chartData = categoriesVal;
        chartDatasetLabel = 'Kategori Bazlı Dağılım';
    }
    else if (page === 'rapor-odemeler') {
        title = "Ödemeler Raporu";
        description = "Tedarikçi ve personele yapılan fiili ödemeler";
        icon = "bx-credit-card";
        metricTitle1 = "Toplam Ödenen Giderler"; metricVal1 = formatMoney(paidExpenses);
        metricTitle2 = "Ödenen Alış Faturaları"; metricVal2 = formatMoney(mockData.faturalar.filter(f => f.tur === 'Alış' && f.durum === 'Ödendi').reduce((a,b) => a + (b.genel_toplam || b.tutar), 0));
        metricTitle3 = "Toplam Fiili Ödeme"; metricVal3 = formatMoney(paidExpenses + mockData.faturalar.filter(f => f.tur === 'Alış' && f.durum === 'Ödendi').reduce((a,b) => a + (b.genel_toplam || b.tutar), 0));
        tableHeaders = ["İşlem Tarihi", "Açıklama", "Tutar", "Ödeme Kanalı"];
        tableRowsHTML = mockData.giderler.filter(g => g.durum === 'Ödendi').map(g => `
            <tr><td>${g.tarih}</td><td style="font-weight:600">${g.aciklama}</td><td style="color:var(--danger); font-weight:600">${formatMoney(g.tutar)}</td><td>${g.kasa}</td></tr>
        `).join('');
        chartLabels = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'];
        const totalPay = paidExpenses + mockData.faturalar.filter(f => f.tur === 'Alış' && f.durum === 'Ödendi').reduce((a,b) => a + (b.genel_toplam || b.tutar), 0);
        chartData = [totalPay * 0.1, totalPay * 0.15, totalPay * 0.2, totalPay * 0.18, totalPay * 0.25, totalPay * 0.3];
        chartDatasetLabel = 'Ödemeler';
    }
    else if (page === 'rapor-kdv') {
        title = "KDV Raporu";
        description = "Hesaplanan KDV ve indirilecek KDV dengesi";
        icon = "bx-line-chart";
        metricTitle1 = "Hesaplanan KDV (Satış)"; metricVal1 = formatMoney(totalKdvOut);
        metricTitle2 = "İndirilecek KDV (Alış)"; metricVal2 = formatMoney(totalKdvIn);
        const netKdv = totalKdvOut - totalKdvIn;
        metricTitle3 = netKdv >= 0 ? "Net Ödenecek KDV" : "Sonraki Döneme Devreden"; metricVal3 = formatMoney(Math.abs(netKdv));
        tableHeaders = ["Fatura Türü", "KDV Oranı", "KDV Matrahı", "Net KDV Tutarı"];
        tableRowsHTML = `
            <tr><td>Satış Faturaları (Tahsil Edilen)</td><td>%20</td><td>${formatMoney(totalSales)}</td><td style="color:var(--success); font-weight:600">${formatMoney(totalKdvOut)}</td></tr>
            <tr><td>Alış Faturaları (Masraflar)</td><td>%20</td><td>${formatMoney(mockData.faturalar.filter(f => f.tur === 'Alış').reduce((a,b) => a + b.tutar, 0))}</td><td style="color:var(--danger); font-weight:600">${formatMoney(totalKdvIn)}</td></tr>
        `;
        chartLabels = ['Hesaplanan KDV', 'İndirilecek KDV'];
        chartData = [totalKdvOut, totalKdvIn];
        chartDatasetLabel = 'KDV Dengesi';
        chartType = 'bar';
    }
    else if (page === 'rapor-kasa') {
        title = "Kasa / Banka Raporu";
        description = "Hesap bakiyeleri ve mevduat hareketleri";
        icon = "bx-bank";
        metricTitle1 = "Toplam Likit Varlık"; metricVal1 = formatMoney(cashBalance);
        metricTitle2 = "En Yüksek Hesap"; metricVal2 = mockData.kasalar.length > 0 ? mockData.kasalar.reduce((prev, current) => (prev.bakiye > current.bakiye) ? prev : current).ad : 'Yok';
        metricTitle3 = "Hesap Sayısı"; metricVal3 = mockData.kasalar.length + " adet hesap";
        tableHeaders = ["Hesap Adı", "Hesap Türü", "Para Birimi", "Güncel Bakiye"];
        tableRowsHTML = mockData.kasalar.map(k => `
            <tr><td style="font-weight:600">${k.ad}</td><td>${k.tur}</td><td>${k.para_birimi}</td><td style="color:var(--success); font-weight:600">${formatMoney(k.bakiye)}</td></tr>
        `).join('');
        chartLabels = mockData.kasalar.map(k => k.ad);
        chartData = mockData.kasalar.map(k => k.bakiye);
        chartDatasetLabel = 'Hesap Dağılımları';
        chartType = 'doughnut';
    }
    else if (page === 'rapor-nakitakisi') {
        title = "Nakit Akışı Raporu";
        description = "Giriş ve çıkış hareketlerinin nakit akış projeksiyonu";
        icon = "bx-shuffle";
        metricTitle1 = "Nakit Girişleri (Tahsilat)"; metricVal1 = formatMoney(totalCollections);
        metricTitle2 = "Nakit Çıkışları (Ödemeler)"; metricVal2 = formatMoney(paidExpenses);
        metricTitle3 = "Net Nakit Dengesi"; metricVal3 = formatMoney(totalCollections - paidExpenses);
        tableHeaders = ["Açıklama", "Tutar", "Nakit Etkisi"];
        tableRowsHTML = `
            <tr><td>Kasa & Banka Mevcut Bakiyeler</td><td style="font-weight:600">${formatMoney(cashBalance)}</td><td style="color:var(--success)">Giriş (Net Bakiye)</td></tr>
            <tr><td>Toplam Fatura Tahsilatları</td><td style="font-weight:600">${formatMoney(totalCollections)}</td><td style="color:var(--success)">Giriş</td></tr>
            <tr><td>Ödenen Firma Masrafları</td><td style="font-weight:600">${formatMoney(paidExpenses)}</td><td style="color:var(--danger)">Çıkış</td></tr>
        `;
        chartLabels = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'];
        chartData = [cashBalance * 0.8, cashBalance * 0.9, cashBalance, cashBalance * 0.95, cashBalance * 1.05, cashBalance * 1.15];
        chartDatasetLabel = 'Kasa Dengesi Eğrisi';
    }
    else if (page === 'rapor-stok') {
        title = "Stok Raporu";
        description = "Envanter miktarları ve depo değerleme raporu";
        icon = "bx-package";
        metricTitle1 = "Stoktaki Toplam Ürün"; metricVal1 = totalStockCount + " Adet";
        metricTitle2 = "Toplam Envanter Değeri"; metricVal2 = formatMoney(inventoryValuation);
        metricTitle3 = "Ürün Çeşidi Sayısı"; metricVal3 = mockData.urunler.length + " Çeşit";
        tableHeaders = ["Ürün Kodu", "Ürün Adı", "Stok Miktarı", "Birim Fiyatı", "Toplam Değer"];
        tableRowsHTML = mockData.urunler.map(u => `
            <tr><td>${u.kod}</td><td style="font-weight:600">${u.ad}</td><td>${u.stok} Adet</td><td>${formatMoney(u.fiyat)}</td><td style="color:var(--primary); font-weight:600">${formatMoney(u.fiyat * u.stok)}</td></tr>
        `).join('');
        chartLabels = mockData.urunler.slice(0, 5).map(u => u.ad);
        chartData = mockData.urunler.slice(0, 5).map(u => u.stok);
        chartDatasetLabel = 'En Çok Stokta Bulunan 5 Ürün';
        chartType = 'bar';
    }

    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">${title}</h1>
                <p style="color:var(--text-secondary)">${description}</p>
            </div>
            <button class="btn btn-primary" onclick="window.print()"><i class='bx bx-printer'></i> Yazdır / PDF</button>
        </div>

        <div class="stats-grid fade-in">
            <div class="stat-card glass-panel c-primary">
                <div class="stat-header"><span>${metricTitle1}</span><div class="stat-icon"><i class='bx ${icon}'></i></div></div>
                <div class="stat-value">${metricVal1}</div>
            </div>
            <div class="stat-card glass-panel c-success">
                <div class="stat-header"><span>${metricTitle2}</span><div class="stat-icon"><i class='bx bx-check-circle'></i></div></div>
                <div class="stat-value">${metricVal2}</div>
            </div>
            <div class="stat-card glass-panel c-warning">
                <div class="stat-header"><span>${metricTitle3}</span><div class="stat-icon"><i class='bx bx-bar-chart-alt'></i></div></div>
                <div class="stat-value">${metricVal3}</div>
            </div>
        </div>

        <div class="dashboard-grid fade-in" style="grid-template-columns: 1fr; margin-bottom: 25px;">
            <div class="glass-panel chart-container" style="height: 380px;">
                <div class="table-header"><h3>Grafik Analizi</h3></div>
                <div style="position: relative; height: calc(100% - 40px); width: 100%;">
                    <canvas id="reportChartElement"></canvas>
                </div>
            </div>
        </div>

        <div class="glass-panel table-container fade-in">
            <div class="table-header"><h3>Detay Veri Listesi</h3></div>
            <table>
                <thead>
                    <tr>${tableHeaders.map(th => `<th>${th}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${tableRowsHTML || '<tr><td colspan="4" style="text-align:center;">Veri bulunamadı.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;

    setTimeout(() => {
        const isLightTheme = document.body.classList.contains('light-theme');
        const chartTextColor = isLightTheme ? '#475569' : '#cbd5e1';
        const chartGridColor = isLightTheme ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)';
        const ctx = document.getElementById('reportChartElement');
        if (ctx) {
            const backgroundColors = chartType === 'doughnut' || chartType === 'pie' ? 
                ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'] : 'rgba(99, 102, 241, 0.8)';
            
            new Chart(ctx, {
                type: chartType,
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: chartDatasetLabel,
                        data: chartData,
                        backgroundColor: backgroundColors,
                        borderWidth: 0,
                        borderRadius: chartType === 'bar' ? 6 : 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: chartTextColor }
                        }
                    },
                    scales: chartType === 'doughnut' || chartType === 'pie' ? {} : {
                        x: { grid: { display: false }, ticks: { color: chartTextColor } },
                        y: { grid: { color: chartGridColor }, ticks: { color: chartTextColor }, beginAtZero: true }
                    }
                }
            });
        }
    }, 200);
}
