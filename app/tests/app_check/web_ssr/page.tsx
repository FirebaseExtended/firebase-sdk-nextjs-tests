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
import type { Metadata } from 'next'
import { testAppCheck, TestResults } from '../../../../src/lib/app_tests/app_check/test';
import ResultsDisplay from '../../../../src/components/app_tests/app_check/results_display';

// Suppress static site generation.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'AppCheck Web SDK SSR test'
}

export default async function Page() {
  const testResults: TestResults = await testAppCheck();
  return (
    <>
      <h1>AppCheck SSR Test results:</h1>
      <ResultsDisplay statusString='Tests Complete!' testResults={testResults} />
    </>
  );
}
