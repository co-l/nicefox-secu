#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const os = require('os');

// --- Config ---
const IMAGE_NAME = 'nicefox-tools';
const CONTAINER_NAME = 'nicefox-tools';
const HOME_DIR = path.join(os.homedir(), '.nicefox');
const PROMPT_SRC = path.join(__dirname, '..', 'prompt', 'REVIEW.md');
const PROMPT_DEST = path.join(HOME_DIR, 'REVIEW.md');
const DOCKERFILE = path.join(__dirname, '..', 'docker', 'Dockerfile');

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

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  console.log('');
  console.log(bold('  NiceFox Secu'));
  console.log(dim('  AI-powered security review for web developers'));
  console.log('');

  // --- Step 1: Check Docker ---
  if (run('docker info') === null) {
    fail(`Docker is not running.

  Start Docker Desktop (or the Docker daemon) and try again.

  Install Docker: ${cyan('https://docs.docker.com/get-docker/')}`);
  }
  console.log(`  ${green('✓')} Docker is running`);

  // --- Step 2: Build image if missing ---
  const imageExists = run(`docker images -q ${IMAGE_NAME}`);

  if (!imageExists) {
    console.log('');
    console.log(`  The security toolkit needs to be installed (Docker image, ${bold('~1 GB')}).`);
    console.log(`  This only happens once.`);
    console.log('');
    const answer = await ask(`  Install it? ${dim('(Y/n)')} `);
    if (answer === 'n' || answer === 'no') {
      console.log('');
      console.log(dim('  No problem. Run npx nicefox-secu again when you\'re ready.'));
      console.log('');
      process.exit(0);
    }
    console.log('');
    console.log(`  ${yellow('→')} Building security toolkit...`);
    console.log('');
    try {
      execSync(
        `docker build -t ${IMAGE_NAME} -f "${DOCKERFILE}" "${path.dirname(DOCKERFILE)}"`,
        { stdio: 'inherit' }
      );
    } catch {
      fail(`Failed to build the security toolkit image.

  Try manually:
    ${cyan(`docker build -t ${IMAGE_NAME} -f "${DOCKERFILE}" "${path.dirname(DOCKERFILE)}"`)}`);
    }
    console.log('');
    console.log(`  ${green('✓')} Security toolkit installed`);
  } else {
    console.log(`  ${green('✓')} Security toolkit ready`);
  }

  // --- Step 3: Start container if not running ---
  const containerRunning = run(
    `docker ps --filter "name=^${CONTAINER_NAME}$" --format "{{.Names}}"`
  );

  if (containerRunning === CONTAINER_NAME) {
    console.log(`  ${green('✓')} Toolkit container running`);
  } else {
    const containerExists = run(
      `docker ps -a --filter "name=^${CONTAINER_NAME}$" --format "{{.Names}}"`
    );

    if (containerExists === CONTAINER_NAME) {
      // Stopped — restart it
      process.stdout.write(`  ${yellow('→')} Starting toolkit container...`);
      if (run(`docker start ${CONTAINER_NAME}`) === null) {
        console.log('');
        fail(`Failed to start container.

  Try manually:
    ${cyan(`docker start ${CONTAINER_NAME}`)}`);
      }
      console.log(` ${green('done')}`);
    } else {
      // Create new container with platform-aware networking
      const isLinux = process.platform === 'linux';
      const networkFlag = isLinux ? '--network=host' : '';

      process.stdout.write(`  ${yellow('→')} Creating toolkit container...`);
      const runCmd = `docker run -d --name ${CONTAINER_NAME} ${networkFlag} ${IMAGE_NAME}`.replace(/\s+/g, ' ');
      if (run(runCmd) === null) {
        console.log('');
        fail(`Failed to create container.

  Try manually:
    ${cyan(runCmd)}`);
      }
      console.log(` ${green('done')}`);
    }
    console.log(`  ${green('✓')} Toolkit container running`);
  }

  // --- Step 4: Install prompt to ~/.nicefox-secu/ ---
  if (!fs.existsSync(HOME_DIR)) {
    fs.mkdirSync(HOME_DIR, { recursive: true });
  }
  fs.copyFileSync(PROMPT_SRC, PROMPT_DEST);
  console.log(`  ${green('✓')} Prompt installed`);

  // --- Step 5: Print instructions ---
  console.log('');
  console.log(`  ${bold('Ready!')} Open your AI coding agent from your project directory and paste:`);
  console.log('');
  console.log(`    ${cyan(`Read ${PROMPT_DEST} and start the security review`)}`);
  console.log('');
  console.log(dim('  Works with Claude Code, Codex, opencode, Cursor, Kimi, aider...'));
  console.log('');
}

main();
