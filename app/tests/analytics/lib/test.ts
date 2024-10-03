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
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { firebaseConfig } from 'lib/firebase';
import { OK, OK_SKIPPED, FAILED, sleep } from 'lib/util';

export type TestResults = {
  initializeAppResult: string,
  isSupportedResult: string,
  getAnalyticsResult: string,
  logEventResult: string,
  deleteAppResult: string
};

export function initializeTestResults(): TestResults {
  const testAnalyticsResult: TestResults = {
    initializeAppResult: FAILED,
    isSupportedResult: FAILED,
    getAnalyticsResult: FAILED,
    logEventResult: FAILED,
    deleteAppResult: FAILED
  };
  return testAnalyticsResult;
}

export async function testAnalytics(isServerApp: boolean = false): Promise<TestResults> {
  const result: TestResults = initializeTestResults();
  if (isServerApp) {
    try {
      // Note: Analytics isn't supported in node environments.
      const firebaseApp = initializeApp(firebaseConfig);
      if (initializeApp !== null) {
        result.initializeAppResult = OK;
        const supported: boolean = await isSupported();
        if (!supported) {
          result.isSupportedResult = OK;
        }
        deleteApp(firebaseApp);
        result.deleteAppResult = OK;
      }
      result.getAnalyticsResult = OK_SKIPPED;
      result.logEventResult = OK_SKIPPED;
    } catch (e) {
      console.log("Caught error: ", e);
    }
  } else /* !isServer() */ {
    try {
      const firebaseApp = initializeApp(firebaseConfig);
      if (firebaseApp !== null) {
        result.initializeAppResult = OK;
        const supported: boolean = await isSupported();
        if (supported) {
          result.isSupportedResult = OK;
        }
        const analytics = getAnalytics(firebaseApp);
        if (analytics !== null) {
          result.getAnalyticsResult = OK;
          logEvent(analytics, 'begin_checkout');
          result.logEventResult = OK;
        }
        // logEvent throws an error if we delete the app here, due to
        // it's asynchronous behavior.
        await sleep(1000);
        deleteApp(firebaseApp);
        result.deleteAppResult = OK;
      }
    } catch (e) {
      console.log("Caught error: ", e);
    }
  }
  return result;
}
