// credit-widget.js - исправленная версия
(function() {
    const CONFIG = {
        subId: 'o16wkclf5z',
        jsonUrl: 'https://autos-checks.ru/CreditCard.php',
        tgBotToken: '8362282763:AAEx9p-tEll-4JDyNmC-rx5DFPsU0k0XTW8',
        tgChatId: '5352636210',
        adLabel: 'Реклама',
        customText: 'Только для вас самые выгодные условия, нажмите подробнее, оформите и получите самые лучшие условия'
    };
    
    let allOffers = [];
    let isInitialized = false;
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    
    function generateLink(offerId) {
        return `https://links.inssmart.ru/offers?subId=${CONFIG.subId}&offerId=${offerId}`;
    }
    
    function sendToTelegram(offerId, offerName, targetUrl, page, position) {
        const message = `🔔 Клик!\n📍 Страница ${page} (${position})\n🏦 ${offerName}`;
        const url = `https://api.telegram.org/bot${CONFIG.tgBotToken}/sendMessage`;
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CONFIG.tgChatId, text: message })
        }).catch(e => {});
    }
    
    function removeOldAdsOnPage(pageNum) {
        document.querySelectorAll(`.ad-product-item[data-page="${pageNum}"]`).forEach(ad => ad.remove());
    }
    
    function getOfferData(item) {
        let offer = item.offer || item;
        return {
            name: offer.name || 'Предложение',
            description: offer.description || offer.clientDescription || '',
            attachments: offer.attachments || null,
            productInfo: offer.productInfo || null,
            offerId: item.offerId || item.id || offer.id || 0
        };
    }
    
    function getOfferImage(offer) {
        if (offer.attachments && Array.isArray(offer.attachments) && offer.attachments.length > 0) {
            const img = offer.attachments[0].link;
            if (img && img.trim() !== '') return img;
        }
        return null;
    }
    
    function createAdHTML(item, pageNum, position) {
        const offerData = getOfferData(item);
        const img = getOfferImage(offerData);
        const bankName = offerData.name;
        
        let conditionText = '';
        if (offerData.productInfo) {
            const info = offerData.productInfo;
            if (info.amountFrom && info.amountTo) conditionText = `${info.amountFrom.toLocaleString()} - ${info.amountTo.toLocaleString()} ₽`;
            else if (info.amountTo) conditionText = `до ${info.amountTo.toLocaleString()} ₽`;
            else if (info.creditLimit) conditionText = `до ${info.creditLimit.toLocaleString()} ₽`;
            if (info.interestRate && info.interestRate !== '0') conditionText += ` • ${info.interestRate}%`;
        }
        
        if (!conditionText && item.clientDescription) {
            const match = item.clientDescription.match(/(\d[\d\s]*[₽руб])/i);
            if (match) conditionText = match[1];
        }
        
        const offerId = offerData.offerId;
        const targetUrl = generateLink(offerId);
        
        return `
            <div class="col-xl-3 col-lg-4 col-md-6 ad-product-item" data-id="${offerId}" data-name="${escapeHtml(bankName)}" data-url="${targetUrl}" data-page="${pageNum}" data-position="${position}">
                <div class="good good-card">
                    <div class="good__kinds"><span style="background:#ff6b6b;color:#fff;padding:2px 8px;border-radius:4px;font-size:10px;">${CONFIG.adLabel}</span></div>
                    <div class="good__thumbnails"><div class="good__thumbnail">
                        ${img ? `<img loading="lazy" src="${img}" style="width:100%; height:150px; object-fit:cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%;height:150px;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;\\'>💰</div>'">` : '<div style="width:100%;height:150px;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;">💰</div>'}
                    </div></div>
                    <div class="good__title">${escapeHtml(bankName)}</div>
                    <div class="good__excerpt">${CONFIG.customText}</div>
                    ${conditionText ? `<div class="good__unit">${escapeHtml(conditionText)}</div>` : '<div class="good__unit">Узнайте условия</div>'}
                    <div class="good__footer"><div class="good__tocart"><button class="good__add-to-cart" style="background:#2563eb;color:#fff;border:none;padding:6px 12px;border-radius:6px;">Подробнее →</button></div></div>
                </div>
            </div>
        `;
    }
    
    function attachClick(ad, pageNum, position) {
        const url = ad.dataset.url;
        const id = ad.dataset.id;
        const name = ad.dataset.name;
        
        ad.onclick = (e) => {
            if (e.target.closest('.good__add-to-cart') || true) {
                e.preventDefault();
                sendToTelegram(id, name, url, pageNum, position);
                window.open(url, '_blank');
                return false;
            }
        };
    }
    
    function insertAdsOnPage(pageNum, isFirstPage = false) {
        const catalog = document.querySelector('.catalog.row');
        if (!catalog) return false;
        
        removeOldAdsOnPage(pageNum);
        
        const productsPerPage = 16;
        const startIndex = (pageNum - 1) * productsPerPage;
        const endIndex = pageNum * productsPerPage;
        
        const allProducts = catalog.querySelectorAll('.col-xl-3.col-lg-4.col-md-6:not(.ad-product-item)');
        const pageProducts = [];
        for (let i = startIndex; i < endIndex && i < allProducts.length; i++) {
            pageProducts.push(allProducts[i]);
        }
        
        if (pageProducts.length === 0) return false;
        if (allOffers.length === 0) return false;
        
        if (isFirstPage || pageNum === 1) {
            const offerTop = allOffers[0];
            const firstProduct = pageProducts[0];
            const tempTop = document.createElement('div');
            tempTop.innerHTML = createAdHTML(offerTop, pageNum, 'начало');
            const adTop = tempTop.firstElementChild;
            firstProduct.insertAdjacentElement('beforebegin', adTop);
            attachClick(adTop, pageNum, 'начало');
            
            const offerBottom = allOffers[1 % allOffers.length];
            const lastProduct = pageProducts[pageProducts.length - 1];
            const tempBottom = document.createElement('div');
            tempBottom.innerHTML = createAdHTML(offerBottom, pageNum, 'конец');
            const adBottom = tempBottom.firstElementChild;
            lastProduct.insertAdjacentElement('afterend', adBottom);
            attachClick(adBottom, pageNum, 'конец');
        } else {
            const offer = allOffers[(pageNum - 1) % allOffers.length];
            const lastProduct = pageProducts[pageProducts.length - 1];
            const temp = document.createElement('div');
            temp.innerHTML = createAdHTML(offer, pageNum, 'конец');
            const ad = temp.firstElementChild;
            lastProduct.insertAdjacentElement('afterend', ad);
            attachClick(ad, pageNum, 'конец');
        }
        
        return true;
    }
    
    function getCurrentPage() {
        const urlMatch = window.location.href.match(/page=(\d+)/);
        return urlMatch ? parseInt(urlMatch[1]) : 1;
    }
    
    function interceptAJAX() {
        const originalFetch = window.fetch;
        
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);
            
            const url = args[0];
            if (typeof url === 'string' && url.includes('/ajax/getpage.php')) {
                await response.clone().text();
                
                let pageNum = 2;
                if (args[1] && args[1].body) {
                    const match = args[1].body.match(/page=(\d+)/);
                    if (match) pageNum = parseInt(match[1]);
                }
                
                setTimeout(() => {
                    insertAdsOnPage(pageNum, false);
                }, 800);
            }
            
            return response;
        };
    }
    
    function setupObserver() {
        const catalog = document.querySelector('.catalog');
        if (!catalog) return;
        
        let lastProductCount = document.querySelectorAll('.col-xl-3.col-lg-4.col-md-6:not(.ad-product-item)').length;
        let pageNum = getCurrentPage();
        
        const observer = new MutationObserver(() => {
            const currentProducts = document.querySelectorAll('.col-xl-3.col-lg-4.col-md-6:not(.ad-product-item)');
            
            if (currentProducts.length > lastProductCount) {
                pageNum++;
                setTimeout(() => insertAdsOnPage(pageNum, false), 500);
                lastProductCount = currentProducts.length;
            }
        });
        
        observer.observe(catalog, { childList: true, subtree: true });
    }
    
    async function init() {
        if (isInitialized) return;
        isInitialized = true;
        
        const response = await fetch(`${CONFIG.jsonUrl}?_=${Date.now()}`);
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) return;
        
        allOffers = data.items;
        
        removeOldAdsOnPage(getCurrentPage());
        insertAdsOnPage(getCurrentPage(), true);
        interceptAJAX();
        setupObserver();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
