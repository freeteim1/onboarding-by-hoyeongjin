import type { Meta, StoryObj } from '@storybook/html';
import TodoListApp from '../todo-list/todo-list';
import { type TodoListAppOptions } from '../types/todo.types';

const meta: Meta<TodoListAppOptions> = {
  title: 'Todo List App', // Default 이름으로 노출되는 문제
  argTypes: {
    placeholder: { control: 'text' },
    items: {
      control: {
        type: 'object',
      },
    },
  },
  args: {
    placeholder: 'What needs to be done?',
    items: [
      {
        id: '1758596983531',
        label: 'Sample Item 1',
        isChecked: false,
        createDt: 1758596983531,
      },
      {
        id: '1758596983532',
        label: 'Sample Item 2',
        isChecked: false,
        createDt: 1758596983532,
      },
    ],
  },
};
export default meta;

type Story = StoryObj<TodoListAppOptions>;

export const Default: Story = {
  render: (args) => {
    const host = document.createElement('div'); // Storybook이 감싸줄 루트
    const root = document.createElement('div'); // TodoListApp이 붙을 실제 element
    const app = new TodoListApp({
      el: root,
      placeholder: args.placeholder,
      items: args.items,
    });
    app.render();
    host.appendChild(root);
    return host;
  },
};
