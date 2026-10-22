import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const testSuites = [
  { name: 'Room Gateway Flow', file: 'verify-room-gateway.mjs' },
  { name: 'Auth & Swagger Flow', file: 'verify-auth-flow.mjs' },
  { name: 'Email Verification & Password Reset Flow', file: 'verify-email-flow.mjs' },
  { name: 'Cloudinary Upload Flow', file: 'verify-upload-flow.mjs' },
  { name: 'User Profile & Statistics Flow', file: 'verify-profile-flow.mjs' },
  { name: 'Friends & Notifications System Flow', file: 'verify-friends-notifications-flow.mjs' },
];

async function runScript(suite) {
  console.log(`\n======================================================`);
  console.log(`🧪 RUNNING TEST SUITE: ${suite.name} (${suite.file})`);
  console.log(`======================================================\n`);

  return new Promise((resolve, reject) => {
    const child = spawn('node', [path.join(__dirname, suite.file)], {
      stdio: 'inherit',
      env: process.env,
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ SUITE PASSED: ${suite.name}\n`);
        resolve();
      } else {
        reject(new Error(`Suite failed with exit code ${code}: ${suite.name}`));
      }
    });

    child.on('error', (err) => reject(err));
  });
}

async function runAll() {
  console.log('🐰 Starting Bunny Cove Full Test Verification Pipeline...\n');
  const startTime = Date.now();

  for (const suite of testSuites) {
    await runScript(suite);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n======================================================`);
  console.log(`🎉 ALL ${testSuites.length} TEST SUITES PASSED IN ${duration}s! READY FOR PUSH! 🎉`);
  console.log(`======================================================\n`);
}

runAll().catch((err) => {
  console.error('\n❌ TEST PIPELINE FAILED:', err.message);
  process.exit(1);
});
