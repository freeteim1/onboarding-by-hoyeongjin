import { test, expect } from '@playwright/test';
import { TodoListAppStyles } from 'src/components/todo-list-styles.components';

test.describe('Todo List App', () => {
  let todoStyles: TodoListAppStyles;
  test.beforeEach(async ({ page }) => {
    todoStyles = new TodoListAppStyles();
    await page.goto('/');
  });

  test('UI 요소가 보인다', async ({ page }) => {
    const todo = page.locator(`div.${todoStyles.clsNames.root}`);
    const todoUl = page.locator(`.${todoStyles.clsNames.ul}`);
    const input = page.locator(`.${todoStyles.clsNames.input}`);
    const itemCnt = page.locator(`.${todoStyles.clsNames.count}`);
    const allBtn = page.locator(`.${todoStyles.clsNames.filter}`).filter({ hasText: 'All' });
    const activeBtn = page.locator(`.${todoStyles.clsNames.filter}`).filter({ hasText: 'Active' });
    const completedBtn = page
      .locator(`.${todoStyles.clsNames.filter}`)
      .filter({ hasText: 'Completed' });
    const clearDiv = page.locator(`div.${todoStyles.clsNames.clear}`);

    expect(todo).toBeTruthy();
    expect(await todoUl.count()).toBeTruthy();
    expect(await input.count()).toBeTruthy();
    expect(await itemCnt.count()).toBeTruthy();
    expect(await allBtn.count()).toBeTruthy();
    expect(await activeBtn.count()).toBeTruthy();
    expect(await completedBtn.count()).toBeTruthy();
    expect(await clearDiv.count()).toBeTruthy();
  });

  test('할 일을 입력한 후 엔터키를 누르면', async ({ page }) => {
    const sampleTxt = 'Playwright로 테스트 작성하기';

    const todoUl = page.locator(`.${todoStyles.clsNames.ul}`).first();
    const input = page.locator(`.${todoStyles.clsNames.input}`).first();
    const li = todoUl.locator('li').filter({ hasText: sampleTxt });

    expect(await li.count()).toBe(0); // 입력 전

    await input.fill(sampleTxt);
    await input.focus();
    await input.press('Enter');

    expect(await li.count()).toBeGreaterThanOrEqual(1); // 입력 후
  });

  test('D&D 마지막 요소를 맨앞에', async ({ page }) => {
    const todoUl = page.locator(`.${todoStyles.clsNames.ul}`).first();
    const li = todoUl.locator('li');
    const input = page.locator(`.${todoStyles.clsNames.input}`).first();

    const items: string[] = ['Test TODO1', 'Test TODO2', 'Test TODO3', 'Test TODO4'];

    await input.fill(items[0] ?? '');
    await input.press('Enter');
    await page.waitForTimeout(100);

    await input.fill(items[1] ?? '');
    await input.press('Enter');
    await page.waitForTimeout(100);

    await input.fill(items[2] ?? '');
    await input.press('Enter');
    await page.waitForTimeout(100);

    await input.fill(items[3] ?? '');
    await input.press('Enter');
    await page.waitForTimeout(100);

    await page.dragAndDrop(
      `.${todoStyles.clsNames.li} >> nth=3`,
      `.${todoStyles.clsNames.li} >> nth=0`,
    );
    await page.waitForTimeout(100);

    expect(await li.nth(0).textContent()).toContain(items[3]);
  });
});
