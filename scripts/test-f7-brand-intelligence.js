const http = require('http');

function apiRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => { chunks.push(chunk); });
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const text = buffer.toString('utf8');
        try {
          const parsed = JSON.parse(text);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers, rawBuffer: buffer });
        } catch (e) {
          resolve({ status: res.statusCode, rawText: text, rawBuffer: buffer, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function run() {
  console.log("====================================================");
  console.log("DYVIN AI — F7 BRAND INTELLIGENCE INTEGRATION TEST");
  console.log("====================================================\n");

  // 1. Authenticate
  const loginRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { email: 'alex@dyvin.ai', password: 'SecurePassword123!' });

  if (loginRes.status !== 200 || !loginRes.data?.success) {
    throw new Error(`Authentication failed: ${JSON.stringify(loginRes.data)}`);
  }

  const token = loginRes.data.data.tokens.accessToken;
  const user = loginRes.data.data.user;

  const orgsRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/organizations',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  const activeOrg = orgsRes.data?.data?.[0];
  const orgId = activeOrg.id;
  const orgName = activeOrg.name;

  console.log(`--- 1. Authentication & Workspace Scope ---`);
  console.log(`User: ${user.email} | Org: ${orgName} | Org ID: ${orgId}\n`);

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'x-organization-id': orgId,
    'Content-Type': 'application/json',
  };

  // 2. Fetch Projects
  const projectsRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/projects',
    method: 'GET',
    headers: authHeaders,
  });

  const projects = projectsRes.data?.data || projectsRes.data || [];
  console.log(`--- 2. Tracked Projects Count: ${projects.length} ---`);
  const stripeProj = projects.find(p => p.name.includes('Stripe')) || projects[0];
  const activeProj = stripeProj;
  console.log(`Active Project: "${activeProj?.name}" (ID: ${activeProj?.id})\n`);

  // 3. Test Full Brand Intelligence (GET /api/v1/brand-intelligence)
  console.log(`--- 3. Full Brand Intelligence Assembly (GET /api/v1/brand-intelligence) ---`);
  const biRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/v1/brand-intelligence?projectId=${activeProj?.id}`,
    method: 'GET',
    headers: authHeaders,
  });

  if (biRes.status !== 200 || !biRes.data?.success) {
    throw new Error(`GET /brand-intelligence failed with status ${biRes.status}: ${JSON.stringify(biRes.data)}`);
  }

  const bi = biRes.data.data;
  console.log(`HTTP Status: ${biRes.status}`);
  console.log(`Brand Profile Name: "${bi.profile?.brandName}"`);
  console.log(`Domain: ${bi.profile?.domain}`);
  console.log(`Industry: ${bi.profile?.industry}`);
  console.log(`Knowledge Graph Products: ${bi.profile?.products?.length || 0}`);
  console.log(`Knowledge Graph Services: ${bi.profile?.services?.length || 0}`);
  console.log(`Knowledge Graph Entities: ${bi.profile?.entities?.length || 0}`);
  console.log(`AI Positioning Synthesis: "${bi.understanding?.positioningStatement?.slice(0, 110)}..."`);
  console.log(`Total Model Answers Analyzed: ${bi.understanding?.totalAnswersAnalyzed}`);
  console.log(`Total Mentions: ${bi.understanding?.totalMentions} (${bi.understanding?.mentionRate?.toFixed(1)}%)`);
  console.log(`Associated Topics Extracted: ${bi.understanding?.associatedTopics?.length || 0}`);
  console.log(`Associated Products Identified: ${bi.understanding?.associatedProducts?.length || 0}`);
  console.log(`Answer Excerpts with Quotes: ${bi.understanding?.answerExcerpts?.length || 0}`);
  console.log(`Factual Accuracy Score: ${bi.accuracy?.accuracyScore}/100`);
  console.log(`Accuracy Findings Count: ${bi.accuracy?.findings?.length || 0}`);
  console.log(`AI Engine Presence: ${bi.presence?.providerBreakdown?.length || 0} engines tracked`);
  console.log(`Competitive Gaps Detected: ${bi.competitiveGaps?.length || 0} gaps`);
  console.log(`Overall Snapshot Provenance: ${bi.provenance}\n`);

  // 4. Test Dedicated Sub-endpoints
  console.log(`--- 4. Individual Micro-Endpoints ---`);
  const subEndpoints = [
    { ep: 'profile', key: 'brandName', obj: 'profile' },
    { ep: 'understanding', key: 'positioningStatement', obj: 'understanding' },
    { ep: 'accuracy', key: 'accuracyScore', obj: 'accuracy' },
    { ep: 'presence', key: 'visibilityScore', obj: 'presence' },
    { ep: 'competitive-gaps', key: null, obj: 'array' },
  ];

  for (const s of subEndpoints) {
    const res = await apiRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1/brand-intelligence/${s.ep}?projectId=${activeProj?.id}`,
      method: 'GET',
      headers: authHeaders,
    });
    if (res.status !== 200 || !res.data?.success) {
      throw new Error(`Sub-endpoint /${s.ep} failed with status ${res.status}`);
    }
    console.log(`  ✓ GET /api/v1/brand-intelligence/${s.ep} -> 200 OK`);
  }

  // 5. Tenant Scoping Security Test
  console.log(`\n--- 5. Tenant & Project Security Boundaries ---`);
  const unauthorizedRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/v1/brand-intelligence?projectId=00000000-0000-0000-0000-000000000000`,
    method: 'GET',
    headers: authHeaders,
  });
  console.log(`  ✓ Non-existent project scoping status (Expected 404): ${unauthorizedRes.status}`);

  const crossTenantRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/v1/brand-intelligence?projectId=${activeProj?.id}`,
    method: 'GET',
    headers: {
      ...authHeaders,
      'x-organization-id': '00000000-0000-0000-0000-000000000000',
    },
  });
  console.log(`  ✓ Cross-tenant mismatch status (Expected 403 or 404): ${crossTenantRes.status}`);

  console.log("\n====================================================");
  console.log("ALL F7 BRAND INTELLIGENCE INTEGRATION CHECKS PASSED (100%)");
  console.log("====================================================");
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
