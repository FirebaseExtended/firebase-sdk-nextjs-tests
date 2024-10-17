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
export default function ResultsDisplay({ statusString, testResults }) {
  return (
    <>
      <h2 title="testStatus">{statusString}</h2>
      <h4 title="initializeAppResult">initializeAppResult: {testResults.initializeAppResult}</h4>
      <h4 title="initializeAuthResult">initializeAuthResult: {testResults.initializeAuthResult}</h4>
      <h4 title="authUserSignedInResult">authUserSignedInResult: {testResults.authUserSignedInResult}</h4>
      <h4 title="initializeStorageResult">initializeStorageResult: {testResults.initializeStorageResult}</h4>
      <h4 title="createStorageRefResult">createStorageRefResult: {testResults.createStorageRefResult}</h4>
      <h4 title="uploadStringResult">uploadStringResult: {testResults.uploadStringResult}</h4>
      <h4 title="getDownloadUrlResult">getDownloadUrlResult: {testResults.getDownloadUrlResult}</h4>
      <h4 title="fetchCompletedResult">fetchCompletedResult: {testResults.fetchCompletedResult}</h4>
      <h4 title="getResponseTextResult">getResponseTextResult: {testResults.getResponseTextResult}</h4>
      <h4 title="getDataMatchesExepctedResult">getDataMatchesExepctedResult: {testResults.getDataMatchesExepctedResult}</h4>
      <h4 title="deleteReferenceResult">deleteReferenceResult: {testResults.deleteReferenceResult}</h4>
      <h4 title="deleteUserResult">deleteUserResult: {testResults.deleteUserResult}</h4>
      <h4 title="authSignedOutResult">authSignedOutResult: {testResults.authSignedOutResult}</h4>
      <h4 title="deleteAppResult">deleteAppResult: {testResults.deleteAppResult}</h4>
      <p />
      <Link href="/">Back to test index</Link>
    </>
  );
}
