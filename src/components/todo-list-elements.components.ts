import {
  DEFAULT_LABEL,
  EventsPayload,
  TodoListAppOptions,
  TodoListItem,
  Utils,
} from '../types/todo.types';
import { TodoListAppStyles } from './todo-list-styles.components';

export class TodoListAppElements {
  private options: TodoListAppOptions;
  private todoStyles: TodoListAppStyles;
  private defaultLabel = DEFAULT_LABEL;

  dispatch = (event: { type: string; payload?: any }) => {};

  constructor(options: TodoListAppOptions, styles: TodoListAppStyles, stream: (e: any) => void) {
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
    ul.className = `${this.todoStyles.clsNames.ul}`;
    events.forEach(({ type, handler }) => ul.addEventListener(type, handler));
    return ul;
  }

  createInput(events: EventsPayload[] = []) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = this.todoStyles.clsNames.input;
    input.placeholder = this.options.placeholder || 'What needs to be done?';
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
    // checkbox.id = `chk-${id.toString()}`;
    checkbox.id = id.toString();
    const lb = document.createElement('label');
    lb.className = this.todoStyles.clsNames.label;
    lb.textContent = label;
    lb.htmlFor = checkbox.id;
    // lb.id = id.toString();
    // li.id = id.toString();
    li.setAttribute('data-id', id.toString());
    li.appendChild(checkbox);
    li.appendChild(lb);
    return li;
  }

  createNoItems() {
    const li = this.createLi(`${this.todoStyles.clsNames.li} ${this.todoStyles.clsNames.noItems}`);
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
    return input;
  }

  createListElements() {
    const events: EventsPayload[] = [
      {
        type: 'change',
        handler: (e: Event) => {
          this.dispatch({
            type: 'check',
            payload: {
              id: (e.target as HTMLInputElement).id,
              isChecked: (e.target as HTMLInputElement).checked,
            },
          });
        },
      },
    ];
    const ul = this.createUl(events);
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
      Utils.replaceItemCnt(this.defaultLabel.itemCnt, this.options.items?.length || 0),
    );
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
    const elClearCompleted = this.createPanelButton(wrapper, clearCompleted, [
      {
        type: 'click',
        handler: () => {
          this.dispatch({
            type: 'clearCompleted',
          });
        },
      },
    ]);
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
}
