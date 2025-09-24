
import { TodoListAppDnDElements } from '../components/todo-list-elements-dnd.components';
import { TodoListAppElements } from '../components/todo-list-elements.components';
import { TodoListAppStyles } from '../components/todo-list-styles.components';
import {
  DEFAULT_LABEL,
  TodoDndPayload,
  TodoListAppOptions,
  TodoListItem,
  Utils,
} from '../types/todo.types';

export default class TodoListApp {
  private _instanceId = `todo-list-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  private defaultLabel = DEFAULT_LABEL;

  get instanceId() {
    return this._instanceId;
  }
  set instanceId(value) {
    this._instanceId = value;
  }

  private _todoStyles!: TodoListAppStyles;

  get todoStyles() {
    return this._todoStyles;
  }
  set todoStyles(value) {
    this._todoStyles = value;
  }
  private _elements!: TodoListAppElements;

  get elements() {
    return this._elements;
  }
  set elements(value) {
    this._elements = value;
  }

  private _options!: TodoListAppOptions;

  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value;
  }

  private _selectedBtn: 'allItems' | 'activeItems' | 'completedItems' | 'clearCompleted' =
    'allItems';

  get selectedBtn() {
    return this._selectedBtn;
  }
  set selectedBtn(value) {
    this._selectedBtn = value;
  }

  private _data = {
    items: [] as TodoListItem[],
    inputValue: '',
    originItems: [] as TodoListItem[],
  };
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
  }

  private _layouts: {
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

  get layouts() {
    return this._layouts;
  }
  set layouts(value) {
    this._layouts = value;
  }
  eventStream = ({ type, payload }: { type: string; payload?: any }) => {
    switch (type) {
      case 'input':
        this.data.inputValue = payload as string;
        break;
      case 'check':
        {
          this.data.originItems = this.data.originItems.map((i) => {
            if (i.id === (payload as TodoListItem).id) {
              return { ...i, isChecked: (payload as TodoListItem).isChecked };
            }
            return i;
          });
          this.dispatch();
        }
        break;
      case 'allItems': {
        this.selectedBtn = 'allItems';
        this.dispatch();
        break;
      }
      case 'activeItems': {
        this.selectedBtn = 'activeItems';
        this.dispatch();
        break;
      }
      case 'completedItems': {
        this.selectedBtn = 'completedItems';
        this.dispatch();
        break;
      }
      case 'clearCompleted': {
        this.selectedBtn = 'clearCompleted';
        this.dispatch();
        break;
      }
      case 'addItem': {
        if (this.data.inputValue.trim()) {
          this.addItem();
          this.data.inputValue = '';
        }
        break;
      }
      case 'dragstart': {
        console.log('dragstart', payload);
        break;
      }
      case 'drop': {
        const { start, end } = payload as TodoDndPayload;
        const startIndex = this.data.items.findIndex((el) => {
          return el.id.split('-')[2] === start.split('-')[2];
        });
        const endIndex = this.data.items.findIndex(
          (el) => el.id.split('-')[2] === end.split('-')[2],
        );
        this.data.items = this.moveItem(this.data.items, startIndex, endIndex);
        this.dispatch();
        break;
      }
    }
  };

  moveItem(arr: TodoListItem[], fromIndex: number, toIndex: number) {
    const newArr = [...arr];
    const [item] = newArr.splice(fromIndex, 1);
    if (!item) {
      return arr;
    }
    newArr.splice(toIndex, 0, item);
    return newArr;
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
    if (this.options.defaultLabel) {
      this.defaultLabel = {
        ...DEFAULT_LABEL,
        ...this.options.defaultLabel,
      };
    }

    this.todoStyles = this.options.styles || new TodoListAppStyles();

    this.elements = new TodoListAppElements(this.options, this.todoStyles, this.eventStream);
    if (this.options.useDnd) {
      this.elements = new TodoListAppDnDElements(this.options, this.todoStyles, this.eventStream);
      if (this.elements instanceof TodoListAppDnDElements) {
        this.elements.draggable(`.${this.todoStyles.clsNames.li}`);
        this.elements.dropzone(`ul.${this.todoStyles.clsNames.ul}`);
      }
    }
  }

  // layout
  render() {
    this.todoStyles.addStyles(this.instanceId);
    this.initTodoList();
    this.dispatch();
  }

  initTodoList() {
    this.layouts.root = document.createElement('div');
    this.layouts.root.className = `${this.todoStyles.clsNames.root} ${this.instanceId}`;
    this.layouts.input = this.elements.createInputElements(); //TO DO 입력부
    this.layouts.ul = this.elements.createListElements(); //TO DO 목록 출력부
    const {
      wrapper,
      panel,
      elItemCnt,
      elAllItems,
      elActiveItems,
      elCompletedItems,
      elClearCompleted,
    } = this.elements.createToolboxElements(); //TO DO 정보 출력부

    this.layouts.buttonWrapper = wrapper;
    this.layouts.itemCnt = elItemCnt;
    this.layouts.allItems = elAllItems;
    this.layouts.activeItems = elActiveItems;
    this.layouts.completedItems = elCompletedItems;
    this.layouts.clearCompleted = elClearCompleted;

    this.layouts.buttonWrapper.appendChild(this.layouts.itemCnt);
    this.layouts.buttonWrapper.appendChild(panel);
    this.layouts.buttonWrapper.appendChild(this.layouts.clearCompleted);
    this.layouts.root.appendChild(this.layouts.input);
    this.layouts.root.appendChild(this.layouts.ul);
    this.layouts.root.appendChild(this.layouts.buttonWrapper);
    this.options.el.appendChild(this.layouts.root);
  }

  addItem() {
    const newItem: TodoListItem = {
      // id: `todo-li-${Date.now()}`,
      id: Date.now().toString(),
      label: this.data.inputValue,
      isChecked: false,
      createDt: Date.now(),
    };
    this.data.originItems.push(newItem);
    this.data.items = [...this.data.originItems];
    this.dispatch();
  }

  dispatch(initialItems?: TodoListItem[]) {
    // let items = initialItems || this.data.items;
    let items = initialItems || [...this.data.originItems];
    switch (this.selectedBtn) {
      case 'allItems':
      default:
        break;
      case 'activeItems':
        // items = items.filter((i) => !i.isChecked);
        items = [...this.data.originItems.filter((i) => !i.isChecked)];
        break;
      case 'completedItems':
        // items = items.filter((i) => i.isChecked);
        items = [...this.data.originItems.filter((i) => i.isChecked)];
        break;
      case 'clearCompleted':
        this.data.originItems = this.data.originItems.filter((i) => {
          return !i.isChecked;
        });
        items = this.data.originItems;
        break;
    }
    this.renderItems(items);
    this.renderItemCnt(this.data.originItems);
  }

  private renderItems(items: TodoListItem[]) {
    let itemsHTML: HTMLLIElement[] = [];
    if (items.length === 0) {
      const noItems = this.elements.createNoItems();
      itemsHTML = [noItems];
    } else {
      this.data.items = items
        .sort((a, b) => b.createDt - a.createDt)
        .sort((a, b) => Number(a.isChecked) - Number(b.isChecked));
      // .map((item) => this.elements.createRow(item));
    }
    itemsHTML = this.data.items.map((item) => this.elements.createRow(item));
    if (this.layouts.ul) {
      this.layouts.ul.innerHTML = '';
      itemsHTML.forEach((li) => this.layouts.ul?.appendChild(li));
    }
  }

  private renderItemCnt(items: TodoListItem[]) {
    if (!this.layouts.itemCnt) return;
    this.layouts.itemCnt.textContent = Utils.replaceItemCnt(
      this.defaultLabel.itemCnt,
      items.length,
    );
  }
}
