import { TodoListAppLayouts } from 'src/types/todo.types';

export class TodoListAppStyles {
  // clsNames: TodoListAppLayouts = {
  //   root: `todo-list-parent`,
  //   ul: 'todo-list',
  //   li: 'todo-item',
  //   input: 'todo-input',
  //   label: 'todo-label',
  //   buttonWrapper: 'todo-button-wrapper',
  //   buttonPanel: 'todo-button-panel',
  //   noItems: 'todo-no-items',
  // };
  clsNames: TodoListAppLayouts = {
    root: `todo`,
    input: 'todo__input',
    ul: 'todo__list',
    li: 'todo__item',
    checkbox: 'todo__checkbox',
    label: 'todo__label',
    buttonWrapper: 'todo__controls',
    buttonPanel: 'todo__panel',
    count: 'todo__count',
    filter: 'todo__filter',
    clear: 'todo__clear',
    noItems: 'todo__list__no-items',
  };

  rootStyle = `.${this.clsNames.root} {
    max-width: 480px;
    margin: 0 auto;
    background: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }`;

  inputStyle = `.${this.clsNames.input} {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 16px;
    background: var(--surface);
    color: var(--text);
    box-sizing: border-box;
  }`;

  ulStyle = `.${this.clsNames.ul} {
    list-style: none;
    padding: 0;
  }`;

  liStyle = `.${this.clsNames.li} {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    background: var(--surface);
    border-bottom: 1px solid var(--border-light);
  }`;

  checkboxStyle = `.${this.clsNames.checkbox} {
    width: 18px;
    height: 18px;
    margin-right: 12px;
    cursor: pointer;
  }`;

  labelStyle = `.${this.clsNames.label} {
    flex: 1;
    cursor: pointer;
    user-select: none;
    color: var(--text);
  }`;

  buttonWrapperStyle = `.${this.clsNames.buttonWrapper} {
    display: flex;
    border-top: 1px solid var(--border);
    align-items: center;
    padding: 2px 12px;
    background: var(--surface);
  }`;

  buttonPanelStyle = `.${this.clsNames.buttonPanel} {
    width: 50%;
    display: inline-block;
  }`;

  btnCntStyle = `.${this.clsNames.count} {
    width: 20%;
    font-size: 14px;
    color: #666;
  }`;

  btnFilterStyle = `.${this.clsNames.filter} {
    margin: 0 4px;
    padding: 4px 8px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }`;

  btnClearStyle = `.${this.clsNames.clear} {
    margin: 0 8px;
    display: inline-block;
    width: 30%;
    padding: 4px 8px;
    border: 1px solid var(--danger);
    background: var(--surface);
    color: var(--danger);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }`;

  draggableStyles = `.useDnD {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
  }`;

  getStyles(instanceId: string) {
    return `
      .${instanceId}${this.rootStyle}
      .${instanceId} ${this.inputStyle}
      .${instanceId} ${this.ulStyle}
      .${instanceId} ${this.liStyle}
      .${instanceId} ${this.checkboxStyle}
      .${instanceId} ${this.labelStyle}
      .${instanceId} ${this.buttonWrapperStyle}
      .${instanceId} ${this.buttonPanelStyle}
      .${instanceId} ${this.btnCntStyle}
      .${instanceId} ${this.btnFilterStyle}
      .${instanceId} ${this.btnClearStyle}
      .${instanceId} ${this.draggableStyles}
    `;
  }

  addStyles(instanceId: string) {
    const styleId = `todo-styles-${instanceId}`;
    if (document.getElementById(styleId)) {
      return;
    }
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = this.getStyles(instanceId);
    document.head.appendChild(style);
  }
}
