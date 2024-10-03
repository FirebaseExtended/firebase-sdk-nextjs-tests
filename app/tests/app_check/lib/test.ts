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
import { AppCheckToken, CustomProvider, initializeAppCheck, getToken } from 'firebase/app-check';
import { firebaseConfig } from 'lib/firebase';
import { OK, FAILED } from 'lib/util';

export type TestResults = {
  initializeAppResult: string,
  initializeAppCheckResult: string,
  getTokenResult: string,
  deleteAppResult: string
};

export function initializeTestResults(): TestResults {
  return {
    initializeAppResult: FAILED,
    initializeAppCheckResult: FAILED,
    getTokenResult: FAILED,
    deleteAppResult: FAILED
  };
}

export async function testAppCheck(): Promise<TestResults> {
  const result: TestResults = initializeTestResults();
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    if (initializeApp !== null) {
      result.initializeAppResult = OK;
      const appCheck = initializeAppCheck(firebaseApp, {
        provider: new CustomProvider({
          getToken: () => Promise.resolve({ token: 'abcd' } as AppCheckToken)
        })
      });
      if (appCheck !== null) {
        result.initializeAppCheckResult = OK;
        await getToken(appCheck);
        result.getTokenResult = OK;
      }
      deleteApp(firebaseApp);
      result.deleteAppResult = OK;
    }
  } catch (e) {
    console.log("Caught error: ", e);
  }
  return result;
}
