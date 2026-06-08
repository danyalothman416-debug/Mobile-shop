// ========== App Data ==========
const DATA_KEY = 'golden_delivery_data';

let app = JSON.parse(localStorage.getItem(DATA_KEY)) || {
    orders: [],
    customers: [],
    drivers: [
        { id: 'D1', name: 'ئارام', phone: '07701234567', status: 'بەردەست' },
        { id: 'D2', name: 'سامان', phone: '07702345678', status: 'بەردەست' },
        { id: 'D3', name: 'هێمن', phone: '07703456789', status: 'سەرقاڵ' }
    ],
    user: null,
    adminAuth: false,
    theme: 'dark',
    currentPage: 'home'
};

const PROMOS = {
    'WELCOME10': { discount: 10, type: '%', min: 5000 },
    'FREESHIP': { discount: 3000, type: 'IQD', min: 10000 },
    'GOLDEN50': { discount: 50, type: '%', min: 20000 }
};

const AREAS = [
    'عەرەفە', 'تەسعین', 'شۆراو', 'ڕەحیماوە', 'قوڕیە', 
    'الواسطی', 'النەسر', 'ئازادی', 'یەکی حوزەیران', 'دۆمیز',
    'مەسلە', 'ئیمام قاسم', 'شۆرجە', 'حەسیرەکە', 'خەزرا'
];

// ========== Save Data ==========
function save() {
    localStorage.setItem(DATA_KEY, JSON.stringify(app));
}

// ========== Generate ID ==========
function genId() {
    const d = new Date();
    return `GD-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
}

// ========== Render ==========
function render(page) {
    const container = document.getElementById('app-content');
    app.currentPage = page;
    save();
    
    switch(page) {
        case 'home': homePage(container); break;
        case 'order': orderPage(container); break;
        case 'track': trackPage(container); break;
        case 'profile': profilePage(container); break;
    }
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
}

// ========== Home Page ==========
function homePage(c) {
    const total = app.orders.length;
    const delivered = app.orders.filter(o => o.status === 'گەیاندرا').length;
    const free = app.orders.filter(o => o.price === 0).length;
    const revenue = app.orders.reduce((s, o) => s + (o.price || 0), 0);

    c.innerHTML = `
        <div class="hero">
            <h1>🚀 گەیاندنی زێڕین</h1>
            <p>خێراترین و پارێزراوترین گەیاندن لە کەرکوک</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${total}</div>
                <div class="stat-label">📦 کۆی داواکاری</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${delivered}</div>
                <div class="stat-label">✅ گەیاندراوە</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${free}</div>
                <div class="stat-label">🎁 خۆڕایی</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${revenue.toLocaleString()}</div>
                <div class="stat-label">💰 داهات</div>
            </div>
        </div>

        <div class="features-grid">
            <div class="feature-card">
                <span class="feature-icon">⚡</span>
                <div class="feature-title">گەیاندنی خێرا</div>
                <div class="feature-desc">لە ماوەی ٢٤ کاتژمێردا</div>
            </div>
            <div class="feature-card">
                <span class="feature-icon">🔒</span>
                <div class="feature-title">پارێزراوی تەواو</div>
                <div class="feature-desc">کاڵاکەت سەلامەتە</div>
            </div>
            <div class="feature-card">
                <span class="feature-icon">🎁</span>
                <div class="feature-title">گەیاندنی خۆڕایی</div>
                <div class="feature-desc">یەک لە هەر ٣ جار</div>
            </div>
        </div>

        ${total > 0 ? `
            <div class="form-card">
                <h3 style="color:var(--primary);margin-bottom:15px;">📋 دوایین داواکارییەکان</h3>
                <div class="table-responsive">
                    <table>
                        <thead><tr><th>ID</th><th>کڕیار</th><th>گەڕەک</th><th>نرخ</th><th>دۆخ</th></tr></thead>
                        <tbody>
                            ${app.orders.slice(-5).reverse().map(o => `
                                <tr>
                                    <td><small>${o.orderId}</small></td>
                                    <td>${o.customer}</td>
                                    <td>${o.area}</td>
                                    <td>${(o.price||0).toLocaleString()} د.ع</td>
                                    <td><span class="status-badge status-${o.status === 'گەیاندرا' ? 'delivered' : o.status === 'چاوەڕوانی' ? 'pending' : 'transit'}">${o.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        ` : ''}
    `;
}

// ========== Order Page ==========
function orderPage(c) {
    c.innerHTML = `
        <h2 style="color:var(--primary);text-align:center;margin-bottom:20px;">📦 داواکاری نوێ</h2>
        
        <div class="alert alert-info">🎁 یەکێک لە هەر ٣ گەیاندنێک بە خۆڕاییە!</div>
        
        <form id="orderForm" class="form-card">
            <div class="form-group">
                <label class="form-label">ناوی کڕیار *</label>
                <input type="text" class="form-input" id="custName" required>
            </div>
            <div class="form-group">
                <label class="form-label">ژمارەی مۆبایل *</label>
                <input type="tel" class="form-input" id="phone" placeholder="07xx xxx xxxx" required>
            </div>
            <div class="form-group">
                <label class="form-label">ناوی دوکان</label>
                <input type="text" class="form-input" id="shop">
            </div>
            <div class="form-group">
                <label class="form-label">گەڕەک *</label>
                <select class="form-select" id="area" required>
                    <option value="">-- هەڵبژێرە --</option>
                    ${AREAS.map(a => `<option>${a}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">وردەکاری ناونیشان</label>
                <textarea class="form-textarea" id="address" placeholder="نزیک کوێیە؟"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">نرخ (د.ع)</label>
                <input type="number" class="form-input" id="price" value="3000" min="0" step="1000">
            </div>
            <div class="form-group">
                <label class="form-label">کۆدی پڕۆمۆ</label>
                <input type="text" class="form-input" id="promo" placeholder="بەتاڵ بیهێڵە">
            </div>
            <button type="submit" class="btn btn-primary">✅ تۆمارکردنی داواکاری</button>
        </form>
    `;

    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('custName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const area = document.getElementById('area').value;
        
        if (!name || !phone || !area) {
            alert('تکایە خانە پێویستەکان پڕ بکەرەوە');
            return;
        }

        let price = parseInt(document.getElementById('price').value) || 3000;
        const promo = document.getElementById('promo').value.trim();
        
        // Check free delivery (every 3rd)
        const count = app.orders.filter(o => o.phone === phone).length;
        if ((count + 1) % 3 === 0) {
            price = 0;
            alert('🎊 پیرۆزە! ئەم گەیاندنەت خۆڕاییە!');
        }
        
        // Check promo
        if (promo && PROMOS[promo] && price >= PROMOS[promo].min) {
            const p = PROMOS[promo];
            if (p.type === '%') price -= (price * p.discount / 100);
            else price -= p.discount;
            if (price < 0) price = 0;
            alert(`✅ کۆدی پڕۆمۆ بەکارهات!`);
        }

        const order = {
            orderId: genId(),
            date: new Date().toISOString().split('T')[0],
            customer: name,
            phone: phone,
            shop: document.getElementById('shop').value,
            area: area,
            address: document.getElementById('address').value,
            price: price,
            status: 'چاوەڕوانی',
            estimated: new Date(Date.now() + 86400000).toISOString().split('T')[0]
        };

        app.orders.push(order);
        save();
        
        alert(`✅ داواکاری تۆمارکرا!\n🆔 ${order.orderId}`);
        this.reset();
        document.getElementById('price').value = '3000';
    });
}

// ========== Track Page ==========
function trackPage(c) {
    c.innerHTML = `
        <h2 style="color:var(--primary);text-align:center;margin-bottom:20px;">📍 شوێنکەوتنی داواکاری</h2>
        
        <div class="form-card">
            <div class="form-group">
                <label class="form-label">ژمارەی داواکاری</label>
                <input type="text" class="form-input" id="trackId" placeholder="GD-202501-XXXX">
            </div>
            <button class="btn btn-primary" id="trackBtn">🔍 گەڕان</button>
            <div id="trackResult" class="mt-3"></div>
        </div>
    `;

    document.getElementById('trackBtn').addEventListener('click', () => {
        const id = document.getElementById('trackId').value.trim();
        const order = app.orders.find(o => o.orderId === id);
        const result = document.getElementById('trackResult');

        if (!order) {
            result.innerHTML = '<div class="alert alert-warning">❌ داواکاری نەدۆزرایەوە</div>';
            return;
        }

        const steps = ['چاوەڕوانی', 'وەرگیرا', 'لە ڕێگادا', 'لە ڕێگەی گەیاندن', 'گەیاندرا'];
        const icons = ['⏳', '📦', '🚚', '🚪', '✅'];
        const current = steps.indexOf(order.status);

        result.innerHTML = `
            <div class="form-card">
                <h4 style="color:var(--primary);">📦 ${order.orderId}</h4>
                <p>👤 ${order.customer} | 📍 ${order.area}</p>
                <p>💰 ${(order.price||0).toLocaleString()} د.ع | 📅 ${order.date}</p>
                <p>⏰ گەیاندن: ${order.estimated}</p>
                <hr style="border-color:rgba(255,255,255,0.1);">
                <div class="timeline">
                    ${steps.map((s, i) => `
                        <div class="timeline-item ${i < current ? 'completed' : ''} ${i === current ? 'current' : ''}">
                            <span>${icons[i]}</span> ${s}
                            ${i === current ? ' <small style="color:var(--primary);">(ئێستا)</small>' : ''}
                            ${i < current ? ' ✅' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
}

// ========== Profile Page ==========
function profilePage(c) {
    if (!app.user) {
        c.innerHTML = `
            <h2 style="color:var(--primary);text-align:center;margin-bottom:20px;">👤 هەژمار</h2>
            <div class="form-card text-center">
                <p style="margin-bottom:15px;">بچۆ ژوورەوە بۆ بەڕێوەبردنی داواکارییەکانت</p>
                <button class="btn btn-primary mb-3" id="loginBtn">🔑 چوونەژوورەوە</button>
                <hr style="border-color:rgba(255,255,255,0.1);">
                <p style="font-size:13px;color:var(--text-dim);">بەڕێوەبەر</p>
                <input type="password" class="form-input mb-2" id="adminPass" placeholder="وشەی نهێنی">
                <button class="btn btn-outline" id="adminBtn">🔓 کردنەوە</button>
            </div>
        `;

        document.getElementById('loginBtn').addEventListener('click', () => {
            app.user = { name: 'بەکارهێنەر', role: 'customer' };
            save();
            render('profile');
        });

        document.getElementById('adminBtn').addEventListener('click', () => {
            if (document.getElementById('adminPass').value === 'GoldenAdmin2026') {
                app.user = { name: 'ئەدمین', role: 'admin' };
                app.adminAuth = true;
                save();
                render('profile');
            } else {
                alert('❌ وشەی نهێنی هەڵەیە');
            }
        });
    } else {
        // Logged in
        if (app.adminAuth) {
            // Admin dashboard
            c.innerHTML = `
                <h2 style="color:var(--primary);text-align:center;margin-bottom:20px;">📊 پانێڵی بەڕێوەبەر</h2>
                
                <div class="stats-grid" style="margin-bottom:20px;">
                    <div class="stat-card">
                        <div class="stat-value">${app.orders.length}</div>
                        <div class="stat-label">کۆی داواکاری</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${app.orders.reduce((s,o) => s+(o.price||0), 0).toLocaleString()}</div>
                        <div class="stat-label">کۆی داهات</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${app.drivers.filter(d=>d.status==='بەردەست').length}</div>
                        <div class="stat-label">شۆفێری بەردەست</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${app.orders.filter(o=>o.status==='گەیاندرا').length}</div>
                        <div class="stat-label">گەیاندراوە</div>
                    </div>
                </div>

                <div class="form-card">
                    <h3 style="color:var(--primary);margin-bottom:15px;">📋 هەموو داواکارییەکان</h3>
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>ID</th><th>کڕیار</th><th>گەڕەک</th><th>نرخ</th><th>دۆخ</th><th>گۆڕینی دۆخ</th></tr></thead>
                            <tbody>
                                ${app.orders.slice().reverse().map(o => `
                                    <tr>
                                        <td><small>${o.orderId}</small></td>
                                        <td>${o.customer}</td>
                                        <td>${o.area}</td>
                                        <td>${(o.price||0).toLocaleString()}</td>
                                        <td><span class="status-badge status-${o.status === 'گەیاندرا' ? 'delivered' : o.status === 'چاوەڕوانی' ? 'pending' : 'transit'}">${o.status}</span></td>
                                        <td>
                                            <select class="form-select status-update" data-id="${o.orderId}" style="padding:6px;font-size:12px;">
                                                <option ${o.status==='چاوەڕوانی'?'selected':''}>چاوەڕوانی</option>
                                                <option ${o.status==='وەرگیرا'?'selected':''}>وەرگیرا</option>
                                                <option ${o.status==='لە ڕێگادا'?'selected':''}>لە ڕێگادا</option>
                                                <option ${o.status==='لە ڕێگەی گەیاندن'?'selected':''}>لە ڕێگەی گەیاندن</option>
                                                <option ${o.status==='گەیاندرا'?'selected':''}>گەیاندرا</option>
                                                <option ${o.status==='هەڵوەشایەوە'?'selected':''}>هەڵوەشایەوە</option>
                                            </select>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <button class="btn btn-danger mt-3" id="logoutBtn">🚪 چوونەدەرەوە</button>
            `;

            // Status update listeners
            document.querySelectorAll('.status-update').forEach(sel => {
                sel.addEventListener('change', function() {
                    const order = app.orders.find(o => o.orderId === this.dataset.id);
                    if (order) {
                        order.status = this.value;
                        save();
                    }
                });
            });

        } else {
            c.innerHTML = `
                <h2 style="color:var(--primary);text-align:center;margin-bottom:20px;">👤 هەژماری من</h2>
                <div class="form-card">
                    <p><strong>ناو:</strong> ${app.user.name}</p>
                    <p><strong>ڕۆڵ:</strong> کڕیار</p>
                    <button class="btn btn-danger mt-3" id="logoutBtn">🚪 چوونەدەرەوە</button>
                </div>
                <h3 style="color:var(--primary);margin:20px 0;">📦 داواکارییەکانم</h3>
                ${app.orders.length > 0 ? `
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>ID</th><th>بەروار</th><th>گەڕەک</th><th>نرخ</th><th>دۆخ</th></tr></thead>
                            <tbody>
                                ${app.orders.slice().reverse().map(o => `
                                    <tr>
                                        <td><small>${o.orderId}</small></td>
                                        <td>${o.date}</td>
                                        <td>${o.area}</td>
                                        <td>${(o.price||0).toLocaleString()}</td>
                                        <td><span class="status-badge status-${o.status === 'گەیاندرا' ? 'delivered' : o.status === 'چاوەڕوانی' ? 'pending' : 'transit'}">${o.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : '<p style="color:var(--text-dim);">هێشتا هیچ داواکارییەکت نییە</p>'}
            `;
        }

        document.getElementById('logoutBtn').addEventListener('click', () => {
            app.user = null;
            app.adminAuth = false;
            save();
            render('profile');
        });
    }
}

// ========== Initialize ==========
document.addEventListener('DOMContentLoaded', () => {
    // Navigation click handlers
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            render(this.dataset.page);
        });
    });

    // Theme toggle
    document.querySelector('.theme-btn').addEventListener('click', () => {
        const btn = document.querySelector('.theme-btn');
        if (app.theme === 'dark') {
            document.documentElement.style.setProperty('--bg', '#F8FAFC');
            document.documentElement.style.setProperty('--card', '#FFFFFF');
            document.documentElement.style.setProperty('--text', '#1E293B');
            document.documentElement.style.setProperty('--text-dim', '#64748B');
            btn.textContent = '☀️';
            app.theme = 'light';
        } else {
            document.documentElement.style.setProperty('--bg', '#0F172A');
            document.documentElement.style.setProperty('--card', '#1E293B');
            document.documentElement.style.setProperty('--text', '#F8FAFC');
            document.documentElement.style.setProperty('--text-dim', '#94A3B8');
            btn.textContent = '🌙';
            app.theme = 'dark';
        }
        save();
    });

    // Load initial page
    render(app.currentPage);
});
