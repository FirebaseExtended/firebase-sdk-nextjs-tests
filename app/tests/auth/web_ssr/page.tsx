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
import { testAuth, TestResults } from '../../../../src/lib/app_tests/auth/test';
import ResultsDisplay from '../../../../src/components/app_tests/auth/results_display';

// Suppress static site generation.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Auth Web SDK SSR test'
}

export default async function Page() {
  const testResults: TestResults = await testAuth(/*isServer=*/true);
  return (
    <>
      <h1>Auth SSR Test results:</h1>
      <ResultsDisplay statusString='Tests Complete!' testResults={testResults} />
    </>
  );
}
