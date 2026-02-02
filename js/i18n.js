// ========== LANGUAGE SWITCHER ==========

function setupLanguageSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    const buttons = document.querySelectorAll('.lang-btn');
    
    // Toggle open on mobile touch
    if (switcher) {
        switcher.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // Only toggle if clicking on the active button
                if (e.target.closest('.lang-btn.active')) {
                    switcher.classList.toggle('open');
                }
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!switcher.contains(e.target)) {
                switcher.classList.remove('open');
            }
        });
    }
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
            
            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Close switcher on mobile after selection
            if (switcher) {
                switcher.classList.remove('open');
            }
        });
    });
}

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang === 'pt' ? 'pt-BR' : 'en';
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const text = getTranslation(key);
        if (text) {
            el.textContent = text;
        }
    });
    
    // Reload carousels with translated placeholder
    loadCarousels();
}

function getTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return null;
        }
    }
    
    return value;
}
