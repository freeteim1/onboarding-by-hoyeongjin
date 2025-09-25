import { EventsPayload, TodoListAppOptions } from 'src/types/todo.types';
import { TodoListAppElements } from './todo-list-elements.components';
import { TodoListAppStyles } from './todo-list-styles.components';

export class TodoListAppDnDElements extends TodoListAppElements {
  dragItem: HTMLLIElement | null = null;
  draggableClsName = '';
  dropzoneClsName = '';
  dragStartPosition = { x: 0, y: 0 };
  cloneLiClsName = 'todo-dnd-clone';

  DEFAULT_Z_INDEX = 1000;
  DETECT_CLICK_DISTANCE = 50;

  constructor(options: TodoListAppOptions, styles: TodoListAppStyles, stream: (e: any) => void) {
    super(options, styles, stream);
  }

  draggable(draggableClsName: string) {
    this.draggableClsName = draggableClsName;
  }

  dropzone(dropzoneClsName: string) {
    this.dropzoneClsName = dropzoneClsName;
  }

  createCloneLi(li: HTMLLIElement) {
    const clone = li.cloneNode(true) as HTMLLIElement;
    clone.classList.add(this.cloneLiClsName);
    return clone;
  }

  createListElements() {
    const events: EventsPayload[] = [
      {
        type: 'mousedown',
        handler: (e: any) => {
          let copyItem: HTMLLIElement | null = null;
          let isAppend = false;
          const me = e as MouseEvent;
          if (!me) {
            return;
          }
          const li: HTMLLIElement | null = (me.target as HTMLElement).closest(
            this.draggableClsName,
          );
          if (!li) {
            return;
          }
          const ul = li.parentElement;
          if (!ul) {
            return;
          }
          this.dragStartPosition = { x: me.clientX, y: me.clientY };
          this.dragItem = li;

          const { left, top } = li.getBoundingClientRect();
          const initialX = me.clientX - left;
          const initialY = me.clientY - top;

          const onMousemove = (e: MouseEvent) => {
            if (!this.dragItem) {
              return;
            }

            if (isAppend) {
              if (!copyItem) {
                return;
              }
              this.setItemPosition(
                copyItem,
                `${e.clientX - initialX}px`,
                `${e.clientY - initialY}px`,
              );
            } else {
              copyItem = this.createCloneLi(li);
              this.floatItem(copyItem);
              document.querySelector(this.dropzoneClsName)?.appendChild(copyItem);
              isAppend = true;
            }
          };

          const onMouseup = (e: MouseEvent) => {
            const dx = e.clientX - this.dragStartPosition.x;
            const dy = e.clientY - this.dragStartPosition.y;
            const dist = Math.hypot(dx, dy);

            if (dist < this.DETECT_CLICK_DISTANCE) {
              this.onChangeCheckbox(e);
              ul.removeEventListener('mousemove', onMousemove);
              ul.removeEventListener('mouseup', onMouseup);
              return;
            }

            if (!this.dragItem) {
              return;
            }
            if (isAppend && copyItem) {
              ul.removeChild(copyItem);
              isAppend = false;
            }
            const li = this.fromPointLi(e);
            this.dispatch({
              type: 'drop',
              payload: {
                start: this.dragItem.getAttribute('data-id'),
                end: li?.getAttribute('data-id'),
              },
            });
            ul.removeEventListener('mousemove', onMousemove);
            ul.removeEventListener('mouseup', onMouseup);
          };
          ul.addEventListener('mousemove', onMousemove);
          ul.addEventListener('mouseup', onMouseup);
        },
      },
    ];
    const ul = this.createUl(events);
    ul.className = `${this.todoStyles.clsNames.ul}`;
    ul.classList.add('useDnD');
    return ul;
  }

  floatItem(item: HTMLElement) {
    item.style.position = 'absolute';
    item.style.zIndex = this.DEFAULT_Z_INDEX.toString();
  }

  setItemPosition(item: HTMLElement, left: string, top: string) {
    item.style.left = left || '';
    item.style.top = top || '';
  }

  fromPointLi(e: MouseEvent) {
    return document.elementsFromPoint(e.clientX, e.clientY).find((el) => {
      return (
        (el as HTMLElement).tagName === 'LI' &&
        !(el as HTMLElement).classList.contains(this.cloneLiClsName)
      );
    }) as HTMLElement;
  }
}
