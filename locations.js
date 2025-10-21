/**
 * Kingdom Come: Deliverance II - Сторінка локацій
 * Уніфікований JavaScript з головною сторінкою
 */

// Конфігурація
const LOCATIONS_CONFIG = {
    animationOffset: 50,
    modalTransition: 300
};

// Стан програми
const locationsState = {
    observer: null,
    activeModal: null
};

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    initializeLocationsPage();
});

function initializeLocationsPage() {
    console.log('🗺️ Ініціалізація сторінки локацій Kingdom Come: Deliverance II...');

    initializeMapInteractions();
    initializeGalleryInteractions();
    initializeLocationsAnimations();
    preloadLocationImages();

    console.log('✅ Сторінка локацій успішно ініціалізована');
}

// ===== ВЗАЄМОДІЯ З КАРТАМИ =====
function initializeMapInteractions() {
    // Основна карта Куттенберга
    const mainMap = document.getElementById('mainMap');
    if (mainMap) {
        mainMap.addEventListener('click', function() {
            // Ефект кліку
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // Перехід на сторінку Куттенберга
                window.location.href = 'kuttenberg.html';
            }, 150);
        });

        // Додаємо підказку при наведенні
        mainMap.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
            this.style.borderColor = 'rgba(255, 0, 0, 0.5)';
        });

        mainMap.addEventListener('mouseleave', function() {
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
    }
}

// ===== ВЗАЄМОДІЯ З ГАЛЕРЕЄЮ =====
function initializeGalleryInteractions() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Ефект кліку
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';

                // Отримуємо назву локації
                const img = this.querySelector('img');
                const locationName = img ? img.alt : 'Невідома локація';

                // Показуємо інформацію про локацію
                showLocationInfo(locationName, index);
            }, 150);
        });

        // Плавна поява інформації
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.info-overlay');
            if (overlay) {
                overlay.style.transition = 'transform 0.3s ease';
            }
        });

        // Ефект при наведенні
        item.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
            const img = this.querySelector('img');
            if (img) {
                img.style.filter = 'brightness(1.15) contrast(1.1)';
            }
        });

        item.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.filter = 'brightness(1) contrast(1)';
            }
        });
    });
}

// ===== ПОКАЗ ІНФОРМАЦІЇ ПРО ЛОКАЦІЮ =====
function showLocationInfo(locationName, index) {
    // Закриваємо активне модальне вікно, якщо воно є
    if (locationsState.activeModal) {
        locationsState.activeModal.remove();
    }

    // Створюємо модальне вікно
    const modal = document.createElement('div');
    modal.className = 'location-modal';
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
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(10px);
    `;

    // Контент модального вікна
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: var(--content-bg);
        padding: 2.5rem;
        border-radius: var(--border-radius);
        max-width: 500px;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
        box-shadow: var(--shadow-lg);
    `;

    // Заголовок
    const title = document.createElement('h3');
    title.textContent = locationName;
    title.style.cssText = `
        color: var(--light-red);
        margin-bottom: 1rem;
        font-size: 1.5rem;
        font-family: 'Ancient German Gothic', serif;
    `;

    // Опис локації
    const description = document.createElement('p');
    description.textContent = getLocationDescription(index);
    description.style.cssText = `
        color: var(--text-color);
        line-height: 1.6;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
    `;

    // Кнопка закриття
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрити';
    closeButton.className = 'modal-close';
    closeButton.style.cssText = `
        background: linear-gradient(135deg, var(--primary-red), var(--accent-red));
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 1rem;
        transition: var(--transition);
        font-family: 'Ancient German Gothic', serif;
    `;

    closeButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = 'var(--glow-red)';
    });

    closeButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });

    closeButton.addEventListener('click', function() {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
                locationsState.activeModal = null;
            }
        }, LOCATIONS_CONFIG.modalTransition);
    });

    // Збираємо модальне вікно
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Зберігаємо посилання на активне модальне вікно
    locationsState.activeModal = modal;

    // Анімація появи
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);

    // Закриття по кліку на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                    locationsState.activeModal = null;
                }
            }, LOCATIONS_CONFIG.modalTransition);
        }
    });

    // Закриття по ESC
    const handleKeydown = (e) => {
        if (e.key === 'Escape' && locationsState.activeModal) {
            locationsState.activeModal.style.opacity = '0';
            const modalContent = locationsState.activeModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(0.9)';
            }
            setTimeout(() => {
                if (locationsState.activeModal.parentNode) {
                    locationsState.activeModal.parentNode.removeChild(locationsState.activeModal);
                    locationsState.activeModal = null;
                }
                document.removeEventListener('keydown', handleKeydown);
            }, LOCATIONS_CONFIG.modalTransition);
        }
    };
    document.addEventListener('keydown', handleKeydown);
}

// ===== ОПИСИ ЛОКАЦІЙ =====
function getLocationDescription(index) {
    const descriptions = [
        "Табір кочівників розташований у віддаленій місцевості. Тут можна знайти рідкісні ресурси, торгувати з кочівниками та отримати унікальні квести.",
        "Желєйов — невелике ремісниче містечко, відоме своїми майстрами ковальської справи. Ідеальне місце для поліпшення обладунків та зброї.",
        "Замок Троски — могутня середньовічна фортеця, що височить на пагорбі. Тут відбуваються ключові сюжетні події та лицарські турніри.",
        "Диявольське лігвище — небезпечна територія, населена розбійниками та дикими звірами. Тільки найвправніші воїни ризикують заходити сюди.",
        "Тахов — мирне містечко з розвиненим фермерством. Місцеві жителі завжди раді допомогти мандрівникам та поділитися провізією.",
        "Сучдоль — торгове село на перехресті шляхів. Тут можна знайти унікальні товари та отримати інформацію про навколишні території.",
        "Табір Сигізмунда — військовий штаб королівських військ. Стратегічно важлива локація для участі у великих битвах.",
        "Семін — мальовниче містечко з невеликим замком. Відмінне місце для відпочинку та поповнення запасів.",
        "Стара Кутна — історичний район з унікальною архітектурою. Тут зберігаються давні секрети та легенди.",
        "Місковіц — затишне поселення поблизу Куттенберга. Місцеві мешканці спеціалізуються на лісівництві та полюванні.",
        "Малесов — сільськогосподарський центр регіону. Великі ферми та родючі землі забезпечують продухами весь регіон.",
        "Хоршан — стратегічно розташоване місто з потужними укріпленнями. Ключовий пункт оборони королівства.",
        "Грунд — невелике, але дуже затишне поселення. Місцеві мешканці відомі своєю гостинністю.",
        "Богуновіц — торгове село з розвиненою інфраструктурою. Ідеальне місце для початкових торгів."
    ];

    return descriptions[index] || "Ця локація ще не має детального опису. Досліджуйте її самі, щоб дізнатися більше!";
}

// ===== АНІМАЦІЇ ДЛЯ ЛОКАЦІЙ =====
function initializeLocationsAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: `0px 0px -${LOCATIONS_CONFIG.animationOffset}px 0px`
    };

    locationsState.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Додаткова анімація для елементів галереї
                if (entry.target.classList.contains('gallery-item')) {
                    animateGalleryItem(entry.target);
                }
            }
        });
    }, observerOptions);

    // Спостерігаємо за всіма елементами, що потребують анімації
    const animatedElements = document.querySelectorAll('.fade-in, .gallery-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        locationsState.observer.observe(element);
    });
}

// Анімація елементів галереї
function animateGalleryItem(item) {
    const delay = Array.from(document.querySelectorAll('.gallery-item')).indexOf(item) * 100;
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, delay);
}

// ===== ОПТИМІЗАЦІЯ ЗОБРАЖЕНЬ =====
function preloadLocationImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Додаємо loading="lazy" для оптимізації завантаження
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

// ===== ОБРОБКА ПОМИЛОК =====
window.addEventListener('error', function(e) {
    console.error('❌ Помилка на сторінці локацій:', e.error);
});

// Експорт для глобального використання
window.KCDLocations = {
    showLocationInfo,
    initializeLocationsPage
};