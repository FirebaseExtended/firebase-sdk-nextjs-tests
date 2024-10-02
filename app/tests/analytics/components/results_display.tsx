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
import Link from 'next/link';
export default function ResultsDisplay({ statusString, testAppResult }) {
  return (
    <>
      <h2 title="testStatus">{statusString}</h2>
      <h4 title="initializeAppResult">initializeAppResult: {testAppResult.initializeAppResult}</h4>
      <h4 title="isSupportedResult">isSupportedResult: {testAppResult.isSupportedResult}</h4>
      <h4 title="getAnalyticsResult">deleteAppResult: {testAppResult.getAnalyticsResult}</h4>
      <h4 title="logEventResult">logEventResult: {testAppResult.logEventResult}</h4>
      <h4 title="deleteAppResult">deleteAppResult: {testAppResult.deleteAppResult}</h4>
      <p />
      <Link href="/">Back to test index</Link>
    </>
  );
}
