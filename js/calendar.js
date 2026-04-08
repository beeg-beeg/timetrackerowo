/* js/calendar.js — вид календаря */

const Cal = (() => {
  let year  = new Date().getFullYear();
  let month = new Date().getMonth();

  function render() {
    const label = new Date(year, month).toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
    document.getElementById('cal-month-label').textContent = label;

    // Заголовки дней
    const headerEl = document.getElementById('cal-days-header');
    headerEl.innerHTML = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
      .map(d => `<div class="cal-header">${d}</div>`).join('');

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    let startDow = first.getDay();
    if (startDow === 0) startDow = 7;

    // Заполняем ячейки
    const cells = [];
    for (let i = 1; i < startDow; i++) {
      cells.push({ day: new Date(year, month, 1 - startDow + i).getDate(), current: false, date: new Date(year, month, 1 - startDow + i) });
    }
    for (let i = 1; i <= last.getDate(); i++) {
      cells.push({ day: i, current: true, date: new Date(year, month, i) });
    }
    while (cells.length % 7 !== 0) {
      const extra = cells.length - last.getDate() - startDow + 2;
      cells.push({ day: new Date(year, month + 1, extra).getDate(), current: false, date: new Date(year, month + 1, extra) });
    }

    const el = document.getElementById('cal-days');
    el.innerHTML = cells.map(c => {
      const ds     = c.date.toISOString().split('T')[0];
      const isToday = c.current && c.date.getTime() === today.getTime();
      const hasDl   = deadlines.some(d => d.date === ds);
      return `<div class="cal-day ${isToday ? 'today' : ''} ${!c.current ? 'other-month' : ''} ${hasDl && !isToday ? 'has-deadline' : ''} ${hasDl && isToday ? 'has-deadline' : ''}">${c.day}</div>`;
    }).join('');

    // Список дедлайнов месяца
    const monthDls = deadlines
      .filter(d => { const dt = new Date(d.date); return dt.getFullYear() === year && dt.getMonth() === month; })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const listEl = document.getElementById('cal-month-list');
    if (!monthDls.length) {
      listEl.innerHTML = '<div style="font-size:13px;color:var(--hint);">Нет дедлайнов в этом месяце</div>';
    } else {
      listEl.innerHTML = monthDls.map(dl => `
        <div class="cal-month-item">
          <div class="cal-month-dot" style="background:${dl.color};"></div>
          <span style="flex:1;">${dl.title}</span>
          <span style="font-size:12px;color:var(--muted);margin-right:8px;">${new Date(dl.date).toLocaleDateString('ru-RU',{day:'numeric',month:'short'})}</span>
          ${daysBadge(dl)}
        </div>
      `).join('');
    }
  }

  return {
    render,
    prev() { month--; if (month < 0)  { month = 11; year--; } render(); },
    next() { month++; if (month > 11) { month = 0;  year++; } render(); }
  };
})();
