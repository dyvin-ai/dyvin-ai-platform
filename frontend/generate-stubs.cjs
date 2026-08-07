const fs = require('fs');
const path = require('path');

const stubs = {
  'src/pages/error/ForbiddenPage.tsx': "export { ForbiddenPage as default } from './NotFoundPage';",
  'src/pages/error/ServerErrorPage.tsx': "export { ServerErrorPage as default } from './NotFoundPage';",
  'src/pages/error/MaintenancePage.tsx': "export { MaintenancePage as default } from './NotFoundPage';",
  'src/pages/error/UnauthorizedPage.tsx': "export { UnauthorizedPage as default } from './NotFoundPage';",
  
  // Auth
  'src/pages/auth/LoginPage.tsx': "import React from 'react';\nexport default function LoginPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold\">Login</h1></div>; }",
  'src/pages/auth/RegisterPage.tsx': "import React from 'react';\nexport default function RegisterPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold\">Register</h1></div>; }",
  'src/pages/auth/ForgotPasswordPage.tsx': "import React from 'react';\nexport default function ForgotPasswordPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold\">Forgot Password</h1></div>; }",
  'src/pages/auth/ResetPasswordPage.tsx': "import React from 'react';\nexport default function ResetPasswordPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold\">Reset Password</h1></div>; }",
  'src/pages/auth/VerifyEmailPage.tsx': "import React from 'react';\nexport default function VerifyEmailPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold\">Verify Email</h1></div>; }",

  // Dashboard
  'src/pages/dashboard/OverviewPage.tsx': "import React from 'react';\nexport default function OverviewPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Dashboard Overview</h1><p>Welcome to Dyvin AI Enterprise Platform.</p></div>; }",
  'src/pages/dashboard/SettingsPage.tsx': "import React from 'react';\nexport default function SettingsPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Settings</h1></div>; }",

  // Modules
  'src/pages/ai-search/AiSearchPage.tsx': "import React from 'react';\nexport default function AiSearchPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">AI Search Intelligence</h1></div>; }",
  'src/pages/ai-workforce/AiWorkforcePage.tsx': "import React from 'react';\nexport default function AiWorkforcePage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">AI Workforce</h1></div>; }",
  'src/pages/business-execution/BusinessExecutionPage.tsx': "import React from 'react';\nexport default function BusinessExecutionPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Business Execution</h1></div>; }",
  'src/pages/marketplace/MarketplacePage.tsx': "import React from 'react';\nexport default function MarketplacePage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Agent Marketplace</h1></div>; }",
  'src/pages/governance/GovernancePage.tsx': "import React from 'react';\nexport default function GovernancePage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">AI Governance & Policy</h1></div>; }",
  'src/pages/workflow-studio/WorkflowStudioPage.tsx': "import React from 'react';\nexport default function WorkflowStudioPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Workflow Studio</h1></div>; }",
  'src/pages/app-builder/AppBuilderPage.tsx': "import React from 'react';\nexport default function AppBuilderPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">AI App Builder</h1></div>; }",
  'src/pages/developer/DeveloperPage.tsx': "import React from 'react';\nexport default function DeveloperPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Developer Platform</h1></div>; }",
  'src/pages/customer-intelligence/CustomerIntelligencePage.tsx': "import React from 'react';\nexport default function CustomerIntelligencePage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Customer Intelligence</h1></div>; }",
  'src/pages/security/SecurityPage.tsx': "import React from 'react';\nexport default function SecurityPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Runtime Security</h1></div>; }",
  'src/pages/billing/BillingPage.tsx': "import React from 'react';\nexport default function BillingPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Billing & Usage</h1></div>; }",
  'src/pages/reports/ReportsPage.tsx': "import React from 'react';\nexport default function ReportsPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Reports</h1></div>; }",

  // Admin
  'src/pages/admin/AdminOverviewPage.tsx': "import React from 'react';\nexport default function AdminOverviewPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Admin Overview</h1></div>; }",
  'src/pages/admin/AdminUsersPage.tsx': "import React from 'react';\nexport default function AdminUsersPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Manage Users</h1></div>; }",
  'src/pages/admin/AdminOrgsPage.tsx': "import React from 'react';\nexport default function AdminOrgsPage() { return <div className=\"p-8\"><h1 className=\"text-2xl font-bold mb-4\">Manage Organizations</h1></div>; }",

  // .eslintrc.cjs
  '.eslintrc.cjs': `module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_|React' }],
  },
};`,
  
  // .env.example
  '.env.example': "VITE_API_URL=/api/v1\nVITE_APP_NAME=\"Dyvin AI Platform\"\n"
};

for (const [filepath, content] of Object.entries(stubs)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', filepath);
}
