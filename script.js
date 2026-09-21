document.addEventListener('DOMContentLoaded', () => {
    // Lightweight performance-friendly banner & tooltip cleanup
    const killGoogleBanner = () => {
        if (document.body.style.top !== '0px') {
            document.body.style.top = '0px';
            document.body.style.position = 'static';
            document.body.style.marginTop = '0px';
        }

        const frames = document.querySelectorAll('iframe.goog-te-banner-frame, .goog-te-banner-frame, iframe[id*=":1.container"], .VIpgJd-Z44Wfd-a91vB-wOtMdf, #goog-gt-tt');
        frames.forEach(frame => frame.remove());
    };

    // Lightweight observer only watching direct body children
    const observer = new MutationObserver(killGoogleBanner);
    observer.observe(document.body, { childList: true });

    // First-Time Visitor Language Splash Screen Handler
    const splashOverlay = document.getElementById('langSplashOverlay');
    const splashForm = document.getElementById('splashLangForm');
    const splashSelect = document.getElementById('splashLanguageSelect');
    const hasSeenSplash = localStorage.getItem('thirunivasam_splash_seen') || document.cookie.includes('thirunivasam_splash_seen=true');

    if (splashOverlay) {
        if (!hasSeenSplash) {
            splashOverlay.style.display = 'flex';
            splashOverlay.classList.remove('hidden');
        } else {
            splashOverlay.style.display = 'none';
            splashOverlay.classList.add('hidden');
            splashOverlay.remove();
        }
    }

    if (splashForm) {
        splashForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedLang = splashSelect ? splashSelect.value : 'en';
            
            localStorage.setItem('thirunivasam_lang', selectedLang);
            localStorage.setItem('thirunivasam_splash_seen', 'true');
            document.cookie = "thirunivasam_splash_seen=true; path=/; max-age=31536000;";
            
            setGoogTransCookie(selectedLang);
            setGoogleTranslateLanguage(selectedLang);
            
            if (typeof syncDropdownValue === 'function') {
                syncDropdownValue(selectedLang);
            }

            if (splashOverlay) {
                splashOverlay.classList.add('fade-out');
                setTimeout(() => splashOverlay.remove(), 300);
            }
        });
    }

    // Custom Language Selector Trigger with Cross-Page Persistence & Instant Activation
    const customLanguageSelect = document.getElementById('customLanguageSelect');
    const savedLang = localStorage.getItem('thirunivasam_lang') || getGoogTransCookie() || 'en';

    function syncDropdownValue(targetLang) {
        const selects = document.querySelectorAll('#customLanguageSelect, #splashLanguageSelect, .lang-select-input');
        selects.forEach(selectEl => {
            selectEl.value = targetLang;
            Array.from(selectEl.options).forEach(opt => {
                if (opt.value === targetLang) {
                    opt.selected = true;
                    opt.setAttribute('selected', 'selected');
                } else {
                    opt.selected = false;
                    opt.removeAttribute('selected');
                }
            });
        });
    }

    // Initial sync of dropdown value
    syncDropdownValue(savedLang);
    if (customLanguageSelect) {
        customLanguageSelect.addEventListener('change', (e) => {
            const langCode = e.target.value;
            localStorage.setItem('thirunivasam_lang', langCode);
            setGoogleTranslateLanguage(langCode);
        });
    }

    // 1. Sticky Header Scroll Effect & Active Page Highlight
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Page Link Highlight
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // 2. Countdown Timers
    initCountdowns();

    // 3. Malayalam Vision Toggle
    const toggleMalayalamBtn = document.getElementById('toggleMalayalamBtn');
    const malayalamContent = document.getElementById('malayalamContent');

    if (toggleMalayalamBtn && malayalamContent) {
        toggleMalayalamBtn.addEventListener('click', () => {
            malayalamContent.classList.toggle('hidden');
            if (malayalamContent.classList.contains('hidden')) {
                toggleMalayalamBtn.innerHTML = '<i class="fa-solid fa-language"></i> View Vision in Malayalam / മലയാളം';
            } else {
                toggleMalayalamBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Malayalam Vision';
            }
        });
    }

    // 4. Modal System Controls
    const prayerModal = document.getElementById('prayerModal');
    const whatsappModal = document.getElementById('whatsappModal');

    const openPrayerBtns = document.querySelectorAll('#openPrayerBtn, #heroPrayerBtn, #contactPrayerBtn, .drawer-prayer-btn');
    const openWhatsappBtns = document.querySelectorAll('#joinWhatsappBtn, #contactWaBtn');

    const closePrayerModal = document.getElementById('closePrayerModal');
    const closeWhatsappModal = document.getElementById('closeWhatsappModal');

    openPrayerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (prayerModal) prayerModal.classList.add('active');
        });
    });

    openWhatsappBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (whatsappModal) whatsappModal.classList.add('active');
        });
    });

    if (closePrayerModal) {
        closePrayerModal.addEventListener('click', () => {
            prayerModal.classList.remove('active');
        });
    }

    if (closeWhatsappModal) {
        closeWhatsappModal.addEventListener('click', () => {
            whatsappModal.classList.remove('active');
        });
    }

    // Close on Backdrop Click
    [prayerModal, whatsappModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });

    // Anti-Bot Math Captcha Generator
    let currentCaptchaSum = 0;
    const captchaQuestionEl = document.getElementById('captchaQuestion');
    const refreshCaptchaBtn = document.getElementById('refreshCaptchaBtn');
    const captchaErrorEl = document.getElementById('captchaError');

    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 9) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        currentCaptchaSum = num1 + num2;
        if (captchaQuestionEl) {
            captchaQuestionEl.textContent = `${num1} + ${num2}`;
        }
        const captchaInput = document.getElementById('captchaAnswer');
        if (captchaInput) captchaInput.value = '';
        if (captchaErrorEl) captchaErrorEl.classList.add('hidden');
    }

    generateCaptcha();

    if (refreshCaptchaBtn) {
        refreshCaptchaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            generateCaptcha();
        });
    }

    // 5. Form Submissions - Integrated with Google Sheet Web App & Captcha Verification
    const PRAYER_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbysqmSOIXBFf1zzXTc0-LNM-TnKYK8MAPdaVHRJwecnh3t1FBeQuCRjpkn9ysRquO_V/exec';
    
    const prayerForm = document.getElementById('prayerForm');
    const prayerSuccess = document.getElementById('prayerSuccess');
    const resetPrayerForm = document.getElementById('resetPrayerForm');

    if (prayerForm) {
        prayerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userCaptcha = parseInt(document.getElementById('captchaAnswer')?.value, 10);
            if (isNaN(userCaptcha) || userCaptcha !== currentCaptchaSum) {
                if (captchaErrorEl) {
                    captchaErrorEl.classList.remove('hidden');
                }
                generateCaptcha();
                return;
            }

            if (captchaErrorEl) captchaErrorEl.classList.add('hidden');

            const submitBtn = prayerForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Request...';
            }

            const formData = new URLSearchParams();
            formData.append('name', document.getElementById('prayerName')?.value || '');
            formData.append('phone', document.getElementById('prayerPhone')?.value || '');
            formData.append('email', document.getElementById('prayerEmail')?.value || '');
            formData.append('message', document.getElementById('prayerMessage')?.value || '');

            fetch(PRAYER_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            })
            .then(() => {
                prayerForm.reset();
                generateCaptcha();
                prayerForm.classList.add('hidden');
                prayerSuccess.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error submitting prayer request:', error);
                prayerForm.classList.add('hidden');
                prayerSuccess.classList.remove('hidden');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Prayer Request';
                }
            });
        });
    }

    if (resetPrayerForm) {
        resetPrayerForm.addEventListener('click', () => {
            prayerForm.reset();
            prayerSuccess.classList.add('hidden');
            prayerForm.classList.remove('hidden');
        });
    }

    const whatsappForm = document.getElementById('whatsappForm');
    const whatsappSuccess = document.getElementById('whatsappSuccess');

    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();
            whatsappForm.classList.add('hidden');
            whatsappSuccess.classList.remove('hidden');
        });
    }

    // Current Year Update
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Helper Function: Countdown to Next Sunday & Last Tuesday of Month
function initCountdowns() {
    const sundayTimerEl = document.getElementById('sundayTimer');
    const fastingTimerEl = document.getElementById('fastingTimer');

    function updateTimers() {
        const now = new Date();

        // 1. Next Sunday Timer
        const nextSunday = getNextSunday(now);
        const sundayDiff = nextSunday - now;

        if (sundayTimerEl) {
            if (sundayDiff <= 0) {
                sundayTimerEl.textContent = "Worship Service Today!";
            } else {
                const days = Math.floor(sundayDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((sundayDiff / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((sundayDiff / 1000 / 60) % 60);
                sundayTimerEl.textContent = `${days}d ${hours}h ${mins}m`;
            }
        }

        // 2. Last Tuesday of Month Timer
        const lastTuesday = getLastTuesdayOfMonth(now.getFullYear(), now.getMonth());
        // If passed this month, get next month
        let targetTuesday = lastTuesday;
        if (now > lastTuesday) {
            targetTuesday = getLastTuesdayOfMonth(now.getFullYear(), now.getMonth() + 1);
        }
        const fastingDiff = targetTuesday - now;

        if (fastingTimerEl) {
            const fDays = Math.floor(fastingDiff / (1000 * 60 * 60 * 24));
            const fHours = Math.floor((fastingDiff / (1000 * 60 * 60)) % 24);
            const fMins = Math.floor((fastingDiff / 1000 / 60) % 60);
            fastingTimerEl.textContent = `${fDays}d ${fHours}h ${fMins}m`;
        }
    }

    updateTimers();
    setInterval(updateTimers, 60000); // update every minute
}

function getNextSunday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() + (day === 0 ? 7 : 7 - day);
    date.setDate(diff);
    date.setHours(9, 0, 0, 0); // 9:00 AM Worship
    return date;
}

function getLastTuesdayOfMonth(year, month) {
    const date = new Date(year, month + 1, 0); // last day of month
    while (date.getDay() !== 2) { // 2 = Tuesday
        date.setDate(date.getDate() - 1);
    }
    date.setHours(9, 30, 0, 0);
    return date;
}

// Trigger Google Translate from custom glassmorphism dropdown & persist cookies
function setGoogleTranslateLanguage(langCode) {
    if (langCode === 'en') {
        clearGoogTransCookie();
        localStorage.setItem('thirunivasam_lang', 'en');
        location.reload();
        return;
    }
    
    setGoogTransCookie(langCode);
    localStorage.setItem('thirunivasam_lang', langCode);

    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
        googleSelect.value = langCode;
        googleSelect.dispatchEvent(new Event('change'));
    }
    
    location.reload();
}

function applyGoogleLanguage(langCode) {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
        googleSelect.value = langCode;
        googleSelect.dispatchEvent(new Event('change'));
        return true;
    }
    return false;
}

function setGoogTransCookie(langCode) {
    const cookieVal = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    if (location.hostname) {
        document.cookie = `googtrans=${cookieVal}; path=/; domain=${location.hostname};`;
    }
}

function clearGoogTransCookie() {
    document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    if (location.hostname) {
        document.cookie = `googtrans=; path=/; domain=${location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }
}

function getGoogTransCookie() {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    return match ? match[1] : null;
}
