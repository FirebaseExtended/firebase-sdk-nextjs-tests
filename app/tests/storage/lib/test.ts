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

import { deleteUser, getAuth, signInAnonymously } from 'firebase/auth';
import { deleteApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from 'lib/firebase';
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import { OK, FAILED, waitForUserSignIn } from 'lib/util';

export type TestResults = {
  initializeAppResult: string,
  initializeAuthResult: string,
  authUserSignedInResult: string,
  initializeStorageResult: string,
  createStorageRefResult: string,
  uploadStringResult: string,
  getDownloadUrlResult: string,
  fetchCompletedResult: string,
  getResponseTextResult: string,
  getDataMatchesExepctedResult: string,
  deleteReferenceResult: string,
  deleteUserResult: string,
  authSignedOutResult,
  deleteAppResult: string
};

export function initializeTestResults(): TestResults {
  return {
    initializeAppResult: FAILED,
    initializeAuthResult: FAILED,
    authUserSignedInResult: FAILED,
    initializeStorageResult: FAILED,
    createStorageRefResult: FAILED,
    uploadStringResult: FAILED,
    getDownloadUrlResult: FAILED,
    fetchCompletedResult: FAILED,
    getResponseTextResult: FAILED,
    getDataMatchesExepctedResult: FAILED,
    deleteReferenceResult: FAILED,
    deleteUserResult: FAILED,
    authSignedOutResult: FAILED,
    deleteAppResult: FAILED
  };
}

export async function testStorage(isServer: boolean = false): Promise<TestResults> {
  const result: TestResults = initializeTestResults();
  if (isServer) {
    console.log("server app");
  }

  try {
    const firebaseApp = initializeApp(firebaseConfig);
    if (firebaseApp === null) {
      return result;
    }
    result.initializeAppResult = OK;

    const auth = getAuth(firebaseApp);
    await auth.authStateReady();
    result.initializeAuthResult = OK;

    await signInAnonymously(auth);
    await waitForUserSignIn(auth);
    if (auth.currentUser) {
      result.authUserSignedInResult = OK;

      const storage = getStorage(firebaseApp);
      if (storage) {
        result.initializeStorageResult = OK;
        const reference = ref(storage, '/next-js-test.txt');
        if (reference) {
          const storageText = 'next-js-test-string';
          result.createStorageRefResult = OK;
          await uploadString(reference, storageText);
          result.uploadStringResult = OK;
          const url = await getDownloadURL(reference);
          if (url) {
            result.getDownloadUrlResult = OK;
            const response = await fetch(url);
            result.fetchCompletedResult = OK;
            const data = await response.text();
            result.getResponseTextResult = OK;
            if (data === storageText) {
              result.getDataMatchesExepctedResult = OK;
            }
          }
          await deleteObject(reference);
          result.deleteReferenceResult = OK;
        }
      }
      await deleteUser(auth.currentUser);
      result.deleteUserResult = OK;

      await auth.signOut();
      result.authSignedOutResult = OK;
    }
    deleteApp(firebaseApp);
    result.deleteAppResult = OK;
  } catch (e) {
    console.error("Caught error: ", e);
  }
  return result;
}
