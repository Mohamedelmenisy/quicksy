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
                }, 2000);
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
                }, 2000);
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
                    panel.style.display = panel.id === targetId ? 'block' : 'none';
                    if (panel.id === targetId) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });
    }
    
    // --- Dashboard Chart ---
    const salesChartCanvas = document.getElementById('salesChart');
    if (salesChartCanvas) {
        new Chart(salesChartCanvas, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                datasets: [{
                    label: 'Sales',
                    data: [120, 190, 300, 500, 230, 310, 450],
                    borderColor: '#9333EA',
                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // --- Landing Page Demo Form Logic ---
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
