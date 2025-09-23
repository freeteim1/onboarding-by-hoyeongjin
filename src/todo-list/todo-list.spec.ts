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
    const createInputElementsSpy = jest.spyOn(todoApp as any, 'createInputElements');
    const createListElementsSpy = jest.spyOn(todoApp as any, 'createListElements');
    const createInformationElementsSpy = jest.spyOn(todoApp as any, 'createInformationElements');

    todoApp.initTodoList();

    expect(createInputElementsSpy).toHaveBeenCalledTimes(1);
    expect(createListElementsSpy).toHaveBeenCalledTimes(1);
    expect(createInformationElementsSpy).toHaveBeenCalledTimes(1);
  });

  test('#3 TO-DO 입력부', () => {
    const createInputSpy = jest.spyOn(todoApp as any, 'createInput');
    todoApp.createInputElements();
    expect(createInputSpy).toHaveBeenCalledTimes(1);
  });

  test('#3-1 TO-DO 입력 받을 수 있는 input요소가 있다.', () => {
    const el = todoApp.createInput();
    expect(el).toBeInstanceOf(HTMLInputElement);
  });

  test('#3-2 > TO-DO를 입력하고 Enter키를 누르면 TO-DO를 등록할 수 있다.', () => {
    const addItemSpy = jest.spyOn(todoApp as any, 'addItem');
    const input = todoApp.createInput(
      () => {},
      () => todoApp.addItem(),
    );
    input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
    expect(addItemSpy).toHaveBeenCalledTimes(1);
  });

  test('#3-3 등록된 TO-DO는 TO-DO 목록 상단에 추가되며, 등록과 동시에 입력했던 TO-DO 텍스트의 내용은 초기화된다.', () => {
    // pass: css 파싱불가로 render() 사용 불가
    // const newDiv = document.createElement('div');
    // const newApp = new TodoListApp({
    //   el: newDiv,
    //   items: [
    //     {
    //       id: '1',
    //       label: 'Test TODO1',
    //       isChecked: false,
    //       createDt: Date.now(),
    //     },
    //     {
    //       id: '2',
    //       label: 'Test TODO2',
    //       isChecked: false,
    //       createDt: Date.now(),
    //     },
    //   ],
    // });
    // newApp.render();
    // const li = newDiv.querySelectorAll('li');
    // console.log(li);
  });

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
  });
});
