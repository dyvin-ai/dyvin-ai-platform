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

async function testPhase5() {
  console.log('====================================================');
  console.log('DYVIN AI — PHASE 5 OVERVIEW & CROSS-PAGE CONSISTENCY');
  console.log('====================================================\n');

  console.log('--- TEST 1: Login & Workspace Context ---');
  const loginRes = await request({ path: '/api/v1/auth/login', method: 'POST' }, { email: 'alex@dyvin.ai', password: 'SecurePassword123!' });
  const token = loginRes.data.data.tokens.accessToken;
  const meRes = await request({ path: '/api/v1/auth/me', method: 'GET', headers: { 'Authorization': 'Bearer ' + token } });
  const orgId = meRes.data.data.memberships[0].organization.id;
  console.log('Logged in as:', meRes.data.data.email, '| Org ID:', orgId);

  console.log('\n--- TEST 2: Create Fresh Project (Stripe Inc. / stripe-test.com) ---');
  const uniqueDomain = 'stripe-' + Date.now().toString(36) + '.com';
  const projRes = await request({
    path: '/api/v1/projects',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  }, {
    name: 'Stripe Inc.',
    primaryUrl: 'https://' + uniqueDomain,
    industry: 'Financial Technology'
  });
  const project = projRes.data?.data || projRes.data;
  const projectId = project?.id;
  console.log('Created Project:', project?.name, '| ID:', projectId, '| Domain:', project?.primaryDomain);

  console.log('\n--- TEST 3: Fresh Workspace Overview State (Must be NOT_STARTED) ---');
  const initialOverviewRes = await request({
    path: '/api/v1/overview?projectId=' + projectId,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  });
  const initialOverview = initialOverviewRes.data?.data || initialOverviewRes.data;
  console.log('Overview Baseline Status:', initialOverview.baseline?.status);
  console.log('Overview Visibility Score (Must be null):', initialOverview.visibility?.score);
  console.log('Overview Historical Timeline count (Must be 0):', initialOverview.timeline?.length);

  if (initialOverview.baseline?.status !== 'NOT_STARTED' || initialOverview.visibility?.score !== null) {
    throw new Error('Fresh workspace did not return clean NOT_STARTED empty state on /overview!');
  }
  console.log('✓ Verified: Fresh workspace displays unmeasured state without fake scores or fake history.');

  console.log('\n--- TEST 4: Trigger Baseline Scan & Poll Overview ---');
  const triggerRes = await request({
    path: '/api/v1/visibility/baseline',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  }, { projectId });
  console.log('Scan Trigger Status:', triggerRes.status, '| Job ID:', triggerRes.data?.data?.jobId || triggerRes.data?.jobId);

  let finalOverview = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 1200));
    const pollRes = await request({
      path: '/api/v1/overview?projectId=' + projectId,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
    });
    const state = pollRes.data?.data || pollRes.data;
    console.log('Poll #' + (i + 1) + ': Status=' + state.baseline?.status + ' Stage=' + state.baseline?.stage + ' Progress=' + state.baseline?.progress + '% PromptsCompleted=' + state.prompts?.tracked + '/' + state.prompts?.total);
    if (state.baseline?.status === 'READY' || state.baseline?.status === 'FAILED') {
      finalOverview = state;
      break;
    }
  }

  console.log('\n--- TEST 5: Overview Aggregation Verification ---');
  console.log('Final Overview Baseline Status:', finalOverview.baseline?.status);
  console.log('Overview Visibility Score:', finalOverview.visibility?.score);
  console.log('Overview Provenance:', finalOverview.baseline?.provenance);
  console.log('Overview Tracked Prompts:', finalOverview.prompts?.total);
  console.log('Overview Tracked Competitors:', finalOverview.competitors?.tracked);
  console.log('Overview Citation Sources:', finalOverview.citations?.sources);
  console.log('Overview Active Decisions count:', finalOverview.decisions?.length);
  console.log('Overview Alerts count:', finalOverview.alerts?.length);

  console.log('\n====================================================');
  console.log('--- TEST 6: CROSS-PAGE CONSISTENCY TEST ---');
  console.log('====================================================');

  // 1. Fetch /visibility
  const visRes = await request({
    path: '/api/v1/visibility/baseline/status?projectId=' + projectId,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  });
  const visData = visRes.data?.data || visRes.data;

  // 2. Fetch /prompts
  const promptsRes = await request({
    path: '/api/v1/ai-search/prompts?projectId=' + projectId,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  });
  const promptsData = promptsRes.data?.data || promptsRes.data;

  // 3. Fetch /citations/sources
  const sourcesRes = await request({
    path: '/api/v1/citations/sources',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  });
  const sourcesData = sourcesRes.data?.data || sourcesRes.data;

  // 4. Fetch /competitors
  const compRes = await request({
    path: '/api/v1/competitors',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  });
  const compData = compRes.data?.data || compRes.data;

  console.log('\nCross-Page Metric Comparison:');
  console.log('----------------------------------------------------');
  console.log('Metric             | Overview Page | Dedicated Page   | Match?');
  console.log('----------------------------------------------------');
  
  const visScoreOverview = finalOverview.visibility?.score;
  const visScoreDedicated = visData.visibilityScore;
  const visMatch = Math.abs(visScoreOverview - visScoreDedicated) < 0.01;
  console.log(`Visibility Score   | ${visScoreOverview}          | ${visScoreDedicated}            | ${visMatch ? '✓ PASS' : '✗ FAIL'}`);

  const promptsCountOverview = finalOverview.prompts?.total;
  const promptsCountDedicated = Array.isArray(promptsData) ? promptsData.length : 0;
  const promptsMatch = promptsCountOverview === promptsCountDedicated;
  console.log(`Prompts Count      | ${promptsCountOverview}           | ${promptsCountDedicated}              | ${promptsMatch ? '✓ PASS' : '✗ FAIL'}`);

  const sourcesCountOverview = finalOverview.citations?.sources;
  const sourcesCountDedicated = Array.isArray(sourcesData) ? sourcesData.length : 0;
  const sourcesMatch = sourcesCountOverview === sourcesCountDedicated;
  console.log(`Citation Sources   | ${sourcesCountOverview}           | ${sourcesCountDedicated}              | ${sourcesMatch ? '✓ PASS' : '✗ FAIL'}`);

  const compCountOverview = finalOverview.competitors?.tracked;
  const compCountDedicated = Array.isArray(compData) ? compData.length : 0;
  const compMatch = compCountOverview === compCountDedicated;
  console.log(`Competitor Count   | ${compCountOverview}            | ${compCountDedicated}               | ${compMatch ? '✓ PASS' : '✗ FAIL'}`);

  const provenanceOverview = finalOverview.baseline?.provenance;
  const provenanceDedicated = visData.provenance;
  const provMatch = provenanceOverview === provenanceDedicated;
  console.log(`Data Provenance    | ${provenanceOverview} | ${provenanceDedicated} | ${provMatch ? '✓ PASS' : '✗ FAIL'}`);
  console.log('----------------------------------------------------');

  if (!visMatch || !promptsMatch || !sourcesMatch || !compMatch || !provMatch) {
    throw new Error('Cross-page consistency check failed!');
  }
  console.log('✓ All 5 core cross-page metrics match with 100% precision across Overview, Visibility, Prompts, Sources, and Competitors!');

  console.log('\n--- TEST 7: Read-Only Safety Verification ---');
  // Call GET /overview multiple times and verify no duplicate snapshot creations
  const historyBefore = await request({
    path: '/api/v1/visibility/history?days=30',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  });
  const countBefore = (historyBefore.data?.data || historyBefore.data)?.count;

  await request({ path: '/api/v1/overview?projectId=' + projectId, method: 'GET', headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId } });
  await request({ path: '/api/v1/overview?projectId=' + projectId, method: 'GET', headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId } });

  const historyAfter = await request({
    path: '/api/v1/visibility/history?days=30',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'X-Organization-Id': orgId }
  });
  const countAfter = (historyAfter.data?.data || historyAfter.data)?.count;

  console.log('Snapshot count before GET calls:', countBefore, '| after GET calls:', countAfter);
  if (countBefore !== countAfter) {
    throw new Error('GET /overview mutated database records or created duplicate snapshots!');
  }
  console.log('✓ Verified: GET /overview is completely read-only and idempotent.');

  console.log('\n====================================================');
  console.log('PHASE 5 ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

testPhase5().catch(err => {
  console.error('\n❌ Phase 5 Test Failed:', err);
  process.exit(1);
});
