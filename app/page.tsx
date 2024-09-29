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

export default async function Page() {
  return (
    <>
      <h1>How to test</h1>
      <h2>Run `yarn playwright test` to execute the automatic test suite.</h2>
      <p />
      <h2>Tests pages: </h2>
      <ul>
        <li><Link href="/tests/auth/auth_web_client">Auth Web SDK client-side tests</Link></li>
        <li><Link href="/tests/auth/auth_web_ssr">Auth Web SDK server-side tests</Link></li>
      </ul>
    </>
  );
}