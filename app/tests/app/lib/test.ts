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
import { getApp, deleteApp, initializeApp, initializeServerApp } from 'firebase/app';
import { firebaseConfig } from 'lib/firebase';
import { OK, OK_SKIPPED, FAILED } from 'lib/util';

export type TestResults = {
  initializeAppResult: string,
  getAppResult: string,
  deleteAppResult: string,
  initializeServerAppResult: string,
  deleteServerAppResult: string
};

export function initializeTestResults(): TestResults {
  return {
    initializeAppResult: FAILED,
    getAppResult: FAILED,
    deleteAppResult: FAILED,
    initializeServerAppResult: FAILED,
    deleteServerAppResult: FAILED
  };
}

export async function testApp(isServer: boolean = false): Promise<TestResults> {
  const result: TestResults = initializeTestResults();
  try {
    const firebaseApp = initializeApp(firebaseConfig, "appTest");
    if (firebaseApp !== null) {
      result.initializeAppResult = OK;
      const retrievedAppInstance = getApp("appTest");
      if (retrievedAppInstance.name === firebaseApp.name) {
        result.getAppResult = OK;
      }
      deleteApp(firebaseApp);
      result.deleteAppResult = OK;
    }
    if (!isServer) {
      result.initializeServerAppResult = OK_SKIPPED;
      result.deleteServerAppResult = OK_SKIPPED;
    } else {
      const serverApp = initializeServerApp(firebaseConfig, {});
      if (serverApp !== null) {
        result.initializeServerAppResult = OK;
        deleteApp(serverApp);
        result.deleteServerAppResult = OK;
      }
    }
  } catch (e) {
    console.log("Caught error: ", e);
  }
  return result;
}
