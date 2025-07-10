document.addEventListener('DOMContentLoaded', () => {
    // Demo Form Logic
    const demoForm = document.getElementById('demo-form');
    const successMessage = document.getElementById('success-message');

    if (demoForm) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            demoForm.style.display = 'none';
            successMessage.classList.remove('hidden');

            setTimeout(() => {
                demoForm.style.display = 'block';
                successMessage.classList.add('hidden');
                demoForm.reset();
            }, 5000);
        });
    }

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
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
});
