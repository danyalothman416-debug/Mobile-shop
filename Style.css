/* ========== CSS Variables ========== */
:root {
    --gold: #D4AF37;
    --gold-dark: #8A6D3B;
    --transition: all 0.3s ease;
}

/* ========== Dark Mode (Default) ========== */
body.dark-mode {
    --bg: #0a0c10;
    --card-bg: #1e2329;
    --text: #ffffff;
    --text-secondary: #e0e0e0;
    --input-bg: #2d333d;
    --border: #3a404c;
    --nav-bg: #1a1d24;
}

/* ========== Light Mode ========== */
body.light-mode {
    --bg: #f5f7fa;
    --card-bg: #ffffff;
    --text: #1a1a2e;
    --text-secondary: #2d3748;
    --input-bg: #ffffff;
    --border: #e0e0e0;
    --nav-bg: #ffffff;
}

/* ========== Base Styles ========== */
* { transition: background-color 0.3s, color 0.3s; }

body {
    background-color: var(--bg);
    color: var(--text);
    font-family: 'Segoe UI', Tahoma, sans-serif;
    min-height: 100vh;
}

/* ========== Header ========== */
.header {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
    padding: 20px 0;
    color: white;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 1px;
}

/* ========== Navigation ========== */
.nav-tabs {
    background-color: var(--nav-bg);
    padding: 10px 0;
    border-bottom: 2px solid var(--gold);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-pills .nav-link {
    color: var(--text);
    border-radius: 25px;
    padding: 8px 16px;
    margin: 2px;
    font-size: 0.9rem;
    transition: var(--transition);
}

.nav-pills .nav-link:hover {
    background-color: rgba(212, 175, 55, 0.2);
    transform: translateY(-2px);
}

.nav-pills .nav-link.active {
    background-color: var(--gold);
    color: #000;
    font-weight: bold;
}

/* ========== Cards ========== */
.glass-card {
    background-color: var(--card-bg);
    border-radius: 20px;
    padding: 25px;
    border: 1px solid rgba(212, 175, 55, 0.3);
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.card-title {
    color: var(--gold);
    font-size: 1.4rem;
    margin-bottom: 15px;
}

/* ========== Brand Header ========== */
.brand-header {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
    padding: 40px 20px;
    border-radius: 0 0 30px 30px;
    text-align: center;
    color: white;
    margin-bottom: 30px;
}

/* ========== Buttons ========== */
.btn-gold {
    background-color: var(--gold);
    color: #000;
    border: none;
    font-weight: bold;
    border-radius: 10px;
    padding: 10px 25px;
    transition: var(--transition);
}

.btn-gold:hover {
    background-color: #c4a030;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
}

/* ========== Form Elements ========== */
.form-control, .form-select {
    background-color: var(--input-bg);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 15px;
}

.form-control:focus, .form-select:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
}

/* ========== Stats Cards ========== */
.stat-card {
    text-align: center;
    padding: 20px;
}

.stat-card .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--gold);
}

.stat-card .stat-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-top: 5px;
}

/* ========== Order Timeline ========== */
.timeline {
    position: relative;
    padding: 20px 0;
}

.timeline-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 10px;
    background-color: var(--card-bg);
}

.timeline-icon {
    font-size: 1.5rem;
    margin-left: 15px;
}

/* ========== Footer ========== */
.footer {
    background-color: var(--card-bg);
    padding: 20px 0;
    margin-top: 50px;
    border-top: 2px solid var(--gold);
}

.footer a {
    color: var(--gold);
    text-decoration: none;
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
    .logo { font-size: 1.1rem; }
    .nav-pills .nav-link { font-size: 0.8rem; padding: 6px 10px; }
    .brand-header { padding: 25px 15px; }
    .brand-header h1 { font-size: 1.5rem; }
}

/* ========== Animations ========== */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-in {
    animation: fadeIn 0.5s ease;
}

/* ========== Alert Styles ========== */
.alert-gold {
    background-color: rgba(212, 175, 55, 0.15);
    border-right: 4px solid var(--gold);
    color: var(--text);
    border-radius: 10px;
}

/* ========== Table ========== */
.table {
    color: var(--text);
}

.table td, .table th {
    background-color: var(--card-bg);
    color: var(--text);
    border-color: var(--border);
}

/* ========== Badge ========== */
.badge-gold {
    background-color: var(--gold);
    color: #000;
}
