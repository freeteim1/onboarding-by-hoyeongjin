
import { TodoListAppStyles } from './components/todo-list-styles.components';
import './index.css';
import TodoListApp from './todo-list/todo-list';

(function () {
  try {
    firstRender().render();
    // secondRender().render();
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
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      background: skyblue;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }`;
  styles.liStyle = `{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      background: lightyellow;
    }`;
  styles.panelBtnStyle = `{
      border: 1px solid #ddd;
      background: gray;
      cursor: pointer;
      transition: background-color 0.2s;
    }`;

  const todoListApp2 = new TodoListApp({
    el: root as HTMLDivElement,
    styles: styles,
  });
  return todoListApp2;
}
