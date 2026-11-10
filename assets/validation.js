document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedbackForm");
    const modal = document.getElementById("successModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalContent = document.getElementById("modalContent");

    // Функції перевірки
    const validateName = (name) => name.trim().length >= 2;
    // Регулярний вираз емейлу: перевіряє наявність тексту, @, тексту, крапки та домену
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // Регулярний вираз телефону: починається з ^, строго +380, і рівно 9 цифр \d{9} до кінця $
    const validatePhone = (phone) => /^\+380\d{9}$/.test(phone);
    const validateMessage = (message) => message.trim().length >= 10;

    // Керування UI-помилками
    const toggleError = (inputId, errorId, isValid) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (isValid) {
            input.classList.remove("border-red-500");
            input.classList.add("border-green-500");
            error.classList.add("hidden");
            input.setAttribute("aria-invalid", "false");
        } else {
            input.classList.remove("border-green-500");
            input.classList.add("border-red-500");
            error.classList.remove("hidden");
            input.setAttribute("aria-invalid", "true");
        }
    };

    // Динамічна перевірка під час набору (Blur / Input)
    const inputs = ['username', 'email', 'phone', 'message'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('blur', (e) => validateField(e.target));
        document.getElementById(id).addEventListener('input', (e) => {
            // Очищуємо помилку при новому введенні
            if(e.target.classList.contains("border-red-500")) validateField(e.target);
        });
    });

    function validateField(input) {
        if (input.id === 'username') toggleError('username', 'usernameError', validateName(input.value));
        if (input.id === 'email') toggleError('email', 'emailError', validateEmail(input.value));
        if (input.id === 'phone') toggleError('phone', 'phoneError', validatePhone(input.value));
        if (input.id === 'message') toggleError('message', 'messageError', validateMessage(input.value));
    }

    // Відправка форми
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Зупиняє перезавантаження сторінки

        const isNameValid = validateName(form.username.value);
        const isEmailValid = validateEmail(form.email.value);
        const isPhoneValid = validatePhone(form.phone.value);
        const isMsgValid = validateMessage(form.message.value);
        const isAgrValid = form.agreement.checked;

        toggleError('username', 'usernameError', isNameValid);
        toggleError('email', 'emailError', isEmailValid);
        toggleError('phone', 'phoneError', isPhoneValid);
        toggleError('message', 'messageError', isMsgValid);
        
        const agrError = document.getElementById('agreementError');
        if(isAgrValid) agrError.classList.add("hidden");
        else agrError.classList.remove("hidden");

        if (isNameValid && isEmailValid && isPhoneValid && isMsgValid && isAgrValid) {
            modal.classList.remove("hidden");
            form.reset();
            // Скидаємо зелені рамки
            inputs.forEach(id => document.getElementById(id).classList.remove("border-green-500"));
        }
    });

    // Закриття модального вікна
    const closeModal = () => modal.classList.add("hidden");
    closeModalBtn.addEventListener("click", closeModal);
    
    // Закриття при кліку на темний фон, АЛЕ не на саму білу картку!
    modal.addEventListener("click", (e) => {
        if (!modalContent.contains(e.target)) closeModal();
    });

    // Закриття на кнопку Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains("hidden")) closeModal();
    });
});