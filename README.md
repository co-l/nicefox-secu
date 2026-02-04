# Simple Pentest Kit

AI-powered security testing for web developers. Find vulnerabilities in your API, fix them in your code, and verify the fixes — all in one session.

Based on the [AIDA](https://github.com/Vasco0x4/AIDA) methodology, simplified for developers who aren't security experts.

## How It Works

You launch an AI coding agent and point it at your API. The AI:

1. **Pentests** your API (recon, endpoint mapping, vulnerability testing)
2. **Fixes** each vulnerability directly in your source code as it finds them
3. **Verifies** each fix works by re-testing the endpoint
4. **Generates a report** summarizing what was found, fixed, and what needs manual attention

**Output:** `reports/{project}_pentest_report.md` + your code is patched.

## Prerequisites

You need **Docker**, **Python 3**, **Git**, and an **AI coding agent** (Claude Code, opencode, etc.).

| | Linux (recommended) | macOS | Windows |
|---|---|---|---|
| **Docker** | [Docker Engine](https://docs.docker.com/engine/install/) | [OrbStack](https://orbstack.dev/) (recommended) or [Docker Desktop](https://docs.docker.com/desktop/install/mac-install/) | [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) (requires WSL 2) |
| **Python 3 + pipx** | `sudo apt install python3 pipx` | `brew install python3 pipx` | [python.org](https://www.python.org/downloads/) + `pip install pipx` |
| **Git** | `sudo apt install git` | `brew install git` | [Git for Windows](https://git-scm.com/download/win) |

> **Platform notes:**
> - **Linux** is recommended for best performance and full compatibility with Exegol.
> - **macOS**: Works well. OrbStack is preferred over Docker Desktop for performance.
> - **Windows**: Run from a **WSL 2** terminal for best compatibility. Docker Desktop must have the WSL 2 backend enabled.
> - **macOS & Windows**: Docker Desktop has limitations with host network interfaces, which may affect some scan types (e.g., certain nmap raw socket scans). See the [Exegol docs](https://docs.exegol.com/first-install/) for details.

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/co-l/simple-pentest.git
cd simple-pentest
```

### 2. Install & Start Exegol

Follow the official Exegol installation guide for your platform: **https://docs.exegol.com/first-install/**

Once Exegol is installed, start the pentesting container:

```bash
exegol start pentest
# Select 'free' image (community) or 'web'/'full' if you have a Pro subscription
```

### 3. Launch Your AI Agent

```bash
# On your host machine, from the simple-pentest directory
opencode  # or claude, aider, etc.
```

> **Note:** You run your AI agent on the host machine, not inside the Exegol container.
> The container just needs to be running in the background — the AI reaches its pentesting
> tools via `docker exec exegol-pentest <command>`.

### 4. Start

```
Look at prompts/pentest.md and start
```

The AI will ask you 3 questions:
- **Project source path**: Where your code lives (so it can fix it)
- **Target URL**: The API endpoint to test
- **Environment**: Dev or Production

Then it goes to work. Come back to fixed code and a report.

## Example Session

```bash
$ exegol start pentest
$ cd /path/to/simple-pentest
$ opencode  # or claude, aider, etc.

> Look at prompts/pentest.md and start

AI: What is the path to your project source code?
You: /home/user/projects/myapi

AI: What is the target URL to test?
You: http://localhost:3000

AI: Is this a development or production environment?
You: dev

[AI scans your API, discovers endpoints, tests for vulnerabilities...]

AI: Found VULN-001: SQL Injection in POST /api/search (CRITICAL)
    Fixing src/routes/search.js — switching to parameterized query...
    Fix verified — endpoint now returns 400 on injection attempt.

AI: Found VULN-002: Missing rate limiting on POST /api/login (MEDIUM)
    Fixing src/routes/auth.js — adding express-rate-limit...
    Fix verified — returns 429 after 5 attempts.

AI: Found VULN-003: CORS allows all origins (MEDIUM)
    Fixing src/app.js — restricting to specific origins...
    Fix verified — cross-origin request from evil.com now blocked.

[AI does final verification pass...]

AI: Assessment complete. Generated reports/myapi_pentest_report.md
    Found 3 vulnerabilities, fixed 3.
    Review the report for details.
```

## Environment Differences

**Development** (recommended for first use):
- Full testing suite, aggressive scanning
- AI edits your source code directly to fix vulnerabilities
- All exploitation techniques allowed

**Production**:
- Non-destructive tests only, rate limits respected
- AI documents recommended fixes but does NOT edit code
- Extra confirmation prompts for risky tests

## Safety

- **Always** test against a dev/staging environment first
- **Never** test production systems without explicit authorization
- **Backup** your code before running (or just use git)
- The AI will **not modify production code** — it only documents fixes in prod mode

## Files

| File | Purpose |
|------|---------|
| `prompts/pentest.md` | The AI prompt — pentest + fix + verify methodology |
| `prompts/utils/tools-reference.md` | Tool command reference for the AI |
| `reports/` | Output directory for reports (gitignored) |

## Troubleshooting

For Exegol installation issues, see the [official docs](https://docs.exegol.com/first-install/).

### Container won't start
```bash
docker info                   # Check Docker is running
exegol info                   # List existing containers
exegol stop pentest           # Stop conflicting container
exegol remove pentest         # Remove it
exegol start pentest          # Recreate
```

### Tools not responding via docker exec
```bash
docker ps | grep exegol-pentest              # Verify container is running
docker exec exegol-pentest nmap --version    # Test a tool manually
```

### Permission denied (Linux)
```bash
sudo usermod -aG docker $USER    # Add user to docker group
# Log out and back in
```

## License

MIT — Use at your own risk. Only test systems you own or have explicit permission to test.

## Credits

Based on the [AIDA](https://github.com/Vasco0x4/AIDA) (AI-Driven Security Assessment) methodology, simplified for web developers and direct AI interaction.
