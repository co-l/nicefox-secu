# Simple Pentest Kit

A lightweight, AI-driven API penetration testing framework that works directly with your AI agent - no complex infrastructure needed.

## Overview

This kit provides a streamlined pentesting workflow with three clear phases:
1. **Findings** - Conduct comprehensive security assessment
2. **Fixes** - Generate prioritized, code-level remediation guidance  
3. **Verify** - Re-test to confirm vulnerabilities are resolved

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
> - **macOS & Windows**: Docker Desktop has limitations with host network interfaces and USB device access, which may affect some scan types (e.g., certain nmap raw socket scans). See the [Exegol docs](https://docs.exegol.com/first-install/) for details.

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

### 4. Start Pentesting

Use this prompt to begin:

```
Look at prompts/01-recon-and-pentest.md and start by asking my project parameters
```

The AI will ask you:
- **Project source path**: Location of your codebase (for fix generation)
- **Target URL**: The API endpoint to test
- **Environment**: Dev or Production (affects testing intensity)

## Workflow

### Phase 1: Pentest

The AI conducts a 4-phase security assessment:
- **Reconnaissance** - DNS, subdomains, tech stack, ports
- **Mapping** - Endpoint discovery, API enumeration
- **Vulnerability Assessment** - Test for SQLi, XSS, IDOR, auth bypass, etc.
- **Exploitation** - Validate findings with proof-of-concept

**Output**: `reports/{project}_pentest_findings.md`

### Phase 2: Fixes

After the pentest completes, the AI will tell you:

> "Pentest complete. Now look at prompts/02-fixes.md to generate fix recommendations."

Start a new AI agent session and use:

```
Look at prompts/02-fixes.md and generate fix recommendations for {project}
```

The AI will:
- Analyze your source code for framework detection
- Generate code-level fixes with examples
- Prioritize by severity (Critical → High → Medium → Low)

**Output**: `reports/{project}_pentest_fixes.md`

### Phase 3: Implementation

Take the fixes file to your project and implement all recommendations.

### Phase 4: Verify

Return to your **original pentest AI session** and use the verification prompt provided earlier:

```
Verify all findings from reports/{project}_pentest_findings.md
```

The AI will:
- Re-test ALL previous findings
- Mark each as fixed or still vulnerable
- Offer new fix prompts for remaining issues
- Update the findings report with verification results

## Files Reference

### For Humans (Documentation)

| File | Purpose |
|------|---------|
| `README.md` | This file - setup and workflow guide |
| `templates/findings_template.md` | Report structure template |
| `reports/` | Output directory for pentest findings and fixes (gitignored) |

### For AI (Prompts)

| File | Purpose |
|------|---------|
| `prompts/01-recon-and-pentest.md` | Step 1: Reconnaissance & pentesting methodology |
| `prompts/02-fixes.md` | Step 2: Fix generation with framework detection |
| `prompts/03-verify.md` | Step 3: Verification & re-testing workflow |
| `prompts/utils/tools-reference.md` | Tool reference and command examples |

## Important Notes

### Environment Differences

**Development Environment:**
- Full testing suite enabled
- Aggressive scanning allowed
- Database manipulation permitted
- All exploitation techniques available

**Production Environment:**
- Non-destructive tests only
- Rate limiting respected
- No data modification
- Extra confirmation prompts for risky tests

### Safety Guidelines

- **Always** verify you have permission to test the target
- **Never** test production systems without explicit authorization
- **Backup** databases before testing in dev environments
- **Document** all commands run for accountability

### Framework Support

The AI auto-detects common frameworks for better fix recommendations:
- **Python**: Django, Flask, FastAPI
- **Node.js**: Express, NestJS, Koa
- **Go**: Gin, Echo, Fiber
- **Java**: Spring Boot, Jakarta EE
- **Ruby**: Rails, Sinatra
- **PHP**: Laravel, Symfony

## Example Session

```bash
# Setup (run once)
$ exegol start pentest   # select 'free' (community) or 'web'/'full' (Pro)
[*] Container ready

# Launch your AI agent on the host machine
$ cd /path/to/simple-pentest
$ opencode  # or claude, aider, etc.

# In your AI agent:
> Look at prompts/01-recon-and-pentest.md and start by asking my project parameters

AI: What is the path to your project source code?
You: /home/user/projects/leangraph

AI: What is the target URL to test?
You: https://api.leangraph.io

AI: Is this a development or production environment?
You: dev

[AI conducts 4-phase pentest, running tools via docker exec exegol-pentest...]

AI: Pentest complete. Generated reports/leangraph_pentest_findings.md
    Now look at prompts/02-fixes.md to generate fix recommendations.

# Terminal 2: New AI agent session for fixes
$ opencode  # or claude, aider, etc.

# In your AI agent:
> Look at prompts/02-fixes.md and generate fix recommendations for leangraph

[AI analyzes source code and generates fixes...]

AI: Generated reports/leangraph_pentest_fixes.md with prioritized fixes

# You implement fixes in your project...

# Terminal 1: Back to original session
> Verify all findings from reports/leangraph_pentest_findings.md

[AI re-tests all findings...]

AI: Verification complete:
    - 3 findings FIXED ✓
    - 1 finding STILL VULNERABLE ✗
    
    Would you like me to generate additional fix recommendations
    for the remaining vulnerability?
```

## Troubleshooting

For Exegol installation issues, see the [official docs](https://docs.exegol.com/first-install/).

### Container won't start
```bash
# Check Docker is running
docker info

# List existing Exegol containers
exegol info

# Remove conflicting container and recreate
exegol stop pentest
exegol remove pentest
exegol start pentest
```

### Tools not responding via docker exec
```bash
# Verify the container is running
docker ps | grep exegol-pentest

# Test a tool manually
docker exec exegol-pentest nmap --version
```

### Permission denied (Linux)
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

## License

MIT - Use at your own risk. Only test systems you own or have explicit permission to test.

## Credits

Based on the AIDA (AI-Driven Security Assessment) methodology, simplified for solo developers and direct AI interaction.