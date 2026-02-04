# NiceFox Secu

AI-powered pentesting for web developers. Find vulnerabilities, fix them in your code, verify the fixes — all in one session, with zero security experience needed.

Works with **any AI coding agent**: Claude Code, Codex, opencode, Cursor, Kimi, aider...

Based on the [AIDA](https://github.com/Vasco0x4/AIDA) methodology.

## Quick Start

### 1. Install Exegol (one-time)

[Exegol](https://exegol.readthedocs.io/) is a Docker-based pentesting toolbox. Install it once:

```bash
pip install exegol
exegol install
```

Then create the container:

```bash
exegol start nicefox
# Select the 'free' image (community), or 'web'/'full' if you have a Pro subscription
```

### 2. Run NiceFox Secu

From **your project directory**:

```bash
npx nicefox-secu
```

This checks Docker and Exegol are ready, then tells you exactly what to do next.

### 3. Start the Pentest

Open your AI coding agent from your project directory and paste:

```
Read ~/.nicefox-secu/PENTEST.md and start the pentest
```

The AI will:
1. **Auto-detect** your framework, target URL, and environment (dev/prod)
2. **Ask you to confirm** — one question instead of a setup wizard
3. **Pentest** your app (recon, endpoint mapping, vulnerability testing)
4. **Fix** each vulnerability directly in your source code
5. **Verify** each fix by re-testing
6. **Generate a report** at `reports/{project}_pentest_report.md`

## Example

```bash
$ cd ~/projects/my-express-api
$ npx nicefox-secu

  NiceFox Secu
  AI-powered pentesting for web developers

  ✓ Docker is running
  ✓ Exegol container ready (exegol-nicefox)
  ✓ Prompt installed

  Ready! Open your AI coding agent from your project directory and paste:

    Read ~/.nicefox-secu/PENTEST.md and start the pentest

$ claude  # or opencode, cursor, codex, aider...

> Read ~/.nicefox-secu/PENTEST.md and start the pentest

AI: Detected: Express.js project, target http://localhost:3000, dev mode.
    Start the pentest? (Y/n)

You: Y

AI: [scanning, testing, fixing...]

AI: Found VULN-001: SQL Injection in POST /api/search (CRITICAL)
    Fixing src/routes/search.js — parameterized query...
    Fix verified.

AI: Found VULN-002: Missing rate limiting on POST /api/login (MEDIUM)
    Fixing src/routes/auth.js — adding express-rate-limit...
    Fix verified.

AI: Assessment complete. Generated reports/my-express-api_pentest_report.md
    Found 2 vulnerabilities, fixed 2.
```

## Environment Modes

**Development** (auto-detected when target is localhost):
- Aggressive scanning, all exploitation techniques allowed
- AI edits your source code directly to fix vulnerabilities
- Full tool suite

**Production** (auto-detected when target is a real domain):
- Non-destructive tests only, rate limits respected
- AI documents recommended fixes but does NOT edit code
- Extra caution on risky tests

## Prerequisites

| | Linux (recommended) | macOS | Windows |
|---|---|---|---|
| **Node.js** | [nodejs.org](https://nodejs.org/) | `brew install node` | [nodejs.org](https://nodejs.org/) |
| **Docker** | [Docker Engine](https://docs.docker.com/engine/install/) | [OrbStack](https://orbstack.dev/) or [Docker Desktop](https://docs.docker.com/desktop/install/mac-install/) | [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) (WSL 2) |
| **Python 3 + pipx** | `sudo apt install python3 pipx` | `brew install python3 pipx` | [python.org](https://www.python.org/downloads/) |

> **Windows**: Run from a **WSL 2** terminal for best compatibility.

## Safety

- **Always** test against a dev/staging environment first
- **Never** test production systems without explicit authorization
- **Backup** your code before running (or just use git — you do use git, right?)
- The AI will **not modify production code** — it only documents fixes in prod mode

## Troubleshooting

### Container won't start
```bash
docker info                   # Check Docker is running
docker ps -a | grep nicefox   # Check container status
docker start exegol-nicefox   # Start stopped container
```

### Tools not responding
```bash
docker exec exegol-nicefox nmap --version    # Test a tool manually
```

### Recreate the container
```bash
exegol stop nicefox
exegol remove nicefox
exegol start nicefox
```

## License

MIT — Use at your own risk. Only test systems you own or have explicit permission to test.

## Credits

Based on [AIDA](https://github.com/Vasco0x4/AIDA) (AI-Driven Security Assessment), simplified for web developers.
