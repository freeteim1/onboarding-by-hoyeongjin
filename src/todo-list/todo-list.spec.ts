import { BUTTON_TYPES, Utils } from '../types/todo.types';
import TodoListApp from './todo-list';

describe('TodoListApp', () => {
  let div: HTMLDivElement;
  let todoApp: TodoListApp;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    div = document.getElementById('app')! as HTMLDivElement;
    todoApp = new TodoListApp({ el: div });
  });

  test('#1 check instance id', () => {
    expect(todoApp.instanceId).toBeTruthy();
  });

  test('#2 UI는 TO-DO 입력부와 TO-DO 목록 출력부, 정보 출력부로 나뉜다.', () => {
    todoApp.initTodoList();
    expect(todoApp.layouts.root).toBeTruthy();
    expect(todoApp.layouts.input).toBeTruthy();
    expect(todoApp.layouts.ul).toBeTruthy();
    expect(todoApp.layouts.buttonWrapper).toBeTruthy();
  });

  describe('#3 TO-DO 입력부', () => {
    test('#3-1 TO-DO 입력 받을 수 있는 input 요소가 있다.', () => {
      const createInputElementsSpy = jest.spyOn(todoApp.elements as any, 'createInputElements');
      todoApp.initTodoList();
      expect(createInputElementsSpy).toHaveBeenCalledTimes(1);
      expect(todoApp.layouts.input).toBeTruthy();
    });
    test('#3-2 > TO-DO를 입력하고 Enter키를 누르면 TO-DO를 등록할 수 있다.', () => {
      const dispatchSpy = jest.spyOn(todoApp.elements as any, 'dispatch');
      // const eventBusSpy = jest.spyOn(todoApp as any, 'eventBus', 'get');

      todoApp.initTodoList();

      const input = todoApp.layouts.input as HTMLInputElement;
      input.value = 'Test TODO';
      todoApp.data.inputValue = input.value;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); // keydown 변경

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(todoApp.data.originItems.length).toEqual(1);
      expect(todoApp.layouts.ul?.querySelector('li')?.textContent).toEqual('Test TODO');
    });
  });
  describe('#4 TO-DO 목록 출력부', () => {
    test('#4-1 TO-DO 목록 출력부 > 등록된 TO-DO 목록이 출력된다.', () => {
      const sampleData = [
        {
          id: '1',
          label: 'Test TODO1',
          isChecked: false,
          createDt: Date.now(),
        },
        {
          id: '2',
          label: 'Test TODO2',
          isChecked: false,
          createDt: Date.now(),
        },
      ];
      todoApp.initTodoList();
      todoApp.dispatch(sampleData);
      expect(todoApp.layouts.ul?.querySelectorAll('li').length).toEqual(sampleData.length);
    });

    test('#4-2 TO-DO는 등록순으로 정렬되어 최근에 등록한 TO-DO 항목이 목록의 상단에 위치한다.', () => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(today.getDate() - 2);
      const sampleData = [
        {
          id: '1',
          label: 'Test TODO1',
          isChecked: false,
          createDt: yesterday.getTime(),
        },
        {
          id: '2',
          label: 'Test TODO2',
          isChecked: false,
          createDt: twoDaysAgo.getTime(),
        },
      ];
      const newTodo = new TodoListApp({ el: div, items: [...sampleData] });
      newTodo.initTodoList();
      newTodo.data.inputValue = 'Test TODO3';
      newTodo.addItem();
      const liElements = newTodo.layouts.ul?.querySelectorAll('li');
      expect(liElements?.length).toEqual(sampleData.length + 1);
      expect(liElements?.item(0)?.textContent).toEqual('Test TODO3');
    });

    test('#4-3 checkbox 요소가 있다 + 텍스트가 표시된다', () => {
      const newTodo = new TodoListApp({
        el: div,
      });
      newTodo.initTodoList();
      newTodo.data.inputValue = 'Test TODO3';
      newTodo.addItem();
      const liElements = newTodo.layouts.ul?.querySelectorAll('li');
      const item = liElements?.item(0);
      expect(item?.querySelectorAll('input[type="checkbox"]')).toBeTruthy();
      expect(item?.querySelectorAll('label')).toBeTruthy();
    });

    test('#4-4 checkbox를 클릭하면 TO-DO가 완료처리된다.', () => {
      const newTodo = new TodoListApp({
        el: div,
      });
      newTodo.initTodoList();
      newTodo.addItem();
      const liElements = newTodo.layouts.ul?.querySelectorAll('li');
      const item = liElements?.item(0);
      const checkbox = item?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox.checked).toBeFalsy();
      checkbox.click();
      expect(checkbox.checked).toBeTruthy();
    });

    test('#4-5 TO-DO목록은 ul요소 하나만 사용한다..', () => {
      todoApp.initTodoList();
      const ulElements = div.querySelectorAll('ul');
      expect(ulElements.length).toEqual(1);
    });
  });

  describe('하단 정보 출력부', () => {
    test('#5-1 하단 정보 출력부 > 전체 TO-DO 개수와 완료된 TO-DO 개수가 표시된다.', () => {
      const sample = [
        {
          id: '1',
          label: 'Test TODO1',
          isChecked: false,
          createDt: Date.now(),
        },
        {
          id: '2',
          label: 'Test TODO2',
          isChecked: true,
          createDt: Date.now(),
        },
        {
          id: '3',
          label: 'Test TODO3',
          isChecked: true,
          createDt: Date.now(),
        },
      ];
      todoApp.initTodoList();
      todoApp.dispatch(sample);
      expect(todoApp.layouts.itemCnt?.textContent).toEqual(
        Utils.replaceToken(todoApp.defaultLabel.itemCnt, sample.filter((i) => !i.isChecked).length),
      );
      expect(todoApp.layouts.clearCompleted?.querySelector('button')?.innerText).toEqual(
        Utils.replaceToken(
          todoApp.defaultLabel.clearCompleted,
          sample.filter((i) => i.isChecked).length,
        ),
      );
    });

    test('#5-2 TO-DO 목록을 필터해 볼 수 있는 기능을 제공한다', () => {
      todoApp.initTodoList();
      expect(todoApp.layouts.buttonPack).toBeTruthy();
      expect(todoApp.layouts.allItems).toBeTruthy();
      expect(todoApp.layouts.activeItems).toBeTruthy();
      expect(todoApp.layouts.completedItems).toBeTruthy();
      expect(todoApp.layouts.clearCompleted).toBeTruthy();

      todoApp.layouts.allItems?.click();
      expect(todoApp.selectedBtn).toEqual(BUTTON_TYPES.ALL_ITEMS);
      todoApp.layouts.activeItems?.click();
      expect(todoApp.selectedBtn).toEqual(BUTTON_TYPES.ACTIVE_ITEMS);
      todoApp.layouts.completedItems?.click();
      expect(todoApp.selectedBtn).toEqual(BUTTON_TYPES.COMPLETED_ITEMS);
    });
  });
});
