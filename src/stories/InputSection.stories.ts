import type { Meta, StoryObj } from '@storybook/html';
import { TodoListAppStyles } from 'src/components/todo-list-elements.components';
import TodoListApp from 'src/todo-list/todo-list';

type InputSectionProps = {
  placeholder: string;
  inputStyle: string;
};

const meta: Meta<InputSectionProps> = {
  title: 'Todo List App/Input Section',
  argTypes: {
    placeholder: { control: 'text' },
    inputStyle: { control: 'text' },
  },
  args: {
    placeholder: 'What needs to be done?',
    inputStyle: new TodoListAppStyles().inputStyle || `{}`,
  },
};

export default meta;
type Story = StoryObj<InputSectionProps>;

export const InputSection: Story = {
  render: (args) => {
    const host = document.createElement('div');
    const root = document.createElement('div');
    const app = new TodoListApp({
      el: host,
      placeholder: args.placeholder,
    });
    const todoStyles = new TodoListAppStyles();
    todoStyles.inputStyle = args.inputStyle;

    const style = document.createElement('style');
    style.textContent = todoStyles.getStyles(app.instanceId);

    const input = app.createInputElements();
    root.appendChild(style);
    root.className = `${todoStyles.clsNames.root} ${app.instanceId}`;

    root.appendChild(input);
    host.appendChild(root);
    return host;
  },
};
