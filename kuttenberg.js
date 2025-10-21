/**
 * Kingdom Come: Deliverance II - Сторінка Куттенберга
 * Уніфікований JavaScript з головною сторінкою
 */

// Конфігурація
const KUTTENBERG_CONFIG = {
    modalTransition: 300
};

// Стан програми
const kuttenbergState = {
    activeModal: null
};

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    initializeKuttenbergPage();
});

function initializeKuttenbergPage() {
    console.log('🏰 Ініціалізація сторінки Куттенберга Kingdom Come: Deliverance II...');

    initializeImageInteractions();
    initializeKuttenbergAnimations();

    console.log('✅ Сторінка Куттенберга успішно ініціалізована');
}

// ===== ВЗАЄМОДІЯ З ЗОБРАЖЕННЯМ =====
function initializeImageInteractions() {
    const mainImage = document.getElementById('mainImage');
    const infoModal = document.getElementById('infoModal');
    const closeModal = document.getElementById('closeModal');

    if (mainImage) {
        mainImage.addEventListener('click', function() {
            showInfoModal();
        });

        mainImage.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            hideInfoModal();
        });
    }

    // Закриття модального вікна по кліку на фон
    if (infoModal) {
        infoModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideInfoModal();
            }
        });
    }
}

// ===== ПОКАЗ МОДАЛЬНОГО ВІКНА =====
function showInfoModal() {
    const infoModal = document.getElementById('infoModal');
    if (!infoModal) return;

    kuttenbergState.activeModal = infoModal;
    infoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Анімація появи
    setTimeout(() => {
        infoModal.classList.add('active');
    }, 10);

    // Закриття по ESC
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            hideInfoModal();
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    document.addEventListener('keydown', handleKeydown);
}

function hideInfoModal() {
    const infoModal = document.getElementById('infoModal');
    if (!infoModal) return;

    infoModal.classList.remove('active');
    document.body.style.overflow = 'auto';

    setTimeout(() => {
        infoModal.style.display = 'none';
        kuttenbergState.activeModal = null;
    }, KUTTENBERG_CONFIG.modalTransition);
}

// ===== АНІМАЦІЇ ДЛЯ КУТТЕНБЕРГА =====
function initializeKuttenbergAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Спостерігаємо за всіма елементами, що потребують анімації
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Анімація для карток особливостей
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(() => {
            observer.observe(card);
        }, index * 100);
    });
}

// ===== ОБРОБКА ПОМИЛОК =====
window.addEventListener('error', function(e) {
    console.error('❌ Помилка на сторінці Куттенберга:', e.error);
});

// Експорт для глобального використання
window.KCDKuttenberg = {
    showInfoModal,
    hideInfoModal,
    initializeKuttenbergPage
};