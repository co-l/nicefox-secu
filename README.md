# Simple Pentest Kit

A lightweight, AI-driven API penetration testing framework that works directly with your AI agent - no complex infrastructure needed.

## Overview

This kit provides a streamlined pentesting workflow with three clear phases:
1. **Findings** - Conduct comprehensive security assessment
2. **Fixes** - Generate prioritized, code-level remediation guidance  
3. **Verify** - Re-test to confirm vulnerabilities are resolved

## Quick Start

### 1. Setup Exegol

```bash
# Run the setup script
./setup.sh

# Or manually:
# Install Exegol if not already installed
pip3 install exegol

# Start the pentesting container
exegol start pentest

# Select 'web' or 'full' image when prompted
```

### 2. Launch Your AI Agent

```bash
# Inside the Exegol container, navigate to this directory
cd /path/to/simple-pentest

# Launch your AI agent CLI (e.g., opencode, Claude Code, etc.)
opencode
```

### 3. Start Pentesting

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

**Output**: `{project}_pentest_findings.md`

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

**Output**: `{project}_pentest_fixes.md`

### Phase 3: Implementation

Take the fixes file to your project and implement all recommendations.

### Phase 4: Verify

Return to your **original pentest AI session** and use the verification prompt provided earlier:

```
Verify all findings from {project}_pentest_findings.md
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
| `setup.sh` | Exegol container setup script |
| `templates/findings_template.md` | Report structure template |

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
# Terminal 1: Setup
$ ./setup.sh
[*] Starting Exegol container 'pentest'...
[*] Container ready

# Terminal 1: Launch your AI agent
$ opencode  # or claude, aider, etc.

# In your AI agent:
> Look at prompts/01-recon-and-pentest.md and start by asking my project parameters

AI: What is the path to your project source code?
You: /home/user/projects/leangraph

AI: What is the target URL to test?
You: https://api.leangraph.io

AI: Is this a development or production environment?
You: dev

[AI conducts 4-phase pentest...]

AI: Pentest complete. Generated leangraph_pentest_findings.md
    Now look at FIXES.md to generate fix recommendations.

# Terminal 2: New AI agent session for fixes
$ opencode  # or claude, aider, etc.

# In your AI agent:
> Look at prompts/02-fixes.md and generate fix recommendations for leangraph

[AI analyzes source code and generates fixes...]

AI: Generated leangraph_pentest_fixes.md with prioritized fixes

# You implement fixes in your project...

# Terminal 1: Back to original session
> Verify all findings from leangraph_pentest_findings.md

[AI re-tests all findings...]

AI: Verification complete:
    - 3 findings FIXED ✓
    - 1 finding STILL VULNERABLE ✗
    
    Would you like me to generate additional fix recommendations
    for the remaining vulnerability?
```

## Troubleshooting

### Exegol not found
```bash
pip3 install --user exegol
# Or: pip3 install exegol
```

### Container won't start
```bash
# Check Docker is running
docker info

# List existing Exegol containers
exegol info

# Remove conflicting container
exegol stop pentest
exegol remove pentest
exegol start pentest
```

### Permission denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

## License

MIT - Use at your own risk. Only test systems you own or have explicit permission to test.

## Credits

Based on the AIDA (AI-Driven Security Assessment) methodology, simplified for solo developers and direct AI interaction.