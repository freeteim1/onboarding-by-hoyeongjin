import { BUTTON_TYPES } from 'src/constants/todo-list.const';
import { TodoDndPayload, Utils, type TodoListItem } from 'src/types/todo.types';

export interface TodoListRenderer {
  render(): void;
  renderItems(items: TodoListItem[]): void;
  renderItemCnt(len: number): void;
  renderClearCompletedBtn(cnt: number): void;
  renderFilterButtons(): void;
}

export abstract class AbstractTodoListHandler {
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

  abstract dispatch(): void;
  abstract selectedBtn: string;
  abstract addItem(): void;

  handleChangeInputValue(payload: string) {
    this.data.inputValue = payload;
  }

  handleChangeCheck(payload: TodoListItem) {
    this.data.originItems = this.data.originItems.map((i) => {
      if (i.id === payload.id) {
        return { ...i, isChecked: i.isChecked ? false : true };
      }
      return i;
    });
    this.dispatch();
  }

  handleAllItems() {
    this.selectedBtn = BUTTON_TYPES.ALL_ITEMS;
    this.dispatch();
  }

  handleActiveItems() {
    this.selectedBtn = BUTTON_TYPES.ACTIVE_ITEMS;
    this.dispatch();
  }

  handleCompletedItems() {
    this.selectedBtn = BUTTON_TYPES.COMPLETED_ITEMS;
    this.dispatch();
  }

  handleClearCompleted() {
    this.selectedBtn = BUTTON_TYPES.CLEAR_COMPLETED;
    this.dispatch();
  }

  handleAddItem() {
    if (this.data.inputValue.trim()) {
      this.addItem();
      this.data.inputValue = '';
    }
  }

  handleDrop(payload: TodoDndPayload) {
    const { start, end } = payload;
    const startIndex = this.data.originItems.findIndex((el) => el.id === start);
    const endIndex = this.data.originItems.findIndex((el) => el.id === end);
    this.data.originItems = Utils.moveItem(this.data.originItems, startIndex, endIndex);
    this.dispatch();
  }
}
