import { EventsPayload, TodoListAppOptions } from 'src/types/todo.types';
import { TodoListAppElements } from './todo-list-elements.components';
import { TodoListAppStyles } from './todo-list-styles.components';

export class TodoListAppDnDElements extends TodoListAppElements {
  dragItem: HTMLLIElement | null = null;
  // dragStart = false;
  draggableClsName = '';
  dropzoneClsName = '';

  dragStartPosition = { x: 0, y: 0 };

  constructor(options: TodoListAppOptions, styles: TodoListAppStyles, stream: (e: any) => void) {
    super(options, styles, stream);
  }

  draggable(draggableClsName: string) {
    this.draggableClsName = draggableClsName;
  }

  dropzone(dropzoneClsName: string) {
    this.dropzoneClsName = dropzoneClsName;
  }

  createLi(clsName: string) {
    const li = document.createElement('li');
    li.className = `${clsName} draggable`;
    return li;
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
      {
        type: 'mousedown',
        handler: (e: any) => {
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
          this.dragItem.style.position = 'absolute';
          this.dragItem.style.zIndex = '1000';
          const { left, top } = li.getBoundingClientRect();
          this.dragItem.style.left = left + 'px';
          this.dragItem.style.top = top + 'px';

          const initialX = me.clientX - left;
          const initialY = me.clientY - top;

          const onMousemove = (e: MouseEvent) => {
            if (!this.dragItem) {
              return;
            }
            this.dragItem.style.left = e.clientX - initialX + 'px';
            this.dragItem.style.top = e.clientY - initialY + 'px';
          };

          const onMouseup = (e: MouseEvent) => {
            if (!this.dragItem) {
              return;
            }
            const dx = e.clientX - this.dragStartPosition.x;
            const dy = e.clientY - this.dragStartPosition.y;
            const dist = Math.hypot(dx, dy);

            if (dist >= 50) {
              return;
            }

            this.dragItem.style.position = '';
            this.dragItem.style.zIndex = '';
            this.dragItem.style.left = '';
            this.dragItem.style.top = '';

            const el = document.elementFromPoint(e.clientX, e.clientY);
            const li = el?.closest('li');
            // console.log(this.dragItem, li);
            // console.log(this.dragItem.getAttribute('data-id'), li?.getAttribute('data-id'));
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

          // if (!li) return;
          // const listEl = li.parentElement;
          // if (!listEl) return;
          // this.dragItem = li;
          // const { left, top } = li.getBoundingClientRect();
          // const offsetX = me.clientX - left;
          // const offsetY = me.clientY - top;
          // li.style.position = 'absolute';
          // li.style.zIndex = '1000';
          // li.style.left = left + 'px';
          // li.style.top = top + 'px';
          // li.style.zIndex = '1000';
          // li.style.pointerEvents = 'none';
          // li.style.transition = 'none';
          // li.classList.add('dragging');
          // listEl.insertBefore(placeholder, li.nextSibling);
          // const onMouseMove = (e: MouseEvent) => {
          //   if (this.dragItem) {
          //     this.dragItem.style.left = e.clientX - initialX + 'px';
          //     this.dragItem.style.top = e.clientY - initialY + 'px';
          //   }
          // };
          // const onMouseUp = () => {
          //   if (this.dragItem) {
          //     this.dragItem.style.position = '';
          //     this.dragItem.style.zIndex = '';
          //     this.dragItem.style.left = '';
          //     this.dragItem.style.top = '';
          //     this.dragItem = null;
          //   }
          //   document.removeEventListener('mousemove', onMouseMove);
          //   document.removeEventListener('mouseup', onMouseUp);
          // };
          // document.addEventListener('mousemove', onMouseMove);
          // document.addEventListener('mouseup', onMouseUp);
        },
      },
    ];
    const ul = this.createUl(events);
    return ul;
  }
}

// const events: EventsPayload[] = [
//   {
//     type: 'change',
//     handler: (e: Event) => {
//       this.dispatch({
//         type: 'check',
//         payload: {
//           id: (e.target as HTMLInputElement).id,
//           isChecked: (e.target as HTMLInputElement).checked,
//         },
//       });
//     },
//   },
//   {
//     type: 'dragstart',
//     handler: (e: any) => {
//       const dragEvt = e as DragEvent;
//       if (!dragEvt) return;
//       this.dragItem = dragEvt.target;
//       if (!dragEvt.dataTransfer) return;
//       dragEvt.dataTransfer.effectAllowed = 'move';
//       dragEvt.dataTransfer.setData('text/plain', (dragEvt.target as HTMLElement).id);
//       //   this.dispatch({
//       //     type: 'dragstart',
//       //     payload: e,
//       //   });
//     },
//   },
//   {
//     type: 'dragover',
//     handler: (e: Event) => {
//       e.preventDefault();
//       const dragEvt = e as DragEvent;
//       if (!dragEvt) return;
//       if (!dragEvt.dataTransfer) return;
//       dragEvt.dataTransfer.effectAllowed = 'move';
//       //   this.dispatch({
//       //     type: 'dragover',
//       //     payload: e,
//       //   });
//     },
//   },
//   {
//     type: 'drop',
//     handler: (e: Event) => {
//       e.preventDefault();
//       const dragEvt = e as DragEvent;
//       if (!dragEvt) return;
//       if (!dragEvt.target) return;
//       const li: HTMLLIElement | null = (dragEvt.target as HTMLElement).closest('.todo-item');
//       const rect = li?.getBoundingClientRect();
//       const mouseY = dragEvt.clientY;
//       //   if (rect && mouseY < rect.top + rect.height / 2) {
//       //     console.log('down', this.dragItem, li);
//       //     // if (this.dragItem instanceof Node && li?.parentNode) {
//       //     //   li.parentNode.insertBefore(this.dragItem, li);
//       //     // }
//       //   } else if (rect) {
//       //     console.log('up', this.dragItem, li);
//       //     // if (this.dragItem instanceof Node && li?.parentNode) {
//       //     //   li.parentNode.insertBefore(this.dragItem, li?.nextSibling);
//       //     // }
//       //   }
//       this.dispatch({
//         type: 'drop',
//         payload: {
//           start: this.dragItem,
//           end: li,
//           direction: mouseY < (rect?.top ?? 0) + (rect?.height ?? 0) / 2 ? 'up' : 'down',
//         },
//       });
//     },
//   },
// ];
