(function() {
    'use strict';

    const globalStyles = `
        .privacy-checkbox-wrapper {
            margin: 20px 0 15px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 14px;
            line-height: 1.4;
            text-align: left;
        }
        .privacy-checkbox-wrapper input[type="checkbox"] {
            width: 18px;
            height: 18px;
            min-width: 18px;
            cursor: pointer;
            margin-top: 2px;
        }
        .privacy-checkbox-wrapper label {
            cursor: pointer;
            color: #333;
            font-weight: normal;
        }
        .privacy-checkbox-wrapper a {
            color: #f15a24;
            text-decoration: underline;
            cursor: pointer;
        }
        .privacy-checkbox-wrapper a:hover {
            color: #d14a1e;
        }
        .free-access-form__submit:disabled,
        .orange-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        .policy-fancy-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 10002;
            justify-content: center;
            align-items: center;
            font-family: 'Arial', sans-serif;
        }
        .policy-fancy-modal.active {
            display: flex;
        }
        .policy-fancy-modal__content {
            background: #fff;
            width: 90%;
            max-width: 800px;
            max-height: 85vh;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            animation: policyFadeIn 0.3s ease;
        }
        @keyframes policyFadeIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .policy-fancy-modal__header {
            background: linear-gradient(135deg, #644080 0%, #4a2e5e 100%);
            padding: 18px 25px;
            position: relative;
        }
        .policy-fancy-modal__header h3 {
            margin: 0;
            color: #fff;
            font-size: 20px;
            font-weight: 600;
        }
        .policy-fancy-modal__close {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #fff;
            font-size: 28px;
            cursor: pointer;
            opacity: 0.8;
            line-height: 1;
        }
        .policy-fancy-modal__close:hover {
            opacity: 1;
        }
        .policy-fancy-modal__body {
            padding: 25px;
            overflow-y: auto;
            max-height: calc(85vh - 70px);
            font-size: 14px;
            line-height: 1.6;
            color: #333;
        }
        .policy-fancy-modal__body h4 {
            color: #644080;
            margin: 20px 0 12px 0;
            font-size: 17px;
            font-weight: 600;
        }
        .policy-fancy-modal__body p {
            margin-bottom: 12px;
        }
        .policy-fancy-modal__body ul {
            margin: 10px 0 15px 20px;
        }
        .policy-fancy-modal__body li {
            margin-bottom: 6px;
        }
        .policy-fancy-modal__body a {
            color: #f15a24;
            text-decoration: none;
        }
        .policy-fancy-modal__body a:hover {
            text-decoration: underline;
        }
        .cookie-consent-notice {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(30, 30, 40, 0.95);
            backdrop-filter: blur(10px);
            z-index: 10001;
            padding: 18px 20px;
            border-top: 2px solid #644080;
            transform: translateY(0);
            transition: transform 0.3s ease;
        }
        .cookie-consent-notice.hide {
            transform: translateY(100%);
        }
        .cookie-consent-notice__container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }
        .cookie-consent-notice__text {
            flex: 1;
            color: #fff;
            font-size: 14px;
            line-height: 1.5;
        }
        .cookie-consent-notice__text a {
            color: #f5a623;
            text-decoration: underline;
            cursor: pointer;
        }
        .cookie-consent-notice__buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .cookie-consent-notice__btn {
            padding: 10px 24px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }
        .cookie-consent-notice__btn--accept {
            background: #644080;
            color: #fff;
        }
        .cookie-consent-notice__btn--accept:hover {
            background: #7a55a0;
        }
        .cookie-consent-notice__btn--details {
            background: transparent;
            color: #fff;
            border: 1px solid #644080;
        }
        .cookie-consent-notice__btn--close {
            background: transparent;
            color: #aaa;
            font-size: 20px;
            padding: 10px 15px;
        }
        @media (max-width: 768px) {
            .cookie-consent-notice__container {
                flex-direction: column;
                text-align: center;
            }
            .policy-fancy-modal__body { padding: 18px; }
        }
    `;

    const privacyPolicyHTML = `
        <h4>1. Общие положения</h4>
        <p>Настоящая Политика конфиденциальности персональных данных (далее — Политика) действует в отношении всей информации, которую ООО «ГРП» (ИНН 7714390077, ОГРН 1167746502032, юридический адрес: г. Москва, Ленинградский проспект, 68/24), а также его аффилированные лица, могут получить о Пользователе во время использования сайта <strong>Гетриалпрайс</strong>, его сервисов, программ и продуктов.</p>
        <p>Использование сервисов Гетриалпрайс означает безоговорочное согласие Пользователя с настоящей Политикой и указанными в ней условиями обработки его персональной информации.</p>
        
        <h4>2. Какие персональные данные мы собираем</h4>
        <p><strong>2.1.</strong> Персональная информация, которую Пользователь предоставляет о себе самостоятельно при заполнении форм обратной связи:</p>
        <ul>
            <li>фамилия, имя, отчество;</li>
            <li>контактный телефон;</li>
            <li>адрес электронной почты (e-mail);</li>
            <li>наименование компании и должность.</li>
        </ul>
        <p><strong>2.2.</strong> Данные, которые передаются автоматически:</p>
        <ul>
            <li>IP-адрес;</li>
            <li>информация о браузере и операционной системе;</li>
            <li>сведения о действиях на сайте (cookie-файлы).</li>
        </ul>
        
        <h4>3. Цели обработки персональных данных</h4>
        <ul>
            <li>идентификация Пользователя для предоставления сервисов и услуг;</li>
            <li>связь с Пользователем, включая направление уведомлений и обработку запросов;</li>
            <li>улучшение качества сервисов и разработка новых продуктов;</li>
            <li>проведение статистических исследований на основе обезличенных данных.</li>
        </ul>
        
        <h4>4. Правовые основания обработки персональных данных</h4>
        <p>Обработка персональных данных осуществляется в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных», а также на основании согласия Пользователя, выраженного путем проставления отметки в чекбоксе при заполнении формы обратной связи.</p>
        
        <h4>5. Контактная информация</h4>
        <p>Телефон: <a href="tel:+74952258655">+7 (495) 225-86-55</a><br>
        Email: <a href="mailto:mail@getrealprice.com">mail@getrealprice.com</a><br>
        Юридический адрес: 125167, г. Москва, Ленинградский проспект, д. 68/24</p>
        
        <p style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #888;">Дата последнего обновления: 04 мая 2026 г.</p>
    `;

    const cookiePolicyHTML = `
        <h4>1. Что такое cookie-файлы?</h4>
        <p>Cookie-файлы — это небольшие текстовые файлы, которые веб-сайт сохраняет на вашем устройстве при первом посещении. Они содержат информацию о ваших действиях на сайте и помогают нам улучшать работу сервиса.</p>
        
        <h4>2. Какие cookie мы используем?</h4>
        <p><strong>Технически необходимые cookie</strong> — обеспечивают корректную работу сайта (навигация, отправка форм). Без них сайт не сможет работать полноценно.</p>
        <p><strong>Аналитические cookie</strong> — собирают информацию о том, как посетители используют сайт: какие страницы просматривают, сколько времени проводят. Эти данные помогают нам улучшать сайт.</p>
        
        <h4>3. Яндекс Метрика — аналитический инструмент</h4>
        <p>На нашем сайте используется сервис <strong>Яндекс Метрика</strong> (счетчик №49810300). Этот сервис помогает нам анализировать посещаемость сайта, поведение пользователей и эффективность рекламных кампаний.</p>
        <p>Яндекс Метрика собирает обезличенные данные:</p>
        <ul>
            <li>IP-адрес (в обезличенном виде);</li>
            <li>тип устройства, браузер, операционная система;</li>
            <li>просмотренные страницы и время на сайте;</li>
            <li>источник перехода на сайт;</li>
            <li>геолокация (город/страна).</li>
        </ul>
        <p>Все данные собираются в обезличенном виде и не позволяют идентифицировать конкретного пользователя.</p>
        
        <h4>4. Как управлять cookie и отключить Яндекс Метрику?</h4>
        <p><strong>Управление cookie через браузер:</strong> вы можете настроить браузер на блокировку cookie или удаление их после закрытия браузера.</p>
        <p><strong>Отключение Яндекс Метрики:</strong> вы можете установить расширение для браузера <a href="https://yandex.ru/support/metrica/general/opt-out.html" target="_blank">«Блокировка Яндекс Метрики»</a>.</p>
        
        <h4>5. Контактная информация</h4>
        <p>Email: <a href="mailto:mail@getrealprice.com">mail@getrealprice.com</a><br>
        Телефон: <a href="tel:+74952258655">+7 (495) 225-86-55</a></p>
        
        <p style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #888;">Дата последнего обновления: 04 мая 2026 г.</p>
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = globalStyles;
    document.head.appendChild(styleSheet);

    function closeAllPopups() {
        const closeButtons = document.querySelectorAll('[data-fancybox-close], .fancybox-button.fancybox-close-small');
        closeButtons.forEach(btn => {
            if (btn && btn.click) btn.click();
        });
        
        const fancyboxContainer = document.querySelector('.fancybox-container');
        if (fancyboxContainer && fancyboxContainer.style && fancyboxContainer.style.display !== 'none') {
            if (window.jQuery && window.jQuery.fancybox) {
                window.jQuery.fancybox.close();
            }
            if (window.Fancybox) {
                window.Fancybox.close();
            }
        }
        
        const detailsPopup = document.getElementById('details-popup');
        if (detailsPopup && detailsPopup.style.display !== 'none') {
            detailsPopup.style.display = 'none';
        }
        
        document.body.style.overflow = '';
    }

    function addCheckboxToForm(form, submitBtnSelector) {
        if (form.querySelector('.privacy-checkbox-wrapper')) return;
        
        const submitBtn = submitBtnSelector ? form.querySelector(submitBtnSelector) : form.querySelector('input[type="submit"], button[type="submit"], .free-access-form__submit');
        if (!submitBtn) return;
        
        const randomId = 'privacy_' + Math.random().toString(36).substr(2, 8);
        const wrapper = document.createElement('div');
        wrapper.className = 'privacy-checkbox-wrapper';
        wrapper.innerHTML = `
            <input type="checkbox" id="${randomId}" class="privacy-checkbox">
            <label for="${randomId}">
                Я ознакомлен(а) и согласен(на) с 
                <a href="#" class="privacy-policy-modal-link">Политикой конфиденциальности</a> 
                и даю согласие на обработку персональных данных
            </label>
        `;
        
        const checkbox = wrapper.querySelector('.privacy-checkbox');
        const link = wrapper.querySelector('.privacy-policy-modal-link');
        
        form.insertBefore(wrapper, submitBtn);
        submitBtn.disabled = true;
        
        checkbox.addEventListener('change', function() {
            submitBtn.disabled = !this.checked;
        });
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllPopups();
            setTimeout(() => {
                const modal = document.getElementById('privacyPolicyModal');
                if (modal) modal.style.display = 'flex';
            }, 50);
        });
    }

    function addCheckboxesToAllForms() {
        const mainForm = document.querySelector('.free-access-form');
        if (mainForm) addCheckboxToForm(mainForm, '.free-access-form__submit');
        
        const observer = new MutationObserver(() => {
            const popup = document.getElementById('details-popup');
            if (popup && popup.style.display !== 'none') {
                const form = popup.querySelector('.free-access-form');
                if (form && !form.querySelector('.privacy-checkbox-wrapper')) {
                    addCheckboxToForm(form, '.free-access-form__submit');
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    function createPrivacyPolicyModal() {
        if (document.getElementById('privacyPolicyModal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'privacyPolicyModal';
        modal.className = 'policy-fancy-modal';
        modal.innerHTML = `
            <div class="policy-fancy-modal__content">
                <div class="policy-fancy-modal__header">
                    <h3>Политика конфиденциальности</h3>
                    <button class="policy-fancy-modal__close close-privacy-modal">&times;</button>
                </div>
                <div class="policy-fancy-modal__body">
                    ${privacyPolicyHTML}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.close-privacy-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    function createCookiePolicyModal() {
        if (document.getElementById('cookiePolicyModal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'cookiePolicyModal';
        modal.className = 'policy-fancy-modal';
        modal.innerHTML = `
            <div class="policy-fancy-modal__content">
                <div class="policy-fancy-modal__header">
                    <h3>Использование cookie и Яндекс Метрики</h3>
                    <button class="policy-fancy-modal__close close-cookie-modal">&times;</button>
                </div>
                <div class="policy-fancy-modal__body">
                    ${cookiePolicyHTML}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.close-cookie-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    function createCookieNotice() {
        if (document.cookie.split('; ').some(row => row.startsWith('cookie_consent_gRP=true'))) return;
        
        const notice = document.createElement('div');
        notice.id = 'cookieConsentNotice';
        notice.className = 'cookie-consent-notice';
        notice.innerHTML = `
            <div class="cookie-consent-notice__container">
                <div class="cookie-consent-notice__text">
                    🔒 Мы используем <strong>cookie-файлы</strong> и сервис <strong>Яндекс Метрика</strong> для улучшения работы сайта, 
                    анализа посещаемости и предоставления релевантного контента. 
                    <a href="#" id="cookieDetailsLink">Подробнее о cookie и Метрике</a>
                </div>
                <div class="cookie-consent-notice__buttons">
                    <button class="cookie-consent-notice__btn cookie-consent-notice__btn--details" id="cookieDetailsBtn">Подробнее</button>
                    <button class="cookie-consent-notice__btn cookie-consent-notice__btn--accept" id="cookieAcceptBtn">Принять и продолжить</button>
                    <button class="cookie-consent-notice__btn cookie-consent-notice__btn--close" id="cookieCloseBtn">✕</button>
                </div>
            </div>
        `;
        document.body.appendChild(notice);
        
        const cookieModal = document.getElementById('cookiePolicyModal');
        const openCookieModal = () => {
            closeAllPopups();
            setTimeout(() => {
                if (cookieModal) cookieModal.style.display = 'flex';
            }, 50);
        };
        
        document.getElementById('cookieAcceptBtn').addEventListener('click', () => {
            document.cookie = "cookie_consent_gRP=true; path=/; max-age=" + (60 * 60 * 24 * 365);
            notice.classList.add('hide');
            setTimeout(() => notice.remove(), 300);
        });
        document.getElementById('cookieCloseBtn').addEventListener('click', () => {
            notice.classList.add('hide');
            setTimeout(() => notice.remove(), 300);
        });
        document.getElementById('cookieDetailsBtn').addEventListener('click', openCookieModal);
        const detailsLink = document.getElementById('cookieDetailsLink');
        if (detailsLink) detailsLink.addEventListener('click', (e) => { e.preventDefault(); openCookieModal(); });
    }

    function addFooterLink() {
        if (!document.getElementById('footerPolicyLink')) {
            const footerRow = document.querySelector('.footer__row');
            if (footerRow) {
                const footerCol = document.createElement('div');
                footerCol.style.cssText = 'margin-top: 20px; text-align: center; width: 100%;';
                footerCol.innerHTML = '<a href="#" id="footerPolicyLink" style="color: #644080; text-decoration: underline; font-size: 14px; margin-right: 20px;">Политика конфиденциальности</a>' +
                                      '<a href="#" id="footerCookieLink" style="color: #644080; text-decoration: underline; font-size: 14px;">Использование cookie и Метрики</a>';
                footerRow.appendChild(footerCol);
                
                document.getElementById('footerPolicyLink').addEventListener('click', (e) => {
                    e.preventDefault();
                    closeAllPopups();
                    setTimeout(() => {
                        const modal = document.getElementById('privacyPolicyModal');
                        if (modal) modal.style.display = 'flex';
                    }, 50);
                });
                document.getElementById('footerCookieLink').addEventListener('click', (e) => {
                    e.preventDefault();
                    closeAllPopups();
                    setTimeout(() => {
                        const modal = document.getElementById('cookiePolicyModal');
                        if (modal) modal.style.display = 'flex';
                    }, 50);
                });
            }
        }
    }

    createPrivacyPolicyModal();
    createCookiePolicyModal();
    addCheckboxesToAllForms();
    createCookieNotice();
    addFooterLink();
})();
