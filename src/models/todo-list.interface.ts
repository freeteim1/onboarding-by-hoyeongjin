import { TodoListItem } from 'src/types/todo.types';

export interface TodoListRenderer {
  render(): void;
  renderItems(items: TodoListItem[]): void;
  renderItemCnt(len: number): void;
  renderClearCompletedBtn(cnt: number): void;
  renderFilterButtons(): void;
}
