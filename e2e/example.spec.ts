import { test, expect } from '@playwright/test';
import { TodoListAppStyles } from 'src/components/todo-list-styles.components';
import { DEFAULT_LABEL } from 'src/constants/todo-list.const';
import { Utils } from 'src/types/todo.types';

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

  test('할 일 항목이 존재하지 않는다면 "There are no to-do items. Please write your to-dos." 메세지를 노출한다.', async ({
    page,
  }) => {
    const todoUl = page.locator(`.${todoStyles.clsNames.ul}`).first();
    const li = todoUl.locator('li').first();
    expect(li.first()).toContainText('There are no to-do items. Please write your to-dos.');
  });

  test.describe('할 일을 입력한 후 엔터키를 누르면', () => {
    test('입력한 항목이 할 일 목록에 노출된다.', async ({ page }) => {
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

    test(
      '할 일 항목의 완료하지 않은 갯수가 ' + DEFAULT_LABEL.itemCnt + '  로 노출된다.',
      async ({ page }) => {
        const root = page.locator(`div.${todoStyles.clsNames.root}`).first();
        const ul = root.locator(`.${todoStyles.clsNames.ul}`);
        const input = root.locator(`.${todoStyles.clsNames.input}`);
        const itemCnt = root.locator(`.${todoStyles.clsNames.count}`);
        const li = ul.locator('li');

        await input.fill('1. 스토리북 작성하기.');
        await input.press('Enter');

        await input.fill('2. jest 테스트 작성하기');
        await input.press('Enter');

        await input.fill('3. Playwright로 테스트 작성하기'); // <<- click
        await input.press('Enter');

        expect(await itemCnt.textContent()).toBe(Utils.replaceToken(DEFAULT_LABEL.itemCnt, 3));
        await li.first().click();
        expect(await itemCnt.textContent()).toBe(Utils.replaceToken(DEFAULT_LABEL.itemCnt, 2));
      },
    );
  });

  test.describe('할 일 항목을 체크하면', () => {
    test('완료된 항목은 목록의 맨 하단으로 이동된다.', async ({ page }) => {
      const root = page.locator(`div.${todoStyles.clsNames.root}:not(.useDnD)`).first();
      const input = root.locator(`.${todoStyles.clsNames.input}`);
      const li = root.locator(`.${todoStyles.clsNames.li}`);

      await input.fill('1. 스토리북 작성하기.');
      await input.press('Enter');

      await input.fill('2. jest 테스트 작성하기');
      await input.press('Enter');

      await input.fill('3. Playwright로 테스트 작성하기'); // <<- click
      await input.press('Enter');

      expect(li.last()).toContainText('1. 스토리북 작성하기.'); // 가장 먼저 입력됐으니 last
      await li.first().click();

      expect(li.last()).not.toContainText('1. 스토리북 작성하기.'); // last 바뀜 검증
      expect(li.last()).toContainText('3. Playwright로 테스트 작성하기');
      expect(li.last().locator('input[type=checkbox]')).toBeChecked();
    });
  });

  test.describe('"Clear completed" 버튼을 클릭하면', () => {
    test('완료된 항목은 목록에서 제거된다. + 완료된 항목 갯수가 0으로 초기화 된다.', async ({
      page,
    }) => {
      const root = page.locator(`div.${todoStyles.clsNames.root}:not(.useDnD)`).first();
      const input = root.locator(`.${todoStyles.clsNames.input}`);
      const li = root.locator(`.${todoStyles.clsNames.li}`);
      const clearBtn = root.locator(`div.${todoStyles.clsNames.clear}`);

      await input.fill('1. 스토리북 작성하기.');
      await input.press('Enter');

      await input.fill('2. jest 테스트 작성하기');
      await input.press('Enter');

      await input.fill('3. Playwright로 테스트 작성하기'); // <<- click
      await input.press('Enter');

      expect(await li.count()).toBe(3);
      await li.first().click();

      expect(await li.count()).toBe(3);
      await clearBtn.click();

      expect(await li.count()).toBe(2);
      expect(li.locator('input[type=checkbox]:checked')).toHaveCount(0); // 체크된 인풋이 실제로 없는지
      expect(await clearBtn.allTextContents()).toContain('Clear Completed (0)');
    });
  });

  test.describe('보기 타입 버튼 메뉴에서', () => {
    test('"Active" 버튼을 클릭하면 완료되지 않은 목록을 노출한다.', async ({ page }) => {
      const root = page.locator(`div.${todoStyles.clsNames.root}:not(.useDnD)`).first();
      const input = root.locator(`.${todoStyles.clsNames.input}`);
      const li = root.locator(`.${todoStyles.clsNames.li}`);
      const activeBtn = root
        .locator(`.${todoStyles.clsNames.filter}`)
        .filter({ hasText: 'Active' });

      await input.fill('1. 스토리북 작성하기.');
      await input.press('Enter');

      await input.fill('2. jest 테스트 작성하기');
      await input.press('Enter');

      await input.fill('3. Playwright로 테스트 작성하기'); // <<- click
      await input.press('Enter');

      await li.first().click();

      expect(await li.count()).toBe(3);
      await activeBtn.click();
      expect(await li.count()).toBe(2);
      expect(li.locator('input[type=checkbox]:checked')).toHaveCount(0);
    });

    test('"Completed" 버튼을 클릭하면 완료된 항목을 노출한다.', async ({ page }) => {
      const root = page.locator(`div.${todoStyles.clsNames.root}:not(.useDnD)`).first();
      const input = root.locator(`.${todoStyles.clsNames.input}`);
      const li = root.locator(`.${todoStyles.clsNames.li}`);
      const completedBtn = root
        .locator(`.${todoStyles.clsNames.filter}`)
        .filter({ hasText: 'Completed' });

      await input.fill('1. 스토리북 작성하기.');
      await input.press('Enter');

      await input.fill('2. jest 테스트 작성하기');
      await input.press('Enter');

      await input.fill('3. Playwright로 테스트 작성하기'); // <<- click
      await input.press('Enter');

      await li.first().click();

      expect(await li.count()).toBe(3);
      await completedBtn.click();
      expect(await li.count()).toBe(1);
      expect(li.locator('input[type=checkbox]:checked')).toHaveCount(1);
    });
  });

  test('D&D 마지막 요소를 맨앞에', async ({ page }) => {
    const root = page.locator(`div.${todoStyles.clsNames.root}.useDnD`).first();
    const ul = root.locator(`.${todoStyles.clsNames.ul}`).first();
    const li = ul.locator('li');
    const input = root.locator(`.${todoStyles.clsNames.input}`).first();
    const items: string[] = ['Test TODO1', 'Test TODO2', 'Test TODO3', 'Test TODO4'];

    expect(ul).toBeTruthy();

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
