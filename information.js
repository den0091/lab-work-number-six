/**
 * Kingdom Come: Deliverance II - Інформаційна сторінка JavaScript
 * Повна версія без скорочень
 */

// Конфігурація
const CONFIG = {
    scrollThreshold: 100,
    throttleDelay: 100,
    animationOffset: 50
};

// Стан програми
let state = {
    lastScroll: 0,
    isThrottled: false,
    observer: null
};

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', init);

function init() {
    initializeHeader();
    initializeAnimations();
    initializeSmoothScrolling();
    initializeImageInteractions();
    initializeReadingProgress();
    initializeHeadingAnimations();
    addHeadingAnimationStyles();
    initializeButtonEffects();

    console.log('Kingdom Come: Deliverance II - інформаційна сторінка завантажена');
}

// ===== УПРАВЛІННЯ ШАПКОЮ =====
function initializeHeader() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    const handleScroll = () => {
        if (state.isThrottled) return;

        const currentScroll = window.pageYOffset;

        if (currentScroll > state.lastScroll && currentScroll > CONFIG.scrollThreshold) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        state.lastScroll = currentScroll;
        state.isThrottled = true;

        setTimeout(() => {
            state.isThrottled = false;
        }, CONFIG.throttleDelay);
    };

    // Додаємо обробник з пасивним слухачем для кращої продуктивності
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ===== АНІМАЦІЇ ПРИ СКРОЛІ =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: `0px 0px -${CONFIG.animationOffset}px 0px`
    };

    state.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Спостерігаємо за всіма елементами, що потребують анімації
    const animatedElements = document.querySelectorAll('.window, .footer');
    animatedElements.forEach(element => {
        state.observer.observe(element);
    });
}

// ===== ПЛАВНА ПРОКРУТКА =====
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.getElementById('mainHeader').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ОБРОБКА ЗОБРАЖЕНЬ =====
function initializeImageInteractions() {
    const images = document.querySelectorAll('.info-image');

    images.forEach(image => {
        // Додаємо ефект завантаження для зображень
        image.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });

        // Додаємо обробник кліку для збільшення зображення
        image.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });

        // Початковий стан для плавного появи
        image.style.opacity = '0';
        image.style.transform = 'scale(0.9)';
        image.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
}

// ===== МОДАЛЬНЕ ВІКНО ДЛЯ ЗОБРАЖЕНЬ =====
function openImageModal(imageSource, imageAlt) {
    // Створюємо модальне вікно
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: zoom-out;
    `;

    // Створюємо зображення для модального вікна
    const modalImage = document.createElement('img');
    modalImage.src = imageSource;
    modalImage.alt = imageAlt;
    modalImage.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: var(--border-radius);
        box-shadow: 0 0 50px rgba(255, 0, 0, 0.5);
        transform: scale(0.8);
        transition: transform 0.3s ease;
        cursor: default;
    `;

    // Кнопка закриття
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Закрити модальне вікно');
    closeButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: var(--primary-red);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 30px;
        cursor: pointer;
        z-index: 2001;
        transition: var(--transition);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    closeButton.addEventListener('mouseenter', function() {
        this.style.background = 'var(--accent-red)';
        this.style.transform = 'scale(1.1)';
    });

    closeButton.addEventListener('mouseleave', function() {
        this.style.background = 'var(--primary-red)';
        this.style.transform = 'scale(1)';
    });

    // Функція закриття модального вікна
    function closeModal() {
        modal.style.opacity = '0';
        modalImage.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            document.removeEventListener('keydown', handleEscape);
        }, 300);
    }

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Обробник клавіші Escape
    function handleEscape(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    // Додаємо елементи до модального вікна
    modal.appendChild(modalImage);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);

    // Запускаємо анімацію появи
    setTimeout(() => {
        modal.style.opacity = '1';
        modalImage.style.transform = 'scale(1)';
    }, 10);

    // Додаємо слухач клавіші Escape
    document.addEventListener('keydown', handleEscape);
}

// ===== ПРОГРЕС БАР ЧИТАННЯ =====
function initializeReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-red), var(--accent-red));
        width: 0%;
        z-index: 999;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
    `;

    document.body.appendChild(progressBar);

    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        const progress = (scrollTop / documentHeight) * 100;

        progressBar.style.width = `${progress}%`;
    }

    // Оптимізуємо за допомогою throttle
    const throttledUpdate = throttle(updateProgressBar, 16);
    window.addEventListener('scroll', throttledUpdate);
}

// ===== АНІМАЦІЯ ЗАГОЛОВКІВ ПРИ СКРОЛІ =====
function initializeHeadingAnimations() {
    const headings = document.querySelectorAll('.heading-secondary');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'headingSlideIn 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    headings.forEach(heading => {
        heading.style.opacity = '0';
        heading.style.transform = 'translateX(-50px)';
        headingObserver.observe(heading);
    });
}

// ===== ЕФЕКТИ ДЛЯ КНОПОК =====
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.button');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px) scale(1.02)';
        });

        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
    });
}

// ===== ДОДАВАННЯ СТИЛІВ АНІМАЦІЙ =====
function addHeadingAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes headingSlideIn {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .image-modal {
            cursor: zoom-out;
        }

        .image-modal img {
            cursor: default;
        }

        .reading-progress {
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        }
    `;
    document.head.appendChild(style);
}

// ===== ДОПОМІЖНІ ФУНКЦІЇ =====
// Throttle функція для оптимізації скролу
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce функція для оптимізації
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ОБРОБКА ПОМИЛОК =====
window.addEventListener('error', function(event) {
    console.error('Сталася помилка:', event.error);

    // Резервний варіант для анімацій, якщо IntersectionObserver не підтримується
    if (event.error && event.error.name === 'TypeError' && event.error.message.includes('IntersectionObserver')) {
        console.warn('IntersectionObserver не підтримується, використовуючи резервний метод');
        initializeFallbackAnimations();
    }
});

function initializeFallbackAnimations() {
    const animatedElements = document.querySelectorAll('.window, .footer');

    function checkVisibility() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('in-view');
            }
        });
    }

    window.addEventListener('scroll', throttle(checkVisibility, 100));
    checkVisibility(); // Перевіряємо початковий стан
}

// ===== ЕКСПОРТ ФУНКЦІЙ ДЛЯ ГЛОБАЛЬНОГО ВИКОРИСТАННЯ =====
window.KCDInfo = {
    initialize: init,
    initializeHeader: initializeHeader,
    initializeAnimations: initializeAnimations,
    initializeImageInteractions: initializeImageInteractions,
    openImageModal: openImageModal,
    initializeReadingProgress: initializeReadingProgress
};

// Автоматична ініціалізація при завантаженні DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
