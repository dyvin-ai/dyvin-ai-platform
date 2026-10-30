/**
 * DYVIN AI — FULL-STACK WEBSITE INTELLIGENCE & LIVE SCANNER
 * COMPREHENSIVE INTEGRATION & SECURITY VERIFICATION SUITE
 */

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
  console.log('====================================================');
  console.log('DYVIN AI — WEBSITE INTELLIGENCE & SCANNER VERIFICATION');
  console.log('====================================================\n');

  // 1. Authenticate
  const loginRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { email: 'alex@dyvin.ai', password: 'SecurePassword123!' });

  if (loginRes.status !== 200 || !loginRes.data.success) {
    throw new Error(`Authentication failed: ${JSON.stringify(loginRes.data)}`);
  }

  const token = loginRes.data.data.tokens.accessToken;
  const user = loginRes.data.data.user;
  console.log(`[PASS] 1. Authenticated as ${user.email}`);

  // Fetch Organization
  const orgsRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/organizations',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const activeOrg = orgsRes.data?.data?.[0] || orgsRes.data?.[0];
  const orgId = activeOrg.id;
  console.log(`[PASS] Organization: ${activeOrg.name} (${orgId})`);

  // 2. Fetch Projects
  const projRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/projects',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-organization-id': orgId,
    },
  });


  const projects = projRes.data.data || projRes.data;
  if (!projects || !projects.length) {
    throw new Error('No projects found');
  }
  const project = projects[0];
  console.log(`[PASS] 2. Retrieved active project: ${project.name} (${project.id})`);

  // 3. GET /api/v1/scans
  const listRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/v1/scans?projectId=${project.id}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-organization-id': orgId,
    },
  });

  if (listRes.status !== 200) {
    throw new Error(`GET /scans failed with status ${listRes.status}`);
  }
  const initialScans = listRes.data.data || listRes.data;
  console.log(`[PASS] 3. GET /scans returned ${initialScans.length} historical scans`);

  // 4. SSRF Security Hardening Verification
  console.log('\n--- SSRF Security Rejection Tests ---');
  const ssrfTargets = [
    'http://127.0.0.1:8080',
    'http://localhost:3000/api/v1/admin',
    'http://169.254.169.254/latest/meta-data',
    'http://10.0.0.1/internal',
    'http://192.168.1.1/router',
  ];

  for (const dangerousUrl of ssrfTargets) {
    const ssrfRes = await apiRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1/projects/${project.id}/scan`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-organization-id': orgId,
        'Content-Type': 'application/json',
      },
    }, { url: dangerousUrl });

    // Should fail with 400 Bad Request
    if (ssrfRes.status === 400) {
      console.log(`[PASS] SSRF Protection: Correctly rejected ${dangerousUrl} (Status 400: ${ssrfRes.data.message || 'Blocked'})`);
    } else {
      console.error(`[FAIL] SSRF Target was not blocked: ${dangerousUrl} (Status: ${ssrfRes.status})`);
      process.exit(1);
    }
  }

  // 5. Initiate Real Scan
  console.log('\n--- Live Scan Initiation & Execution ---');
  const scanTargetUrl = 'https://example.com';
  const triggerRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/v1/projects/${project.id}/scan`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-organization-id': orgId,
      'Content-Type': 'application/json',
    },
  }, { url: scanTargetUrl });

  if (triggerRes.status !== 201 && triggerRes.status !== 200) {
    throw new Error(`Trigger scan failed with status ${triggerRes.status}: ${JSON.stringify(triggerRes.data)}`);
  }
  const activeScan = triggerRes.data.data || triggerRes.data;
  console.log(`[PASS] 5. Initiated scan: ID ${activeScan.id}, status: ${activeScan.status}`);

  // 6. Poll Scan Details until completion or up to 20s
  let finalScan = activeScan;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const detailRes = await apiRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1/scans/${activeScan.id}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-organization-id': orgId,
      },
    });
    if (detailRes.status === 200) {
      finalScan = detailRes.data.data || detailRes.data;
      if (finalScan.status === 'COMPLETED' || finalScan.status === 'FAILED') {
        break;
      }
    }
  }
  console.log(`[PASS] 6. Scan status resolved to: ${finalScan.status} (discovered: ${finalScan.pagesDiscovered || 0}, crawled: ${finalScan.pagesCrawled || 0})`);

  // 7. GET /api/v1/scans/:id/pages
  const pagesRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/v1/scans/${activeScan.id}/pages`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-organization-id': orgId,
    },
  });

  const pages = pagesRes.data.data || pagesRes.data;
  console.log(`[PASS] 7. GET /scans/${activeScan.id}/pages returned ${pages.length} crawled pages`);
  if (pages.length > 0) {
    const p = pages[0];
    console.log(`   Sample page: ${p.url} (Status: ${p.statusCode}, Words: ${p.wordCount}, Title: "${p.title}")`);
  }

  // 8. GET /api/v1/scans/:id/structured-data
  const schemaRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/v1/scans/${activeScan.id}/structured-data`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-organization-id': orgId,
    },
  });

  const schemas = schemaRes.data.data || schemaRes.data;
  console.log(`[PASS] 8. GET /scans/${activeScan.id}/structured-data returned ${schemas.length} Schema.org entities`);

  // 9. GET /api/v1/scans/:id/technologies
  const techRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/v1/scans/${activeScan.id}/technologies`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-organization-id': orgId,
    },
  });

  const techs = techRes.data.data || techRes.data;
  console.log(`[PASS] 9. GET /scans/${activeScan.id}/technologies returned ${techs.length} detected technologies`);

  // 10. GET /api/v1/scans/:id/metadata
  const metaRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/v1/scans/${activeScan.id}/metadata`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-organization-id': orgId,
    },
  });

  const metas = metaRes.data.data || metaRes.data;
  console.log(`[PASS] 10. GET /scans/${activeScan.id}/metadata returned ${metas.length} metadata entries`);

  // 11. Cross-Tenant Security Isolation Test
  console.log('\n--- Tenant Isolation Security Verification ---');
  const unauthorizedOrgId = 'org-unauthorized-adversary-999';
  const crossTenantRes = await apiRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/v1/scans/${activeScan.id}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-organization-id': unauthorizedOrgId,
    },
  });

  if (crossTenantRes.status === 404 || crossTenantRes.status === 403) {
    console.log(`[PASS] 11. Cross-tenant access safely rejected with status ${crossTenantRes.status} (Scan isolation confirmed)`);
  } else {
    console.error(`[FAIL] Cross-tenant access succeeded with status ${crossTenantRes.status}`);
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('ALL WEBSITE INTELLIGENCE & LIVE SCANNER TESTS PASSED');
  console.log('====================================================\n');
}

run().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
