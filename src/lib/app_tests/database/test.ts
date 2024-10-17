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

import { deleteApp, initializeApp } from 'firebase/app';
import { getDatabase, update, off, onValue, ref, remove, set } from 'firebase/database';
import { firebaseConfig } from '@/lib/app_tests/firebase';
import { OK, OK_SKIPPED, FAILED } from '@/lib/app_tests/util';

export type TestResults = {
  initializeAppResult: string,
  initializeDatabaseResult: string,
  createRefResult: string,
  deleteSetValueListenerResult: string,
  deleteUpdateValueListenerResult: string,
  deleteRemoveValueListenerResult: string,
  setValueResult: string,
  updateValueResult: string,
  deleteValueResult: string,
  deleteAppResult: string
};

export function initializeTestResults(): TestResults {
  return {
    initializeAppResult: FAILED,
    initializeDatabaseResult: FAILED,
    createRefResult: FAILED,
    deleteSetValueListenerResult: FAILED,
    deleteUpdateValueListenerResult: FAILED,
    deleteRemoveValueListenerResult: FAILED,
    setValueResult: FAILED,
    updateValueResult: FAILED,
    deleteValueResult: FAILED,
    deleteAppResult: FAILED
  };
}
export async function testDatabase(isServer: boolean = false): Promise<TestResults> {
  const result: TestResults = initializeTestResults();
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    if (firebaseApp === null) {
      return result;
    }
    result.initializeAppResult = OK;

    const db = getDatabase(firebaseApp);
    if (db === null) {
      return result;
    }
    result.initializeDatabaseResult = OK;

    const dbRef = ref(db, 'abc/def');
    if (dbRef === null) {
      return result;
    }
    result.createRefResult = OK;

    // Set test.
    onValue(dbRef, snap => {
      if (snap.exists()) {
        const value = snap.val();
        if (value.text !== undefined && value.text === 'string 123 xyz') {
          result.setValueResult = OK;
        }
      }
    });
    await set(dbRef, { text: 'string 123 xyz' });
    off(dbRef);
    result.deleteSetValueListenerResult = OK;

    // Update test.
    onValue(dbRef, snap => {
      if (snap.exists()) {
        const value = snap.val();
        if (value.number !== undefined && value.number === 987) {
          result.updateValueResult = OK;
        }
      }
    });
    await update(dbRef, { number: 987 });
    off(dbRef);
    result.deleteUpdateValueListenerResult = OK;

    // Remove test.
    onValue(dbRef, snap => {
      if (!snap.exists()) {
        result.deleteValueResult = OK;
      }
    });
    await remove(dbRef);
    off(dbRef);

    result.deleteRemoveValueListenerResult = OK;

    // Note: Deleting the app hangs the SSR pass on playwright on Firefox
    // and Chromium, but the hang does not occur when manually testing with
    // those browsers.
    if (isServer) {
      result.deleteAppResult = OK_SKIPPED;
    } else {
      deleteApp(firebaseApp);
      result.deleteAppResult = OK;
    }
  } catch (e) {
    console.log("Caught error: ", e);
  }
  return result;
}