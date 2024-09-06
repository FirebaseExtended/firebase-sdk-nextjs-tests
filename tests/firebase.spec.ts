/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { test, expect } from '@playwright/test';

test.afterEach(async ({ page, baseURL }) => { });
test.beforeEach(async ({ page, baseURL }) => { });

test('auth operations should pass - client', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/auth_web`);
  await expect(page.getByTitle('testStatus')).toContainText('Complete', {timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Auth CSR Test');
  await expect(page.getByTitle('initializeAppResult')).toContainText("OK");
  await expect(page.getByTitle('signInAnonymouslyResult')).toContainText("OK");
  await expect(page.getByTitle('getTokenResult')).toContainText("OK");
  await expect(page.getByTitle('deleteUserResult')).toContainText("OK");
  await expect(page.getByTitle('deleteAppResult')).toContainText("OK");
});

test('auth operations should pass - server', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/auth_web_ssr`);
  await expect(page.getByTitle('testStatus')).toContainText('Complete', {timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Auth SSR Test');
  await expect(page.getByTitle('initializeAppResult')).toContainText("OK");
  await expect(page.getByTitle('signInAnonymouslyResult')).toContainText("OK");
  await expect(page.getByTitle('getTokenResult')).toContainText("OK");
  await expect(page.getByTitle('deleteUserResult')).toContainText("OK");
  await expect(page.getByTitle('deleteAppResult')).toContainText("OK");
});
