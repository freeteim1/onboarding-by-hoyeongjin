import { type TodoListDefaultLabel } from 'src/types/todo.types';

export const DEFAULT_LABEL: TodoListDefaultLabel = {
  itemCnt: 'items #{} left',
  allItems: 'All',
  activeItems: 'Active',
  completedItems: 'Completed',
  clearCompleted: 'Clear Completed (#{})',
  noItems: 'There are no to-do items. Please write your to-dos.',
} as const;

export const BUTTON_TYPES = {
  ALL_ITEMS: 'allItems',
  ACTIVE_ITEMS: 'activeItems',
  COMPLETED_ITEMS: 'completedItems',
  CLEAR_COMPLETED: 'clearCompleted',
} as const;

export const EVENT_BUS_TYPES = {
  CHANGE_INPUT_VALUE: 'CHANGE_INPUT_VALUE',
  CHANGE_CHECK: 'CHANGE_CHECK',
  CLICK_ALL_ITEMS: 'CLICK_ALL_ITEMS',
  CLICK_ACTIVE_ITEMS: 'CLICK_ACTIVE_ITEMS',
  CLICK_COMPLETED_ITEMS: 'CLICK_COMPLETED_ITEMS',
  CLICK_CLEAR_COMPLETED: 'CLICK_CLEAR_COMPLETED',
  ADD_ITEM: 'ADD_ITEM',
  DROP: 'DROP',
} as const;

export const DND_OPTIONS = {
  DEFAULT_Z_INDEX: 1000,
  DETECT_CLICK_DISTANCE: 2,
} as const;
