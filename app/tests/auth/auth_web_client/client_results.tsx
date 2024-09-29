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
'use client'

import { useState, useEffect } from 'react'
import { testAuth, createTestAuthResult } from '../../../../lib/auth_test';

export default function ClientResults() {
  const [testStatus, setTestStatus] = useState("running...");
  const [testAuthResult, setTestAuthResult] = useState(createTestAuthResult());
  useEffect(() => {
    const asyncTest = async () => {
      setTestAuthResult(await testAuth());
      setTestStatus("Complete!");
    }
    asyncTest().catch((e) => {
      console.error("Error encountered during testing: ", e);
      setTestStatus("Errored!");
    });
  }, []);

  return (
    <>
      <h2 title="testStatus">Tests {testStatus}</h2>
      <h4 title="initializeAppResult">initializeAppResult: {testAuthResult.initializeAppResult}</h4>
      <h4 title="signInAnonymouslyResult">signInAnonymouslyResult: {testAuthResult.signInAnonymouslyResult}</h4>
      <h4 title="getTokenResult">getTokenResult: {testAuthResult.getTokenResult}</h4>
      <h4 title="initializeServerAppResult">initializeServerAppResult: {testAuthResult.initializeServerAppResult}</h4>
      <h4 title="getAuthServerAppResult">getAuthServerAppResult: {testAuthResult.getAuthServerAppResult}</h4>
      <h4 title="getServerAppUserResult">getServerAppUserResult: {testAuthResult.getServerAppUserResult}</h4>
      <h4 title="deleteServerAppResult">deleteServerAppResult: {testAuthResult.deleteServerAppResult}</h4>
      <h4 title="deleteUserResult">deleteUserResult: {testAuthResult.deleteUserResult}</h4>
      <h4 title="deleteAppResult">deleteAppResult: {testAuthResult.deleteAppResult}</h4>
    </>
  );
}