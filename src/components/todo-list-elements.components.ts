import {
  DEFAULT_LABEL,
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
    events.forEach(({ type, handler }) => ul.addEventListener(type, handler));
    return ul;
  }

  createInput(events: EventsPayload[] = []) {
    const input = document.createElement('input');
    input.type = 'text';
    events.forEach(({ type, handler }) => input.addEventListener(type, handler));
    return input;
  }

  createPanelButton(parent: HTMLDivElement, text: string, events: EventsPayload[] = []) {
    const button = document.createElement('button');
    button.innerText = text;
    parent.appendChild(button);
    events.forEach(({ type, handler }) => button.addEventListener(type, handler));
    return button;
  }

  createPanelLabel(parent: HTMLDivElement, text: string) {
    const label = document.createElement('label');
    label.innerText = text;
    parent.appendChild(label);
    return label;
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
            type: 'input',
            payload: value,
          });
        },
      },
      {
        type: 'keypress',
        handler: (e: Event) => {
          if ((e as KeyboardEvent).key === 'Enter') {
            this.dispatch({
              type: 'addItem',
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
      type: 'check',
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
    const panel = document.createElement('div');
    const { allItems, activeItems, completedItems, clearCompleted } = this.defaultLabel;

    wrapper.className = this.todoStyles.clsNames.buttonWrapper;
    panel.className = this.todoStyles.clsNames.buttonPanel;

    const elItemCnt = this.createPanelLabel(
      wrapper,
      Utils.replaceToken(this.defaultLabel.itemCnt, this.options.items?.length || 0),
    );
    elItemCnt.className = this.todoStyles.clsNames.count;

    const elAllItems = this.createPanelButton(panel, allItems, [
      {
        type: 'click',
        handler: () => {
          this.dispatch({
            type: 'allItems',
          });
        },
      },
    ]);
    elAllItems.className = this.todoStyles.clsNames.filter;
    const elActiveItems = this.createPanelButton(panel, activeItems, [
      {
        type: 'click',
        handler: () => {
          this.dispatch({
            type: 'activeItems',
          });
        },
      },
    ]);
    elActiveItems.className = this.todoStyles.clsNames.filter;
    const elCompletedItems = this.createPanelButton(panel, completedItems, [
      {
        type: 'click',
        handler: () => {
          this.dispatch({
            type: 'completedItems',
          });
        },
      },
    ]);
    elCompletedItems.className = this.todoStyles.clsNames.filter;
    // const elClearCompleted = document.createElement('div');
    // elClearCompleted.className = this.todoStyles.clsNames.clear;
    // const btnText = Utils.replaceToken(clearCompleted, 0);
    // elClearCompleted.appendChild(
    //   this.createPanelButton(wrapper, btnText, [
    //     {
    //       type: 'click',
    //       handler: () => {
    //         this.dispatch({
    //           type: 'clearCompleted',
    //         });
    //       },
    //     },
    //   ]),
    // );
    const elClearCompleted = document.createElement('div');
    elClearCompleted.className = this.todoStyles.clsNames.clear;
    elClearCompleted.appendChild(this.createClearCompletedButton(0));

    return {
      wrapper,
      panel,
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

  createClearCompletedButton(num: number) {
    const btnText = Utils.replaceToken(this.defaultLabel.clearCompleted, num);
    const button = document.createElement('button');
    button.innerText = btnText;
    this.attachEvents(button, [
      {
        type: 'click',
        handler: () => {
          this.dispatch({
            type: 'clearCompleted',
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
