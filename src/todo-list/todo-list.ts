import { TodoListRenderer } from 'src/models/todo-list.interface';
import { TodoListAppDnDElements } from '../components/todo-list-elements-dnd.components';
import { TodoListAppElements } from '../components/todo-list-elements.components';
import { TodoListAppStyles } from '../components/todo-list-styles.components';
import {
  BUTTON_TYPES,
  DEFAULT_LABEL,
  EVENT_BUS_TYPES,
  EventBusType,
  SelectBtnType,
  TodoDndPayload,
  TodoListAppOptions,
  TodoListItem,
  Utils,
} from '../types/todo.types';

export default class TodoListApp implements TodoListRenderer {
  private _instanceId = `todo-list-${Utils.createRandomKey(8)}`;
  private _defaultLabel = DEFAULT_LABEL;

  get defaultLabel() {
    return this._defaultLabel;
  }

  set defaultLabel(value) {
    this._defaultLabel = value;
  }

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

  private _selectedBtn: SelectBtnType = 'allItems';

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
    clearCompleted: HTMLDivElement | null;
    noItems: HTMLLIElement | null;
    buttonPack: HTMLDivElement | null;
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
    buttonPack: null,
  };

  get layouts() {
    return this._layouts;
  }
  set layouts(value) {
    this._layouts = value;
  }

  eventBus = ({ type, payload }: EventBusType) => {
    switch (type) {
      case EVENT_BUS_TYPES.INPUT:
        this.data.inputValue = payload as string;
        break;
      case EVENT_BUS_TYPES.CHECK:
        {
          this.data.originItems = this.data.originItems.map((i) => {
            if (i.id === (payload as TodoListItem).id) {
              return { ...i, isChecked: i.isChecked ? false : true };
            }
            return i;
          });
          this.dispatch();
        }
        break;
      case EVENT_BUS_TYPES.ALL_ITEMS: {
        this.selectedBtn = BUTTON_TYPES.ALL_ITEMS;
        this.dispatch();
        break;
      }
      case EVENT_BUS_TYPES.ACTIVE_ITEMS: {
        this.selectedBtn = BUTTON_TYPES.ACTIVE_ITEMS;
        this.dispatch();
        break;
      }
      case EVENT_BUS_TYPES.COMPLETED_ITEMS: {
        this.selectedBtn = BUTTON_TYPES.COMPLETED_ITEMS;
        this.dispatch();
        break;
      }
      case EVENT_BUS_TYPES.CLEAR_COMPLETED: {
        this.selectedBtn = BUTTON_TYPES.CLEAR_COMPLETED;
        this.dispatch();
        break;
      }
      case EVENT_BUS_TYPES.ADD_ITEM: {
        if (this.data.inputValue.trim()) {
          this.addItem();
          this.data.inputValue = '';
        }
        break;
      }
      case EVENT_BUS_TYPES.DROP: {
        const { start, end } = payload as TodoDndPayload;
        const startIndex = this.data.originItems.findIndex((el) => el.id === start);
        const endIndex = this.data.originItems.findIndex((el) => el.id === end);
        this.data.originItems = Utils.moveItem(this.data.originItems, startIndex, endIndex);
        this.dispatch();
        break;
      }
    }
  };

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
      this.data.originItems = this.options.items;
    }
    if (this.options.defaultLabel) {
      this.defaultLabel = {
        ...DEFAULT_LABEL,
        ...this.options.defaultLabel,
      };
    }
    this.todoStyles = this.options.styles || new TodoListAppStyles();
    this.elements = this.installElements();
  }

  installElements() {
    if (this.options.useDnd) {
      const dndElements = new TodoListAppDnDElements(this.options, this.todoStyles, this.eventBus);
      dndElements.draggable(`.${this.todoStyles.clsNames.li}`);
      dndElements.dropzone(`ul.${this.todoStyles.clsNames.ul}`);
      return dndElements;
    }
    return new TodoListAppElements(this.options, this.todoStyles, this.eventBus);
  }

  destroy() {}

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

    //TO DO 정보 출력부
    const {
      wrapper,
      buttonPack,
      elItemCnt,
      elAllItems,
      elActiveItems,
      elCompletedItems,
      elClearCompleted,
    } = this.elements.createToolboxElements();

    this.layouts.activeItems = elActiveItems;
    this.layouts.completedItems = elCompletedItems;
    this.layouts.clearCompleted = elClearCompleted;
    this.layouts.allItems = elAllItems;
    this.layouts.itemCnt = elItemCnt;
    this.layouts.buttonWrapper = wrapper;
    this.layouts.buttonPack = buttonPack;

    buttonPack.appendChild(elAllItems);
    buttonPack.appendChild(elActiveItems);
    buttonPack.appendChild(elCompletedItems);

    wrapper.appendChild(elItemCnt);
    wrapper.appendChild(buttonPack);
    wrapper.appendChild(elClearCompleted);

    this.layouts.root.appendChild(this.layouts.input);
    this.layouts.root.appendChild(this.layouts.ul);
    this.layouts.root.appendChild(this.layouts.buttonWrapper);
    this.options.el.appendChild(this.layouts.root);
  }

  addItem() {
    const newItem: TodoListItem = {
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
    if (initialItems) {
      this.data.originItems = initialItems;
    }
    let items = [] as TodoListItem[];
    switch (this.selectedBtn) {
      case BUTTON_TYPES.ALL_ITEMS:
      default:
        items = [...this.data.originItems];
        break;
      case BUTTON_TYPES.ACTIVE_ITEMS:
        items = [...this.data.originItems.filter((i) => !i.isChecked)];
        break;
      case BUTTON_TYPES.COMPLETED_ITEMS:
        items = [...this.data.originItems.filter((i) => i.isChecked)];
        break;
      case BUTTON_TYPES.CLEAR_COMPLETED:
        this.data.originItems = this.data.originItems.filter((i) => {
          return !i.isChecked;
        });
        items = this.data.originItems;
        break;
    }
    this.renderItems(items);
    // this.renderItemCnt(this.data.originItems);
    this.renderItemCnt(this.data.originItems.filter((i) => !i.isChecked).length);
    this.renderFilterButtons();
    this.renderClearCompletedBtn(this.data.originItems.filter((i) => i.isChecked).length);
  }

  sortItems(items: TodoListItem[]) {
    if (items.length === 0) {
      return [this.elements.createNoItems()];
    }
    if (this.options.useDnd) {
      // d&d 사용시 정렬 x
      return items.map((item) => this.elements.createRow(item));
    }
    return items
      .sort((a, b) => b.createDt - a.createDt)
      .sort((a, b) => Number(a.isChecked) - Number(b.isChecked))
      .map((item) => this.elements.createRow(item));
  }

  renderItems(items: TodoListItem[]) {
    const itemsHTML: HTMLLIElement[] = this.sortItems(items);
    if (this.layouts.ul) {
      this.layouts.ul.innerHTML = '';
      itemsHTML.forEach((li) => this.layouts.ul?.appendChild(li));
    }
  }

  renderItemCnt(len: number) {
    if (!this.layouts.itemCnt) return;
    this.layouts.itemCnt.textContent = Utils.replaceToken(this.defaultLabel.itemCnt, len);
  }

  renderFilterButtons() {
    if (!this.layouts.buttonWrapper || !this.layouts.buttonPack) {
      return;
    }
    const buttonPack = this.elements.createButtonPack();
    const elAllItems = this.elements.createAllItemsButton(this.defaultLabel.allItems);
    const elActiveItems = this.elements.createActiveItemsButton(this.defaultLabel.activeItems);
    const elCompletedItems = this.elements.createCompletedItemsButton(
      this.defaultLabel.completedItems,
    );

    switch (this.selectedBtn) {
      case BUTTON_TYPES.ALL_ITEMS:
      default:
        elAllItems.classList.add('active');
        break;
      case BUTTON_TYPES.ACTIVE_ITEMS:
        elActiveItems.classList.add('active');
        break;
      case BUTTON_TYPES.COMPLETED_ITEMS:
        elCompletedItems.classList.add('active');
        break;
    }

    buttonPack.innerHTML = '';
    buttonPack.appendChild(elAllItems);
    buttonPack.appendChild(elActiveItems);
    buttonPack.appendChild(elCompletedItems);

    this.layouts.buttonWrapper?.replaceChild(buttonPack, this.layouts.buttonPack);
    this.layouts.buttonPack = buttonPack;
  }

  renderClearCompletedBtn(cnt: number) {
    if (!this.layouts.buttonWrapper) {
      return;
    }
    const btn = this.elements.createClearCompletedButton(this.defaultLabel.clearCompleted, cnt);
    if (this.layouts.clearCompleted) {
      this.layouts.clearCompleted.innerHTML = '';
      this.layouts.clearCompleted.appendChild(btn);
    }
  }
}
