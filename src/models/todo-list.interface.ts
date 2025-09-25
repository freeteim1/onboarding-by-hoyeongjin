import { TodoListItem } from 'src/types/todo.types';

export interface TodoListRenderer {
  render(): void;
  renderItems(items: TodoListItem[]): void;
  renderItemCnt(items: TodoListItem[]): void;
  renderClearCompletedBtn(cnt: number): void;
}
