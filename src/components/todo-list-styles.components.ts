import { TodoListAppLayouts } from 'src/types/todo.types';

export class TodoListAppStyles {
  clsNames: TodoListAppLayouts = {
    root: `todo`,
    input: 'todo__input',
    ul: 'todo__list',
    li: 'todo__item',
    checkbox: 'todo__checkbox',
    label: 'todo__label',
    buttonWrapper: 'todo__controls',
    buttonPack: 'todo__package',
    count: 'todo__count',
    filter: 'todo__filter',
    clear: 'todo__clear',
    noItems: 'todo__list__no-items',
  };

  rootStyle = `{
    max-width: 480px;
    margin: 0 auto;
    background: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }`;

  inputStyle = `{
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 16px;
    background: var(--surface);
    color: var(--text);
    box-sizing: border-box;
  }`;

  ulStyle = `{
    list-style: none;
    padding: 0;
  }`;

  liStyle = `{
    display: flex;
    align-items: center;
    padding: 6px 12px;
    background: var(--surface);
    border-bottom: 1px solid var(--border-light);
  }`;

  checkboxStyle = `{
    width: 18px;
    height: 18px;
    margin-right: 12px;
    cursor: pointer;
  }`;

  labelStyle = `{
    flex: 1;
    cursor: pointer;
    user-select: none;
    color: var(--text);
  }`;

  buttonWrapperStyle = `{
    position: relative;
    display: flex;
    border-top: 1px solid var(--border);
    align-items: center;
    padding: 2px 12px;
    background: var(--surface);
  }`;

  buttonPackStyle = `{
    display: inline-block;
  }`;

  btnCntStyle = `{
    width: 20%;
    font-size: 14px;
    color: #666;
  }`;

  btnFilterStyle = `{
    margin: 0 4px;
    padding: 4px 8px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }`;

  divClearStyle = `{
    position: absolute;
    right: 0px;
  }`;

  btnClearStyle = `{
    margin: 0 8px;
    display: inline-block;
    padding: 4px;
    border: 1px solid var(--danger);
    background: var(--surface);
    color: var(--danger);
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
  }`;

  draggableStyles = `.useDnD {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
  }
  .todo-dnd-underline {
    border-top: 2px solid purple !important;
  }`;

  getRootStyle() {
    return `.${this.clsNames.root} ${this.rootStyle}`;
  }

  getInputStyle() {
    return `.${this.clsNames.input} ${this.inputStyle}`;
  }
  getUlStyle() {
    return `.${this.clsNames.ul} ${this.ulStyle}`;
  }
  getLiStyle() {
    return `.${this.clsNames.li} ${this.liStyle}`;
  }
  getCheckboxStyle() {
    return `.${this.clsNames.checkbox} ${this.checkboxStyle}`;
  }
  getLabelStyle() {
    return `.${this.clsNames.label} ${this.labelStyle}`;
  }
  getButtonWrapperStyle() {
    return `.${this.clsNames.buttonWrapper} ${this.buttonWrapperStyle}`;
  }
  getButtonPackStyle() {
    return `.${this.clsNames.buttonPack} ${this.buttonPackStyle}`;
  }
  getBtnCntStyle() {
    return `.${this.clsNames.count} ${this.btnCntStyle}`;
  }
  getBtnFilterStyle() {
    return `.${this.clsNames.filter} ${this.btnFilterStyle}`;
  }
  getActiveFilterBtnStyle() {
    return `.${this.clsNames.filter} ${this.btnFilterStyle}.active {
      border-color: var(--danger) !important;
    }`;
  }
  getDivClearStyle() {
    return `.${this.clsNames.clear} ${this.divClearStyle}`;
  }
  getBtnClearStyle() {
    return `.${this.clsNames.clear} button ${this.btnClearStyle}`;
  }

  getDraggableStyles() {
    return this.draggableStyles;
  }

  getStyles(instanceId: string) {
    return `
      .${instanceId}${this.getRootStyle()}
      .${instanceId} ${this.getInputStyle()}
      .${instanceId} ${this.getUlStyle()}
      .${instanceId} ${this.getLiStyle()}
      .${instanceId} ${this.getCheckboxStyle()}
      .${instanceId} ${this.getLabelStyle()}
      .${instanceId} ${this.getButtonWrapperStyle()}
      .${instanceId} ${this.getButtonPackStyle()}
      .${instanceId} ${this.getBtnCntStyle()}
      .${instanceId} ${this.getBtnFilterStyle()}
      .${instanceId} ${this.getActiveFilterBtnStyle()}
      .${instanceId} ${this.getDivClearStyle()}
      .${instanceId} ${this.getBtnClearStyle()}
      .${instanceId} ${this.getDraggableStyles()}
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
