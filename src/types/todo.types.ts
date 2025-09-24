import { TodoListAppStyles } from 'src/models/todo-list-styles.model';

export interface TodoListItem {
  id: string;
  label: string;
  isChecked: boolean;
  createDt: number;
}

export interface TodoListAppOptions {
  el: HTMLDivElement;
  placeholder?: string;
  styles?: TodoListAppStyles;
  items?: TodoListItem[];
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
}
// export interface TodoListElementsFeatures {
//     createUl(onChange?: (e: Event) => void): HTMLUListElement;
//     createInput(onInput?: (e: Event) => void, onKeyPress?: (e: KeyboardEvent) => void): HTMLInputElement;
//     createPanelButton(parent: HTMLDivElement, text: string, onClick?: () => void): HTMLButtonElement;
//     createPanelLabel(parent: HTMLDivElement, text: string): HTMLLabelElement;
//     createLi(item: TodoListItem): HTMLLIElement;
// }

export const Utils = {
  replaceItemCnt: (template: string, cnt: number) => {
    return template.replace('#{}', cnt.toString());
  },
};
