// --- START OF FILE script.js --- (النسخة النهائية والمضمونة)

document.addEventListener('DOMContentLoaded', () => {

    // 1. Supabase Client Initialization (The **CORRECT** way)
    const supabaseUrl = 'https://iazgqkhiudfioxskvjvz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhemdxa2hpdWRmaW94c2t2anZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTE2NjcsImV4cCI6MjA2NzcyNzY2N30.9R3jaGdI-bO-AejUSgWI5LnYa2VMmUFa2TKy8AmdfM4';
    
    // The global 'supabase' object comes from the CDN script.
    // We create our own client instance from it and store it in a *new* variable.
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


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

            // USE THE CORRECT CLIENT VARIABLE: supabaseClient
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: { data: { full_name: fullName } }
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

            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';
            messageDiv.classList.add('hidden');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // USE THE CORRECT CLIENT VARIABLE: supabaseClient
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                messageDiv.textContent = `Error: ${error.message}`;
                messageDiv.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
            } else {
                window.location.href = 'dashboard.html';
            }
        });
    }

    // 5. Dashboard Logic
    if (document.body.classList.contains('dashboard-body')) {
        const welcomeMessageEl = document.getElementById('welcome-message');
        const logoutButton = document.getElementById('logout-button');

        const initializeDashboard = async () => {
            // USE THE CORRECT CLIENT VARIABLE: supabaseClient
            const { data: { user } } = await supabaseClient.auth.getUser();

            if (!user) {
                window.location.href = 'login.html';
                return;
            }
            
            const { data: profile } = await supabaseClient
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            if (profile && welcomeMessageEl) {
                welcomeMessageEl.textContent = `Welcome back, ${profile.full_name || user.email}!`;
            }

            // ... The rest of dashboard logic like loading pages, charts etc.
        };

        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            // USE THE CORRECT CLIENT VARIABLE: supabaseClient
            await supabaseClient.auth.signOut();
            window.location.href = 'index.html';
        });

        initializeDashboard();
    }
});
