# NiceFox Secu

AI-powered pentesting for web developers. Find vulnerabilities, fix them in your code, verify the fixes — all in one session.

Zero security experience needed. Works with **any AI coding agent**: Claude Code, Codex, opencode, Cursor, Kimi, aider...

Based on the [AIDA](https://github.com/Vasco0x4/AIDA) methodology.

## Quick Start

### 1. Run NiceFox Secu

From **your project directory**:

```bash
npx nicefox-secu
```

On first run, this builds the security toolkit (~400MB Docker image, takes ~2-3 min once).

### 2. Start the Pentest

Open your AI coding agent and paste:

```
Read ~/.nicefox-secu/PENTEST.md and start the pentest
```

The AI will:
1. **Auto-detect** your framework, target URL, and environment (dev/prod)
2. **Ask you to confirm** — one question instead of a setup wizard
3. **Pentest** your app (recon, endpoint mapping, vulnerability testing)
4. **Fix** each vulnerability directly in your source code
5. **Verify** each fix by re-testing
6. **Print a summary** of what was found and fixed

### What You Need

- **Docker** — https://docs.docker.com/get-docker/
- **An AI coding agent** — Claude Code, Codex, opencode, Cursor, Kimi, aider...

That's it.

## Example

```bash
$ cd ~/projects/my-express-api
$ npx nicefox-secu

  NiceFox Secu
  AI-powered pentesting for web developers

  ✓ Docker is running
  ✓ Security toolkit image ready
  ✓ Toolkit container running
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

AI: Assessment complete.
    2 vulnerabilities found, 2 fixed, 0 require manual attention.
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

## Included Tools

The security toolkit Docker image ships with:

| Category | Tools |
|---|---|
| **Recon** | nmap, subfinder |
| **Vuln scanning** | nuclei |
| **Web discovery** | ffuf |
| **Parameters** | arjun |
| **SQL injection** | sqlmap |
| **XSS** | dalfox |
| **API testing** | httpie, curl |
| **JWT** | jwt_tool |
| **Brute force** | hydra |
| **Wordlists** | SecLists (Discovery, Fuzzing, Passwords) |

## Safety

- **Always** test against a dev/staging environment first
- **Never** test production systems without explicit authorization
- **Backup** your code before running (or just use git — you do use git, right?)
- The AI will **not modify production code** — it only documents fixes in prod mode

## Troubleshooting

### Rebuild the toolkit image
```bash
docker rm -f nicefox-tools        # Remove container
docker rmi nicefox-tools           # Remove image
npx nicefox-secu                   # Rebuilds from scratch
```

### Tools not responding
```bash
docker exec nicefox-tools nmap --version    # Test a tool manually
```

### macOS / Windows networking
If tools can't reach your local app, the AI will automatically use `host.docker.internal` instead of `localhost` — this is handled in the prompt.

## License

MIT — Use at your own risk. Only test systems you own or have explicit permission to test.

## Credits

Based on [AIDA](https://github.com/Vasco0x4/AIDA) (AI-Driven Security Assessment), simplified for web developers.
