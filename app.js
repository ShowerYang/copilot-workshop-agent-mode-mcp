// 待辦清單使用原生 JavaScript，並以 localStorage 保存資料。
const STORAGE_KEY = 'todo-list-items';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');

let todos = loadTodos();

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

// 依照資料重新繪製清單與未完成數量。
function render() {
  list.replaceChildren();

  todos.forEach((todo) => {
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

  emptyState.hidden = todos.length > 0;
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
