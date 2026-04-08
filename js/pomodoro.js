/* js/pomodoro.js — таймер Помодоро */

const Pom = (() => {
  let running  = false;
  let seconds  = 25 * 60;
  let total    = 25 * 60;
  let session  = 1;
  let onBreak  = false;
  let interval = null;
  let taskName = 'Выберите задачу →';

  function tick() {
    seconds--;
    if (seconds <= 0) {
      clearInterval(interval);
      running = false;

      if (!onBreak) {
        // Переход на перерыв
        session++;
        onBreak  = true;
        seconds  = 5 * 60;
        total    = 5 * 60;
        document.getElementById('pom-label').textContent = 'Перерыв';
        document.getElementById('pom-session').textContent = `Перерыв`;
      } else {
        // Обратно к работе
        onBreak  = false;
        seconds  = 25 * 60;
        total    = 25 * 60;
        document.getElementById('pom-label').textContent = 'Фокус';
        document.getElementById('pom-session').textContent = `Сессия ${session}`;
      }

      document.getElementById('pom-start-btn').textContent = 'Старт';
    }
    updateUI();
  }

  function updateUI() {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    document.getElementById('pom-time').textContent =
      `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    const pct = (seconds / total) * 100;
    const fill = document.getElementById('pom-fill');
    fill.style.width = pct + '%';
    fill.style.background = onBreak ? '#BA7517' : '#378ADD';

    document.title = running
      ? `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} — 0w0 Tracker`
      : '0w0 Deadline Tracker';
  }

  return {
    toggle() {
      running = !running;
      const btn = document.getElementById('pom-start-btn');
      if (running) {
        interval = setInterval(tick, 1000);
        btn.textContent = 'Пауза';
      } else {
        clearInterval(interval);
        btn.textContent = 'Продолжить';
      }
    },

    reset() {
      clearInterval(interval);
      running  = false;
      onBreak  = false;
      seconds  = 25 * 60;
      total    = 25 * 60;
      document.getElementById('pom-start-btn').textContent = 'Старт';
      document.getElementById('pom-label').textContent = 'Фокус';
      document.getElementById('pom-session').textContent = `Сессия ${session}`;
      document.title = '0w0 Deadline Tracker';
      updateUI();
    },

    setTask(name) {
      taskName = name;
      document.getElementById('pom-task').textContent = name;
    }
  };
})();
