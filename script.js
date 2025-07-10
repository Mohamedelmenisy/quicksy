document.addEventListener('DOMContentLoaded', () => {
    const demoForm = document.getElementById('demo-form');
    const successMessage = document.getElementById('success-message');

    if (demoForm) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault(); // يمنع إرسال الفورم

            // إخفاء الفورم وإظهار رسالة النجاح
            demoForm.classList.add('hidden');
            successMessage.classList.remove('hidden');

            // إعادة الفورم بعد 5 ثواني
            setTimeout(() => {
                demoForm.classList.remove('hidden');
                successMessage.classList.add('hidden');
                demoForm.reset(); // تفريغ حقول الفورم
            }, 5000);
        });
    }
});