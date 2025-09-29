import { TodoListRenderer } from 'src/models/todo-list.interface';
import { TodoListAppStyles } from 'src/components/todo-list-styles.components';
import {
  type EventBusType,
  type SelectBtnType,
  type TodoDndPayload,
  type TodoListAppOptions,
  type TodoListItem,
  Utils,
} from 'src/types/todo.types';
import { BUTTON_TYPES, DEFAULT_LABEL, EVENT_BUS_TYPES } from 'src/constants/todo-list.const';
import { TodoListElementBuilder } from 'src/components/todo-list-element-builder.components';
import { TodoListDnDElementBuilder } from 'src/components/todo-list-dnd-element-builder.components';
import { AbstractTodoListHandler } from 'src/components/abstract-todo-list-handler';

export default class TodoListApp extends AbstractTodoListHandler implements TodoListRenderer {
  private _instanceId = `todo-list-${Utils.createRandomKey(8)}`;
  private _initialLabel = DEFAULT_LABEL;

  get initialLabel() {
    return this._initialLabel;
  }

  set initialLabel(value) {
    this._initialLabel = value;
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

  private _builder!: TodoListElementBuilder;

  get builder() {
    return this._builder;
  }
  set builder(value) {
    this._builder = value;
  }

  private _options!: TodoListAppOptions;

  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value;
  }

  get useDnd() {
    return this.options.useDnd || false;
  }

  private _selectedBtn: SelectBtnType = BUTTON_TYPES.ALL_ITEMS;

  get selectedBtn() {
    return this._selectedBtn;
  }

  set selectedBtn(value) {
    this._selectedBtn = value;
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

  subscribe({ type, payload }: EventBusType) {
    switch (type) {
      case EVENT_BUS_TYPES.CHANGE_INPUT_VALUE:
        this.handleChangeInputValue(payload as string);
        break;
      case EVENT_BUS_TYPES.CHANGE_CHECK:
        this.handleChangeCheck(payload as TodoListItem);
        break;
      case EVENT_BUS_TYPES.CLICK_ALL_ITEMS: {
        this.handleAllItems();
        break;
      }
      case EVENT_BUS_TYPES.CLICK_ACTIVE_ITEMS: {
        this.handleActiveItems();
        break;
      }
      case EVENT_BUS_TYPES.CLICK_COMPLETED_ITEMS: {
        this.handleCompletedItems();
        break;
      }
      case EVENT_BUS_TYPES.CLICK_CLEAR_COMPLETED: {
        this.handleClearCompleted();
        break;
      }
      case EVENT_BUS_TYPES.ADD_ITEM: {
        this.handleAddItem();
        break;
      }
      case EVENT_BUS_TYPES.DROP: {
        this.handleDrop(payload as TodoDndPayload);
        break;
      }
    }
  }

  constructor(options: TodoListAppOptions) {
    super();
    if (!options) {
      throw new Error('Options are required');
    }
    if (!options.el) {
      throw new Error('Root element is required');
    }
    if (!(options.el instanceof HTMLDivElement)) {
      throw new Error('Root element must be a div');
    }

    this.options = options;

    if (this.options.items) {
      this.data.originItems = this.options.items;
    }
    if (this.options.labels) {
      this.initialLabel = {
        ...DEFAULT_LABEL,
        ...this.options.labels,
      };
    }
    this.todoStyles = this.options.styles || new TodoListAppStyles();
    this.builder = this.initElementBuilder();
  }

  initElementBuilder() {
    if (this.options.useDnd) {
      const dndElements = new TodoListDnDElementBuilder(
        this.options,
        this.todoStyles,
        this.subscribe.bind(this),
      );
      dndElements.draggable(`.${this.todoStyles.clsNames.li}`);
      dndElements.dropzone(`ul.${this.todoStyles.clsNames.ul}`);
      return dndElements;
    }
    return new TodoListElementBuilder(this.options, this.todoStyles, this.subscribe.bind(this));
  }

  destroy() {
    if (this.layouts.root && this.options.el.contains(this.layouts.root)) {
      this.options.el.removeChild(this.layouts.root);
    }
    this.todoStyles.removeStyles(this.instanceId); // 리뷰 개선사항 반영
  }

  render() {
    this.todoStyles.addStyles(this.instanceId);
    this.initTodoList();
    this.dispatch();
  }

  initTodoList() {
    this.layouts.root = document.createElement('div');
    this.layouts.root.className = `${this.todoStyles.clsNames.root} ${this.instanceId}`;
    if (this.useDnd) {
      this.layouts.root.classList.add('useDnD');
    }
    this.layouts.input = this.builder.createTodoInputElement(); //TO DO 입력부
    this.layouts.ul = this.builder.createTodoListElement(); //TO DO 목록 출력부

    //TO DO 정보 출력부
    const {
      wrapper,
      buttonPack,
      elItemCnt,
      elAllItems,
      elActiveItems,
      elCompletedItems,
      elClearCompleted,
    } = this.builder.createTodoToolboxElement();

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
        this.selectedBtn = BUTTON_TYPES.ALL_ITEMS;
        break;
    }
    this.renderItems(items);
    this.renderItemCnt(this.data.originItems.filter((i) => !i.isChecked).length);
    this.renderFilterButtons();
    this.renderClearCompletedBtn(this.data.originItems.filter((i) => i.isChecked).length);
  }

  sortList(items: TodoListItem[]) {
    if (items.length === 0) {
      return [this.builder.createEmptyRow()];
    }
    if (this.options.useDnd) {
      // d&d 사용시 정렬 x
      return items.map((item) => this.builder.createRow(item));
    }
    return items
      .sort((a, b) => b.createDt - a.createDt)
      .sort((a, b) => Number(a.isChecked) - Number(b.isChecked))
      .map((item) => this.builder.createRow(item));
  }

  renderItems(items: TodoListItem[]) {
    const liArr: HTMLLIElement[] = this.sortList(items);
    if (this.layouts.ul) {
      this.layouts.ul.innerHTML = '';
      liArr.forEach((li) => this.layouts.ul?.appendChild(li));
    }
  }

  renderItemCnt(len: number) {
    if (!this.layouts.itemCnt) return;
    this.layouts.itemCnt.textContent = Utils.replaceToken(this.initialLabel.itemCnt, len);
  }

  renderFilterButtons() {
    if (!this.layouts.buttonWrapper || !this.layouts.buttonPack) {
      return;
    }
    const buttonPack = this.builder.createButtonPack();
    const elAllItems = this.builder.createAllItemsButton(this.initialLabel.allItems);
    const elActiveItems = this.builder.createActiveItemsButton(this.initialLabel.activeItems);
    const elCompletedItems = this.builder.createCompletedItemsButton(
      this.initialLabel.completedItems,
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
    const btn = this.builder.createClearCompletedButton(this.initialLabel.clearCompleted, cnt);
    if (this.layouts.clearCompleted) {
      this.layouts.clearCompleted.innerHTML = '';
      this.layouts.clearCompleted.appendChild(btn);
    }
  }
}
