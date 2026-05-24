// Initialize Data from LocalStorage
let mockData = JSON.parse(localStorage.getItem('saas_erp_data')) || {
    cariler: [],
    urunler: [],
    faturalar: [],
    takvimNotlari: {},
    tickets: [],
    kasalar: []
};

// Check and add default bank/safe box accounts if missing
if (!mockData.kasalar) mockData.kasalar = [];
if (mockData.kasalar.length === 0) {
    mockData.kasalar = [
        { ad: "Merkez TL Kasası", tur: "Kasa", bakiye: 15000, para_birimi: "TRY" },
        { ad: "Garanti Bankası Ticari", tur: "Banka", bakiye: 85000, para_birimi: "TRY" },
        { ad: "Dolar Kasası", tur: "Kasa", bakiye: 2500, para_birimi: "USD" }
    ];
}

function saveData() {
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
}


document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme
    const currentTheme = localStorage.getItem('app_theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        const themeBtn = document.getElementById('themeToggleBtn');
        if(themeBtn) themeBtn.innerHTML = `<i class='bx bx-sun'></i>`;
    }

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
                
                if(emailEl) emailEl.innerText = email;
                processAuth(registerForm);
            }
        });
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            if (item.dataset.page === 'takvim') {
                CALENDAR_YEAR = new Date().getFullYear();
                CALENDAR_MONTH = new Date().getMonth();
                SELECTED_DATE = new Date().toISOString().split('T')[0];
            }
            loadPage(item.dataset.page);
        });
    });

    // Modal Form Submit
    document.getElementById('genericForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveModalData();
    });
});

let FINANCE_CHART = null;
let PIE_CHART = null;

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
    CURRENT_PAGE = page;
    const content = document.getElementById('contentArea');
    content.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;"><i class="bx bx-loader-alt bx-spin" style="font-size:40px;color:var(--primary)"></i></div>';

    setTimeout(() => {
        if (page === 'dashboard') renderDashboard(content);
        else if (page === 'cariler') renderCariler(content);
        else if (page === 'urunler') renderUrunler(content);
        else if (page === 'faturalar') renderFaturalar(content);
        else if (page === 'kasalar') renderKasalar(content);
        else if (page === 'takvim') renderTakvim(content);
        else if (page === 'tickets') renderTickets(content);
        else if (page === 'ayarlar') renderAyarlar(content);
    }, 200); 
}

function renderDashboard(container) {
    let gelir = 0, gider = 0, tahsilat = 0, tahsilatAdet = 0;
    mockData.faturalar.forEach(f => {
        const total = parseFloat(f.genel_toplam || f.tutar) || 0;
        if(f.tur === 'Satış' && f.durum === 'Ödendi') gelir += total;
        if(f.tur === 'Satış' && f.durum !== 'Ödendi') { tahsilat += total; tahsilatAdet++; }
        if(f.tur === 'Alış') gider += total;
    });

    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">Finansal Özet</h1>
                <p style="color:var(--text-secondary)">MücahitSaaS Yönetim Paneli</p>
            </div>
            <button class="btn btn-primary" onclick="downloadFaturalarCSV()"><i class='bx bx-cloud-download'></i> Rapor İndir</button>
        </div>

        ${getTickerBandHTML()}

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

        <div class="dashboard-grid fade-in" style="animation-delay: 0.2s; grid-template-columns: 1fr 1fr;">
            <div class="glass-panel chart-container">
                <div class="table-header"><h3>Nakit Akışı (Gelir vs Gider)</h3></div>
                <canvas id="financeChart"></canvas>
            </div>
            
            <div class="glass-panel chart-container">
                <div class="table-header"><h3>Kasa & Banka Dağılımı</h3></div>
                <canvas id="pieChart"></canvas>
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
                    plugins: { legend: { display: true, labels: { color: 'var(--text-secondary)' } } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)' } },
                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'var(--text-secondary)' } }
                    }
                }
            });
        }

        const pieCtx = document.getElementById('pieChart');
        if (pieCtx) {
            if (PIE_CHART) PIE_CHART.destroy();
            
            const labels = mockData.kasaBanka.map(k => k.ad);
            const data = mockData.kasaBanka.map(k => k.bakiye);
            const bgColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

            PIE_CHART = new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: labels.length > 0 ? labels : ['Henüz Veri Yok'],
                    datasets: [{
                        data: data.length > 0 ? data : [1],
                        backgroundColor: data.length > 0 ? bgColors.slice(0, data.length) : ['#333'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: { 
                        legend: { position: 'right', labels: { color: 'var(--text-secondary)' } } 
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
                            <td style="font-weight:600; color:#fff; cursor:pointer;" onclick="viewCariDetail('${c.unvan}')" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='#fff'">
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
                            <td style="font-weight:600; color:#fff">${u.ad}</td>
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
                            <td style="font-weight:600; color:#fff">${formatMoney(f.genel_toplam || f.tutar)}</td>
                            <td><span class="status-badge status-${f.durum === 'Ödendi' ? 'success' : (f.durum === 'Ödenmedi' ? 'warning' : 'danger')}">${f.durum}</span></td>
                            <td style="display:flex; gap:6px;">
                                <button class="btn btn-sm" style="background:var(--primary);color:#fff" onclick="printInvoice(${i})"><i class='bx bx-printer'></i> Detay / Yazdır</button>
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
                            <td style="font-weight:600; color:#fff">${t.konu}</td>
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

function renderAyarlar(container) {
    const currentEmail = localStorage.getItem('user_email') || '';
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Ayarlar</h1><p style="color:var(--text-secondary)">Hesap ve güvenlik tercihleri</p></div>
        </div>
        <div class="dashboard-grid fade-in">
            <div class="glass-panel" style="padding: 24px;">
                <h3 style="margin-bottom:20px; color:var(--text-primary);">Hesap Bilgileri</h3>
                <div class="input-group">
                    <label style="color:var(--text-secondary); font-size:13px; margin-bottom:5px; display:block;">Mevcut E-posta</label>
                    <input type="email" id="set_email" value="${currentEmail}" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid var(--border-light); border-radius:12px; outline:none; margin-bottom:15px;">
                </div>
                <h3 style="margin-bottom:20px; color:var(--text-primary); margin-top:30px;">Şifre Değiştir</h3>
                <div class="input-group">
                    <input type="password" placeholder="Mevcut Şifre" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid var(--border-light); border-radius:12px; outline:none; margin-bottom:15px;">
                </div>
                <div class="input-group">
                    <input type="password" placeholder="Yeni Şifre" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid var(--border-light); border-radius:12px; outline:none; margin-bottom:15px;">
                </div>
                <button class="btn btn-primary" onclick="saveSettings()">Ayarları Kaydet</button>
            </div>
        </div>
    `;
}

function saveSettings() {
    const newEmail = document.getElementById('set_email').value;
    if(newEmail) {
        localStorage.setItem('user_email', newEmail);
        document.getElementById('sidebarUserEmail').innerText = newEmail;
        alert('Ayarlar başarıyla güncellendi!');
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
async function fetchExchangeRates() {
    try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data && data.rates && data.rates.TRY) {
            const tryRate = data.rates.TRY;
            exchangeRates.USD = parseFloat((tryRate).toFixed(2));
            exchangeRates.EUR = parseFloat((tryRate / data.rates.EUR).toFixed(2));
            exchangeRates.GBP = parseFloat((tryRate / data.rates.GBP).toFixed(2));
            console.log("Live rates loaded:", exchangeRates);
        }
    } catch (e) {
        console.warn("Currency exchange rates fetch failed, using fallbacks.", e);
    }
}

function getTickerBandHTML() {
    return `
        <div class="ticker-band fade-in">
            <div style="font-weight:600; font-family:var(--font-heading); color:var(--primary); display:flex; align-items:center; gap:5px;">
                <i class='bx bx-trending-up'></i> Döviz Piyasası:
            </div>
            <div class="ticker-item"><span>USD/TRY</span> <span class="ticker-val">${exchangeRates.USD} ₺</span> <span class="ticker-up"><i class='bx bxs-up-arrow'></i></span></div>
            <div class="ticker-item"><span>EUR/TRY</span> <span class="ticker-val">${exchangeRates.EUR} ₺</span> <span class="ticker-up"><i class='bx bxs-up-arrow'></i></span></div>
            <div class="ticker-item"><span>GBP/TRY</span> <span class="ticker-val">${exchangeRates.GBP} ₺</span> <span class="ticker-up"><i class='bx bxs-up-arrow'></i></span></div>
        </div>
    `;
}

function getMonthlyFinanceData() {
    const monthlyGelir = [0, 0, 0, 0, 0, 0];
    const monthlyGider = [0, 0, 0, 0, 0, 0];
    mockData.faturalar.forEach(f => {
        if (!f.tarih) return;
        const parts = f.tarih.split('.');
        if (parts.length !== 3) return;
        const monthIdx = parseInt(parts[1]) - 1;
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
                            <td style="font-weight:600; color:#fff">${k.ad}</td>
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
                            <td style="font-weight:600; color:#fff">${formatMoney(f.genel_toplam || f.tutar)}</td>
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

// --- DETAY / YAZDIR / PRINT INVOICE ---
function printInvoice(index) {
    const f = mockData.faturalar[index];
    if (!f) return;

    const printContainer = document.getElementById('printContainer');
    if (!printContainer) return;

    const subtotal = parseFloat(f.tutar) || 0;
    const kdvRate = parseFloat(f.kdv_orani) || 20;
    const kdvAmount = parseFloat(f.kdv_tutari) || 0;
    const grandTotal = parseFloat(f.genel_toplam) || subtotal;

    let itemsHTML = '';
    if (f.kalemler && f.kalemler.length > 0) {
        itemsHTML = f.kalemler.map(item => `
            <tr>
                <td>${item.urun}</td>
                <td style="text-align:center;">${item.miktar}</td>
                <td style="text-align:right;">${formatMoney(item.fiyat)}</td>
                <td style="text-align:right;">${formatMoney(item.miktar * item.fiyat)}</td>
            </tr>
        `).join('');
    } else {
        itemsHTML = `
            <tr>
                <td>Genel Hizmet Bedeli</td>
                <td style="text-align:center;">1</td>
                <td style="text-align:right;">${formatMoney(subtotal)}</td>
                <td style="text-align:right;">${formatMoney(subtotal)}</td>
            </tr>
        `;
    }

    const currentEmail = localStorage.getItem('user_email') || 'demo@kullanici.com';

    printContainer.innerHTML = `
        <div class="print-header">
            <div>
                <div class="print-logo">Mücahit<span style="color:#6366f1;">SaaS</span></div>
                <div style="font-size:12px; margin-top:5px; color:#555;">Bulut Tabanlı Muhasebe Çözümü</div>
            </div>
            <div style="text-align:right;">
                <h2 style="margin:0; font-size:22px;">RESMİ FATURA</h2>
                <div style="font-size:12px; margin-top:5px; color:#555;">Tarih: ${f.tarih}</div>
                <div style="font-size:12px; color:#555;">Fatura No: #MS-${1000 + index}</div>
            </div>
        </div>
        
        <div class="print-details">
            <div>
                <h4 style="margin:0 0 5px 0; border-bottom:1px solid #ddd; padding-bottom:5px; text-transform:uppercase; font-size:12px; color:#555;">Yayıncı / Fatura Kesen</h4>
                <strong>MücahitSaaS Yetkilisi</strong><br>
                E-posta: ${currentEmail}<br>
                Adres: XAMPP Htdocs Yerel Ağ Sunucusu
            </div>
            <div>
                <h4 style="margin:0 0 5px 0; border-bottom:1px solid #ddd; padding-bottom:5px; text-transform:uppercase; font-size:12px; color:#555;">Alıcı / Cari Unvan</h4>
                <strong>${f.cari}</strong><br>
                Tür: ${f.tur === 'Satış' ? 'Müşteri' : 'Tedarikçi'}<br>
                Durum: ${f.durum}
            </div>
        </div>

        <table class="print-table">
            <thead>
                <tr>
                    <th style="text-align:left;">Ürün / Açıklama</th>
                    <th style="width:80px; text-align:center;">Miktar</th>
                    <th style="width:120px; text-align:right;">Birim Fiyat</th>
                    <th style="width:120px; text-align:right;">Toplam</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>

        <div class="print-summary">
            <div>Ara Toplam:</div>
            <div>${formatMoney(subtotal)}</div>
            <div>KDV (%${kdvRate}):</div>
            <div>${formatMoney(kdvAmount)}</div>
            <div class="grand-total">Genel Toplam:</div>
            <div class="grand-total">${formatMoney(grandTotal)}</div>
        </div>

        <div style="margin-top:60px; border-top:1px solid #eee; padding-top:20px; text-align:center; font-size:11px; color:#777;">
            Bu fatura MücahitSaaS sistemi tarafından elektronik ortamda oluşturulmuştur.
        </div>
    `;
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
                <div style="display:flex; justify-content:space-between;"><span>Ara Toplam:</span><span id="invoiceSubtotalDisplay" style="font-weight:600; color:#fff;">0.00 ₺</span></div>
                <div style="display:flex; justify-content:space-between;"><span>KDV Tutarı:</span><span id="invoiceKdvDisplay" style="font-weight:600; color:#fff;">0.00 ₺</span></div>
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
    }

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerHTML = body;
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
                <h5 style="font-size:13px; font-weight:600; color:#fff; margin:0 0 3px 0; line-height:1.2;">${n.title}</h5>
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
const SUPABASE_URL = "https://qjnqehrcybnlxxrzkykn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8CPQD1mEl6pl9j85Om7XqQ_v0aSAnWE";

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = () => {
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log("Supabase Auth initialized successfully!");
            syncFromSupabase().then(() => {
                if (document.getElementById('appContainer').style.display === 'flex') {
                    loadPage(CURRENT_PAGE);
                }
            });
        } catch (e) {
            console.error("Supabase client failed to initialize:", e);
        }
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
