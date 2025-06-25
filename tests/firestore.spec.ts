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
  await expect(page.getByTitle('initializeFirestoreResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('createDocInstanceResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('setDocResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('onSnapshotSetDR')).not.toContainText("FAILED");
  await expect(page.getByTitle('updateDocResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('onSnapshotUpdateDR')).not.toContainText("FAILED");
  await expect(page.getByTitle('getDocResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('querySnapshotResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('documentSnapshotBundleResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('reconstitutedDocDataResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('querySnapshotBundleResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('reconstitutedQueryDataResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('documentSnapshotOnSnapshotResumeResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('querySnapshotOnSnapshotResumeResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('deleteDocResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('onSnapshotDeleteDR')).not.toContainText("FAILED");
  await expect(page.getByTitle('getDeletedDocResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('deleteAppResult')).not.toContainText("FAILED");
  
  // Client side tests
  await expect(page.getByTitle('clientSideDocumentSnapshotResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('clientSideDocumentSnapshotOnResumeResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('clientSideQuerySnapshotResult')).not.toContainText("FAILED");
  await expect(page.getByTitle('clientSideQuerySnapshotOnResumeResult')).not.toContainText("FAILED");
}

test('firestore operations should pass - client', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/tests/firestore/web_client`);
  await expect(page.getByTitle('testStatus')).toContainText('Complete', { timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Firestore CSR Test');
  await commonExpectations(page);
});

test('firestore operations should pass - server', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/tests/firestore/web_ssr`);
  await expect(page.getByTitle('testStatus')).toContainText('Complete', { timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Firestore SSR Test');
  await commonExpectations(page);
});
