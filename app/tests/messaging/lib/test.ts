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
import { firebaseConfig } from 'lib/firebase';
import { getMessaging } from 'firebase/messaging';
import { OK, OK_SKIPPED, FAILED } from 'lib/util';

export type TestResults = {
  initializeAppResult: string,
  initializeMessagingResult: string,
  deleteAppResult: string
};

export function initializeTestResults(): TestResults {
  return {
    initializeAppResult: FAILED,
    initializeMessagingResult: FAILED,
    deleteAppResult: FAILED
  };
}

export async function testMessaging(isServer: boolean = false): Promise<TestResults> {
  const result: TestResults = initializeTestResults();
  if (isServer) {
    result.initializeAppResult = OK_SKIPPED;
    result.initializeMessagingResult = OK_SKIPPED;
    result.deleteAppResult = OK_SKIPPED;
    return result;
  }

  try {
    const firebaseApp = initializeApp(firebaseConfig);
    if (firebaseApp === null) {
      return result;
    }
    result.initializeAppResult = OK;

    const messaging = getMessaging(firebaseApp);
    if (!isServer && messaging || isServer && !messaging) {
      result.initializeMessagingResult = OK;
    }

    deleteApp(firebaseApp);
    result.deleteAppResult = OK;
  } catch (e) {
    console.error("Caught error: ", e);
  }
  return result;
}
