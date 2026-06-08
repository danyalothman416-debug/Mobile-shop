// ========== DATA STORAGE ==========
const STORAGE_KEY = 'goldenDeliveryData';

let appData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    orders: [],
    customers: [],
    drivers: [],
    feedback: [],
    user: null,
    theme: 'dark',
    lang: 'ckb',
    adminLogged: false
};

// Sample Drivers
if (appData.drivers.length === 0) {
    appData.drivers = [
        { id: 'D001', name: 'ئارام محەمەد', phone: '07701234567', status: 'Available', area: 'شوراو' },
        { id: 'D002', name: 'سامان عومەر', phone: '07702345678', status: 'Available', area: 'تسعين' },
        { id: 'D003', name: 'هێمن عەلی', phone: '07703456789', status: 'Busy', area: 'عرفة' }
    ];
}

const PROMO_CODES = {
    'WELCOME10': { discount: 10, type: 'percentage', minOrder: 5000 },
    'FREESHIP': { discount: 3000, type: 'fixed', minOrder: 10000 },
    'FIRST3': { discount: 15, type: 'percentage', minOrder: 3000 },
    'GOLDEN50': { discount: 50, type: 'percentage', minOrder: 20000 }
};

const KIRKUK_AREAS = [
    'عرفة', 'تسعين', 'شوراو', 'رحيماوة', 'قورية', 'الواسطي', 'النصر', 'ازادي',
    'واحد حزيران', 'الماس', 'الميثاق', 'الجامعة', 'الأندلس', 'دوميز', 'الخضراء'
];

// ========== SAVE TO LOCALSTORAGE ==========
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

// ========== GENERATE ORDER ID ==========
function generateOrderId() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `GD-${now.getFullYear()}${month}-${random}`;
}

// ========== THEME TOGGLE ==========
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeToggle');
    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
        btn.textContent = '☀️ ڕووناک';
        appData.theme = 'light';
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        btn.textContent = '🌙 تاریک';
        appData.theme = 'dark';
    }
    saveData();
}

// ========== RENDER PAGES ==========
function renderPage(page) {
    const content = document.getElementById('mainContent');
    switch(page) {
        case 'home': renderHome(content); break;
        case 'order': renderOrder(content); break;
        case 'track': renderTrack(content); break;
        case 'offers': renderOffers(content); break;
        case 'profile': renderProfile(content); break;
        case 'terms': renderTerms(content); break;
        case 'support': renderSupport(content); break;
        default: renderHome(content);
    }
    // Add fade animation
    content.classList.add('fade-in');
    setTimeout(() => content.classList.remove('fade-in'), 500);
}

// ========== HOME PAGE ==========
function renderHome(container) {
    const totalOrders = appData.orders.length;
    const delivered = appData.orders.filter(o => o.status === 'گەیاندرا').length;
    const freeOrders = appData.orders.filter(o => o.price === 0).length;
    const totalRevenue = appData.orders.reduce((sum, o) => sum + (o.price || 0), 0);

    container.innerHTML = `
        <div class="brand-header">
            <h1>🚚 گۆڵدن دلیڤەری پرۆ</h1>
            <p class="mb-0">گەیاندنی خێرا و پارێزراو لە سەرانسەری کەرکوک</p>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
                <div class="glass-card stat-card">
                    <div class="stat-value">${totalOrders}</div>
                    <div class="stat-label">📦 کۆی داواکارییەکان</div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="glass-card stat-card">
                    <div class="stat-value">${delivered}</div>
                    <div class="stat-label">✅ گەیاندراوە</div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="glass-card stat-card">
                    <div class="stat-value">${freeOrders}</div>
                    <div class="stat-label">🎁 گەیاندنی خۆڕایی</div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="glass-card stat-card">
                    <div class="stat-value">${totalRevenue.toLocaleString()}</div>
                    <div class="stat-label">💰 کۆی داهات (د.ع)</div>
                </div>
            </div>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="glass-card text-center">
                    <h3 class="card-title">⚡ خێرا</h3>
                    <p>گەیاندن لە ماوەی ٢٤ کاتژمێردا</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="glass-card text-center">
                    <h3 class="card-title">🔒 پارێزراو</h3>
                    <p>پاکەتەکانت سەلامەتن لە لای ئێمە</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="glass-card text-center">
                    <h3 class="card-title">🎁 گەیاندنی خۆڕایی</h3>
                    <p>یەکێک لە هەر ٣ گەیاندنێک بە خۆڕاییە</p>
                </div>
            </div>
        </div>

        <h4 class="card-title">📋 دوایین داواکارییەکان</h4>
        ${renderOrdersTable(appData.orders.slice(-5).reverse())}
    `;
}

// ========== ORDER PAGE ==========
function renderOrder(container) {
    container.innerHTML = `
        <h2 class="text-center card-title mb-4">📦 داواکردنی گەیاندن</h2>
        
        <div class="alert alert-gold mb-4">
            🎁 <strong>دیاری:</strong> یەکێک لە هەر ٣ گەیاندنێک بە خۆڕاییە!
        </div>

        <div class="glass-card">
            <form id="orderForm">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">ناوی کڕیار</label>
                        <input type="text" class="form-control" id="customerName" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">ژمارەی مۆبایل</label>
                        <input type="tel" class="form-control" id="phone" placeholder="07xx xxx xxxx" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">ناوی دوکان</label>
                        <input type="text" class="form-control" id="shopName">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">ناونیشانی دوکان</label>
                        <input type="text" class="form-control" id="shopAddr">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">گەڕەک</label>
                        <select class="form-select" id="area" required>
                            <option value="">-- گەڕەک هەڵبژێرە --</option>
                            ${KIRKUK_AREAS.map(a => `<option value="${a}">${a}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">نرخ (د.ع)</label>
                        <input type="number" class="form-control" id="price" value="3000" min="0" step="1000">
                    </div>
                    <div class="col-12">
                        <label class="form-label">وردەکاری ناونیشان</label>
                        <textarea class="form-control" id="address" rows="2" placeholder="نزیک کوێیە؟"></textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">کۆدی پڕۆمۆ</label>
                        <input type="text" class="form-control" id="promoCode" placeholder="بەتاڵ بیهێڵە">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">شێوازی پارەدان</label>
                        <select class="form-select" id="paymentMethod">
                            <option>پارەدان لە کاتی گەیاندن</option>
                            <option>گواستنەوەی بانکی</option>
                            <option>زەین کاش</option>
                            <option>ئاسیا حەوالە</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-gold w-100 btn-lg">
                            ✅ تۆمارکردنی داواکاری
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;

    // Form Submit Handler
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const customerName = document.getElementById('customerName').value;
        const phone = document.getElementById('phone').value;
        const area = document.getElementById('area').value;
        const priceInput = document.getElementById('price').value;
        const promoCode = document.getElementById('promoCode').value;
        
        if (!customerName || !phone || !area) {
            alert('تکایە هەموو خانە پێویستەکان پڕ بکەرەوە');
            return;
        }

        let price = parseInt(priceInput) || 3000;
        
        // Check free delivery (every 3rd order)
        const customerOrders = appData.orders.filter(o => o.phone === phone).length;
        if ((customerOrders + 1) % 3 === 0) {
            price = 0;
            alert('🎊 پیرۆزە! ئەم گەیاندنەت بە خۆڕاییە!');
        }
        
        // Check promo code
        if (promoCode && PROMO_CODES[promoCode]) {
            const promo = PROMO_CODES[promoCode];
            if (price >= promo.minOrder) {
                if (promo.type === 'percentage') {
                    price -= (price * promo.discount) / 100;
                } else {
                    price -= promo.discount;
                }
                alert(`کۆدی پڕۆمۆ بەکارهات! داشکاندن: ${promo.discount}${promo.type === 'percentage' ? '%' : ' د.ع'}`);
            }
        }
        
        if (price < 0) price = 0;

        // Create order
        const order = {
            orderId: generateOrderId(),
            date: new Date().toISOString().split('T')[0],
            customer: customerName,
            shop: document.getElementById('shopName').value,
            phone: phone,
            area: area,
            address: document.getElementById('address').value,
            shopAddr: document.getElementById('shopAddr').value,
            price: price,
            status: 'چاوەڕوانی',
            paymentMethod: document.getElementById('paymentMethod').value,
            promoCode: promoCode || null,
            estimatedDelivery: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]
        };

        appData.orders.push(order);
        saveData();

        alert(`✅ داواکاری بە سەرکەوتوویی تۆمارکرا!\nژمارەی داواکاری: ${order.orderId}`);
        this.reset();
    });
}

// ========== TRACK PAGE ==========
function renderTrack(container) {
    container.innerHTML = `
        <h2 class="text-center card-title mb-4">📍 شوێنکەوتنی داواکاری</h2>
        
        <div class="glass-card">
            <label class="form-label">ژمارەی داواکاری بنووسە</label>
            <div class="input-group mb-3">
                <input type="text" class="form-control" id="trackInput" placeholder="بۆ نموونە: GD-202501-ABC123">
                <button class="btn btn-gold" id="trackBtn">🔍 گەڕان</button>
            </div>
            <div id="trackResult"></div>
        </div>
    `;

    document.getElementById('trackBtn').addEventListener('click', function() {
        const orderId = document.getElementById('trackInput').value.trim();
        const order = appData.orders.find(o => o.orderId === orderId);
        const resultDiv = document.getElementById('trackResult');

        if (!order) {
            resultDiv.innerHTML = '<div class="alert alert-warning mt-3">❌ داواکاری نەدۆزرایەوە</div>';
            return;
        }

        const statusSteps = ['چاوەڕوانی', 'وەرگیرا', 'لە ڕێگادا', 'لە ڕێگەی گەیاندن', 'گەیاندرا'];
        const statusIcons = ['⏳', '📦', '🚚', '🚪', '✅'];
        const currentStatusIdx = statusSteps.indexOf(order.status);

        resultDiv.innerHTML = `
            <div class="glass-card mt-3">
                <h5>📦 ${order.orderId}</h5>
                <p><strong>کڕیار:</strong> ${order.customer}</p>
                <p><strong>گەڕەک:</strong> ${order.area}</p>
                <p><strong>نرخ:</strong> ${order.price.toLocaleString()} د.ع</p>
                <p><strong>ڕێکەوت:</strong> ${order.date}</p>
                <p><strong>گەیاندنی چاوەڕوانکراو:</strong> ${order.estimatedDelivery}</p>
                
                <hr>
                <h6 class="card-title">هەنگاوەکانی گەیاندن:</h6>
                ${statusSteps.map((step, i) => `
                    <div class="timeline-item ${i <= currentStatusIdx ? 'border-start border-3 border-warning' : 'opacity-50'}">
                        <span class="timeline-icon">${statusIcons[i]}</span>
                        <span>${step}</span>
                    </div>
                `).join('')}
            </div>
        `;
    });
}

// ========== OFFERS PAGE ==========
function renderOffers(container) {
    container.innerHTML = `
        <h2 class="text-center card-title mb-4">🎁 پێشکەشکراوەکان</h2>

        <div class="row g-3 mb-4">
            <div class="col-md-6">
                <div class="glass-card text-center">
                    <h4 class="card-title">🎊 گەیاندنی خۆڕایی</h4>
                    <p class="fs-5">یەکێک لە هەر ٣ گەیاندنێک بە خۆڕاییە!</p>
                    <p>بە شێوەیەکی خۆکار جێبەجێ دەبێت</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="glass-card text-center">
                    <h4 class="card-title">💎 خاڵی دڵسۆزی</h4>
                    <p class="fs-5">١ خاڵ بۆ هەر ١٠٠٠ دینار</p>
                    <p>١٠٠ خاڵ = ٥٠٠٠ دینار داشکاندن</p>
                </div>
            </div>
        </div>

        <h4 class="card-title">🏷️ کۆدی پڕۆمۆ</h4>
        <div class="row g-3">
            ${Object.entries(PROMO_CODES).map(([code, promo]) => `
                <div class="col-md-6 col-lg-4">
                    <div class="glass-card text-center">
                        <h5 class="text-warning">${code}</h5>
                        <p class="fs-4">${promo.discount}${promo.type === 'percentage' ? '%' : ' د.ع'} داشکاندن</p>
                        <p class="small">کەمترین داواکاری: ${promo.minOrder.toLocaleString()} د.ع</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ========== PROFILE PAGE ==========
function renderProfile(container) {
    if (!appData.user) {
        container.innerHTML = `
            <h2 class="text-center card-title mb-4">👤 هەژمار</h2>
            <div class="glass-card text-center">
                <p>تکایە بچۆ ژوورەوە بۆ بینینی هەژمارەکەت</p>
                <button class="btn btn-gold btn-lg" id="loginBtn">🔑 چوونەژوورەوە</button>
                <div id="adminSection" class="mt-4">
                    <hr>
                    <p class="small">بەڕێوەبەر:</p>
                    <input type="password" class="form-control mb-2" id="adminPass" placeholder="وشەی نهێنی">
                    <button class="btn btn-outline-warning" id="adminLoginBtn">🔓 کردنەوە</button>
                </div>
            </div>
        `;

        document.getElementById('loginBtn').addEventListener('click', function() {
            appData.user = { name: 'بەکارهێنەر', email: 'user@gmail.com', role: 'customer' };
            saveData();
            renderPage('profile');
        });

        document.getElementById('adminLoginBtn').addEventListener('click', function() {
            if (document.getElementById('adminPass').value === 'GoldenAdmin2026') {
                appData.adminLogged = true;
                appData.user = { name: 'ئەدمین', email: 'admin@goldendelivery.com', role: 'admin' };
                saveData();
                renderPage('profile');
            } else {
                alert('❌ وشەی نهێنی هەڵەیە');
            }
        });
    } else {
        // Logged in view
        const userOrders = appData.orders.filter(o => o.phone === appData.user.phone || appData.user.role === 'admin');
        
        container.innerHTML = `
            <h2 class="text-center card-title mb-4">👤 هەژماری من</h2>
            <div class="glass-card">
                <p><strong>ناو:</strong> ${appData.user.name}</p>
                <p><strong>ئیمەیڵ:</strong> ${appData.user.email}</p>
                <p><strong>ڕۆڵ:</strong> ${appData.user.role === 'admin' ? 'بەڕێوەبەر' : 'کڕیار'}</p>
                <button class="btn btn-outline-danger" id="logoutBtn">🚪 چوونەدەرەوە</button>
            </div>

            ${appData.adminLogged ? `
            <div class="glass-card mt-4">
                <h4 class="card-title">📊 پانێڵی بەڕێوەبەر</h4>
                <div class="row g-3 mb-3">
                    <div class="col-6 col-md-3">
                        <div class="stat-card"><div class="stat-value">${appData.orders.length}</div><div class="stat-label">کۆی داواکاری</div></div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="stat-card"><div class="stat-value">${appData.customers.length || 0}</div><div class="stat-label">کڕیار</div></div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="stat-card"><div class="stat-value">${appData.drivers.filter(d => d.status === 'Available').length}</div><div class="stat-label">شۆفێری بەردەست</div></div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="stat-card"><div class="stat-value">${appData.orders.reduce((s,o) => s + (o.price||0), 0).toLocaleString()}</div><div class="stat-label">داهات (د.ع)</div></div>
                    </div>
                </div>
                
                <h6>داواکارییەکان:</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead><tr><th>ID</th><th>کڕیار</th><th>گەڕەک</th><th>نرخ</th><th>دۆخ</th><th>کردار</th></tr></thead>
                        <tbody>
                            ${appData.orders.slice(-10).reverse().map(o => `
                                <tr>
                                    <td>${o.orderId}</td>
                                    <td>${o.customer}</td>
                                    <td>${o.area}</td>
                                    <td>${o.price?.toLocaleString() || 0}</td>
                                    <td>${o.status}</td>
                                    <td>
                                        <select class="form-select form-select-sm statusUpdate" data-id="${o.orderId}">
                                            <option ${o.status === 'چاوەڕوانی' ? 'selected' : ''}>چاوەڕوانی</option>
                                            <option ${o.status === 'وەرگیرا' ? 'selected' : ''}>وەرگیرا</option>
                                            <option ${o.status === 'لە ڕێگادا' ? 'selected' : ''}>لە ڕێگادا</option>
                                            <option ${o.status === 'لە ڕێگەی گەیاندن' ? 'selected' : ''}>لە ڕێگەی گەیاندن</option>
                                            <option ${o.status === 'گەیاندرا' ? 'selected' : ''}>گەیاندرا</option>
                                            <option ${o.status === 'هەڵوەشایەوە' ? 'selected' : ''}>هەڵوەشایەوە</option>
                                        </select>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}

            <h4 class="card-title mt-4">📦 داواکارییەکانم</h4>
            ${userOrders.length > 0 ? renderOrdersTable(userOrders.reverse()) : '<p>هێشتا هیچ داواکارییەکت نییە</p>'}
        `;

        document.getElementById('logoutBtn').addEventListener('click', function() {
            appData.user = null;
            appData.adminLogged = false;
            saveData();
            renderPage('profile');
        });

        // Status update listeners
        document.querySelectorAll('.statusUpdate').forEach(select => {
            select.addEventListener('change', function() {
                const orderId = this.dataset.id;
                const order = appData.orders.find(o => o.orderId === orderId);
                if (order) {
                    order.status = this.value;
                    saveData();
                }
            });
        });
    }
}

// ========== TERMS PAGE ==========
function renderTerms(container) {
    container.innerHTML = `
        <h2 class="text-center card-title mb-4">📜 مەرج و ڕێساکان</h2>
        <div class="glass-card">
            <h4 class="card-title">ڕێسا زێڕینەکان</h4>
            <ol class="list-group list-group-numbered">
                <li class="list-group-item bg-transparent text-${appData.theme === 'dark' ? 'light' : 'dark'} border-secondary">
                    یەکێک لە هەر ٣ گەیاندنێک بە خۆڕاییە - بە شێوەیەکی خۆکار جێبەجێ دەبێت!
                </li>
                <li class="list-group-item bg-transparent text-${appData.theme === 'dark' ? 'light' : 'dark'} border-secondary">
                    هیچ کاڵایەکی نایاسایی نییە - ئێمە پابەندی هەموو یاسا ناوخۆییەکانین
                </li>
                <li class="list-group-item bg-transparent text-${appData.theme === 'dark' ? 'light' : 'dark'} border-secondary">
                    خزمەتگوزاری خێرا لە سەرانسەری کەرکوک - هەموو گەڕەکەکان داپۆشراون
                </li>
                <li class="list-group-item bg-transparent text-${appData.theme === 'dark' ? 'light' : 'dark'} border-secondary">
                    گەیاندن لە ماوەی ٢٤ کاتژمێری دوای پشتڕاستکردنەوەی داواکاری
                </li>
                <li class="list-group-item bg-transparent text-${appData.theme === 'dark' ? 'light' : 'dark'} border-secondary">
                    تەنها پارەدان لە کاتی گەیاندن
                </li>
                <li class="list-group-item bg-transparent text-${appData.theme === 'dark' ? 'light' : 'dark'} border-secondary">
                    پڕۆمۆشنی گەیاندنی خۆڕایی بۆ داواکارییەکانی سەروو ٣٠٠٠ دینار
                </li>
                <li class="list-group-item bg-transparent text-${appData.theme === 'dark' ? 'light' : 'dark'} border-secondary">
                    کڕیار دەبێت لە کاتی گەیاندن ئامادە بێت
                </li>
            </ol>
        </div>
    `;
}

// ========== SUPPORT PAGE ==========
function renderSupport(container) {
    container.innerHTML = `
        <h2 class="text-center card-title mb-4">📞 پاڵپشتی</h2>
        <div class="row g-3">
            <div class="col-md-6">
                <div class="glass-card">
                    <h5 class="card-title">📞 پەیوەندیمان پێوە بکە</h5>
                    <p><strong>تەلەفۆن:</strong></p>
                    <p><a href="tel:+9647801352003" class="text-warning">07801352003</a></p>
                    <p><a href="tel:+9647721959922" class="text-warning">07721959922</a></p>
                    <p><strong>واتسئاپ:</strong></p>
                    <a href="https://wa.me/9647801352003" target="_blank" class="btn btn-success">💬 پەیوەندی بە واتسئاپ</a>
                    <hr>
                    <p><strong>ئیمەیڵ:</strong> Danyalexpert@gmail.com</p>
                    <p><strong>ناونیشان:</strong> کەرکوک، عێراق</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="glass-card">
                    <h5 class="card-title">🕒 کاتەکانی کارکردن</h5>
                    <p>شەممە - پێنجشەممە: ٨:٠٠ ص - ١٠:٠٠ م</p>
                    <p>هەینی: ٢:٠٠ م - ٨:٠٠ م</p>
                    <p>پاڵپشتی ئۆنڵاین ٢٤/٧ لە ڕێگەی واتسئاپ</p>
                </div>
                
                <div class="glass-card mt-3">
                    <h6 class="card-title">نامەیەک بنێرە</h6>
                    <form id="contactForm">
                        <input type="text" class="form-control mb-2" placeholder="ناوت" required>
                        <input type="text" class="form-control mb-2" placeholder="ژمارەی مۆبایل">
                        <textarea class="form-control mb-2" rows="3" placeholder="پەیامەکەت"></textarea>
                        <button type="submit" class="btn btn-gold w-100">📨 ناردن</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('✅ سوپاس! لە ماوەی ٢٤ کاتژمێردا وەڵامت دەدەینەوە');
        this.reset();
    });
}

// ========== HELPER: RENDER ORDERS TABLE ==========
function renderOrdersTable(orders) {
    if (orders.length === 0) return '<p class="text-center">هیچ داواکارییەک نییە</p>';
    
    return `
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr><th>ID</th><th>بەروار</th><th>کڕیار</th><th>گەڕەک</th><th>نرخ</th><th>دۆخ</th></tr>
                </thead>
                <tbody>
                    ${orders.map(o => `
                        <tr>
                            <td><small>${o.orderId}</small></td>
                            <td>${o.date}</td>
                            <td>${o.customer}</td>
                            <td>${o.area}</td>
                            <td>${o.price?.toLocaleString() || 0}</td>
                            <td>${o.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    if (appData.theme === 'light') {
        document.body.classList.replace('dark-mode', 'light-mode');
        document.getElementById('themeToggle').textContent = '☀️ ڕووناک';
    }

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Navigation
    document.getElementById('mainNav').addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
            const link = e.target.closest('a');
            const page = link.dataset.page;
            
            // Update active state
            document.querySelectorAll('#mainNav .nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Render page
            renderPage(page);
            
            // Save current page
            appData.currentPage = page;
            saveData();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Load initial page
    const initialPage = appData.currentPage || 'home';
    renderPage(initialPage);
    
    // Set active nav
    const activeLink = document.querySelector(`[data-page="${initialPage}"]`);
    if (activeLink) {
        document.querySelectorAll('#mainNav .nav-link').forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
    }
});
