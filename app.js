// 待辦清單使用原生 JavaScript，並以 localStorage 保存資料。
const STORAGE_KEY = 'todo-list-items';
const THEME_STORAGE_KEY = 'todo-list-theme';
const FILTER_STORAGE_KEY = 'todo-list-filter';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const themeToggle = document.getElementById('theme-toggle');
const filterButtons = document.querySelectorAll('.btn-filter');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

let todos = loadTodos();
let activeFilter = loadSavedFilter();
let savedTheme = loadSavedTheme();

// 僅接受支援的篩選值，避免無效資料造成清單顯示錯誤。
function loadSavedFilter() {
  try {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    return ['all', 'active', 'completed'].includes(saved) ? saved : 'all';
  } catch (error) {
    console.error('讀取篩選設定失敗。', error);
    return 'all';
  }
}

// 使用手動選擇的主題，否則依照作業系統的外觀設定。
function loadSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch (error) {
    console.error('讀取主題設定失敗。', error);
    return null;
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeToggle.textContent = isDark ? '☀️ 淺色模式' : '🌙 深色模式';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

applyTheme(savedTheme || (systemTheme.matches ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  savedTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem(THEME_STORAGE_KEY, savedTheme);
  } catch (error) {
    console.error('儲存主題設定失敗。', error);
  }
  applyTheme(savedTheme);
});

systemTheme.addEventListener('change', (event) => {
  if (!savedTheme) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

// 從瀏覽器讀取資料，並排除格式不正確的項目。
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((todo) =>
      todo &&
      typeof todo.id === 'string' &&
      typeof todo.text === 'string' &&
      typeof todo.completed === 'boolean'
    );
  } catch (error) {
    console.error('讀取待辦清單失敗。', error);
    return [];
  }
}

// 將目前的待辦清單保存至瀏覽器。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 依照目前篩選條件繪製清單，並更新整份清單的未完成數量。
function render() {
  list.replaceChildren();

  const visibleTodos = todos.filter((todo) => {
    if (activeFilter === 'active') {
      return !todo.completed;
    }
    if (activeFilter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'todo-item completed' : 'todo-item';
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.className = 'todo-checkbox';
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記「${todo.text}」為完成`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-delete';
    deleteButton.type = 'button';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = visibleTodos.length > 0;
  if (todos.length === 0) {
    emptyState.textContent = '還沒有任何待辦事項,新增一個吧!';
  } else if (activeFilter === 'active') {
    emptyState.textContent = '目前沒有未完成的待辦事項；其他項目仍在清單中，切換至「全部」即可查看。';
  } else if (activeFilter === 'completed') {
    emptyState.textContent = '目前沒有已完成的待辦事項；其他項目仍在清單中，切換至「全部」即可查看。';
  } else {
    emptyState.textContent = '還沒有任何待辦事項,新增一個吧!';
  }

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
}

// 為新增的待辦事項建立唯一識別碼。
function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    return;
  }

  todos.push({ id: createId(), text, completed: false });
  saveTodos();
  render();
  input.value = '';
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, activeFilter);
    } catch (error) {
      console.error('儲存篩選設定失敗。', error);
    }
    render();
  });
});

list.addEventListener('change', (event) => {
  if (!event.target.matches('.todo-checkbox')) {
    return;
  }

  const item = event.target.closest('.todo-item');
  if (!item) {
    return;
  }

  todos = todos.map((todo) =>
    todo.id === item.dataset.id
      ? { ...todo, completed: event.target.checked }
      : todo
  );
  saveTodos();
  render();
});

list.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.btn-delete');
  if (!deleteButton) {
    return;
  }

  const item = deleteButton.closest('.todo-item');
  if (!item) {
    return;
  }

  todos = todos.filter((todo) => todo.id !== item.dataset.id);
  saveTodos();
  render();
});

render();
