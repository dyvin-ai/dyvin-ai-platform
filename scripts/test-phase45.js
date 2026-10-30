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

async function testPhase45() {
  console.log('=== TEST 1: Login & Identity ===');
  const loginRes = await request({ path: '/api/v1/auth/login', method: 'POST' }, { email: 'alex@dyvin.ai', password: 'SecurePassword123!' });
  const token = loginRes.data.data.tokens.accessToken;
  const meRes = await request({ path: '/api/v1/auth/me', method: 'GET', headers: { 'Authorization': 'Bearer ' + token } });
  const orgId = meRes.data.data.memberships[0].organization.id;
  console.log('User:', meRes.data.data.email, 'Org ID:', orgId);

  console.log('\n=== TEST 2: Create Fresh Project (Apple Inc. / apple.com) ===');
  const uniqueDomain = 'apple-' + Date.now().toString(36) + '.com';
  const projRes = await request({
    path: '/api/v1/projects',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  }, {
    name: 'Apple Inc.',
    primaryUrl: 'https://' + uniqueDomain,
    industry: 'Consumer Electronics'
  });
  const project = projRes.data?.data || projRes.data;
  const projectId = project?.id;
  console.log('Project created:', project?.name, 'ID:', projectId, 'Domain:', project?.primaryDomain);

  console.log('\n=== TEST 3: Check Initial Baseline State for Fresh Project ===');
  const initialBaselineRes = await request({
    path: '/api/v1/visibility/baseline/status?projectId=' + projectId,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  });
  console.log('Baseline Status:', initialBaselineRes.data?.data?.status || initialBaselineRes.data?.status);
  console.log('Visibility Score (Must be null):', initialBaselineRes.data?.data?.visibilityScore || initialBaselineRes.data?.visibilityScore);

  console.log('\n=== TEST 4: Trigger Initial Baseline Scan ===');
  const triggerRes = await request({
    path: '/api/v1/visibility/baseline',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  }, { projectId });
  console.log('Scan Trigger Status:', triggerRes.status, 'Job ID:', triggerRes.data?.data?.jobId || triggerRes.data?.jobId);

  console.log('\n=== TEST 5: Poll Baseline Scan Progress ===');
  let finalBaseline = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 1200));
    const pollRes = await request({
      path: '/api/v1/visibility/baseline/status?projectId=' + projectId,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
    });
    const state = pollRes.data?.data || pollRes.data;
    console.log('Poll #' + (i + 1) + ': Status=' + state.status + ' Stage=' + state.stage + ' Progress=' + state.progress + '% PromptsCompleted=' + state.promptsCompleted + '/' + state.promptsTotal);
    if (state.status === 'READY' || state.status === 'FAILED') {
      finalBaseline = state;
      break;
    }
  }

  console.log('\n=== TEST 6: Final Baseline Measurement Verification ===');
  console.log('Final Baseline Status:', finalBaseline?.status);
  console.log('Calculated Visibility Score:', finalBaseline?.visibilityScore);
  console.log('Provenance:', finalBaseline?.provenance);
  console.log('Engine Coverage:', JSON.stringify(finalBaseline?.providerCoverage?.providers, null, 2));

  console.log('\n=== TEST 7: Check /api/v1/ai-search/prompts ===');
  const promptsRes = await request({
    path: '/api/v1/ai-search/prompts',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  });
  const prompts = promptsRes.data?.data || promptsRes.data;
  console.log('Prompts Count:', prompts?.length);
  console.log('Sample Brand Prompt:', prompts?.[0]?.promptText);

  console.log('\n=== TEST 8: Check /api/v1/visibility/history ===');
  const historyRes = await request({
    path: '/api/v1/visibility/history?days=30',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  });
  console.log('Snapshot History count:', historyRes.data?.data?.count || historyRes.data?.count);
  console.log('History Timeline Sample:', historyRes.data?.data?.timeline || historyRes.data?.timeline);
}

testPhase45().catch(console.error);
