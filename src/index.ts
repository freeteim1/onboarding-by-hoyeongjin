import { TodoListAppStyles } from './components/todo-list-styles.components';
import './index.css';
import TodoListApp from './todo-list/todo-list';

(function () {
  try {
    firstRender().render();
    secondRender().render();
  } catch (e) {
    console.error('Error initializing TodoListApp:', e);
  }
})();

function firstRender() {
  const root = document.getElementById('app');
  const todoListApp = new TodoListApp({
    el: root as HTMLDivElement,
    useDnd: true,
  });
  return todoListApp;
}

function secondRender() {
  const root = document.getElementById('app2');
  const styles = new TodoListAppStyles();

  styles.rootStyle = `{
    max-width: 480px;
    margin: 0 auto;
    background: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }`;

  styles.liStyle = `{
    display: flex;
    align-items: center;
    padding: 6px 12px;
    background: pink;
    border-bottom: 1px solid var(--border-light);
  }`;

  styles.btnFilterStyle = `{
    margin: 0 4px;
    padding: 4px 8px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
   }`;

  const todoListApp2 = new TodoListApp({
    el: root as HTMLDivElement,
    styles: styles,
    useDnd: true,
  });
  return todoListApp2;
}
