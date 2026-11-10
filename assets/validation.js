document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedbackForm");
    const modal = document.getElementById("successModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalContent = document.getElementById("modalContent");

    // Функції перевірки
    const validateName = (name) => name.trim().length >= 2;
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^\+380\d{9}$/.test(phone);
    const validateMessage = (message) => message.trim().length >= 10;

    // Керування UI-помилками (ТУТ ВИПРАВЛЕНО РАМКИ)
    const toggleError = (inputId, errorId, isValid) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        
        // Спочатку обов'язково забираємо ВСІ можливі рамки
        input.classList.remove("border-[#111111]", "border-red-500", "border-green-500");

        if (isValid) {
            input.classList.add("border-green-500"); // Ставимо зелену
            error.classList.add("hidden");
            input.setAttribute("aria-invalid", "false");
        } else {
            input.classList.add("border-red-500"); // Ставимо червону
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
        e.preventDefault();

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

        // Якщо все ідеально - показуємо модалку і очищаємо форму
        if (isNameValid && isEmailValid && isPhoneValid && isMsgValid && isAgrValid) {
            modal.classList.remove("hidden");
            form.reset();
            
            // Повертаємо чорні рамки після очищення
            inputs.forEach(id => {
                document.getElementById(id).classList.remove("border-green-500", "border-red-500");
                document.getElementById(id).classList.add("border-[#111111]");
            });
        }
    });

    // Закриття модального вікна
    const closeModal = () => modal.classList.add("hidden");
    closeModalBtn.addEventListener("click", closeModal);
    
    modal.addEventListener("click", (e) => {
        if (!modalContent.contains(e.target)) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains("hidden")) closeModal();
    });
});