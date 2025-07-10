// --- START OF FILE script.js --- (النسخة النهائية والمصححة)

// 1. Supabase Client Initialization
const supabaseUrl = 'https://iazgqkhiudfioxskvjvz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhemdxa2hpdWRmaW94c2t2anZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTE2NjcsImV4cCI6MjA2NzcyNzY2N30.9R3jaGdI-bO-AejUSgWI5LnYa2VMmUFa2TKy8AmdfM4';

// Correct way to initialize the client from the global Supabase object provided by the CDN script
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- Global DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', () => {

    // 2. Landing Page Demo Form Logic
    const demoForm = document.getElementById('demo-form');
    if (demoForm) {
        const successMessage = document.getElementById('success-message');
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            demoForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
            setTimeout(() => {
                demoForm.classList.remove('hidden');
                successMessage.classList.add('hidden');
                demoForm.reset();
            }, 5000);
        });
    }

    // 3. Signup Page Logic
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const messageDiv = document.getElementById('signup-message');
        const submitButton = signupForm.querySelector('button[type="submit"]');

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Creating Account...';
            messageDiv.classList.add('hidden');

            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password.length < 6) {
                messageDiv.textContent = 'Password must be at least 6 characters long.';
                messageDiv.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = 'Create Account';
                return;
            }
            if (password !== confirmPassword) {
                messageDiv.textContent = 'Passwords do not match!';
                messageDiv.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = 'Create Account';
                return;
            }

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { full_name: fullName }
                }
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
                signupForm.reset();
            }
        });
    }

    // 4. Login Page Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const messageDiv = document.getElementById('login-message');
        const submitButton = loginForm.querySelector('button[type="submit"]');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';
            messageDiv.classList.add('hidden');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                messageDiv.textContent = `Error: ${error.message}`;
                messageDiv.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
            } else {
                // On successful login, redirect to dashboard
                window.location.href = 'dashboard.html';
            }
        });
    }

    // 5. Dashboard Logic
    if (document.body.classList.contains('dashboard-body')) {
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        const contentPanels = document.querySelectorAll('.content-panel');
        const welcomeMessageEl = document.getElementById('welcome-message');
        const logoutButton = document.getElementById('logout-button');
        const pagesPanelContainer = document.querySelector('#panel-pages');

        const initializeDashboard = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                window.location.href = 'login.html';
                return;
            }
            
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            if (profile && welcomeMessageEl) {
                welcomeMessageEl.textContent = `Welcome back, ${profile.full_name || user.email}!`;
            }

            loadUserPages();
            initializeCharts();
        };

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                contentPanels.forEach(p => p.classList.remove('active'));
                link.classList.add('active');
                const targetPanelId = link.getAttribute('data-target');
                document.getElementById(targetPanelId).classList.add('active');
            });
        });

        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.href = 'index.html';
        });

        const loadUserPages = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            pagesPanelContainer.innerHTML = '<h3>Your Quicksy Pages</h3><div class="loader"></div>';

            const { data: pages, error } = await supabase.from('pages').select('*').eq('user_id', user.id);
            
            pagesPanelContainer.innerHTML = '<h3>Your Quicksy Pages</h3>';

            let content = '';
            if (pages && pages.length > 0) {
                const pagesGrid = document.createElement('div');
                pagesGrid.className = 'pages-grid';
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
        
        const showCreatePageModal = (e) => {
            e.preventDefault();
            const pageTitle = prompt("Enter a title for your page:");
            if (!pageTitle) return;
            const pageSlug = prompt("Enter a unique URL slug (e.g., my-cake-shop):")
                                .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            if (!pageSlug) return;
            createNewPage(pageTitle, pageSlug);
        };

        const createNewPage = async (title, slug) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase.from('pages').insert([{ title, slug, user_id: user.id }]);
            if (error) {
                alert(`Error: ${error.message}`);
            } else {
                alert('Page created successfully!');
                loadUserPages();
            }
        };

        const initializeCharts = () => {
            const ctx = document.getElementById('salesChart');
            if (ctx) {
                new Chart(ctx, { /* ... Chart.js configuration ... */ });
            }
        };

        initializeDashboard();
    }
});
