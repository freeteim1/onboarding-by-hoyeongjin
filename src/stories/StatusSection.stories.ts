import type { Meta, StoryObj } from '@storybook/html';
import { TodoListAppStyles } from 'src/components/todo-list-elements.components';
import TodoListApp from 'src/todo-list/todo-list';

type StatusSectionProps = {
  itemCount: number;
  buttonWrapperStyle: string;
  buttonPanelStyle: string;
  panelBtnStyle: string;
  panelLabelStyle: string;
};

const sampleStyles = new TodoListAppStyles();

const meta: Meta<StatusSectionProps> = {
  title: 'Todo List App/Status Section',
  argTypes: {
    itemCount: { control: 'number' },
    buttonWrapperStyle: { control: 'text' },
    buttonPanelStyle: { control: 'text' },
    panelBtnStyle: { control: 'text' },
    panelLabelStyle: { control: 'text' },
  },
  args: {
    itemCount: 0,
    buttonWrapperStyle: sampleStyles.buttonWrapperStyle || `{}`,
    buttonPanelStyle: sampleStyles.buttonPanelStyle || `{}`,
    panelBtnStyle: sampleStyles.panelBtnStyle || `{}`,
    panelLabelStyle: sampleStyles.panelLabelStyle || `{}`,
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
    todoStyles.buttonPanelStyle = args.buttonPanelStyle;
    todoStyles.panelBtnStyle = args.panelBtnStyle;
    todoStyles.panelLabelStyle = args.panelLabelStyle;

    const style = document.createElement('style');
    style.textContent = todoStyles.getStyles(app.instanceId);
    root.className = `${todoStyles.clsNames.root} ${app.instanceId}`;

    app.layouts.buttonWrapper = app.createToolboxElements();

    const list = new Array(args.itemCount).fill(0).map((i) => {
      return {
        id: String(Math.random()),
        label: `Sample Item ${i + 1}`,
        isChecked: false,
        createDt: Date.now(),
      };
    });
    app.dispatch(list);
    root.appendChild(style);
    root.appendChild(app.layouts.buttonWrapper);
    host.appendChild(root);
    return host;
  },
};
