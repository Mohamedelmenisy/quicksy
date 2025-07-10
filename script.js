document.addEventListener('DOMContentLoaded', () => {

    const SUPABASE_URL = 'https://iazgqkhiudfioxskvjvz.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhemdxa2hpdWRmaW94c2t2anZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTE2NjcsImV4cCI6MjA2NzcyNzY2N30.9R3jaGdI-bO-AejUSgWI5LnYa2VMmUFa2TKy8AmdfM4';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // --- UTILITY FUNCTIONS ---
    const showMessage = (elementId, message, isSuccess = false) => {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
            el.classList.remove('hidden');
            el.classList.toggle('success', isSuccess);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
    };

    const checkUserSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            const isPublicPage = ['/', '/index.html', '/login.html', '/signup.html'].some(p => window.location.pathname.endsWith(p));
            if (!isPublicPage) {
                window.location.href = 'login.html';
            }
            return null;
        }
        return session.user;
    };
    
    // --- AUTH MODULE ---
    const initAuthPages = () => {
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button');
                btn.disabled = true;
                btn.textContent = 'Creating...';
                
                const fullName = document.getElementById('full-name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;

                if (password !== confirmPassword) {
                    showMessage('signup-message', 'Passwords do not match!');
                    btn.disabled = false;
                    btn.textContent = 'Create My Account';
                    return;
                }

                const { data, error } = await supabase.auth.signUp({
                    email, password, options: { data: { full_name: fullName, new_user: true } }
                });
                
                if (error) {
                    showMessage('signup-message', error.message);
                } else if (data.user && data.user.identities && data.user.identities.length === 0){
                    showMessage('signup-message', 'A user with this email already exists.');
                } else {
                    showMessage('signup-message', 'Success! Check your email for verification.', true);
                }
                btn.disabled = false;
                btn.textContent = 'Create My Account';
            });
        }

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button');
                btn.disabled = true;
                btn.textContent = 'Logging in...';

                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                const { error } = await supabase.auth.signInWithPassword({ email, password });
                
                if (error) {
                    showMessage('login-message', error.message);
                    btn.disabled = false;
                    btn.textContent = 'Login';
                } else {
                    window.location.href = 'app.html';
                }
            });
        }
    };

    // --- APP (USER WORKSPACE) MODULE ---
    const initAppWorkspace = async () => {
        const user = await checkUserSession();
        if (!user) return;

        const UI = {
            welcomeMessage: document.getElementById('welcome-message'),
            userEmailDisplay: document.getElementById('user-email-display'),
            logoutButton: document.getElementById('logout-button'),
            myPagesList: document.getElementById('my-pages-list'),
            recentOrdersList: document.getElementById('recent-orders-list'),
            onboardingModal: document.getElementById('onboarding-modal'),
            onboardingStep1: document.getElementById('onboarding-step-1'),
            onboardingStep2: document.getElementById('onboarding-step-2'),
            onboardingNextBtn: document.getElementById('onboarding-next-btn'),
            onboardingFinishBtn: document.getElementById('onboarding-finish-btn'),
        };

        const state = {};

        const handleOnboarding = async () => {
            if (user.user_metadata.new_user) {
                UI.onboardingModal.classList.remove('hidden');
                
                UI.onboardingNextBtn.addEventListener('click', () => {
                    state.pageTitle = document.getElementById('onboarding-page-title').value;
                    if (state.pageTitle.trim() === '') {
                        alert('Please enter a page title.');
                        return;
                    }
                    UI.onboardingStep1.classList.add('hidden');
                    UI.onboardingStep2.classList.remove('hidden');
                });

                UI.onboardingFinishBtn.addEventListener('click', async () => {
                    UI.onboardingFinishBtn.disabled = true;
                    UI.onboardingFinishBtn.textContent = 'Creating...';

                    state.serviceName = document.getElementById('onboarding-service-name').value;
                    state.servicePrice = document.getElementById('onboarding-service-price').value;

                    if (state.serviceName.trim() === '') {
                        alert('Please enter a service name.');
                        UI.onboardingFinishBtn.disabled = false;
                        UI.onboardingFinishBtn.textContent = 'Create My Page!';
                        return;
                    }

                    const { error: pageError } = await supabase
                        .from('pages')
                        .insert({ title: state.pageTitle, user_id: user.id });

                    if (pageError) {
                        alert('Error creating page: ' + pageError.message);
                    } else {
                        await supabase.auth.updateUser({ data: { new_user: false } });
                        UI.onboardingModal.classList.add('hidden');
                        loadMyPages();
                    }
                    UI.onboardingFinishBtn.disabled = false;
                    UI.onboardingFinishBtn.textContent = 'Create My Page!';
                });
            }
        };

        const loadMyPages = async () => {
            UI.myPagesList.innerHTML = '<div class="loader">Loading...</div>';
            const { data, error } = await supabase.from('pages').select('id, title').eq('user_id', user.id);

            if (error || !data || data.length === 0) {
                UI.myPagesList.innerHTML = '<div class="list-item"><span class="list-item-sub">No pages yet. Create one!</span></div>';
            } else {
                UI.myPagesList.innerHTML = data.map(page => `
                    <div class="list-item">
                        <span class="list-item-main">${page.title}</span>
                        <a href="editor.html?id=${page.id}" class="btn btn-secondary btn-sm">Edit</a>
                    </div>
                `).join('');
            }
        };
        
        UI.welcomeMessage.textContent = `Welcome, ${user.user_metadata.full_name || user.email}!`;
        UI.userEmailDisplay.textContent = user.email;
        UI.logoutButton.addEventListener('click', handleLogout);

        loadMyPages();
        UI.recentOrdersList.innerHTML = '<div class="list-item"><span class="list-item-sub">No recent orders.</span></div>'; // Placeholder
        handleOnboarding();
    };

    // --- EDITOR MODULE ---
    const initPageEditor = async () => {
        const user = await checkUserSession();
        if (!user) return;
        console.log("Editor Initialized");
    };

    // --- SIMPLE ROUTER ---
    const path = window.location.pathname;
    const isAuthPage = ['/login.html', '/signup.html'].some(p => path.endsWith(p));
    const isAppPage = path.endsWith('/app.html');
    const isEditorPage = path.endsWith('/editor.html');

    if (isAuthPage) {
        initAuthPages();
    } else if (isAppPage) {
        initAppWorkspace();
    } else if (isEditorPage) {
        initPageEditor();
    } else { // Landing page
        initAuthPages(); // It has no forms, but might have other logic later
    }
});
