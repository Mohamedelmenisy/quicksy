document.addEventListener('DOMContentLoaded', () => {

    const SUPABASE_URL = 'https://iazgqkhiudfioxskvjvz.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhemdxa2hpdWRmaW94c2t2anZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTE2NjcsImV4cCI6MjA2NzcyNzY2N30.9R3jaGdI-bO-AejUSgWI5LnYa2VMmUFa2TKy8AmdfM4';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // --- Helper function to display messages ---
    const showMessage = (elementId, message, isSuccess = false) => {
        const messageDiv = document.getElementById(elementId);
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.classList.remove('hidden', 'success');
            if (isSuccess) {
                messageDiv.classList.add('success');
            }
        }
    };

    // --- Signup Page Logic ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                showMessage('signup-message', 'Passwords do not match!');
                return;
            }
            if (password.length < 6) {
                showMessage('signup-message', 'Password must be at least 6 characters long.');
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Creating Account...';

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName }
                }
            });

            submitButton.disabled = false;
            submitButton.textContent = 'Create Account';

            if (error) {
                showMessage('signup-message', `Error: ${error.message}`);
            } else if (data.user && data.user.identities.length === 0) {
                 showMessage('signup-message', 'Error: A user with this email already exists.');
            }
            else {
                showMessage('signup-message', 'Success! Please check your email to verify your account.', true);
                signupForm.reset();
            }
        });
    }

    // --- Login Page Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';

            const { error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) {
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
                showMessage('login-message', `Error: ${error.message}`);
            } else {
                window.location.href = 'dashboard.html';
            }
        });
    }

    // --- Landing Page Logic (FAQ) ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // =================================================================
    // ==========            DASHBOARD LOGIC                 ===========
    // =================================================================
    if (document.body.classList.contains('dashboard-body')) {

        const state = {
            user: null,
            profile: null,
            pages: [],
            orders: [],
            customers: []
        };

        const UI = {
            welcomeMessage: document.getElementById('welcome-message'),
            logoutButton: document.getElementById('logout-button'),
            navLinks: document.querySelectorAll('.sidebar-nav .nav-link'),
            contentPanels: document.querySelectorAll('.content-panel'),
            // Panels
            pagesContainer: document.getElementById('pages-container'),
            ordersContainer: document.getElementById('orders-container'),
            customersContainer: document.getElementById('customers-container'),
            // Buttons
            createNewPageBtn: document.getElementById('create-new-page-btn'),
            // Forms
            settingsForm: document.getElementById('settings-form'),
            settingsFullName: document.getElementById('settings-full-name'),
            settingsEmail: document.getElementById('settings-email'),
        };

        // --- RENDER FUNCTIONS (Update the UI) ---
        
        const renderPages = () => {
            if (!state.pages || state.pages.length === 0) {
                UI.pagesContainer.innerHTML = `
                    <div class="card empty-state-card">
                        <p>You haven't created any pages yet. Let's get started!</p>
                        <p>Click the "Create New Page" button above to begin.</p>
                    </div>`;
                return;
            }

            UI.pagesContainer.innerHTML = '<div class="pages-grid"></div>';
            const grid = UI.pagesContainer.querySelector('.pages-grid');
            state.pages.forEach(page => {
                grid.innerHTML += `
                    <div class="card page-card">
                        <div class="page-card-header">
                            <h4>${page.title}</h4>
                            <p>URL: <a href="/${page.slug}" target="_blank">/${page.slug}</a></p>
                        </div>
                        <div class="page-card-stats">
                            <span>0</span> Views | <span>0</span> Orders
                        </div>
                        <div class="page-card-actions">
                            <a href="#" class="btn btn-secondary">Edit</a>
                            <a href="#" class="btn btn-ghost">Analytics</a>
                        </div>
                    </div>`;
            });
        };

        const renderOrders = () => {
             if (!state.orders || state.orders.length === 0) {
                 UI.ordersContainer.innerHTML = `<table><thead><tr><th>Customer</th><th>Date</th><th>Status</th><th>Amount</th><th>Actions</th></tr></thead><tbody><tr><td colspan="5">No orders found.</td></tr></tbody></table>`;
                 return;
            }
            let tableHTML = `
                <table>
                    <thead><tr><th>Customer</th><th>Date</th><th>Status</th><th>Amount</th><th>Actions</th></tr></thead>
                    <tbody>`;
            state.orders.forEach(order => {
                tableHTML += `
                    <tr>
                        <td>${order.customer_name || 'N/A'}</td>
                        <td>${new Date(order.created_at).toLocaleDateString()}</td>
                        <td><span class="status ${order.status || 'processing'}">${order.status || 'processing'}</span></td>
                        <td>$${(order.amount || 0).toFixed(2)}</td>
                        <td><a href="#" class="action-link">View</a></td>
                    </tr>`;
            });
            tableHTML += `</tbody></table>`;
            UI.ordersContainer.innerHTML = tableHTML;
        };
        
        const renderSettings = () => {
            if(state.profile) UI.settingsFullName.value = state.profile.full_name;
            if(state.user) UI.settingsEmail.value = state.user.email;
        }

        const initializeSalesChart = () => { /* ... (same as before) ... */ };

        // --- DATA FETCHING FUNCTIONS (Get data from Supabase) ---
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = 'login.html';
                return;
            }
            state.user = user;
            
            const { data: profile, error } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
            if (profile) state.profile = profile;
        };

        const fetchPages = async () => {
            UI.pagesContainer.innerHTML = '<div class="loader">Loading your pages...</div>';
            const { data, error } = await supabase.from('pages').select('*').eq('user_id', state.user.id);
            if (!error) {
                state.pages = data;
                renderPages();
            }
        };

        const fetchOrders = async () => {
            UI.ordersContainer.innerHTML = '<div class="loader">Loading your orders...</div>';
            // First, get all page IDs for the current user
            const { data: pages, error: pagesError } = await supabase.from('pages').select('id').eq('user_id', state.user.id);
            if (pagesError || !pages || pages.length === 0) {
                 state.orders = [];
                 renderOrders();
                 return;
            }
            const pageIds = pages.map(p => p.id);
            const { data: orders, error: ordersError } = await supabase.from('orders').select('*').in('page_id', pageIds);
            if (!ordersError) {
                state.orders = orders;
                renderOrders();
            }
        };

        // --- EVENT HANDLERS & INITIALIZATION ---
        const handleCreatePage = async (e) => {
            e.preventDefault();
            const pageTitle = prompt("Enter a title for your new page (e.g., 'My Cake Shop'):");
            if (!pageTitle) return;

            const defaultSlug = pageTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const pageSlug = prompt("Enter a unique URL for your page (e.g., my-cake-shop):", defaultSlug);
            if (!pageSlug) return;
            
            const { error } = await supabase.from('pages').insert([{ 
                title: pageTitle, 
                slug: pageSlug, 
                user_id: state.user.id 
            }]);
            
            if (error) {
                alert(`Error creating page: ${error.message}`);
            } else {
                alert('Page created successfully!');
                fetchPages(); // Refresh the pages list
            }
        };

        const handleTabSwitch = (e) => {
            e.preventDefault();
            const link = e.currentTarget;
            UI.navLinks.forEach(l => l.classList.remove('active'));
            UI.contentPanels.forEach(p => p.classList.remove('active'));

            link.classList.add('active');
            const targetPanelId = link.getAttribute('data-target');
            const targetPanel = document.getElementById(targetPanelId);
            targetPanel.classList.add('active');

            // Load data for the selected panel
            switch (targetPanelId) {
                case 'panel-pages': fetchPages(); break;
                case 'panel-orders': fetchOrders(); break;
                case 'panel-customers': /* fetchCustomers(); */ break;
                case 'panel-settings': renderSettings(); break;
                case 'panel-dashboard': initializeSalesChart(); break;
            }
        };
        
        const handleLogout = async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.href = 'index.html';
        };

        const init = async () => {
            await fetchUserData();

            if (state.user) {
                UI.welcomeMessage.textContent = `Welcome back, ${state.profile?.full_name || state.user.email}!`;
                UI.logoutButton.addEventListener('click', handleLogout);
                UI.navLinks.forEach(link => link.addEventListener('click', handleTabSwitch));
                UI.createNewPageBtn.addEventListener('click', handleCreatePage);
                
                // Initialize the dashboard view
                initializeSalesChart();
                // Pre-load data for the first active panel if needed, or wait for tab click.
                // For now, it loads when tab is clicked.
            }
        };

        init();
    }
});
