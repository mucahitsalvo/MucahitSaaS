// Initialize Data from LocalStorage
let mockData = JSON.parse(localStorage.getItem('saas_erp_data')) || {
    cariler: [],
    urunler: [],
    faturalar: [],
    takvimNotlari: {},
    tickets: []
};

function saveData() {
    localStorage.setItem('saas_erp_data', JSON.stringify(mockData));
    loadPage(CURRENT_PAGE); // Refresh current page
}

const formatMoney = (amount) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

let CURRENT_PAGE = 'dashboard';

let CALENDAR_YEAR = new Date().getFullYear();
let CALENDAR_MONTH = new Date().getMonth(); // 0-indexed
let SELECTED_DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

document.addEventListener('DOMContentLoaded', () => {
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

    // Auth Form Logic
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const pwd = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
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
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('regEmail').value.trim();
            const pwd = document.getElementById('regPassword').value;
            
            localStorage.setItem('user_email', email);
            localStorage.setItem(`user_pwd_${email}`, pwd);
            
            if(emailEl) emailEl.innerText = email;
            processAuth(registerForm);
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
        else if (page === 'takvim') renderTakvim(content);
        else if (page === 'tickets') renderTickets(content);
        else if (page === 'ayarlar') renderAyarlar(content);
    }, 200); 
}

function renderDashboard(container) {
    let gelir = 0, gider = 0, tahsilat = 0, tahsilatAdet = 0;
    mockData.faturalar.forEach(f => {
        if(f.tur === 'Satış' && f.durum === 'Ödendi') gelir += parseFloat(f.tutar);
        if(f.tur === 'Satış' && f.durum !== 'Ödendi') { tahsilat += parseFloat(f.tutar); tahsilatAdet++; }
        if(f.tur === 'Alış') gider += parseFloat(f.tutar);
    });

    container.innerHTML = `
        <div class="page-header fade-in">
            <div>
                <h1 style="margin-bottom:5px;">Finansal Özet</h1>
                <p style="color:var(--text-secondary)">MücahitSaaS Yönetim Paneli</p>
            </div>
            <button class="btn btn-primary" onclick="alert('Veriler indiriliyor...')"><i class='bx bx-cloud-download'></i> Rapor İndir</button>
        </div>

        <div class="stats-grid fade-in" style="animation-delay: 0.1s">
            <div class="stat-card glass-panel c-primary">
                <div class="stat-header"><span>Toplam Gelir</span><div class="stat-icon"><i class='bx bx-wallet'></i></div></div>
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

        <div class="dashboard-grid fade-in" style="animation-delay: 0.2s">
            <div class="glass-panel chart-container">
                <div class="table-header"><h3>Nakit Akışı</h3></div>
                <canvas id="financeChart"></canvas>
            </div>
            
            <div class="glass-panel table-container">
                <div class="table-header"><h3>Son İşlemler</h3></div>
                <table>
                    <thead><tr><th>Cari</th><th>Tutar</th><th>Durum</th></tr></thead>
                    <tbody>
                        ${mockData.faturalar.length === 0 ? '<tr><td colspan="3" style="text-align:center;">Henüz veri yok</td></tr>' : 
                          mockData.faturalar.slice(-4).reverse().map(f => `
                            <tr>
                                <td style="font-weight:600">${f.cari}</td>
                                <td>${formatMoney(f.tutar)}</td>
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
            const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
            
            let dataArr = [0, 0, 0, 0, gelir/2, gelir]; // Mock curve ending at actual income
            if(gelir === 0) dataArr = [0,0,0,0,0,0];

            FINANCE_CHART = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
                    datasets: [{
                        label: 'Nakit Girişi',
                        data: dataArr,
                        borderColor: '#6366f1',
                        backgroundColor: gradient,
                        borderWidth: 3,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#6366f1',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } } }
            });
        }
    }, 100);
}

function renderCariler(container) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <div><h1 style="margin-bottom:5px;">Cari Hesaplar</h1><p style="color:var(--text-secondary)">Müşteri ve tedarikçi yönetimi</p></div>
            <button class="btn btn-primary" onclick="openModal('cari')"><i class='bx bx-plus'></i> Yeni Cari Ekle</button>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Ünvan</th><th>Tür</th><th>Bakiye Durumu</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.cariler.length === 0 ? '<tr><td colspan="4" style="text-align:center;">Henüz veri eklenmedi.</td></tr>' : 
                      mockData.cariler.map((c, i) => `
                        <tr>
                            <td style="font-weight:600; color:#fff">${c.unvan}</td>
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
            <button class="btn btn-primary" onclick="openModal('urun')"><i class='bx bx-plus'></i> Yeni Ürün Ekle</button>
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
            <button class="btn btn-primary" onclick="openModal('fatura')"><i class='bx bx-plus'></i> Fatura Oluştur</button>
        </div>
        <div class="glass-panel table-container fade-in" style="animation-delay: 0.1s">
            <table>
                <thead><tr><th>Tarih</th><th>Tür</th><th>Cari</th><th>Tutar</th><th>Durum</th><th>İşlem</th></tr></thead>
                <tbody>
                    ${mockData.faturalar.length === 0 ? '<tr><td colspan="6" style="text-align:center;">Henüz veri eklenmedi.</td></tr>' : 
                      mockData.faturalar.map((f, i) => `
                        <tr>
                            <td style="color:var(--text-secondary)">${f.tarih}</td>
                            <td>${f.tur}</td>
                            <td>${f.cari}</td>
                            <td style="font-weight:600; color:#fff">${formatMoney(f.tutar)}</td>
                            <td><span class="status-badge status-${f.durum === 'Ödendi' ? 'success' : (f.durum === 'Ödenmedi' ? 'warning' : 'danger')}">${f.durum}</span></td>
                            <td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteData('faturalar', ${i})"><i class='bx bx-trash'></i></button></td>
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
                    <option value="Satış">Satış Faturası</option>
                    <option value="Alış">Alış Faturası</option>
                </select>
            </div>
            <div class="input-group">
                <select id="m_fcari" required style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="">Cari Seçin</option>${cariOptions}
                </select>
            </div>
            <div class="input-group"><input type="number" id="m_ftutar" placeholder="Tutar (₺)" required></div>
            <div class="input-group">
                <select id="m_fdurum" style="width:100%; padding:14px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                    <option value="Ödenmedi">Ödenmedi</option>
                    <option value="Ödendi">Ödendi</option>
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
        mockData.cariler.push({ unvan: document.getElementById('m_unvan').value, tur: document.getElementById('m_tur').value, bakiye: 0, durum: 'Aktif' });
    } else if (currentModalType === 'urun') {
        mockData.urunler.push({ kod: document.getElementById('m_kod').value, ad: document.getElementById('m_ad').value, fiyat: document.getElementById('m_fiyat').value, stok: document.getElementById('m_stok').value });
    } else if (currentModalType === 'fatura') {
        mockData.faturalar.push({ tarih: new Date().toLocaleDateString('tr-TR'), tur: document.getElementById('m_ftur').value, cari: document.getElementById('m_fcari').value, tutar: document.getElementById('m_ftutar').value, durum: document.getElementById('m_fdurum').value });
    } else if (currentModalType === 'ticket') {
        mockData.tickets.push({ konu: document.getElementById('m_tkonu').value, musteri: '-', oncelik: document.getElementById('m_toncelik').value, durum: 'Açık', tarih: new Date().toLocaleDateString('tr-TR') });
    }
    
    closeModal();
    saveData();
}

function deleteData(type, idx) {
    if(confirm('Silmek istediğinize emin misiniz?')) {
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

// --- SUPABASE & SIMULATION AUTH CONFIG ---
// Paste your Supabase project credentials here to enable real database and real password reset emails!
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = () => {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase Auth initialized successfully!");
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
            
            // Dispatch real email using FormSubmit AJAX to mucahitsalvo@gmail.com
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

            btn.innerHTML = originalText;
            btn.disabled = false;

            // Transition to Step 2
            document.getElementById('forgotStep1').style.display = 'none';
            document.getElementById('forgotStep2').style.display = 'block';
            document.getElementById('forgotStep2Title').innerText = `Doğrulama kodunuz mucahitsalvo@gmail.com e-posta adresine başarıyla gönderildi!`;
            
            // Show a gorgeous desktop notification toast with the code so they can copy-paste it
            showSimToast(`MücahitSaaS Doğrulama Kodu: ${activeSimCode}`);
        }
    }, 1200);
}

function verifyAndResetPassword() {
    const enteredCode = document.getElementById('forgotCode').value.trim();
    const newPassword = document.getElementById('forgotNewPassword').value.trim();
    
    if (!enteredCode || !newPassword) return alert("Lütfen kod ve yeni şifre girin.");
    
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
