import type { Meta, StoryObj } from '@storybook/html';
import { TodoListAppStyles } from 'src/components/todo-list-styles.components';
import TodoListApp from 'src/todo-list/todo-list';

type NoTodoItemProps = {
  ulStyle: string;
  liStyle: string;
};

const meta: Meta<NoTodoItemProps> = {
  title: 'Todo List App/List Section/No Todo Items',
  argTypes: {
    ulStyle: { control: 'text' },
  },
  args: {
    ulStyle: new TodoListAppStyles().ulStyle || `{}`,
  },
};

export default meta;
type Story = StoryObj<NoTodoItemProps>;

export const NoTodoItems: Story = {
  render: (args) => {
    const host = document.createElement('div');
    const root = document.createElement('div');
    const app = new TodoListApp({
      el: root,
    });
    const todoStyles = new TodoListAppStyles();
    todoStyles.ulStyle = args.ulStyle;

    const style = document.createElement('style');
    style.textContent = todoStyles.getStyles(app.instanceId);
    root.className = `${todoStyles.clsNames.root} ${app.instanceId}`;

    app.layouts.ul = app.builder.createTodoListElement();
    app.dispatch();

    root.appendChild(style);
    root.appendChild(app.layouts.ul);
    host.appendChild(root);
    return host;
  },
};
