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

test.describe.configure({ mode: 'serial' });

async function commonExpectations(page) {
  await expect(page.getByTitle('initializeAppResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('initializeAuthResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('authUserSignedInResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('initializeFunctionsResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('createCallTestResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('callTestInvokedSuccessfullyResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('callTestResponseResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('httpCallableTestInvokedSuccessfullyResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('httpCallableResponseResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('deleteUserResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('authSignedOutResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('deleteAppResult')).not.toContainText("FAILED");
}

test('functions operations should pass - client', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/tests/functions/web_client`);
  await expect(page.getByTitle('testStatus')).toContainText('Complete', { timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Functions CSR Test');
  await commonExpectations(page);
});

test('functions operations should pass - server', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/tests/functions/web_ssr`);
  await expect(page.getByTitle('testStatus')).toContainText('Complete', { timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Functions SSR Test');
  await commonExpectations(page);
});
