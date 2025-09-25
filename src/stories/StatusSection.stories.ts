import type { Meta, StoryObj } from '@storybook/html';
import { TodoListAppStyles } from 'src/components/todo-list-styles.components';
import TodoListApp from 'src/todo-list/todo-list';
import { Utils } from 'src/types/todo.types';

const sampleData = new Array(3).fill(0).map((i) => {
  return {
    id: Utils.createRandomKey(4),
    label: `Sample Item ${i + 1}`,
    isChecked: false,
    createDt: Date.now(),
  };
});

type StatusSectionProps = {
  items: typeof sampleData;

  buttonWrapperStyle: string;
  buttonPackStyle: string;
  btnCntStyle: string;
  btnFilterStyle: string;
  divClearStyle: string;

  panelBtnStyle: string;
  panelLabelStyle: string;
};

const sampleStyles = new TodoListAppStyles();

const meta: Meta<StatusSectionProps> = {
  title: 'Todo List App/Status Section',
  argTypes: {
    items: { control: 'object' },
    buttonWrapperStyle: { control: 'text' },
    buttonPackStyle: { control: 'text' },
    btnCntStyle: { control: 'text' },
    btnFilterStyle: { control: 'text' },
    divClearStyle: { control: 'text' },
  },
  args: {
    items: sampleData,
    buttonWrapperStyle: sampleStyles.buttonWrapperStyle || `{}`,
    buttonPackStyle: sampleStyles.buttonPackStyle || `{}`,
    btnCntStyle: sampleStyles.btnCntStyle || `{}`,
    btnFilterStyle: sampleStyles.btnFilterStyle || `{}`,
    divClearStyle: sampleStyles.divClearStyle || `{}`,
  },
};

export default meta;
type Story = StoryObj<StatusSectionProps>;

export const StatusSection: Story = {
  render: (args) => {
    const host = document.createElement('div');
    const root = document.createElement('div');
    const app = new TodoListApp({
      el: root,
    });

    const todoStyles = new TodoListAppStyles();
    todoStyles.buttonWrapperStyle = args.buttonWrapperStyle;
    todoStyles.buttonPackStyle = args.buttonPackStyle;
    todoStyles.btnCntStyle = args.btnCntStyle;
    todoStyles.btnFilterStyle = args.btnFilterStyle;
    todoStyles.divClearStyle = args.divClearStyle;

    const style = document.createElement('style');
    style.textContent = todoStyles.getStyles(app.instanceId);
    root.className = `${todoStyles.clsNames.root} ${app.instanceId}`;

    const {
      wrapper,
      buttonPack,
      elItemCnt,
      elAllItems,
      elActiveItems,
      elCompletedItems,
      elClearCompleted,
    } = app.elements.createToolboxElements(); //TO DO 정보 출력부

    app.layouts.buttonWrapper = wrapper;

    [elAllItems, elActiveItems, elCompletedItems].forEach((btn) => buttonPack.appendChild(btn));
    [elItemCnt, buttonPack, elClearCompleted].forEach((el) => wrapper.appendChild(el));

    app.layouts.itemCnt = elItemCnt;
    app.layouts.buttonPack = buttonPack;
    app.layouts.allItems = elAllItems;
    app.layouts.activeItems = elActiveItems;
    app.layouts.completedItems = elCompletedItems;
    app.layouts.clearCompleted = elClearCompleted;

    root.appendChild(style);
    root.appendChild(wrapper);
    host.appendChild(root);

    app.dispatch(args.items);

    return host;
  },
};
