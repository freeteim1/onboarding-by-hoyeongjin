import { TodoListAppStyles } from '../components/todo-list-styles.components';

export interface TodoListItem {
  id: string;
  label: string;
  isChecked: boolean;
  createDt: number;
}

export interface TodoListDefaultLabel {
  itemCnt: string;
  allItems: string;
  activeItems: string;
  completedItems: string;
  clearCompleted: string;
  noItems: string;
}

export interface TodoListAppOptions {
  el: HTMLDivElement;
  placeholder?: string;
  styles?: TodoListAppStyles;
  items?: TodoListItem[];
  useDnd?: boolean;
  defaultLabel?: TodoListDefaultLabel;
}

export interface TodoListAppLayouts {
  root: string;
  ul: string;
  li: string;
  input: string;
  label: string;
  buttonWrapper: string;
  buttonPanel: string;
  noItems: string;
  checkbox: string;
  count: string;
  filter: string;
  clear: string;
}
// export interface TodoListElementsFeatures {
//     createUl(onChange?: (e: Event) => void): HTMLUListElement;
//     createInput(onInput?: (e: Event) => void, onKeyPress?: (e: KeyboardEvent) => void): HTMLInputElement;
//     createPanelButton(parent: HTMLDivElement, text: string, onClick?: () => void): HTMLButtonElement;
//     createPanelLabel(parent: HTMLDivElement, text: string): HTMLLabelElement;
//     createLi(item: TodoListItem): HTMLLIElement;
// }

export const Utils = {
  replaceToken: (template: string, cnt: number) => {
    return template.replace('#{}', cnt.toString());
  },
  moveItem: (arr: TodoListItem[], fromIndex: number, toIndex: number) => {
    const newArr = [...arr];
    const [item] = newArr.splice(fromIndex, 1);
    if (!item) {
      return arr;
    }
    newArr.splice(toIndex, 0, item);
    return newArr;
  },
};

export interface EventsPayload {
  type: string;
  handler: (e: Event) => void;
}

export interface EventBusType {
  type: string;
  payload?: any;
}

export const DEFAULT_LABEL: TodoListDefaultLabel = {
  itemCnt: 'items #{} left',
  allItems: 'All',
  activeItems: 'Active',
  completedItems: 'Completed',
  clearCompleted: 'Clear Completed (#{})',
  noItems: 'There are no to-do items. Please write your to-dos.',
};

export interface TodoDndPayload {
  start: string;
  end: string;
  // direction: 'up' | 'down';
}
