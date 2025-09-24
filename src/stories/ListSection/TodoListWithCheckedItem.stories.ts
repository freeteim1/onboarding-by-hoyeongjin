import type { Meta, StoryObj } from '@storybook/html';
import { TodoListAppStyles } from 'src/components/todo-list-styles.components';
import TodoListApp from 'src/todo-list/todo-list';
import { TodoListItem } from 'src/types/todo.types';

type TodoListWithCheckedItemsProps = {
  items: TodoListItem[];
  placeholder: string;
  ulStyle: string;
  liStyle: string;
};

const sampleItems: TodoListItem[] = [
  {
    id: '1758596983531',
    label: 'Sample Item 1',
    isChecked: true,
    createDt: 1758596983531,
  },
  {
    id: '1758596983532',
    label: 'Sample Item 2',
    isChecked: true,
    createDt: 1758596983532,
  },
  {
    id: '1758596983533',
    label: 'Sample Item 3',
    isChecked: true,
    createDt: 1758596983533,
  },
];

const sampleStyles = new TodoListAppStyles();

const meta: Meta<TodoListWithCheckedItemsProps> = {
  title: 'Todo List App/List Section/Todo List With Checked Items',
  argTypes: {
    items: {
      control: {
        type: 'object',
      },
    },
    ulStyle: { control: 'text' },
    liStyle: { control: 'text' },
  },
  args: {
    items: sampleItems,
    ulStyle: sampleStyles.ulStyle || `{}`,
    liStyle: sampleStyles.liStyle || `{}`,
  },
};

export default meta;
type Story = StoryObj<TodoListWithCheckedItemsProps>;

export const TodoListWithCheckedItems: Story = {
  render: (args) => {
    const host = document.createElement('div');
    const root = document.createElement('div');

    const app = new TodoListApp({
      el: root,
      placeholder: args.placeholder,
      items: args.items,
    });

    const todoStyles = new TodoListAppStyles();
    todoStyles.ulStyle = args.ulStyle;
    todoStyles.liStyle = args.liStyle;

    const style = document.createElement('style');
    style.textContent = todoStyles.getStyles(app.instanceId);
    root.className = `${todoStyles.clsNames.root} ${app.instanceId}`;

    app.layouts.ul = app.elements.createListElements();
    app.dispatch();

    root.appendChild(style);
    root.appendChild(app.layouts.ul);
    host.appendChild(root);
    return host;
  },
};
