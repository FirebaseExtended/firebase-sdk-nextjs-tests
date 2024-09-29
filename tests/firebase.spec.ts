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

// Run tests in serial to avoid Auth user conflicts.
test.describe.configure({ mode: 'serial' });

test.afterEach(async ({ page, baseURL }) => { });
test.beforeEach(async ({ page, baseURL }) => { });

async function commonExpectations(page) {
  await expect(page.getByTitle('initializeAppResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('signInAnonymouslyResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('getTokenResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('initializeServerAppResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('getAuthServerAppResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('getServerAppUserResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('deleteServerAppResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('deleteUserResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('deleteAppResult')).not.toContainText("FAILED");
}

test('auth operations should pass - client', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/tests/auth/auth_web_client`);
  await expect(page.getByTitle('testStatus')).toContainText('Complete', { timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Auth CSR Test');
  await commonExpectations(page);
});

test('auth operations should pass - server', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/tests/auth/auth_web_ssr`);
  await expect(page.getByTitle('testStatus')).toContainText('Complete', { timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Auth SSR Test');
  await commonExpectations(page);
});
