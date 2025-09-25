import { TodoListAppStyles } from '../components/todo-list-styles.components';

export type SelectBtnType = 'allItems' | 'activeItems' | 'completedItems' | 'clearCompleted';

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
  buttonPack: string;
  noItems: string;
  checkbox: string;
  count: string;
  filter: string;
  clear: string;
}

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
  createRandomKey: (len: number) => {
    return Math.random()
      .toString(36)
      .substring(2, 2 + len);
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

export interface TodoDndPayload {
  start: string;
  end: string;
  // direction: 'up' | 'down';
}

export const DEFAULT_LABEL: TodoListDefaultLabel = {
  itemCnt: 'items #{} left',
  allItems: 'All',
  activeItems: 'Active',
  completedItems: 'Completed',
  clearCompleted: 'Clear Completed (#{})',
  noItems: 'There are no to-do items. Please write your to-dos.',
};

export const BUTTON_TYPES = {
  ALL_ITEMS: 'allItems',
  ACTIVE_ITEMS: 'activeItems',
  COMPLETED_ITEMS: 'completedItems',
  CLEAR_COMPLETED: 'clearCompleted',
} as const;

export const EVENT_BUS_TYPES = {
  INPUT: 'input',
  CHECK: 'check',
  ALL_ITEMS: 'allItems',
  ACTIVE_ITEMS: 'activeItems',
  COMPLETED_ITEMS: 'completedItems',
  CLEAR_COMPLETED: 'clearCompleted',
  ADD_ITEM: 'addItem',
  DROP: 'drop',
};

export const DND_OPTIONS = {
  DEFAULT_Z_INDEX: 1000,
  DETECT_CLICK_DISTANCE: 2,
};
