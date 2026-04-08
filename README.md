# 0w0 Deadline Tracker

Веб-версия трекера дедлайнов для художников и студентов, вдохновлённая оригинальным [0w0](https://www.postype.com/@nyaohasaranghae/post/22028515) от @nyaohasaranghae.

Работает прямо в браузере — никаких зависимостей, никакого сервера.

![preview](https://img.shields.io/badge/works-offline-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

## Возможности

- **Дедлайны** — добавление, редактирование, удаление, отметка выполнения
- **Прогресс-бары** с цветовой кодировкой по срочности
- **Категории** с фильтром в сайдбаре
- **Календарь** с отметками дедлайнов
- **Статистика** — тепловая карта активности, разбивка по категориям
- **Таймер Помодоро** — 25 мин работа / 5 мин перерыв
- **Экспорт/импорт** данных в JSON
- **Тёмная тема** — автоматически по системным настройкам
- **Сохранение** в localStorage (работает оффлайн)

## Использование

### Вариант 1 — GitHub Pages

1. Сделай форк репозитория
2. Зайди в **Settings → Pages**
3. Source: `Deploy from a branch`, Branch: `main`, Folder: `/ (root)`
4. Сохрани — через пару минут сайт будет доступен по адресу `https://<username>.github.io/<repo>/`

### Вариант 2 — локально

```bash
git clone https://github.com/<username>/<repo>.git
cd <repo>
open index.html   # или просто открой файл в браузере
```

Никакого `npm install` не требуется — это чистый HTML/CSS/JS.

## Структура проекта

```
owo-deadline-tracker/
├── index.html          # Разметка и точка входа
├── css/
│   └── style.css       # Все стили (light + dark mode)
└── js/
    ├── data.js         # Хранилище данных и утилиты
    ├── pomodoro.js     # Таймер Помодоро
    ├── calendar.js     # Вид календаря
    ├── modal.js        # Модальное окно добавления/редактирования
    ├── render.js       # Рендеринг списков и статистики
    └── app.js          # Главный контроллер приложения
```

## Кастомизация

Все цвета и переменные находятся в блоке `:root` файла `css/style.css`.

Цвета для дедлайнов задаются в массиве `COLORS` в файле `js/data.js`.

## Оригинал

Оригинальная Windows-версия: [@nyaohasaranghae на Postype](https://www.postype.com/@nyaohasaranghae/post/22028515)

---

MIT License
