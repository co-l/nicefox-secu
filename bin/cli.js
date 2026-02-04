#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// --- Config ---
const CONTAINER_NAME = 'exegol-nicefox';
const EXEGOL_SESSION = 'nicefox';
const HOME_DIR = path.join(os.homedir(), '.nicefox-secu');
const PROMPT_SRC = path.join(__dirname, '..', 'prompt', 'PENTEST.md');
const PROMPT_DEST = path.join(HOME_DIR, 'PENTEST.md');

// --- Colors ---
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch {
    return null;
  }
}

function fail(msg) {
  console.error(`\n  ${red('✗')} ${msg}\n`);
  process.exit(1);
}

// ─────────────────────────────────────────
//  NiceFox Secu
// ─────────────────────────────────────────

console.log('');
console.log(bold('  NiceFox Secu'));
console.log(dim('  AI-powered pentesting for web developers'));
console.log('');

// --- Step 1: Check Docker ---
if (run('docker info') === null) {
  fail(`Docker is not running.

  Start Docker Desktop (or the Docker daemon) and try again.

  Install Docker: ${cyan('https://docs.docker.com/get-docker/')}`);
}
console.log(`  ${green('✓')} Docker is running`);

// --- Step 2: Check / start Exegol container ---
const containerRunning = run(
  `docker ps --filter "name=^${CONTAINER_NAME}$" --format "{{.Names}}"`
);

if (containerRunning === CONTAINER_NAME) {
  console.log(`  ${green('✓')} Exegol container ready (${CONTAINER_NAME})`);
} else {
  // Container exists but stopped?
  const containerExists = run(
    `docker ps -a --filter "name=^${CONTAINER_NAME}$" --format "{{.Names}}"`
  );

  if (containerExists === CONTAINER_NAME) {
    process.stdout.write(`  ${yellow('→')} Starting stopped container ${CONTAINER_NAME}...`);
    if (run(`docker start ${CONTAINER_NAME}`) === null) {
      console.log('');
      fail(`Failed to start container ${CONTAINER_NAME}.

  Try manually:
    docker start ${CONTAINER_NAME}`);
    }
    console.log(` ${green('done')}`);
    console.log(`  ${green('✓')} Exegol container running (${CONTAINER_NAME})`);
  } else {
    // Container doesn't exist at all
    fail(`Exegol container "${CONTAINER_NAME}" does not exist.

  Create it first:
    ${cyan(`exegol start ${EXEGOL_SESSION}`)}

  If Exegol is not installed:
    ${cyan('pip install exegol')}
    ${cyan('exegol install')}

  Then run ${cyan('npx nicefox-secu')} again.`);
  }
}

// --- Step 3: Install prompt to ~/.nicefox-secu/ ---
if (!fs.existsSync(HOME_DIR)) {
  fs.mkdirSync(HOME_DIR, { recursive: true });
}
fs.copyFileSync(PROMPT_SRC, PROMPT_DEST);
console.log(`  ${green('✓')} Prompt installed`);

// --- Step 4: Print instructions ---
console.log('');
console.log(`  ${bold('Ready!')} Open your AI coding agent from your project directory and paste:`);
console.log('');
console.log(`    ${cyan(`Read ${PROMPT_DEST} and start the pentest`)}`);
console.log('');
console.log(dim('  Works with Claude Code, Codex, opencode, Cursor, Kimi, aider...'));
console.log('');
