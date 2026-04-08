/* js/render.js — рендеринг списков, статистики */

const Render = {

  list() {
    const list = App.getFiltered();
    const el   = document.getElementById('deadline-list');

    if (!list.length) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">0w0</div>
          <div>Нет дедлайнов</div>
          <div style="font-size:12px;margin-top:6px;color:var(--hint);">Нажмите «+ Добавить» чтобы начать</div>
        </div>`;
      return;
    }

    el.innerHTML = list.map(dl => `
      <div class="deadline-card ${urgencyClass(dl)}" onclick="Pom.setTask('${dl.title.replace(/'/g,"\\'")}')">
        <div class="dc-color" style="background:${dl.color};"></div>
        <div class="dc-body">
          <div class="dc-title">${dl.title}</div>
          <div class="dc-meta">
            <span>${new Date(dl.date).toLocaleDateString('ru-RU')}</span>
            ${dl.category ? `<span style="color:var(--hint);">${dl.category}</span>` : ''}
            ${daysBadge(dl)}
          </div>
          <div class="dc-progress">
            <div class="dc-progress-meta">
              <span>Прогресс</span><span>${dl.progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${dl.progress}%;background:${dl.color};"></div>
            </div>
          </div>
          ${dl.notes ? `<div class="dc-notes">${dl.notes}</div>` : ''}
        </div>
        <div class="dc-actions">
          <button class="dc-action-btn" title="${dl.done ? 'Вернуть' : 'Выполнено'}"
                  onclick="event.stopPropagation(); App.toggleDone(${dl.id})">
            ${dl.done ? '↩' : '✓'}
          </button>
          <button class="dc-action-btn" title="Редактировать"
                  onclick="event.stopPropagation(); Modal.open(${dl.id})">✎</button>
          <button class="dc-action-btn danger" title="Удалить"
                  onclick="event.stopPropagation(); App.deleteDeadline(${dl.id})">✕</button>
        </div>
      </div>
    `).join('');
  },

  stats() {
    const total   = deadlines.length;
    const done    = deadlines.filter(d => d.done).length;
    const urgent  = deadlines.filter(d => !d.done && daysLeft(d.date) <= 3).length;
    const avgProg = total
      ? Math.round(deadlines.reduce((s, d) => s + d.progress, 0) / total)
      : 0;

    document.getElementById('stats-cards').innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Всего</div>
        <div class="stat-val">${total}</div>
        <div class="stat-sub">дедлайнов</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Выполнено</div>
        <div class="stat-val" style="color:var(--accent);">${done}</div>
        <div class="stat-sub">${total ? Math.round(done / total * 100) : 0}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Срочных</div>
        <div class="stat-val" style="color:var(--danger);">${urgent}</div>
        <div class="stat-sub">≤ 3 дней</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Ср. прогресс</div>
        <div class="stat-val" style="color:var(--accent2);">${avgProg}%</div>
        <div class="stat-sub">по всем</div>
      </div>`;

    // Heatmap
    const today = new Date();
    const cells = [];
    for (let i = 83; i >= 0; i--) {
      const d  = new Date(today); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const cnt = deadlines.filter(dl => dl.date === ds).length;
      const lvl = cnt === 0 ? 0 : cnt === 1 ? 1 : cnt <= 2 ? 2 : 3;
      cells.push(`<div class="hm-cell hm-${lvl}" title="${ds}: ${cnt} дедлайнов"></div>`);
    }
    document.getElementById('heatmap').innerHTML = cells.join('');

    // По категориям
    const cats = getCategories();
    document.getElementById('cat-breakdown').innerHTML = cats.map(c => {
      const items = deadlines.filter(d => d.category === c);
      const col   = items[0]?.color || '#888';
      const avg   = Math.round(items.reduce((s, d) => s + d.progress, 0) / items.length);
      return `
        <div class="cat-breakdown-item">
          <div class="cat-breakdown-meta">
            <span class="cat-breakdown-name">
              <span style="width:8px;height:8px;border-radius:50%;background:${col};display:inline-block;"></span>
              ${c}
            </span>
            <span class="cat-breakdown-sub">${items.length} зад. · ${avg}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${avg}%;background:${col};"></div>
          </div>
        </div>`;
    }).join('');
  }
};
