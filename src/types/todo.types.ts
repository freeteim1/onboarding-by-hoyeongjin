/**
 * @description 타입 정의, 유틸 함수
 */
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
  labels?: TodoListDefaultLabel;
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

/**
 * 유틸 함수 모음
 * 싱글톤 클래스(인스턴스x)에 대응하는 목적으로 네이밍 Utils 유지
 */
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
}
