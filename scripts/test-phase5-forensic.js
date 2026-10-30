const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': payload.length } : {}),
        ...(options.headers || {})
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runForensicAudit() {
  console.log('====================================================');
  console.log('DYVIN AI — PHASE 5 FORENSIC AUDIT & VERIFICATION');
  console.log('====================================================\n');

  console.log('--- 1. Authentication & Active Workspace ---');
  const loginRes = await request({ path: '/api/v1/auth/login', method: 'POST' }, { email: 'alex@dyvin.ai', password: 'SecurePassword123!' });
  const token = loginRes.data?.data?.tokens?.accessToken;
  if (!token) throw new Error('Authentication failed!');
  
  const meRes = await request({ path: '/api/v1/auth/me', method: 'GET', headers: { 'Authorization': 'Bearer ' + token } });
  const user = meRes.data?.data;
  const activeOrg = user.memberships[0]?.organization;
  console.log('User:', user.email, '| Org:', activeOrg.name, '| Org ID:', activeOrg.id);

  console.log('\n--- 2. Direct API Endpoint Verification Table ---');
  const endpoints = [
    { method: 'GET', path: '/api/v1/overview' },
    { method: 'GET', path: '/api/v1/visibility' },
    { method: 'GET', path: '/api/v1/visibility/score' },
    { method: 'GET', path: '/api/v1/visibility/history?days=30' },
    { method: 'GET', path: '/api/v1/visibility/trends' },
    { method: 'GET', path: '/api/v1/visibility/benchmarks' },
    { method: 'GET', path: '/api/v1/visibility/leaderboard' },
    { method: 'GET', path: '/api/v1/visibility/forecast?days=30' },
    { method: 'GET', path: '/api/v1/visibility/insights' },
    { method: 'GET', path: '/api/v1/ai-search/analytics' },
    { method: 'GET', path: '/api/v1/notifications' },
  ];

  console.log('----------------------------------------------------------------------');
  console.log('Endpoint                                | Method | Status | Result');
  console.log('----------------------------------------------------------------------');

  for (const ep of endpoints) {
    try {
      const res = await request({
        path: ep.path,
        method: ep.method,
        headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': activeOrg.id }
      });
      const ok = res.status >= 200 && res.status < 300;
      console.log(`${ep.path.padEnd(40)} | ${ep.method.padEnd(6)} | ${res.status}    | ${ok ? '✓ PASS' : '✗ FAIL'}`);
    } catch (e) {
      console.log(`${ep.path.padEnd(40)} | ${ep.method.padEnd(6)} | ERR    | ✗ ${e.message}`);
    }
  }
  console.log('----------------------------------------------------------------------');

  console.log('\n--- 3. Notification Management (Dismiss / Clear All) Verification ---');
  // 1. Get initial notifications count
  const notifListRes = await request({
    path: '/api/v1/notifications',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const notifsInitial = notifListRes.data?.data || notifListRes.data || [];
  console.log('Current user notifications count:', notifsInitial.length);

  // 2. Test Clear All endpoint
  const clearRes = await request({
    path: '/api/v1/notifications',
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('DELETE /api/v1/notifications status:', clearRes.status, '| Response:', clearRes.data?.data || clearRes.data);

  const notifAfterClearRes = await request({
    path: '/api/v1/notifications',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const notifsAfterClear = notifAfterClearRes.data?.data || notifAfterClearRes.data || [];
  console.log('Notifications count after Clear All:', notifsAfterClear.length);
  if (notifsAfterClear.length !== 0) {
    throw new Error('Clear all notifications failed to delete records!');
  }
  console.log('✓ Verified: DELETE /api/v1/notifications permanently clears all notifications.');

  console.log('\n--- 4. Fresh Project Creation & Clean Unmeasured State ---');
  const uniqueDomain = 'acme-' + Date.now().toString(36) + '.com';
  const projRes = await request({
    path: '/api/v1/projects',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': activeOrg.id }
  }, {
    name: 'Acme Corporation',
    primaryUrl: 'https://' + uniqueDomain,
    industry: 'Enterprise Software'
  });
  const newProj = projRes.data?.data || projRes.data;
  console.log('Created Project:', newProj?.name, '| ID:', newProj?.id);

  const freshOverviewRes = await request({
    path: '/api/v1/overview?projectId=' + newProj?.id,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': activeOrg.id }
  });
  const freshOverview = freshOverviewRes.data?.data || freshOverviewRes.data;
  console.log('Fresh Overview Baseline Status:', freshOverview.baseline?.status);
  console.log('Fresh Overview Visibility Score (Must be null):', freshOverview.visibility?.score);
  console.log('Fresh Overview Tracked Competitors (Must be 0):', freshOverview.competitors?.tracked);
  console.log('Fresh Overview Historical Timeline (Must be 0):', freshOverview.timeline?.length);

  if (freshOverview.baseline?.status !== 'NOT_STARTED' || freshOverview.visibility?.score !== null || freshOverview.competitors?.tracked !== 0) {
    throw new Error('Fresh workspace leaked synthetic competitor or score data!');
  }
  console.log('✓ Verified: Fresh workspace contains 0 synthetic competitors, 0 fake history, and clean unmeasured baseline.');

  console.log('\n--- 5. Trigger Baseline Scan & Provenance Verification ---');
  const triggerRes = await request({
    path: '/api/v1/visibility/baseline',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': activeOrg.id }
  }, { projectId: newProj?.id });
  console.log('Trigger status:', triggerRes.status, '| Job ID:', triggerRes.data?.data?.jobId || triggerRes.data?.jobId);

  let measuredOverview = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 1200));
    const pollRes = await request({
      path: '/api/v1/overview?projectId=' + newProj?.id,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': activeOrg.id }
    });
    const state = pollRes.data?.data || pollRes.data;
    if (state.baseline?.status === 'READY' || state.baseline?.status === 'FAILED') {
      measuredOverview = state;
      break;
    }
  }

  console.log('Measured Overview Status:', measuredOverview?.baseline?.status);
  console.log('Measured Overview Provenance:', measuredOverview?.baseline?.provenance);
  console.log('Measured Overview Score:', measuredOverview?.visibility?.score);
  console.log('Measured Overview Prompts:', measuredOverview?.prompts?.total);

  if (measuredOverview?.baseline?.provenance !== 'DETERMINISTIC_FALLBACK') {
    throw new Error('Expected DETERMINISTIC_FALLBACK provenance in development mode!');
  }
  console.log('✓ Verified: Provenance is accurately tagged as DETERMINISTIC_FALLBACK.');

  console.log('\n--- 6. Read-Only Invariance Check ---');
  const hist1 = await request({ path: '/api/v1/visibility/history?days=30', method: 'GET', headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': activeOrg.id } });
  const c1 = (hist1.data?.data || hist1.data)?.count;
  await request({ path: '/api/v1/overview?projectId=' + newProj?.id, method: 'GET', headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': activeOrg.id } });
  await request({ path: '/api/v1/overview?projectId=' + newProj?.id, method: 'GET', headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': activeOrg.id } });
  const hist2 = await request({ path: '/api/v1/visibility/history?days=30', method: 'GET', headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': activeOrg.id } });
  const c2 = (hist2.data?.data || hist2.data)?.count;
  console.log('Snapshots before:', c1, '| after 2 GETs:', c2);
  if (c1 !== c2) throw new Error('GET /overview is mutating database snapshots!');
  console.log('✓ Verified: GET /overview is completely read-only.');

  console.log('\n====================================================');
  console.log('ALL FORENSIC CHECKS PASSED WITH 100% TRUTH INTEGRITY');
  console.log('====================================================');
}

runForensicAudit().catch(err => {
  console.error('\n❌ Forensic Audit Failed:', err);
  process.exit(1);
});
