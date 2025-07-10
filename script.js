/* === General & Variables === */
:root {
    --bg-dark: #0F172A;
    --bg-surface: #1E293B;
    --bg-body: #020617;
    --text-primary: #E2E8F0;
    --text-secondary: #94A3B8;
    --accent-start: #38BDF8;
    --accent-end: #9333EA;
    --border-color: #334155;
    --success-bg: #166534;
    --success-text: #A7F3D0;
}

body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
.hidden { display: none !important; }

/* === Navbar === */
.navbar {
    padding: 1rem 0;
    background-color: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 1000;
}
.navbar .container { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.5rem; font-weight: 800; text-decoration: none; color: var(--text-primary); }
.navbar nav a { color: var(--text-secondary); text-decoration: none; margin-left: 1.5rem; transition: color 0.3s; }
.navbar nav a:hover { color: var(--text-primary); }

/* === Buttons === */
.btn {
    padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none;
    font-weight: 600; display: inline-block; transition: all 0.3s ease;
    border: none; cursor: pointer;
}
.btn-primary { background-image: linear-gradient(to right, var(--accent-start), var(--accent-end)); color: white; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3); }
.btn-secondary { background-color: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); }
.btn-secondary:hover { background-color: var(--border-color); }
.btn-ghost { background: transparent; color: var(--text-secondary); }
.btn-ghost:hover { background-color: var(--bg-surface); color: var(--text-primary); }
.full-width { width: 100%; text-align: center; box-sizing: border-box; }

/* === Hero Section === */
.hero { text-align: center; padding: 6rem 0; }
.hero-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2; }
.gradient-text { background-image: linear-gradient(to right, var(--accent-start), var(--accent-end)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero p { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem; }
.hero-buttons { display: flex; justify-content: center; gap: 1rem; }
.hero-mockup { margin-top: 4rem; max-width: 320px; height: auto; }

/* === Reusable & Other Sections === */
.features, .pricing { padding: 5rem 0; text-align: center; }
.features h2, .pricing h2, .interactive-demo h2, .faq h2 { font-size: 2.5rem; margin-bottom: 3rem; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.card { background-color: var(--bg-surface); padding: 2rem; border-radius: 8px; text-align: left; border: 1px solid var(--border-color); }
.card h3 { margin-top: 0; }
.interactive-demo { padding: 5rem 0; background-color: var(--bg-surface); text-align: center; }
.demo-form-card { max-width: 450px; margin: 0 auto; }
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; align-items: center; }
/* ... other sections styles are mostly unchanged ... */
.faq { padding: 5rem 0; background-color: var(--bg-surface); }
.footer { padding: 3rem 0; text-align: center; color: var(--text-secondary); border-top: 1px solid var(--border-color); }

/* === Auth Pages (Login/Signup) - REVAMPED === */
.auth-page-bg { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-image: linear-gradient(135deg, var(--bg-dark), #2c1a4d); }
.auth-container { padding: 20px; }
.auth-card { width: 100%; max-width: 400px; background-color: var(--bg-surface); padding: 2.5rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.auth-logo-container { display: flex; flex-direction: column; align-items: center; margin-bottom: 1rem; }
.auth-icon-wrapper { width: 60px; height: 60px; background-image: linear-gradient(to right, var(--accent-start), var(--accent-end)); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 0.5rem; color: white; }
.auth-card h2 { text-align: center; font-size: 1.8rem; margin-top: 0; margin-bottom: 0.5rem; }
.auth-subtitle { text-align: center; color: var(--text-secondary); margin-top: 0; margin-bottom: 2rem; }
.form-group-icon { position: relative; margin-bottom: 1.5rem; }
.form-group-icon svg { position: absolute; top: 50%; transform: translateY(-50%); left: 1rem; color: var(--text-secondary); }
.form-group-icon input { width: 100%; padding: 0.8rem 1rem 0.8rem 3rem; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--bg-dark); color: var(--text-primary); font-size: 1rem; box-sizing: border-box; }
.form-group-icon input:focus { outline: none; border-color: var(--accent-start); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.3); }
.form-message { padding: 0.75rem; margin-bottom: 1.5rem; border-radius: 6px; font-weight: 500; }
.form-message.success { background-color: var(--success-bg); color: var(--success-text); }
.auth-switch { text-align: center; margin-top: 1.5rem; color: var(--text-secondary); }
.auth-switch a { color: var(--accent-start); font-weight: 600; text-decoration: none; }

/* === Dashboard - REVAMPED === */
.dashboard-body { background-color: var(--bg-body); }
.dashboard-layout { display: flex; min-height: 100vh; }
.sidebar { width: 260px; background-color: var(--bg-dark); border-right: 1px solid var(--border-color); padding: 1.5rem; display: flex; flex-direction: column; }
.sidebar-header { margin-bottom: 2rem; }
.sidebar-nav { display: flex; flex-direction: column; gap: 0.5rem; }
.nav-link { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; border-radius: 6px; text-decoration: none; color: var(--text-secondary); font-weight: 500; transition: background-color 0.2s, color 0.2s; }
.nav-link:hover { background-color: var(--bg-surface); color: var(--text-primary); }
.nav-link.active { background-color: var(--bg-surface); color: var(--text-primary); font-weight: 600; }
.main-content { flex: 1; padding: 2rem; overflow-y: auto; }
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.main-header h2 { font-size: 1.5rem; margin: 0; }
.content-panel { display: none; }
.content-panel.active { display: block; }
.content-panel h3 { font-size: 1.8rem; margin-bottom: 1.5rem; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { text-align: left; }
.stat-card h4 { margin: 0 0 0.5rem 0; color: var(--text-secondary); font-weight: 600; }
.stat-card p { margin: 0; font-size: 2.5rem; font-weight: 800; }
.dashboard-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 2rem; }
@media (min-width: 1024px) { .dashboard-grid { grid-template-columns: 2fr 1fr; } }
.chart-card { padding: 1rem; display: flex; align-items: center; justify-content: center; }
.chart-card img { max-width: 100%; height: auto; }
.table-card { padding: 0; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
thead th { color: var(--text-secondary); font-size: 0.9rem; text-transform: uppercase; font-weight: 600; }
tbody tr:hover { background-color: var(--bg-surface); }
tbody tr:last-child td { border-bottom: none; }
.status { padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
.status.shipped { background-color: #0E7490; color: #67E8F9; }
.status.processing { background-color: #9A3412; color: #FDBA74; }
.status.delivered { background-color: #166534; color: #A7F3D0; }
.status.cancelled { background-color: #991B1B; color: #FECACA; }
.action-link { color: var(--accent-start); text-decoration: none; font-weight: 600; }
.empty-state-card { text-align: center; padding: 4rem 2rem; border: 2px dashed var(--border-color); }
.empty-state-card p { font-size: 1.1rem; color: var(--text-secondary); margin-top: 0; }
