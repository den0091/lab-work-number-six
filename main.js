/**
 * Kingdom Come: Deliverance II - Оновлений JavaScript з PHP-сумісністю
 */

// Конфігурація програми
const CONFIG = {
    scrollThreshold: 100,
    throttleDelay: 100,
    animationOffset: 50,
    surveyToggleSpeed: 500,
    notificationDuration: 5000
};

// Стан програми
const appState = {
    lastScrollPosition: 0,
    isScrollThrottled: false,
    isSurveyVisible: false,
    intersectionObserver: null,
    formSubmissionInProgress: false
};

/**
 * Головна функція ініціалізації
 */
function initializeApplication() {
    console.log('🚀 Ініціалізація Kingdom Come: Deliverance II вебсайту...');

    initializeHeaderBehavior();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeSurveyFunctionality();
    initializeFormHandling();
    initializeTableInteractions();
    initializeFeatureCards();
    initializeErrorHandling();
    initializePerformanceOptimizations();

    // Автоматично показуємо опитування якщо є повідомлення про успіх
    setTimeout(checkForSuccessMessage, 1000);

    console.log('✅ Kingdom Come: Deliverance II - вебсайт успішно завантажено та ініціалізовано');
}

/**
 * Перевіряємо чи є повідомлення про успішну відправку
 */
function checkForSuccessMessage() {
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
        // Прокручуємо до повідомлення
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Автоматично ховаємо через 8 секунд
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (successMessage.parentNode) {
                        successMessage.remove();
                    }
                }, 500);
            }
        }, 8000);
    }
}

/**
 * Модуль управління шапкою
 */
function initializeHeaderBehavior() {
    const headerElement = document.getElementById('mainHeader');

    if (!headerElement) {
        console.warn('⚠️ Header element not found');
        return;
    }

    function handleScrollEvent() {
        if (appState.isScrollThrottled) return;

        const currentScrollPosition = window.pageYOffset;
        const scrollDirection = currentScrollPosition > appState.lastScrollPosition;

        if (scrollDirection && currentScrollPosition > CONFIG.scrollThreshold) {
            headerElement.classList.add('hidden');
        } else {
            headerElement.classList.remove('hidden');
        }

        appState.lastScrollPosition = currentScrollPosition;
        appState.isScrollThrottled = true;

        setTimeout(() => {
            appState.isScrollThrottled = false;
        }, CONFIG.throttleDelay);
    }

    // Покращена обробка скролу з requestAnimationFrame
    let ticking = false;
    function updateHeader() {
        handleScrollEvent();
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });

    // Додаємо ефект при кліку на посилання в хедері
    const headerLinks = document.querySelectorAll('.header__link');
    headerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

/**
 * Модуль анімацій при скролі
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: `0px 0px -${CONFIG.animationOffset}px 0px`
    };

    appState.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Додаткові анімації для різних елементів
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.transition = 'all 0.6s ease 0.1s';
                } else if (entry.target.classList.contains('window')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
                    entry.target.style.transition = `all 0.6s ease ${delay}s`;
                } else if (entry.target.classList.contains('success-message')) {
                    entry.target.style.transition = 'all 0.6s ease 0.2s';
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.window, .feature-card, .footer, .survey-section, .success-message');

    animatedElements.forEach((element) => {
        // Не скидаємо стилі для success-message, якщо вони вже задані
        if (!element.classList.contains('success-message')) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        appState.intersectionObserver.observe(element);
    });
}

/**
 * Модуль плавної прокрутки
 */
function initializeSmoothScrolling() {
    const navigationLinks = document.querySelectorAll('a[href^="#"]');

    navigationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');

            if (targetHref !== '#' && targetHref.startsWith('#') && document.querySelector(targetHref)) {
                e.preventDefault();

                const targetElement = document.querySelector(targetHref);
                const headerElement = document.getElementById('mainHeader');
                const headerHeight = headerElement ? headerElement.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Оновлюємо активний стан посилань
                navigationLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

/**
 * Модуль функціоналу опитування
 */
function initializeSurveyFunctionality() {
    const surveyToggleButton = document.getElementById('surveyToggle');
    const surveySection = document.getElementById('surveySection');

    if (!surveyToggleButton || !surveySection) {
        console.warn('⚠️ Survey elements not found');
        return;
    }

    function toggleSurveyVisibility() {
        if (appState.formSubmissionInProgress) return;

        appState.isSurveyVisible = !appState.isSurveyVisible;

        if (appState.isSurveyVisible) {
            // Показуємо опитування
            surveySection.style.display = 'block';

            // Анімація появи
            requestAnimationFrame(() => {
                surveySection.classList.add('show');
                surveyToggleButton.textContent = 'Приховати опитування';
                surveyToggleButton.classList.add('active');
            });

            // Прокрутка до опитування
            const headerElement = document.getElementById('mainHeader');
            const headerHeight = headerElement ? headerElement.offsetHeight : 0;
            const surveyPosition = surveySection.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: surveyPosition,
                behavior: 'smooth'
            });

            // Фокус на першому полі форми
            setTimeout(() => {
                const firstInput = surveySection.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
            }, 600);

        } else {
            // Ховаємо опитування
            surveySection.classList.remove('show');
            surveyToggleButton.classList.remove('active');

            setTimeout(() => {
                surveySection.style.display = 'none';
                surveyToggleButton.textContent = 'Пройти опитування';
            }, CONFIG.surveyToggleSpeed);
        }
    }

    // Обробник кнопки перемикача
    surveyToggleButton.addEventListener('click', toggleSurveyVisibility);

    // Закриття по кліку поза опитуванням
    document.addEventListener('click', (e) => {
        if (appState.isSurveyVisible &&
            surveySection &&
            !surveySection.contains(e.target) &&
            e.target !== surveyToggleButton &&
            !surveyToggleButton.contains(e.target)) {
            toggleSurveyVisibility();
        }
    });

    // Закриття по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && appState.isSurveyVisible) {
            toggleSurveyVisibility();
        }
    });
}

/**
 * Модуль обробки форми
 */
function initializeFormHandling() {
    const surveyForm = document.getElementById('surveyForm');

    if (!surveyForm) {
        console.warn('⚠️ Survey form not found');
        return;
    }

    // Обмеження кількості обраних чекбоксів
    const checkboxes = document.querySelectorAll('input[name="favoriteAspects[]"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('input[name="favoriteAspects[]"]:checked');
            if (checkedBoxes.length > 3) {
                this.checked = false;
                showNotification('Можна вибрати не більше трьох улюблених аспектів', 'warning');

                // Анімація відхилення
                this.parentElement.style.transform = 'translateX(-10px)';
                setTimeout(() => {
                    this.parentElement.style.transform = 'translateX(0)';
                }, 300);
            }
        });
    });

    // Покращена валідація в реальному часі
    const formInputs = surveyForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);

            // Додаємо візуальний індикатор валідності
            if (this.checkValidity()) {
                this.classList.add('valid');
            } else {
                this.classList.remove('valid');
            }
        });
    });

    // Валідація окремого поля
    function validateField(field) {
        const value = field.value.trim();

        switch(field.type) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    showFieldError(field, 'Будь ласка, введіть коректну email адресу');
                    return false;
                }
                break;

            case 'text':
                if (field.required && !value) {
                    showFieldError(field, 'Це поле обов\'язкове для заповнення');
                    return false;
                } else if (field.id === 'playerName' && value.length < 2) {
                    showFieldError(field, 'Ім\'я повинно містити принаймні 2 символи');
                    return false;
                }
                break;

            case 'select-one':
                if (field.required && !value) {
                    showFieldError(field, 'Будь ласка, оберіть значення');
                    return false;
                }
                break;
        }

        clearFieldError(field);
        return true;
    }

    // Валідація всієї форми перед відправкою
    surveyForm.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            showNotification('Будь ласка, виправте помилки в формі', 'error');

            // Прокручуємо до першої помилки
            const firstError = surveyForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Валідація всієї форми
    function validateForm() {
        let isValid = true;
        const playerName = document.getElementById('playerName');
        const playerEmail = document.getElementById('playerEmail');
        const playerAge = document.getElementById('playerAge');
        const gameRating = document.querySelector('input[name="gameRating"]:checked');
        const playtime = document.getElementById('playtime');

        // Валідація імені
        if (!playerName.value.trim()) {
            showFieldError(playerName, 'Будь ласка, введіть ваше ім\'я');
            isValid = false;
        } else if (playerName.value.trim().length < 2) {
            showFieldError(playerName, 'Ім\'я повинно містити принаймні 2 символи');
            isValid = false;
        }

        // Валідація email
        if (!playerEmail.value.trim()) {
            showFieldError(playerEmail, 'Будь ласка, введіть email адресу');
            isValid = false;
        } else if (!isValidEmail(playerEmail.value.trim())) {
            showFieldError(playerEmail, 'Будь ласка, введіть коректну email адресу');
            isValid = false;
        }

        // Валідація віку
        if (!playerAge.value) {
            showFieldError(playerAge, 'Будь ласка, оберіть вікову категорію');
            isValid = false;
        }

        // Валідація рейтингу
        if (!gameRating) {
            showNotification('Будь ласка, оберіть загальну оцінку гри', 'error');
            isValid = false;
        }

        // Валідація часу гри
        if (!playtime.value) {
            showFieldError(playtime, 'Будь ласка, оберіть час гри');
            isValid = false;
        }

        return isValid;
    }

    // Допоміжні функції валідації
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        field.classList.add('error');

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;

        field.parentNode.appendChild(errorElement);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
}

/**
 * Модуль взаємодії з таблицею
 */
function initializeTableInteractions() {
    const tableRows = document.querySelectorAll('.events-table tbody tr');

    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Видаляємо активний стан з усіх рядків
            tableRows.forEach(r => r.classList.remove('active'));

            // Додаємо активний стан до поточного рядка
            this.classList.add('active');

            // Отримуємо дані з рядка
            const cells = this.querySelectorAll('td');
            const eventData = {
                date: cells[0].textContent,
                event: cells[1].textContent,
                description: cells[2].textContent,
                rewards: cells[3].textContent
            };

            // Показуємо деталі події
            showEventDetails(eventData);
        });

        // Ефект при наведенні
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });

        row.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(0)';
            }
        });
    });
}

/**
 * Показ деталей події
 */
function showEventDetails(eventData) {
    const notificationMessage = `
        🗓️ <strong>${eventData.event}</strong><br>
        📅 Дата: ${eventData.date}<br>
        📝 ${eventData.description}<br>
        🎁 Нагороди: ${eventData.rewards}
    `;

    showNotification(notificationMessage, 'info');
}

/**
 * Модуль карток особливостей
 */
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });

        // Клік по картці
        card.addEventListener('click', function() {
            const title = this.querySelector('.feature-card__title').textContent;
            const description = this.querySelector('.feature-card__description').textContent;

            showNotification(`<strong>${title}</strong><br>${description}`, 'info');
        });
    });
}

/**
 * Модуль системи сповіщень
 */
function showNotification(message, type = 'info') {
    // Видаляємо старі сповіщення
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notification => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });

    // Створюємо нове сповіщення
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;

    let backgroundColor, icon;
    switch(type) {
        case 'success':
            backgroundColor = 'rgba(76, 175, 80, 0.95)';
            icon = '✅';
            break;
        case 'error':
            backgroundColor = 'rgba(244, 67, 54, 0.95)';
            icon = '❌';
            break;
        case 'warning':
            backgroundColor = 'rgba(255, 152, 0, 0.95)';
            icon = '⚠️';
            break;
        case 'info':
            backgroundColor = 'rgba(33, 150, 243, 0.95)';
            icon = 'ℹ️';
            break;
        default:
            backgroundColor = 'rgba(33, 150, 243, 0.95)';
            icon = '💡';
    }

    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Закрити">&times;</button>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 140px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: 'Ancient German Gothic', serif;
        max-width: 350px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    // Стилі для вмісту сповіщення
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }
        .notification-icon {
            font-size: 1.2rem;
            flex-shrink: 0;
            margin-top: 0.1rem;
        }
        .notification-message {
            flex: 1;
            line-height: 1.5;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
            flex-shrink: 0;
        }
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Анімація появи
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Обробник закриття
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });

    // Автоматичне закриття
    const autoCloseTimeout = setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, CONFIG.notificationDuration);

    // Зупинка автоматичного закриття при наведенні
    notification.addEventListener('mouseenter', () => {
        clearTimeout(autoCloseTimeout);
    });

    notification.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 1000);
    });
}

/**
 * Модуль оптимізації продуктивності
 */
function initializePerformanceOptimizations() {
    // Відкладаємо завантаження некритичних ресурсів
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            console.log('🔄 Завантаження додаткових ресурсів...');
        });
    }

    // Оптимізація анімацій
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        document.documentElement.style.setProperty('--transition', 'none');
        document.documentElement.style.setProperty('--transition-slow', 'none');
    }
}

/**
 * Модуль обробки помилок
 */
function initializeErrorHandling() {
    // Глобальна обробка помилок
    window.addEventListener('error', function(event) {
        console.error('❌ Сталася помилка виконання:', event.error);
        showNotification('Сталася несподівана помилка. Будь ласка, оновіть сторінку.', 'error');
    });

    // Обробка невдалих промісів
    window.addEventListener('unhandledrejection', function(event) {
        console.error('❌ Необроблена проміс-помилка:', event.reason);
        showNotification('Сталася помилка при виконанні операції.', 'error');
    });

    // Обробка помилок завантаження зображень
    document.addEventListener('error', function(event) {
        if (event.target.tagName === 'IMG') {
            console.warn('⚠️ Не вдалося завантажити зображення:', event.target.src);
            event.target.style.opacity = '0.5';
        }
    }, true);
}

/**
 * Додаткові утиліти
 */

// Функція для обмеження частоти викликів (throttle)
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

// Функція для запобігання багаторазовому виконанню (debounce)
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Запуск програми
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}

// Експорт для глобального використання
window.KCDApp = {
    showNotification,
    initializeApplication,
    config: CONFIG
};