<?php
/**
 * Kingdom Come: Deliverance II - Головна сторінка з PHP опитуванням
 * Лабораторна робота №6
 */

// Обробка POST запиту якщо форма відправлена
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Отримуємо дані з форми
    $playerName = htmlspecialchars($_POST['playerName'] ?? '');
    $playerEmail = htmlspecialchars($_POST['playerEmail'] ?? '');
    $playerAge = htmlspecialchars($_POST['playerAge'] ?? '');
    $gameRating = htmlspecialchars($_POST['gameRating'] ?? '');
    $playtime = htmlspecialchars($_POST['playtime'] ?? '');
    $playerComments = htmlspecialchars($_POST['playerComments'] ?? '');

    // Обробка масиву улюблених аспектів
    $favoriteAspects = [];
    if (isset($_POST['favoriteAspects']) && is_array($_POST['favoriteAspects'])) {
        foreach ($_POST['favoriteAspects'] as $aspect) {
            $favoriteAspects[] = htmlspecialchars($aspect);
        }
    }

    // Зберігаємо результат
    $saveResult = saveSurveyResult([
        'name' => $playerName,
        'email' => $playerEmail,
        'age' => $playerAge,
        'rating' => $gameRating,
        'playtime' => $playtime,
        'favorite_aspects' => $favoriteAspects,
        'comments' => $playerComments
    ]);

    // Показуємо повідомлення про успіх
    $showSuccessMessage = true;
    $submissionTime = date('d.m.Y H:i:s');
}

/**
 * Функція для збереження результатів опитування
 */
function saveSurveyResult($data) {
    // Створюємо папку survey якщо не існує
    if (!is_dir('survey')) {
        mkdir('survey', 0777, true);
    }

    // Генеруємо ім'я файлу з датою та часом
    $timestamp = date('Y-m-d_His');
    $filename = "survey/survey_{$timestamp}.txt";

    // Формуємо вміст файлу
    $content = "ОПИТУВАННЯ ГРАВЦЯ - Kingdom Come: Deliverance II\n";
    $content .= "=============================================\n\n";
    $content .= "📅 Час заповнення: " . date('d.m.Y H:i:s') . "\n";
    $content .= "👤 Ім'я гравця: " . $data['name'] . "\n";
    $content .= "📧 Email: " . $data['email'] . "\n";
    $content .= "🎯 Вікова категорія: " . $data['age'] . "\n";
    $content .= "⭐ Загальна оцінка гри: " . $data['rating'] . "/5\n";
    $content .= "⏱️ Час гри: " . $data['playtime'] . "\n";

    $content .= "❤️ Улюблені аспекти: ";
    if (!empty($data['favorite_aspects'])) {
        $content .= implode(', ', $data['favorite_aspects']) . "\n";
    } else {
        $content .= "Не вказано\n";
    }

    $content .= "💬 Коментарі: " . $data['comments'] . "\n";
    $content .= "\n=============================================\n";
    $content .= "Дякуємо за участь в опитуванні!";

    // Записуємо у файл
    return file_put_contents($filename, $content);
}

// Альтернативний варіант збереження у JSON (для бонусного завдання)
function saveSurveyResultJson($data) {
    if (!is_dir('survey')) {
        mkdir('survey', 0777, true);
    }

    $timestamp = date('Y-m-d_His');
    $filename = "survey/survey_{$timestamp}.json";

    // Додаємо timestamp до даних
    $data['timestamp'] = date('c');
    $data['submission_time'] = date('d.m.Y H:i:s');

    $jsonContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    return file_put_contents($filename, $jsonContent);
}
?>
