/* js/app.js — главный контроллер приложения */

const App = {
  currentView:     'list',
  currentCategory: 'all',
  currentTab:      'active',

  init() {
    this.setView('list');
    this.updateSidebar();
    Render.list();
  },

  // ---- Views ----

  setView(v) {
    this.currentView = v;

    const views = { list: 'view-list-area', calendar: 'view-cal-area', stats: 'view-stats-area' };
    Object.entries(views).forEach(([key, id]) => {
      document.getElementById(id).style.display = key === v ? 'flex' : 'none';
    });

    const btnMap = { list: 'btn-view-list', calendar: 'btn-view-cal', stats: 'btn-view-stats' };
    Object.values(btnMap).forEach(id => document.getElementById(id).classList.remove('active'));
    document.getElementById(btnMap[v]).classList.add('active');

    if (v === 'calendar') Cal.render();
    if (v === 'stats')    Render.stats();
  },

  // ---- Filters ----

  setCategory(c) {
    this.currentCategory = c;

    ['all', 'urgent', 'done'].forEach(k => {
      document.getElementById(`cat-${k}`).classList.remove('active');
    });
    if (['all', 'urgent', 'done'].includes(c)) {
      document.getElementById(`cat-${c}`).classList.add('active');
    }

    const titleMap = { all: 'Все дедлайны', urgent: 'Срочные', done: 'Выполненные' };
    document.getElementById('list-title').textContent = titleMap[c] || c;

    Render.list();
    this.updateSidebar();
  },

  setTab(t) {
    this.currentTab = t;
    document.getElementById('tab-active').classList.toggle('active', t === 'active');
    document.getElementById('tab-done-tab').classList.toggle('active', t === 'done');
    Render.list();
  },

  getFiltered() {
    let list = deadlines;

    if      (this.currentCategory === 'urgent') list = list.filter(d => !d.done && daysLeft(d.date) <= 3);
    else if (this.currentCategory === 'done')   list = list.filter(d => d.done);
    else if (this.currentCategory !== 'all')    list = list.filter(d => d.category === this.currentCategory);

    if (this.currentTab === 'active') list = list.filter(d => !d.done);
    else                              list = list.filter(d => d.done);

    return list.sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  // ---- Sidebar ----

  updateSidebar() {
    document.getElementById('cnt-all').textContent    = deadlines.length;
    document.getElementById('cnt-urgent').textContent = deadlines.filter(d => !d.done && daysLeft(d.date) <= 3).length;
    document.getElementById('cnt-done').textContent   = deadlines.filter(d => d.done).length;

    const cats  = getCategories();
    const catEl = document.getElementById('cat-list');
    catEl.innerHTML = cats.map(c => {
      const col = deadlines.find(d => d.category === c)?.color || '#888';
      const cnt = deadlines.filter(d => d.category === c).length;
      const active = this.currentCategory === c ? 'active' : '';
      return `<button class="sidebar-item ${active}" onclick="App.setCategory('${c.replace(/'/g,"\\'")}')">
        <span class="sidebar-dot" style="background:${col};"></span>
        ${c} <span class="sidebar-count">${cnt}</span>
      </button>`;
    }).join('');
  },

  // ---- Actions ----

  toggleDone(id) {
    const dl = deadlines.find(d => d.id === id);
    if (!dl) return;
    dl.done = !dl.done;
    if (dl.done) dl.progress = 100;
    DB.save(deadlines);
    Render.list();
    this.updateSidebar();
  },

  deleteDeadline(id) {
    if (!confirm('Удалить этот дедлайн?')) return;
    deadlines = deadlines.filter(d => d.id !== id);
    DB.save(deadlines);
    Render.list();
    this.updateSidebar();
  },

  // ---- Import / Export ----

  exportData() {
    const blob = new Blob([JSON.stringify(deadlines, null, 2)], { type: 'application/json' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `owo_deadlines_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  },

  importTrigger() {
    document.getElementById('import-file').click();
  },

  importData(event) {
    const file   = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) throw new Error('Неверный формат');
        if (confirm(`Импортировать ${imported.length} дедлайнов? Текущие данные будут заменены.`)) {
          deadlines = imported;
          DB.save(deadlines);
          Render.list();
          this.updateSidebar();
        }
      } catch {
        alert('Ошибка чтения файла. Убедитесь, что это корректный JSON-экспорт.');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  }
};

// Запуск
App.init();
