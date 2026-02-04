#!/bin/bash
# ==============================================================================
# Simple Pentest Kit - Exegol Setup Script
# ==============================================================================
# Sets up Exegol container with pentesting tools
# ==============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()     { echo -e "${GREEN}[✓]${NC} $*"; }
warn()    { echo -e "${YELLOW}[!]${NC} $*"; }
error()   { echo -e "${RED}[✗]${NC} $*"; }
section() { echo -e "\n${BLUE}══════════════════════════════════════${NC}\n${BLUE}  $*${NC}\n${BLUE}══════════════════════════════════════${NC}"; }

CONTAINER_NAME="pentest"

# ==============================================================================
# CHECK PREREQUISITES
# ==============================================================================

section "Checking Prerequisites"

# Check Docker
if ! command -v docker &> /dev/null; then
    error "Docker not found. Please install Docker Desktop first:"
    error "  https://docker.com/products/docker-desktop"
    exit 1
fi

if ! docker info &> /dev/null; then
    error "Docker daemon not running. Start Docker Desktop first."
    exit 1
fi

log "Docker is installed and running"

# Check Exegol
if ! command -v exegol &> /dev/null; then
    warn "Exegol not found. Installing..."
    pip3 install exegol || pip install exegol
    
    if ! command -v exegol &> /dev/null; then
        error "Failed to install Exegol. Try manually:"
        error "  pip3 install --user exegol"
        exit 1
    fi
fi

log "Exegol is installed"

# ==============================================================================
# SETUP EXEGOL CONTAINER
# ==============================================================================

section "Setting up Exegol Container"

# Check if container already exists
if exegol info "$CONTAINER_NAME" &> /dev/null; then
    warn "Container '$CONTAINER_NAME' already exists"
    read -p "Remove and recreate? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Removing existing container..."
        exegol stop "$CONTAINER_NAME" 2>/dev/null || true
        exegol remove "$CONTAINER_NAME" 2>/dev/null || true
    else
        log "Using existing container"
        exegol start "$CONTAINER_NAME"
        section "Setup Complete"
        log "Container '$CONTAINER_NAME' is running"
        log "To enter: exegol start $CONTAINER_NAME"
        exit 0
    fi
fi

# Create new container
log "Creating Exegol container '$CONTAINER_NAME'..."
echo ""
echo "Select an image:"
echo "  1) web - Web pentesting tools (~15GB) - RECOMMENDED"
echo "  2) full - Full pentesting suite (~40GB)"
echo "  3) light - Minimal tools (~5GB)"
echo ""
read -p "Choice (1-3) [1]: " choice
choice=${choice:-1}

case $choice in
    1) IMAGE="web" ;;
    2) IMAGE="full" ;;
    3) IMAGE="light" ;;
    *) IMAGE="web" ;;
esac

log "Selected image: $IMAGE"
echo ""
echo "This will download approximately:"
case $IMAGE in
    web) echo "  ~15GB for 'web' image" ;;
    full) echo "  ~40GB for 'full' image" ;;
    light) echo "  ~5GB for 'light' image" ;;
esac
echo ""
read -p "Continue with download? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ -n $REPLY ]]; then
    error "Setup cancelled"
    exit 1
fi

# Start container creation
log "Starting Exegol container (this may take a while)..."
exegol start "$CONTAINER_NAME" "$IMAGE"

# ==============================================================================
# VERIFY SETUP
# ==============================================================================

section "Verifying Setup"

# Check container is running
if docker ps --format "{{.Names}}" | grep -q "exegol-$CONTAINER_NAME"; then
    log "Container is running"
else
    error "Container failed to start"
    exit 1
fi

# Test basic tools
log "Testing tools availability..."
docker exec "exegol-$CONTAINER_NAME" which nmap &> /dev/null && log "  nmap: OK"
docker exec "exegol-$CONTAINER_NAME" which ffuf &> /dev/null && log "  ffuf: OK"
docker exec "exegol-$CONTAINER_NAME" which sqlmap &> /dev/null && log "  sqlmap: OK"
docker exec "exegol-$CONTAINER_NAME" which gobuster &> /dev/null && log "  gobuster: OK"
docker exec "exegol-$CONTAINER_NAME" which subfinder &> /dev/null && log "  subfinder: OK"

# ==============================================================================
# SUCCESS
# ==============================================================================

section "Setup Complete!"

echo ""
log "Exegol container '$CONTAINER_NAME' is ready"
echo ""
echo "Next steps:"
echo ""
echo "  1. Enter the container:"
echo "     exegol start $CONTAINER_NAME"
echo ""
echo "  2. Navigate to simple-pentest directory:"
echo "     cd /path/to/simple-pentest"
echo ""
echo "  3. Launch opencode:"
echo "     opencode"
echo ""
echo "  4. Start pentesting:"
echo "     'Look at PENTEST.md and start by asking my project parameters'"
echo ""
echo "Useful commands:"
echo "  exegol start $CONTAINER_NAME    # Enter container"
echo "  exegol stop $CONTAINER_NAME     # Stop container"
echo "  exegol info $CONTAINER_NAME     # Show container info"
echo "  exegol remove $CONTAINER_NAME   # Remove container"
echo ""

# Create workspace directory in container
log "Creating workspace directory..."
docker exec "exegol-$CONTAINER_NAME" mkdir -p /workspace/pentest-results
docker exec "exegol-$CONTAINER_NAME" bash -c "echo 'export PS1=\"[pentest] \$PS1\"' >> ~/.bashrc"

log "Setup complete! You're ready to pentest."