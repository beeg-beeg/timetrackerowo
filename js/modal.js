/* js/modal.js — модальное окно добавления/редактирования */

const Modal = (() => {
  let editingId     = null;
  let selectedColor = COLORS[0];

  function buildColorPicker() {
    document.getElementById('color-picker').innerHTML = COLORS.map(c => `
      <div class="color-opt ${c === selectedColor ? 'sel' : ''}"
           style="background:${c};"
           onclick="Modal.pickColor('${c}')"></div>
    `).join('');
  }

  return {
    open(id) {
      editingId = id || null;
      const dl = id ? deadlines.find(d => d.id === id) : null;

      document.getElementById('modal-title').textContent = id ? 'Редактировать' : 'Новый дедлайн';
      document.getElementById('f-title').value    = dl ? dl.title    : '';
      document.getElementById('f-date').value     = dl ? dl.date     : new Date().toISOString().split('T')[0];
      document.getElementById('f-category').value = dl ? dl.category : '';
      document.getElementById('f-progress').value = dl ? dl.progress : 0;
      document.getElementById('f-prog-val').textContent = (dl ? dl.progress : 0) + '%';
      document.getElementById('f-notes').value    = dl ? dl.notes    : '';
      document.getElementById('f-title').classList.remove('error');

      selectedColor = dl ? dl.color : COLORS[0];
      buildColorPicker();

      document.getElementById('modal').classList.add('open');
      setTimeout(() => document.getElementById('f-title').focus(), 50);
    },

    close() {
      document.getElementById('modal').classList.remove('open');
      editingId = null;
    },

    overlayClick(e) {
      if (e.target === document.getElementById('modal')) this.close();
    },

    pickColor(c) {
      selectedColor = c;
      buildColorPicker();
    },

    save() {
      const titleEl = document.getElementById('f-title');
      const title   = titleEl.value.trim();
      if (!title) {
        titleEl.classList.add('error');
        titleEl.focus();
        return;
      }
      titleEl.classList.remove('error');

      const data = {
        title,
        date:     document.getElementById('f-date').value,
        category: document.getElementById('f-category').value.trim(),
        color:    selectedColor,
        progress: parseInt(document.getElementById('f-progress').value),
        notes:    document.getElementById('f-notes').value.trim(),
      };

      if (editingId) {
        const i = deadlines.findIndex(d => d.id === editingId);
        deadlines[i] = { ...deadlines[i], ...data };
      } else {
        deadlines.push({ ...data, id: Date.now(), done: false, created: Date.now() });
      }

      DB.save(deadlines);
      this.close();
      Render.list();
      App.updateSidebar();
    }
  };
})();

// Глобальный ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') Modal.close();
});
