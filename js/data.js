/* js/data.js — хранилище данных */

const STORAGE_KEY = 'owo_deadlines';

const COLORS = [
  '#E24B4A', '#BA7517', '#1D9E75', '#378ADD',
  '#D4537E', '#7F77DD', '#639922', '#D85A30', '#888780'
];

const DB = {
  load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
  },

  save(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  seed() {
    const d = (offset) => {
      const t = new Date();
      t.setDate(t.getDate() + offset);
      return t.toISOString().split('T')[0];
    };
    return [
      { id: 1, title: 'Прототип механики стрельбы', date: d(3),  category: 'Геймплей',     color: '#E24B4A', progress: 40,  notes: 'Реализовать raycast и хитбоксы', done: false, created: Date.now() - 86400000 * 2 },
      { id: 2, title: 'Дизайн уровня 1',            date: d(7),  category: 'Левел-дизайн', color: '#378ADD', progress: 65,  notes: '',                                done: false, created: Date.now() - 86400000 * 5 },
      { id: 3, title: 'Балансировка врагов',         date: d(14), category: 'Геймплей',     color: '#BA7517', progress: 20,  notes: '',                                done: false, created: Date.now() - 86400000 },
      { id: 4, title: 'UI главного меню',            date: d(-1), category: 'UI/UX',        color: '#7F77DD', progress: 100, notes: 'Сдано!',                          done: true,  created: Date.now() - 86400000 * 8 },
      { id: 5, title: 'Звуковое сопровождение',      date: d(21), category: 'Аудио',        color: '#1D9E75', progress: 10,  notes: '',                                done: false, created: Date.now() },
    ];
  }
};

// Инициализация
let deadlines = DB.load();
if (!deadlines.length) {
  deadlines = DB.seed();
  DB.save(deadlines);
}

// Утилиты
function daysLeft(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
}

function urgencyClass(dl) {
  if (dl.done) return 'done';
  const days = daysLeft(dl.date);
  if (days <= 1) return 'urgent';
  if (days <= 3) return 'warning';
  return '';
}

function daysBadge(dl) {
  if (dl.done) return '<span class="days-badge days-done">Готово</span>';
  const days = daysLeft(dl.date);
  if (days < 0)  return `<span class="days-badge days-urgent">Просрочен на ${-days} д.</span>`;
  if (days === 0) return '<span class="days-badge days-urgent">Сегодня!</span>';
  if (days <= 3)  return `<span class="days-badge days-warn">${days} д.</span>`;
  return `<span class="days-badge days-ok">${days} д.</span>`;
}

function getCategories() {
  return [...new Set(deadlines.map(d => d.category).filter(Boolean))];
}
