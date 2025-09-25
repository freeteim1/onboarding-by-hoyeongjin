import {
  DEFAULT_LABEL,
  EVENT_BUS_TYPES,
  EventBusType,
  EventsPayload,
  TodoListAppOptions,
  TodoListItem,
  Utils,
} from '../types/todo.types';
import { TodoListAppStyles } from './todo-list-styles.components';

export class TodoListAppElements {
  private options: TodoListAppOptions;
  private defaultLabel = DEFAULT_LABEL;
  todoStyles: TodoListAppStyles;

  dispatch: (event: EventBusType) => void;

  constructor(
    options: TodoListAppOptions,
    styles: TodoListAppStyles,
    stream: (e: EventBusType) => void,
  ) {
    this.options = options;
    this.todoStyles = styles;
    this.dispatch = stream;
    if (this.options.defaultLabel) {
      this.defaultLabel = {
        ...DEFAULT_LABEL,
        ...this.options.defaultLabel,
      };
    }
  }

  createUl(events: EventsPayload[] = []) {
    const ul = document.createElement('ul');
    this.attachEvents(ul, events);
    return ul;
  }

  createInput(events: EventsPayload[] = []) {
    const input = document.createElement('input');
    input.type = 'text';
    this.attachEvents(input, events);
    return input;
  }

  createRow(item: TodoListItem) {
    const { id, label, isChecked } = item;
    const dataId = id.toString();
    const li = document.createElement('li');
    li.className = `${this.todoStyles.clsNames.li} ${isChecked ? 'checked' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;
    checkbox.id = dataId;

    const lb = document.createElement('label');
    lb.className = this.todoStyles.clsNames.label;
    lb.textContent = label;
    lb.htmlFor = checkbox.id;

    [li, lb, checkbox].forEach((el) => el.setAttribute('data-id', dataId));
    li.appendChild(checkbox);
    li.appendChild(lb);
    return li;
  }

  createNoItems() {
    const li = document.createElement('li');
    li.className = `${this.todoStyles.clsNames.li} ${this.todoStyles.clsNames.noItems}`;
    li.textContent = this.defaultLabel.noItems;
    return li;
  }

  createInputElements() {
    const events: EventsPayload[] = [
      {
        type: 'input',
        handler: (e: Event) => {
          const value = (e.target as HTMLInputElement).value;
          this.dispatch({
            type: EVENT_BUS_TYPES.INPUT,
            payload: value,
          });
        },
      },
      {
        type: 'keydown',
        handler: (e: Event) => {
          if ((e as KeyboardEvent).key === 'Enter') {
            this.dispatch({
              type: EVENT_BUS_TYPES.ADD_ITEM,
            });
            (e.target as HTMLInputElement).value = '';
          }
        },
      },
    ];
    const input = this.createInput(events);
    input.className = this.todoStyles.clsNames.input;
    input.placeholder = this.options.placeholder || 'What needs to be done?';
    return input;
  }

  onChangeCheckbox(e: Event) {
    this.dispatch({
      type: EVENT_BUS_TYPES.CHECK,
      payload: {
        id: this.getLiDataId(e),
      },
    });
  }

  createListElements() {
    const events: EventsPayload[] = [
      {
        type: 'change',
        handler: (e: Event) => this.onChangeCheckbox(e),
      },
    ];
    const ul = this.createUl(events);
    ul.className = `${this.todoStyles.clsNames.ul}`;
    return ul;
  }

  createToolboxElements() {
    const wrapper = document.createElement('div');
    const buttonPack = document.createElement('div');
    const { allItems, activeItems, completedItems } = this.defaultLabel;

    wrapper.className = this.todoStyles.clsNames.buttonWrapper;
    buttonPack.className = this.todoStyles.clsNames.buttonPack;

    // item count
    const elItemCnt = this.createItemCntLabel(this.defaultLabel.itemCnt, 0);

    // all items
    const elAllItems = this.createAllItemsButton(allItems);

    // active items
    const elActiveItems = this.createActiveItemsButton(activeItems);

    // completed items
    const elCompletedItems = this.createCompletedItemsButton(completedItems);

    // clear completed
    const elClearCompleted = document.createElement('div');
    elClearCompleted.className = this.todoStyles.clsNames.clear;
    elClearCompleted.appendChild(
      this.createClearCompletedButton(this.defaultLabel.clearCompleted, 0),
    );

    return {
      wrapper,
      buttonPack,
      elItemCnt,
      elAllItems,
      elActiveItems,
      elCompletedItems,
      elClearCompleted,
    };
  }

  getLiDataId(e: Event) {
    const dataId: string | null =
      (e.target as HTMLInputElement | HTMLLabelElement).closest('li')?.getAttribute('data-id') ||
      null;
    if (!dataId) {
      return;
    }
    return dataId;
  }

  createButtonPack() {
    const buttonPack = document.createElement('div');
    buttonPack.className = this.todoStyles.clsNames.buttonPack;
    return buttonPack;
  }

  createItemCntLabel(text: string, cnt: number) {
    const label = document.createElement('label');
    label.innerText = Utils.replaceToken(text, cnt);
    label.className = this.todoStyles.clsNames.count;
    return label;
  }

  createAllItemsButton(btnText: string) {
    const button = document.createElement('button');
    button.innerText = btnText;
    button.className = this.todoStyles.clsNames.filter;
    this.attachEvents(button, [
      {
        type: 'click',
        handler: () =>
          this.dispatch({
            type: EVENT_BUS_TYPES.ALL_ITEMS,
          }),
      },
    ]);
    return button;
  }

  createActiveItemsButton(btnText: string) {
    const button = document.createElement('button');
    button.innerText = btnText;
    button.className = this.todoStyles.clsNames.filter;
    this.attachEvents(button, [
      {
        type: 'click',
        handler: () =>
          this.dispatch({
            type: EVENT_BUS_TYPES.ACTIVE_ITEMS,
          }),
      },
    ]);
    return button;
  }

  createCompletedItemsButton(btnText: string) {
    const button = document.createElement('button');
    button.innerText = btnText;
    button.className = this.todoStyles.clsNames.filter;
    this.attachEvents(button, [
      {
        type: 'click',
        handler: () =>
          this.dispatch({
            type: EVENT_BUS_TYPES.COMPLETED_ITEMS,
          }),
      },
    ]);
    return button;
  }

  createClearCompletedButton(btnText: string, num: number) {
    const button = document.createElement('button');
    button.innerText = Utils.replaceToken(btnText, num);
    this.attachEvents(button, [
      {
        type: 'click',
        handler: () => {
          this.dispatch({
            type: EVENT_BUS_TYPES.CLEAR_COMPLETED,
          });
        },
      },
    ]);
    return button;
  }

  attachEvents(target: HTMLElement, events: EventsPayload[]) {
    events.forEach(({ type, handler }: EventsPayload) => target.addEventListener(type, handler));
  }
}
