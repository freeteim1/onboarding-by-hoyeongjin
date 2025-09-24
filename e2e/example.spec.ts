import { test, expect } from '@playwright/test';
import { TodoListAppStyles } from 'src/components/todo-list-styles.components';

test.describe('Todo List App', () => {
  let todoStyles: TodoListAppStyles;
  test.beforeEach(async ({ page }) => {
    todoStyles = new TodoListAppStyles();
    await page.goto('/');
  });

  test('UI 요소가 보인다', async ({ page }) => {
    await expect(page.locator(`div.${todoStyles.clsNames.root}`)).toBeVisible();
    // await expect(page.locator(`input[type="text"]`)).toBeVisible();
    // await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
    // await expect(page.getByRole('list')).toBeVisible();
    // await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    // await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
    // await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();
    // await expect(page.getByRole('button', { name: 'Clear Completed' })).toBeVisible();
    // await expect(page.getByText('0 items left')).toBeVisible();
  });
});
