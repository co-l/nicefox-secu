# Pentesting Tools Reference

Quick reference for common pentesting tools available in Exegol.

> **Execution model:** All tools listed here run inside the Exegol container. Prefix every command with `docker exec exegol-pentest`. For example:
> ```bash
> docker exec exegol-pentest nmap -sV target.com
> ```
> Wordlist paths (e.g., `/usr/share/wordlists/...`) are paths inside the container and are valid as-is within the `docker exec` call.
>
> Prefer stdout output over file-writing flags (`-oN`, `-o`, `--output-dir`). To save output, redirect on the host: `docker exec exegol-pentest nmap -sV target.com > reports/nmap_scan.txt`
>
> Standard host tools (`curl`, `jq`, `base64`, `python3`) can be run directly without `docker exec`.

## Reconnaissance Tools

### nmap - Network Scanner

```bash
# Quick scan - top 100 ports
nmap -sV {target}

# Full port scan
nmap -sV -p- {target}

# Aggressive scan with scripts
nmap -sV -sC -O -A {target}

# Vulnerability scan
nmap --script vuln {target}

# Output formats
nmap -sV {target} -oN scan.txt    # Normal
nmap -sV {target} -oX scan.xml    # XML
nmap -sV {target} -oG scan.gnmap  # Grepable
```

### subfinder - Subdomain Discovery

```bash
# Basic subdomain enumeration
subfinder -d {domain} -o subdomains.txt

# With all sources
subfinder -d {domain} -all -o subdomains.txt

# Recursive search
subfinder -d {domain} -recursive -o subdomains.txt

# Silent mode (output only)
subfinder -d {domain} -silent
```

### amass - Comprehensive DNS Enumeration

```bash
# Passive enumeration
amass enum -d {domain} -o amass.txt

# Active enumeration (more thorough)
amass enum -d {domain} -active -o amass.txt

# With brute forcing
amass enum -d {domain} -brute -o amass.txt

# Visual output
amass viz -d3 -o amass-graph.html
```

### whatweb - Technology Detection

```bash
# Basic scan
whatweb {target_url}

# Aggressive scan
whatweb -a 3 {target_url}

# Multiple targets
whatweb -i urls.txt

# Output formats
whatweb {target_url} --log-json=tech.json
whatweb {target_url} --log-xml=tech.xml
```

### sslscan - SSL/TLS Analysis

```bash
# Basic SSL scan
sslscan {target}:443

# Check for weak ciphers
sslscan --no-failed {target}:443

# XML output
sslscan --xml=ssl-scan.xml {target}:443
```

### testssl.sh - Comprehensive SSL Testing

```bash
# Full SSL audit
testssl.sh {target}:443

# Quick check
testssl.sh --fast {target}:443

# Specific vulnerabilities
testssl.sh --heartbleed --ccs --ticketbleed {target}:443

# JSON output
testssl.sh --jsonfile ssl-results.json {target}:443
```

## Web Discovery Tools

### ffuf - Fast Web Fuzzer

```bash
# Directory discovery
ffuf -u {target_url}/FUZZ -w /usr/share/wordlists/dirb/common.txt

# With file extensions
ffuf -u {target_url}/FUZZ -w wordlist.txt -e .php,.html,.js,.txt

# API endpoint discovery
ffuf -u {target_url}/api/v1/FUZZ -w api-endpoints.txt

# POST data fuzzing
ffuf -u {target_url}/login -X POST -d "username=FUZZ&password=test" -w users.txt

# Header fuzzing
ffuf -u {target_url} -H "Authorization: Bearer FUZZ" -w tokens.txt

# Output to file
ffuf -u {target_url}/FUZZ -w wordlist.txt -o results.json

# Filter responses (hide 404s)
ffuf -u {target_url}/FUZZ -w wordlist.txt -fc 404

# Match specific response size
ffuf -u {target_url}/FUZZ -w wordlist.txt -ms 1234
```

### gobuster - Directory/File Buster

```bash
# Directory enumeration
gobuster dir -u {target_url} -w /usr/share/wordlists/dirb/common.txt

# With extensions
gobuster dir -u {target_url} -w wordlist.txt -x php,html,js

# DNS subdomain enumeration
gobuster dns -d {domain} -w subdomains.txt

# Virtual host discovery
gobuster vhost -u {target_url} -w vhosts.txt

# S3 bucket discovery
gobuster s3 -w buckets.txt

# Output to file
gobuster dir -u {target_url} -w wordlist.txt -o results.txt
```

### feroxbuster - Recursive Content Discovery

```bash
# Recursive directory scan
feroxbuster -u {target_url}

# With extensions
feroxbuster -u {target_url} -x php,html,js

# Depth limit
feroxbuster -u {target_url} -d 3

# Filter status codes
feroxbuster -u {target_url} -C 404,500

# Output
feroxbuster -u {target_url} -o results.json
```

### dirb - Web Content Scanner

```bash
# Basic scan
dirb {target_url}

# Custom wordlist
dirb {target_url} /usr/share/wordlists/dirb/big.txt

# With extensions
dirb {target_url} -X .php,.html,.js

# Silent mode
dirb {target_url} -o results.txt -S
```

## Parameter Discovery

### arjun - HTTP Parameter Discovery

```bash
# GET parameter discovery
arjun -u {target_url}/endpoint

# POST parameter discovery
arjun -u {target_url}/endpoint -m POST

# JSON body
arjun -u {target_url}/api -m POST --json '{"FUZZ":"test"}'

# With custom wordlist
arjun -u {target_url}/endpoint -w params.txt

# Stable mode (slower but more accurate)
arjun -u {target_url}/endpoint -oT 10
```

## SQL Injection Tools

### sqlmap - Automated SQL Injection

```bash
# Basic GET parameter test
sqlmap -u "{target_url}/page?id=1"

# POST data test
sqlmap -u "{target_url}/login" --data="username=test&password=test"

# Cookie test
sqlmap -u "{target_url}/admin" --cookie="session=abc123"

# Header test
sqlmap -u "{target_url}/api" --header="X-Api-Key: test"

# Database enumeration
sqlmap -u "{target_url}/page?id=1" --dbs

# Table enumeration
sqlmap -u "{target_url}/page?id=1" -D database_name --tables

# Column enumeration
sqlmap -u "{target_url}/page?id=1" -D database_name -T table_name --columns

# Data extraction
sqlmap -u "{target_url}/page?id=1" -D database_name -T table_name -C column_name --dump

# Batch mode (no questions)
sqlmap -u "{target_url}/page?id=1" --batch

# Risk and level
sqlmap -u "{target_url}/page?id=1" --level=3 --risk=2

# Output to file
sqlmap -u "{target_url}/page?id=1" --dump-all --output-dir=./sqlmap-results
```

## XSS Testing

### dalfox - Modern XSS Scanner

```bash
# Basic scan
dalfox url {target_url}/search?query=test

# With POST data
dalfox url {target_url}/search --data "query=test"

# Blind XSS with callback
dalfox url {target_url}/search?query=test --blind https://your-callback.com

# Pipe from other tools
cat urls.txt | dalfox pipe

# Mining mode (discover parameters)
dalfox url {target_url} --mining-dict
```

### XSStrike - Advanced XSS Detection

```bash
# Basic scan
python3 xsstrike.py -u "{target_url}/search?query=test"

# Crawl and scan
python3 xsstrike.py -u "{target_url}" --crawl

# Fuzzing
python3 xsstrike.py -u "{target_url}/search?query=test" --fuzzer

# Blind XSS
python3 xsstrike.py -u "{target_url}/search?query=test" --blind
```

## API Testing

### postman / newman

```bash
# Run collection
newman run collection.json

# With environment
newman run collection.json -e environment.json

# Output report
newman run collection.json -r html,json

# Iterations
newman run collection.json -n 10
```

### httpie - HTTP Client

```bash
# GET request
http {target_url}/api/users

# POST with JSON
http POST {target_url}/api/users name="John" email="john@example.com"

# With headers
http {target_url}/api/users Authorization:"Bearer token123"

# Form data
http -f POST {target_url}/api/upload file@document.pdf

# Download
http -d {target_url}/file.zip
```

### curl - HTTP Client

```bash
# GET request
curl {target_url}/api/users

# POST with JSON
curl -X POST {target_url}/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# With headers
curl -H "Authorization: Bearer token123" {target_url}/api/users

# Follow redirects
curl -L {target_url}

# Show headers
curl -I {target_url}

# Verbose output
curl -v {target_url}

# Save output
curl -o output.json {target_url}/api/users

# POST form data
curl -X POST {target_url}/login \
  -d "username=admin&password=secret"
```

## JWT Tools

### jwt_tool - JWT Testing

```bash
# Analyze token
jwt_tool {token}

# Crack secret
jwt_tool {token} -C -d secrets.txt

# Tamper token
jwt_tool {token} -T

# Generate token
jwt_tool -S hs256 -p "secret" -I -pc sub -pv "admin"

# Test vulnerabilities
jwt_tool {token} -t
```

## Wordlists

Common wordlist locations in Exegol:

```bash
# Directory discovery
/usr/share/wordlists/dirb/common.txt
/usr/share/wordlists/dirb/big.txt
/usr/share/wordlists/dirb/small.txt

# SecLists
/usr/share/wordlists/seclists/Discovery/Web-Content/
/usr/share/wordlists/seclists/Discovery/DNS/

# RockYou (passwords)
/usr/share/wordlists/rockyou.txt

# Custom wordlists
/opt/SecLists/
```

## Encoding/Decoding

### base64

```bash
# Encode
echo "text" | base64

# Decode
echo "dGV4dA==" | base64 -d
```

### urlencode

```bash
# Encode
python3 -c "import urllib.parse; print(urllib.parse.quote('test@example.com'))"

# Decode
python3 -c "import urllib.parse; print(urllib.parse.unquote('test%40example.com'))"
```

### jq - JSON Processor

```bash
# Pretty print
cat file.json | jq

# Extract field
cat file.json | jq '.field_name'

# Filter array
cat file.json | jq '.users[] | select(.role=="admin")'

# Modify
cat file.json | jq '.new_field = "value"'
```

## Useful One-Liners

```bash
# Quick port scan
nmap -p- --open -T4 {target} | grep "^PORT"

# Extract subdomains from certificate
echo | openssl s_client -servername {domain} -connect {domain}:443 2>/dev/null | openssl x509 -noout -text | grep DNS

# Check all HTTP methods
curl -X OPTIONS {target_url} -i

# Test for CORS misconfiguration
curl -H "Origin: https://evil.com" -I {target_url}

# Extract URLs from JavaScript
curl -s {target_url}/app.js | grep -oE "(https?://)?[a-zA-Z0-9./?=_-]*" | sort -u

# Check security headers
curl -I {target_url} | grep -E "(X-Frame-Options|X-XSS-Protection|X-Content-Type-Options|Strict-Transport-Security|Content-Security-Policy)"

# Test for SQL injection with time delay
curl "{target_url}/page?id=1' AND (SELECT * FROM (SELECT(SLEEP(5)))a)"

# Brute force basic auth
hydra -l admin -P passwords.txt {target} http-get /admin

# Check for common API endpoints
for endpoint in /api/v1/users /api/v1/admin /api/swagger.json /api/docs /graphql; do curl -s -o /dev/null -w "%{http_code} $endpoint\n" {target_url}$endpoint; done
```

## Output Management

```bash
# Reports are saved on the host in the reports/ directory
# Tool output should be captured via stdout and redirected as needed:
docker exec exegol-pentest nmap -sV target.com > reports/nmap_scan.txt
docker exec exegol-pentest subfinder -d target.com -silent > reports/subdomains.txt
```

## Tips

1. **Always save output** - Redirect stdout on the host side (`> reports/file.txt`) to save results
2. **Use multiple tools** - Don't rely on a single tool's results
3. **Check wordlists** - Ensure you're using appropriate wordlists for the target
4. **Rate limiting** - Add delays (`-rate` in ffuf, `-t` in gobuster) to avoid DoS
5. **Verify findings** - Manually confirm automated tool results
6. **Document everything** - Save commands and outputs for the report