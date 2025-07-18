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
import { firebaseConfig } from '@/lib/app_tests/firebase';
import { getPerformance, trace } from 'firebase/performance';
import { OK, OK_SKIPPED, FAILED } from '@/lib/app_tests/util';

export type TestResults = {
  initializeAppResult: string,
  initializePerformanceResult: string,
  getPerfTraceResult: string,
  runPerfTraceResult: string,
  putAttributeResult: string,
  getAttributeResult: string,
  deleteAppResult: string
};

export function initializeTestResults(): TestResults {
  return {
    initializeAppResult: FAILED,
    initializePerformanceResult: FAILED,
    getPerfTraceResult: FAILED,
    runPerfTraceResult: FAILED,
    putAttributeResult: FAILED,
    getAttributeResult: FAILED,
    deleteAppResult: FAILED
  };
}

export async function testPerformance(isServer: boolean = false): Promise<TestResults> {
  const result: TestResults = initializeTestResults();
  if (isServer) {
    result.initializeAppResult = OK_SKIPPED;
    result.initializePerformanceResult = OK_SKIPPED;
    result.getPerfTraceResult = OK_SKIPPED;
    result.runPerfTraceResult = OK_SKIPPED;
    result.putAttributeResult = OK_SKIPPED;
    result.getAttributeResult = OK_SKIPPED;
    result.deleteAppResult = OK_SKIPPED;
    return result;
  }

  try {
    const firebaseApp = initializeApp(firebaseConfig);
    if (firebaseApp === null) {
      return result;
    }
    result.initializeAppResult = OK;

    const perf = getPerformance(firebaseApp);
    if (performance) {
      result.initializePerformanceResult = OK;
      const perfTrace = trace(perf, 'test');
      if (perfTrace) {
        result.getPerfTraceResult = OK;
        perfTrace.start();
        perfTrace.stop();
        result.runPerfTraceResult = OK;
      }
      perfTrace.putAttribute('testattr', 'perftestvalue');
      result.putAttributeResult = OK;
      if (perfTrace.getAttribute('testattr') === 'perftestvalue') {
        result.getAttributeResult = OK;
      }
    }

    deleteApp(firebaseApp);
    result.deleteAppResult = OK;
  } catch (e) {
    console.error("Caught error: ", e);
  }
  return result;
}
