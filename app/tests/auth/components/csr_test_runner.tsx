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
import { testAuth, createTestAuthResult } from '../lib/test';
import ResultsDisplay from './results_display';

export default function CsrTestRunner() {
  const [testStatus, setTestStatus] = useState<string>("running...");
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
      <ResultsDisplay statusString={testStatus} testAuthResult={testAuthResult} />
  );
}