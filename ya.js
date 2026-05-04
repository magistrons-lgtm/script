// ============================================================
// СКРИПТ ДЛЯ КОНСОЛИ — СРАБАТЫВАЕТ ТОЛЬКО НА 3-М ШАГЕ
// При выборе "Онлайн оплата" и нажатии "Перейти к оплате"
// ============================================================

(function() {
    // Настройки
    const YOUR_WALLET = "410011808980751";  // Ваш кошелек ЮMoney
    const MIN_AMOUNT = 6000;                 // Минимальная сумма для оплаты
    
    // Функция получения суммы корзины
    function getCartTotal() {
        const totalElement = document.querySelector('.cart__total');
        if (!totalElement) {
            console.error('❌ Элемент .cart__total не найден');
            return 0;
        }
        let text = totalElement.textContent || totalElement.innerText;
        let amount = parseFloat(text.replace(/[^\d,.-]/g, '').replace(',', '.'));
        console.log(`💰 Сумма корзины: ${amount} ₽`);
        return isNaN(amount) ? 0 : amount;
    }
    
    // Функция отправки на ЮMoney
    function sendToYooMoney(amount) {
        console.log(`💸 Отправляем платёж на ${amount} ₽...`);
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://yoomoney.ru/quickpay/confirm';
        form.target = '_blank';
        
        const fields = {
            'quickpay-form': 'button',
            'receiver': YOUR_WALLET,
            'sum': amount,
            'label': 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
            'paymentType': 'PC',
            'successURL': window.location.href
        };
        
        for (const [name, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        }
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        console.log('✅ Форма оплаты отправлена');
    }
    
    // Функция поиска кнопки на 3-м шаге
    function findFinalSubmitButton() {
        // Ищем активную форму (таб Доставка или Самовывоз)
        const activeForm = document.querySelector('.checkout__form.tab.active');
        if (!activeForm) return null;
        
        // На 3-м шаге кнопка имеет текст "Перейти к оплате" или "Заказать"
        // Ищем внутри активного шага
        const activeStep = activeForm.querySelector('.checkout__step.active');
        if (!activeStep) return null;
        
        // Варианты кнопок на последнем шаге
        const buttons = activeStep.querySelectorAll('button');
        for (let btn of buttons) {
            const text = btn.textContent.trim();
            if (text === 'Перейти к оплате' || text === 'Оплатить' || text === 'Заказать') {
                return btn;
            }
        }
        
        // Также проверяем футер формы
        const footerBtn = activeForm.querySelector('.checkout__footer .form__submit');
        if (footerBtn && footerBtn.textContent.trim() === 'Перейти к оплате') {
            return footerBtn;
        }
        
        return null;
    }
    
    // Отслеживаем переключение шагов
    function setupObserver() {
        // Находим все кнопки "Далее" на 1-м и 2-м шаге
        const nextButtons = document.querySelectorAll('.fake-step-next');
        
        nextButtons.forEach(btn => {
            btn.removeEventListener('click', stepHandler);
            btn.addEventListener('click', stepHandler);
        });
        
        // Также следим за появлением кнопки на 3-м шаге (если она динамическая)
        const observer = new MutationObserver(function(mutations) {
            const finalBtn = findFinalSubmitButton();
            if (finalBtn && !finalBtn.hasAttribute('data-yoomoney-bound')) {
                finalBtn.setAttribute('data-yoomoney-bound', 'true');
                finalBtn.removeEventListener('click', finalHandler);
                finalBtn.addEventListener('click', finalHandler);
                console.log('✅ Найдена финальная кнопка оплаты');
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Первичный поиск
        const existingBtn = findFinalSubmitButton();
        if (existingBtn && !existingBtn.hasAttribute('data-yoomoney-bound')) {
            existingBtn.setAttribute('data-yoomoney-bound', 'true');
            existingBtn.addEventListener('click', finalHandler);
        }
    }
    
    // Обработчик нажатия на "Далее" (проверяем, возможно это 3-й шаг)
    function stepHandler(event) {
        // Небольшая задержка, чтобы DOM обновился
        setTimeout(() => {
            const finalBtn = findFinalSubmitButton();
            if (finalBtn && !finalBtn.hasAttribute('data-yoomoney-bound')) {
                finalBtn.setAttribute('data-yoomoney-bound', 'true');
                finalBtn.removeEventListener('click', finalHandler);
                finalBtn.addEventListener('click', finalHandler);
                console.log('✅ Кнопка оплаты активирована после перехода на 3-й шаг');
            }
        }, 100);
    }
    
    // Обработчик нажатия на финальную кнопку оплаты
    function finalHandler(event) {
        const total = getCartTotal();
        
        // Проверяем выбран ли способ оплаты "Онлайн оплата"
        const selectedPay = document.querySelector('input[name="checkoutpay"]:checked');
        const isOnlinePay = selectedPay && selectedPay.value === 'Онлайн-оплата';
        
        if (total > MIN_AMOUNT && isOnlinePay) {
            event.preventDefault();
            event.stopPropagation();
            console.log(`✅ Сумма ${total} > ${MIN_AMOUNT}, онлайн-оплата выбрана → ЮMoney`);
            sendToYooMoney(total);
        } else if (total > MIN_AMOUNT && !isOnlinePay) {
            console.log(`⚠️ Сумма ${total} > ${MIN_AMOUNT}, но выбран другой способ оплаты. ЮMoney не используется.`);
        } else {
            console.log(`ℹ️ Сумма ${total} ≤ ${MIN_AMOUNT} — оплата через ЮMoney не требуется`);
        }
    }
    
    // Запускаем всё
    setupObserver();
    console.log('✅ Скрипт активирован! Сработает только на 3-м шаге при выборе "Онлайн оплата"');
})();
