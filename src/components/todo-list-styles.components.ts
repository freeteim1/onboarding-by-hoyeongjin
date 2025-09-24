import { TodoListAppLayouts } from 'src/types/todo.types';

export class TodoListAppStyles {
  rootStyle = `{
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }`;

  inputStyle = `{
    width: 100%;
    padding: 12px;
    border: 1px solid blue;
    border-radius: 4px;
    box-sizing: border-box;
    font-weight: bold;
  }`;

  ulStyle = `{
    list-style: none;
    padding: 0;
    margin: 0;
  }`;

  liStyle = `{
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #eee;
  }`;

  labelStyle = `{
    margin-left: 8px;
    flex: 1;
    cursor: pointer;
  }`;

  buttonWrapperStyle = `{
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }`;

  buttonPanelStyle = `{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
  }`;

  panelBtnStyle = `{
    padding: 6px;
    border: 0px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
  }`;

  panelLabelStyle = `{
    font-size: 14px;
    color: #666;
  }`;

  otherStyles = `{
    li.checked label {
      text-decoration: line-through;
      color: #999;
    }
  }`;

  draggableStyles = `{
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
  }`;

  clsNames: TodoListAppLayouts = {
    root: `todo-list-parent`,
    ul: 'todo-list',
    li: 'todo-item',
    input: 'todo-input',
    label: 'todo-label',
    buttonWrapper: 'todo-button-wrapper',
    buttonPanel: 'todo-button-panel',
    noItems: 'todo-no-items',
  };

  getStyles(instanceId: string) {
    return `
      .${this.clsNames.root}.${instanceId} ${this.rootStyle}
      .${this.clsNames.root}.${instanceId} .${this.clsNames.input} ${this.inputStyle}
      .${this.clsNames.root}.${instanceId} .${this.clsNames.ul} ${this.ulStyle}
      .${this.clsNames.root}.${instanceId} .${this.clsNames.li} ${this.liStyle}
      .${this.clsNames.root}.${instanceId} .${this.clsNames.label} ${this.labelStyle}
      .${this.clsNames.root}.${instanceId} .${this.clsNames.buttonWrapper} ${this.buttonWrapperStyle}
      .${this.clsNames.root}.${instanceId} .${this.clsNames.buttonWrapper} .${this.clsNames.buttonPanel} ${this.buttonPanelStyle}
      .${this.clsNames.root}.${instanceId} .${this.clsNames.buttonWrapper} .${this.clsNames.buttonPanel} button ${this.panelBtnStyle}
      .${this.clsNames.root}.${instanceId} .${this.clsNames.buttonWrapper} .${this.clsNames.buttonPanel} label ${this.panelLabelStyle}
      .${this.clsNames.root}.${instanceId} ${this.otherStyles}
      .${this.clsNames.root}.${instanceId} .draggable ${this.draggableStyles}
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
