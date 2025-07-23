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
      <h1>Firebase JS SDK Next.js tests</h1>
      <h2>Auto test:</h2>
      <p>Run <b><code>yarn test</code></b> or <b><code>npm run test</code></b> to execute the automatic test suite.</p>
      <p />
      <h2>Manually test:</h2>
      <ul>
        <li>AI</li>
        <ul>
          <li><Link href="/tests/ai/web_client">AI Web SDK client-side tests</Link></li>
          <li><Link href="/tests/ai/web_ssr">AI Web SDK server-side tests</Link></li>
        </ul>
        <p />
        <li>Analytics</li>
        <ul>
          <li><Link href="/tests/analytics/web_client">Analytics Web SDK client-side tests</Link></li>
          <li><Link href="/tests/analytics/web_ssr">Analytics Web SDK server-side tests</Link></li>
        </ul>
        <p />
        <li>App</li>
        <ul>
          <li><Link href="/tests/app/web_client">App Web SDK client-side tests</Link></li>
          <li><Link href="/tests/app/web_ssr">App Web SDK server-side tests</Link></li>
        </ul>
        <p />
        <li>AppCheck</li>
        <ul>
          <li><Link href="/tests/app_check/web_client">AppCheck Web SDK client-side tests</Link></li>
          <li><Link href="/tests/app_check/web_ssr">AppCheck Web SDK server-side tests</Link></li>
        </ul>
        <p />
        <li>Auth</li>
        <ul>
          <li><Link href="/tests/auth/web_client">Auth Web SDK client-side tests</Link></li>
          <li><Link href="/tests/auth/web_ssr">Auth Web SDK server-side tests</Link></li>
        </ul>
        <p />
        <li>Database</li>
        <ul>
          <li><Link href="/tests/database/web_client">Database Web SDK client-side tests</Link></li>
          <li><Link href="/tests/database/web_ssr">Database Web SDK server-side tests</Link></li>
        </ul>
        <p />
        <li>Firestore</li>
        <ul>
          <li><Link href="/tests/firestore/web_client">Firestore Web SDK client-side tests</Link></li>
          <li><Link href="/tests/firestore/web_ssr">Firestore Web SDK server-side tests</Link></li>
        </ul>
        <p />
        <li>Functions</li>
        <ul>
          <li><Link href="/tests/functions/web_client">Functions Web SDK client-side tests</Link></li>
          <li><Link href="/tests/functions/web_ssr">Functions Web SDK server-side tests</Link></li>
        </ul>
        <p />
        <li>Messaging</li>
        <ul>
          <li><Link href="/tests/messaging/web_client">Messaging Web SDK client-side tests</Link></li>
          <li><Link href="/tests/messaging/web_ssr">Messaging Web SDK server-side tests</Link></li>
        </ul>
        <p />
        <li>Performance</li>
        <ul>
          <li><Link href="/tests/performance/web_client">Performance Web SDK client-side tests</Link></li>
          <li><Link href="/tests/performance/web_ssr">Performance Web SDK server-side tests</Link></li>
        </ul>
        <p />
        <li>Storage</li>
        <ul>
          <li><Link href="/tests/storage/web_client">Storage Web SDK client-side tests</Link></li>
          <li><Link href="/tests/storage/web_ssr">Storage Web SDK server-side tests</Link></li>
        </ul>
      </ul>
    </>
  );
}
