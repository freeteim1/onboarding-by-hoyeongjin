import { TodoListAppStyles } from '../models/todo-list-styles.model';
import { TodoListAppOptions, TodoListItem, Utils } from '../types/todo.types';

export default class TodoListApp {
  private _instanceId = `todo-list-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  private options: TodoListAppOptions;

  private defaultLabel = {
    itemCnt: 'items #{} left',
    allItems: 'All',
    activeItems: 'Active',
    completedItems: 'Completed',
    clearCompleted: 'Clear Completed',
    noItems: 'There are no to-do items. Please write your to-dos.',
  };

  private selectedBtn: 'allItems' | 'activeItems' | 'completedItems' | 'clearCompleted' =
    'allItems';

  private data = {
    items: [] as TodoListItem[],
    inputValue: '',
  };

  layouts: {
    root: HTMLDivElement | null;
    ul: HTMLUListElement | null;
    input: HTMLInputElement | null;
    buttonWrapper: HTMLDivElement | null;
    itemCnt: HTMLLabelElement | null;
    allItems: HTMLButtonElement | null;
    activeItems: HTMLButtonElement | null;
    completedItems: HTMLButtonElement | null;
    clearCompleted: HTMLButtonElement | null;
    noItems: HTMLLIElement | null;
  } = {
    root: null,
    ul: null,
    input: null,
    buttonWrapper: null,
    itemCnt: null,
    allItems: null,
    activeItems: null,
    completedItems: null,
    clearCompleted: null,
    noItems: null,
  };

  private todoStyles: TodoListAppStyles;

  get instanceId() {
    return this._instanceId;
  }

  constructor(options: TodoListAppOptions) {
    this.options = options;
    if (!this.options) {
      throw new Error('Options are required');
    }
    if (!this.options.el) {
      throw new Error('Root element is required');
    }
    if (!(this.options.el instanceof HTMLDivElement)) {
      throw new Error('Root element must be a div');
    }
    if (this.options.items) {
      this.data.items = this.options.items;
    }
    this.todoStyles = this.options.styles || new TodoListAppStyles();
  }

  // layout
  render() {
    this.addStyles();
    this.initTodoList();
    this.dispatch();
  }

  addStyles() {
    const styleId = `todo-styles-${this.instanceId}`;
    if (document.getElementById(styleId)) {
      return;
    }
    //
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = this.todoStyles.getStyles(this.instanceId);
    document.head.appendChild(style);
  }

  initTodoList() {
    this.layouts.root = document.createElement('div');
    this.layouts.root.className = `${this.todoStyles.clsNames.root} ${this.instanceId}`;
    this.layouts.input = this.createInputElements(); //TO DO 입력부
    this.layouts.ul = this.createListElements(); //TO DO 목록 출력부
    this.layouts.buttonWrapper = this.createInformationElements(); //TO DO 정보 출력부

    this.layouts.root.appendChild(this.layouts.input);
    this.layouts.root.appendChild(this.layouts.ul);
    this.layouts.root.appendChild(this.layouts.buttonWrapper);
    this.options.el.appendChild(this.layouts.root);
  }

  createInputElements() {
    const input = this.createInput(
      (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.data.inputValue = value;
      },
      (e) => {
        if (e.key === 'Enter' && this.data.inputValue.trim()) {
          this.addItem();
          (e.target as HTMLInputElement).value = '';
          this.data.inputValue = '';
        }
      },
    );
    return input;
  }

  createListElements() {
    const ul = this.createUl((e) => {
      const checked = (e.target as HTMLInputElement).checked;
      const item = this.data.items.find(
        (i) => i.id.toString() === (e.target as HTMLInputElement).value,
      );
      if (item) {
        item.isChecked = checked;
      }
      this.dispatch();
    });
    return ul;
  }

  createInformationElements() {
    const wrapper = document.createElement('div');
    const panel = document.createElement('div');
    const { allItems, activeItems, completedItems, clearCompleted } = this.defaultLabel;
    wrapper.className = this.todoStyles.clsNames.buttonWrapper;
    panel.className = this.todoStyles.clsNames.buttonPanel;

    this.layouts.itemCnt = this.createPanelLabel(
      panel,
      Utils.replaceItemCnt(this.defaultLabel.itemCnt, this.data.items.length),
    );
    this.layouts.allItems = this.createPanelButton(panel, allItems, () => {
      this.selectedBtn = 'allItems';
      this.dispatch();
    });
    this.layouts.activeItems = this.createPanelButton(panel, activeItems, () => {
      this.selectedBtn = 'activeItems';
      this.dispatch();
    });
    this.layouts.completedItems = this.createPanelButton(panel, completedItems, () => {
      this.selectedBtn = 'completedItems';
      this.dispatch();
    });
    this.layouts.clearCompleted = this.createPanelButton(panel, clearCompleted, () => {
      this.selectedBtn = 'clearCompleted';
      this.dispatch();
    });
    wrapper.appendChild(panel);
    return wrapper;
  }

  createUl(onChange?: (e: Event) => void) {
    const ul = document.createElement('ul');
    ul.className = this.todoStyles.clsNames.ul;
    if (onChange) {
      ul.addEventListener('change', onChange);
    }
    return ul;
  }

  createInput(onInput?: (e: Event) => void, onKeyPress?: (e: KeyboardEvent) => void) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = this.todoStyles.clsNames.input;
    input.placeholder = this.options.placeholder || 'What needs to be done?';
    if (onInput) {
      input.addEventListener('input', onInput);
    }
    if (onKeyPress) {
      input.addEventListener('keypress', onKeyPress);
    }
    return input;
  }

  createPanelButton(parent: HTMLDivElement, text: string, onClick?: (e: Event) => void) {
    const button = document.createElement('button');
    button.innerText = text;
    parent.appendChild(button);
    if (onClick) {
      button.addEventListener('click', (e) => onClick(e));
    }
    return button;
  }

  createPanelLabel(parent: HTMLDivElement, text: string) {
    const label = document.createElement('label');
    label.innerText = text;
    parent.appendChild(label);
    return label;
  }

  createLi(clsName: string) {
    const li = document.createElement('li');
    li.className = clsName;
    return li;
  }

  createRow(item: TodoListItem) {
    const { id, label, isChecked } = item;
    const li = this.createLi(`${this.todoStyles.clsNames.li} ${isChecked ? 'checked' : ''}`);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;
    checkbox.value = id.toString();
    const lb = document.createElement('label');
    lb.className = this.todoStyles.clsNames.label;
    lb.innerText = label;
    li.appendChild(checkbox);
    li.appendChild(lb);
    return li;
  }

  createNoItems() {
    const li = this.createLi(`${this.todoStyles.clsNames.li} ${this.todoStyles.clsNames.noItems}`);
    li.innerText = this.defaultLabel.noItems;
    return li;
  }

  addItem() {
    const newItem: TodoListItem = {
      id: `todo-li-${Date.now()}`,
      label: this.data.inputValue,
      isChecked: false,
      createDt: Date.now(),
    };
    this.data.items.push(newItem);
    this.dispatch();
  }

  dispatch(initialItems?: TodoListItem[]) {
    let items = initialItems || this.data.items;
    switch (this.selectedBtn) {
      case 'allItems':
      default:
        break;
      case 'activeItems':
        items = items.filter((i) => !i.isChecked);
        break;
      case 'completedItems':
        items = items.filter((i) => i.isChecked);
        break;
      case 'clearCompleted':
        this.data.items = this.data.items.map((i) => ({ ...i, isChecked: false }));
        items = this.data.items;
        break;
    }
    this.renderItems(items);
    this.renderItemCnt(items);
  }

  private renderItems(items: TodoListItem[]) {
    let itemsHTML: HTMLLIElement[] = [];
    if (items.length === 0) {
      const noItems = this.createNoItems();
      itemsHTML = [noItems];
    } else {
      itemsHTML = items
        .sort((a, b) => a.createDt - b.createDt)
        .sort((a, b) => Number(a.isChecked) - Number(b.isChecked))
        .map((item) => this.createRow(item));
    }

    if (this.layouts.ul) {
      this.layouts.ul.innerHTML = '';
      itemsHTML.forEach((li) => this.layouts.ul?.appendChild(li));
    }
  }

  private renderItemCnt(items: TodoListItem[]) {
    if (!this.layouts.itemCnt) return;
    this.layouts.itemCnt.innerText = Utils.replaceItemCnt(this.defaultLabel.itemCnt, items.length);
  }
}
