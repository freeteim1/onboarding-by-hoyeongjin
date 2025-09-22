import TodoListApp from "./todo-list";

describe('TodoListApp', () => {

    let div: HTMLDivElement;
    let todoApp: TodoListApp;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        div = document.getElementById('app')! as HTMLDivElement;
        todoApp = new TodoListApp({ el: div });
    });

    test('#1 check instance id', () => {
        expect(todoApp.instanceId).toBeTruthy()
    });

    test('#2 UI는 TO-DO 입력부와 TO-DO 목록 출력부, 정보 출력부로 나뉜다.', () => {
        const createInputElementsSpy = jest.spyOn(todoApp as any, 'createInputElements');
        const createListElementsSpy = jest.spyOn(todoApp as any, 'createListElements');
        const createInfomationElementsSpy = jest.spyOn(todoApp as any, 'createInfomationElements');

        todoApp.initTodoList();

        expect(createInputElementsSpy).toHaveBeenCalledTimes(1);
        expect(createListElementsSpy).toHaveBeenCalledTimes(1);
        expect(createInfomationElementsSpy).toHaveBeenCalledTimes(1);
    });

    test('#3 TO-DO 입력부 체크', () => {
        const createInputSpy = jest.spyOn(todoApp as any, 'createInput');
        todoApp.createInputElements();
        expect(createInputSpy).toHaveBeenCalledTimes(1);
    });

    test('#3-1 TO-DO 입력부 > createInput 체크', () => {
        const el = todoApp.createInput();
        expect(el).toBeInstanceOf(HTMLInputElement);
    });

});