// --- START OF FILE script.js --- (النسخة النهائية للداشبورد العاملة)

document.addEventListener('DOMContentLoaded', () => {

    // 1. Supabase Client Initialization
    const supabaseUrl = 'https://iazgqkhiudfioxskvjvz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhemdxa2hpdWRmaW94c2t2anZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTE2NjcsImV4cCI6MjA2NzcyNzY2N30.9R3jaGdI-bO-AejUSgWI5LnYa2VMmUFa2TKy8AmdfM4';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    // --- Logic for all pages other than dashboard ---
    // Signup Page Logic
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        // ... (Signup logic remains the same as the previous correct version)
        // This part is working correctly, so we'll keep it concise here.
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Full signup logic here...
            const messageDiv = document.getElementById('signup-message');
            const submitButton = signupForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Creating Account...';
            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const { error } = await supabaseClient.auth.signUp({
                email: email, password: password, options: { data: { full_name: fullName } }
            });

            submitButton.disabled = false;
            submitButton.textContent = 'Create Account';

            if (error) {
                messageDiv.textContent = `Error: ${error.message}`;
                messageDiv.classList.remove('hidden');
            } else {
                messageDiv.textContent = 'Success! Please check your email to verify your account.';
                messageDiv.style.backgroundColor = '#166534';
                messageDiv.classList.remove('hidden');
            }
        });
    }

    // Login Page Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // ... (Login logic remains the same as the previous correct version)
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Full login logic here...
            const submitButton = loginForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) {
                // handle error
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
                document.getElementById('login-message').textContent = `Error: ${error.message}`;
                document.getElementById('login-message').classList.remove('hidden');
            } else {
                window.location.href = 'dashboard.html';
            }
        });
    }

    // 5. ========== DASHBOARD LOGIC (THE IMPORTANT PART) ==========
    if (document.body.classList.contains('dashboard-body')) {
        
        // --- Element Selectors ---
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        const contentPanels = document.querySelectorAll('.content-panel');
        const welcomeMessageEl = document.getElementById('welcome-message');
        const logoutButton = document.getElementById('logout-button');
        const pagesPanelContainer = document.querySelector('#panel-pages');
        const ordersPanelContainer = document.querySelector('#panel-orders .table-card');

        // --- Data Loading Functions ---

        const loadUserPages = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) return;

            pagesPanelContainer.innerHTML = '<h3>Your Quicksy Pages</h3><div class="loader">Loading...</div>'; // Show loader

            const { data: pages, error } = await supabaseClient.from('pages').select('*').eq('user_id', user.id);
            
            pagesPanelContainer.innerHTML = '<h3>Your Quicksy Pages</h3>'; // Clear loader

            if (pages && pages.length > 0) {
                const pagesGrid = document.createElement('div');
                pagesGrid.className = 'pages-grid'; // You can style this class
                pages.forEach(page => {
                    pagesGrid.innerHTML += `
                        <div class="card">
                            <h4>${page.title}</h4>
                            <p>URL: <a href="/${page.slug}" target="_blank">/${page.slug}</a></p>
                            <a href="#" class="action-link">Edit</a>
                        </div>`;
                });
                pagesPanelContainer.appendChild(pagesGrid);
            } else {
                pagesPanelContainer.innerHTML += `
                    <div class="card empty-state-card">
                        <p>You haven't created any pages yet. Let's get started!</p>
                    </div>`;
            }
            pagesPanelContainer.innerHTML += `<br><a href="#" id="create-new-page-btn" class="btn btn-primary">+ Create New Page</a>`;
            document.getElementById('create-new-page-btn').addEventListener('click', showCreatePageModal);
        };
        
        const loadOrders = async () => {
            ordersPanelContainer.innerHTML = '<div class="loader">Loading orders...</div>';

            // This is a complex query to get orders for all pages belonging to the current user
            const { data: { user } } = await supabaseClient.auth.getUser();
            const { data: pages, error: pagesError } = await supabaseClient.from('pages').select('id').eq('user_id', user.id);
            if (pagesError || !pages || pages.length === 0) {
                 ordersPanelContainer.innerHTML = `<table><thead><tr><th>Customer</th><th>Date</th><th>Status</th><th>Amount</th></tr></thead><tbody><tr><td colspan="4">No orders found.</td></tr></tbody></table>`;
                 return;
            }

            const pageIds = pages.map(p => p.id);
            const { data: orders, error: ordersError } = await supabaseClient.from('orders').select('*').in('page_id', pageIds);

            if (orders && orders.length > 0) {
                let tableHTML = `
                    <table>
                        <thead><tr><th>Customer</th><th>Date</th><th>Status</th><th>Amount</th><th>Actions</th></tr></thead>
                        <tbody>`;
                orders.forEach(order => {
                    tableHTML += `
                        <tr>
                            <td>${order.customer_name}</td>
                            <td>${new Date(order.created_at).toLocaleDateString()}</td>
                            <td><span class="status ${order.status}">${order.status}</span></td>
                            <td>$${order.amount}</td>
                            <td><a href="#" class="action-link">View</a></td>
                        </tr>`;
                });
                tableHTML += `</tbody></table>`;
                ordersPanelContainer.innerHTML = tableHTML;
            } else {
                 ordersPanelContainer.innerHTML = `<table><thead><tr><th>Customer</th><th>Date</th><th>Status</th><th>Amount</th></tr></thead><tbody><tr><td colspan="4">No orders found.</td></tr></tbody></table>`;
            }
        };

        const initializeSalesChart = () => {
            const ctx = document.getElementById('salesChart');
            if (ctx) {
                // Destroy previous chart instance if it exists to prevent errors
                let chartStatus = Chart.getChart("salesChart");
                if (chartStatus != undefined) {
                    chartStatus.destroy();
                }
                // Create new chart
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                        datasets: [{
                            label: 'Sales',
                            data: [12, 19, 3, 5, 2, 3, 9], // Replace with REAL data later
                            borderColor: '#9333EA',
                            backgroundColor: 'rgba(147, 51, 234, 0.2)',
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: { 
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true } } 
                    }
                });
            }
        };
        
        const showCreatePageModal = (e) => {
            e.preventDefault();
            const pageTitle = prompt("Enter a title for your page:");
            if (!pageTitle) return;
            const pageSlug = prompt("Enter a unique URL slug (e.g., my-cake-shop):", pageTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
            if (!pageSlug) return;
            
            createNewPage(pageTitle, pageSlug);
        };

        const createNewPage = async (title, slug) => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            const { error } = await supabaseClient.from('pages').insert([{ title, slug, user_id: user.id }]);
            if (error) { alert(`Error: ${error.message}`); }
            else { alert('Page created!'); loadUserPages(); }
        };


        // --- Main Initialization & Event Listeners ---

        const initializeDashboard = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) {
                window.location.href = 'login.html';
                return;
            }
            
            const { data: profile } = await supabaseClient.from('profiles').select('full_name').eq('id', user.id).single();
            if (profile) {
                welcomeMessageEl.textContent = `Welcome back, ${profile.full_name || user.email}!`;
            }

            initializeSalesChart();
            // Initially load data for the active panel
            loadUserPages(); 
        };

        // Tab navigation logic - ENHANCED to load data on click
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                contentPanels.forEach(p => p.classList.remove('active'));

                link.classList.add('active');
                const targetPanelId = link.getAttribute('data-target');
                document.getElementById(targetPanelId).classList.add('active');

                // Load data for the selected panel
                if(targetPanelId === 'panel-pages') {
                    loadUserPages();
                } else if(targetPanelId === 'panel-orders') {
                    loadOrders();
                } else if (targetPanelId === 'panel-dashboard') {
                    initializeSalesChart(); // Re-initialize chart in case it was hidden
                }
            });
        });

        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabaseClient.auth.signOut();
            window.location.href = 'index.html';
        });

        // Run everything!
        initializeDashboard();
    }
});
