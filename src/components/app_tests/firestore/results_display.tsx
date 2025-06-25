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
      <h4 title="initializeFirestoreResult">initializeFirestoreResult: {testResults.initializeFirestoreResult}</h4>
      <h4 title="createDocInstanceResult">createDocInstanceResult: {testResults.createDocInstanceResult}</h4>
      <h4 title="setDocResult">setDocResult: {testResults.setDocResult}</h4>
      <h4 title="onSnapshotSetDR">onSnapshotSetDocResult: {testResults.onSnapshotSetDocResult}</h4>
      <h4 title="updateDocResult">updateDocResult: {testResults.updateDocResult}</h4>
      <h4 title="onSnapshotUpdateDR">onSnapshotUpdateDocResult: {testResults.onSnapshotUpdateDocResult}</h4>
      <h4 title="getDocResult">getDocResult: {testResults.getDocResult}</h4>
      <h4 title="querySnapshotResult">querySnapshotResult: {testResults.querySnapshotResult}</h4>
      <h4 title="documentSnapshotBundleResult">documentSnapshotBundleResult: {testResults.documentSnapshotBundleResult}</h4>
      <h4 title="reconstitutedDocDataResult">reconstitutedDocDataResult: {testResults.reconstitutedDocDataResult}</h4>
      <h4 title="documentSnapshotOnSnapshotResumeResult">documentSnapshotOnSnapshotResumeResult: {testResults.documentSnapshotOnSnapshotResumeResult}</h4>
      <h4 title="querySnapshotOnSnapshotResumeResult">querySnapshotOnSnapshotResumeResult: {testResults.querySnapshotOnSnapshotResumeResult}</h4>
      <h4 title="querySnapshotBundleResult">querySnapshotBundleResult: {testResults.querySnapshotBundleResult}</h4>
      <h4 title="reconstitutedQueryDataResult">reconstitutedQueryDataResult: {testResults.reconstitutedQueryDataResult}</h4>
      <h4 title="deleteDocResult">deleteDocResult: {testResults.deleteDocResult}</h4>
      <h4 title="onSnapshotDeleteDR">onSnapshotDeleteDocResult: {testResults.onSnapshotDeleteDocResult}</h4>
      <h4 title="getDeletedDocResult">getDeletedDocResult: {testResults.getDeletedDocResult}</h4>
      <h4 title="deleteAppResult">deleteAppResult: {testResults.deleteAppResult}</h4>
      
      <h3> CSR-side deserialization tests </h3>
      <h4 title="clientSideDocumentSnapshotResult">clientSideDocumentSnapshotResult: {testResults.clientSideDocumentSnapshotResult}</h4>
      <h4 title="clientSideDocumentSnapshotOnResumeResult">clientSideDocumentSnapshotOnResumeResult: {testResults.clientSideDocumentSnapshotOnResumeResult}</h4>
      <h4 title="clientSideQuerySnapshotResult">clientSideQuerySnapshotResult: {testResults.clientSideQuerySnapshotResult}</h4>
      <h4 title="clientSideQuerySnapshotOnResumeResult">clientSideQuerySnapshotOnResumeResult: {testResults.clientSideQuerySnapshotOnResumeResult}</h4>
      
      <p />
      <Link href="/">Back to test index</Link>
    </>
  );
}
