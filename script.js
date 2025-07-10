document.addEventListener('DOMContentLoaded', () => {

    // --- Signup Form Logic ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageDiv = document.getElementById('signup-message');
            if (messageDiv) {
                messageDiv.textContent = '✓ Account created successfully! Redirecting...';
                messageDiv.className = 'form-message success';
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000); // Wait 2 seconds before redirecting
            }
        });
    }

    // --- Login Form Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageDiv = document.getElementById('login-message');
            if (messageDiv) {
                messageDiv.textContent = '✓ Login successful! Welcome back.';
                messageDiv.className = 'form-message success';
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000); // Wait 2 seconds before redirecting
            }
        });
    }

    // --- Dynamic Dashboard Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentPanels = document.querySelectorAll('.content-panel');

    if (navLinks.length > 0 && contentPanels.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('data-target');
                
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');

                contentPanels.forEach(panel => {
                    if (panel.id === targetId) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });
    }

    // --- Landing Page Demo Form Logic ---
    const demoForm = document.getElementById('demo-form');
    if (demoForm) {
        const successMessage = document.getElementById('success-message');
        const formContainer = demoForm.parentElement;
        
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            demoForm.classList.add('hidden');
            successMessage.classList.remove('hidden');

            setTimeout(() => {
                demoForm.classList.remove('hidden');
                successMessage.classList.add('hidden');
                demoForm.reset();
            }, 4000);
        });
    }

    // --- Landing Page FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    if(faqItems.length > 0) {
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
});
