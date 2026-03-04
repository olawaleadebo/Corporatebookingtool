#!/bin/bash

# COBT Backend Deployment Script for VPS
# This script automates the deployment process

set -e  # Exit on error

echo "=========================================="
echo "COBT Backend Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="cobt-backend"
DEPLOY_DIR="/opt/cobt"
BACKUP_DIR="/opt/cobt-backups"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_info "All requirements satisfied."
}

create_directories() {
    log_info "Creating necessary directories..."
    
    mkdir -p $DEPLOY_DIR
    mkdir -p $BACKUP_DIR
    mkdir -p $DEPLOY_DIR/logs
    mkdir -p $DEPLOY_DIR/ssl
    
    log_info "Directories created."
}

backup_existing() {
    if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR)" ]; then
        log_info "Creating backup of existing deployment..."
        
        BACKUP_NAME="cobt-backup-$(date +%Y%m%d-%H%M%S)"
        mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
        
        # Backup .env file
        if [ -f "$DEPLOY_DIR/.env" ]; then
            cp "$DEPLOY_DIR/.env" "$BACKUP_DIR/$BACKUP_NAME/.env"
        fi
        
        # Backup database
        docker exec cobt-postgres pg_dump -U cobt_user cobt_db > "$BACKUP_DIR/$BACKUP_NAME/database.sql" 2>/dev/null || true
        
        log_info "Backup created at: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

setup_environment() {
    log_info "Setting up environment..."
    
    if [ ! -f "$DEPLOY_DIR/.env" ]; then
        log_warn ".env file not found. Creating from .env.example..."
        
        if [ -f ".env.example" ]; then
            cp .env.example "$DEPLOY_DIR/.env"
            log_warn "Please edit $DEPLOY_DIR/.env with your production values before continuing."
            read -p "Press enter when ready to continue..."
        else
            log_error ".env.example not found!"
            exit 1
        fi
    else
        log_info ".env file already exists."
    fi
}

deploy_application() {
    log_info "Deploying application..."
    
    # Copy files to deploy directory
    cp -r * "$DEPLOY_DIR/" 2>/dev/null || true
    
    cd "$DEPLOY_DIR"
    
    # Pull latest images
    log_info "Pulling Docker images..."
    docker-compose pull
    
    # Build application
    log_info "Building application..."
    docker-compose build --no-cache
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose down
    
    # Start containers
    log_info "Starting containers..."
    docker-compose up -d
    
    log_info "Application deployed successfully!"
}

run_migrations() {
    log_info "Running database migrations..."
    
    # Wait for database to be ready
    sleep 10
    
    docker-compose exec -T api npm run migration:run || log_warn "Migration failed or no migrations to run"
    
    log_info "Migrations completed."
}

health_check() {
    log_info "Performing health check..."
    
    # Wait for application to start
    sleep 15
    
    MAX_RETRIES=30
    RETRY_COUNT=0
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        if curl -f http://localhost:3000/api/v1/health >/dev/null 2>&1; then
            log_info "Health check passed! Application is running."
            return 0
        fi
        
        RETRY_COUNT=$((RETRY_COUNT + 1))
        log_info "Waiting for application to be ready... ($RETRY_COUNT/$MAX_RETRIES)"
        sleep 5
    done
    
    log_error "Health check failed! Application may not be running correctly."
    return 1
}

show_status() {
    log_info "Container status:"
    docker-compose ps
    
    echo ""
    log_info "Application logs (last 20 lines):"
    docker-compose logs --tail=20 api
    
    echo ""
    log_info "=========================================="
    log_info "Deployment Summary"
    log_info "=========================================="
    log_info "API URL: http://$(hostname -I | awk '{print $1}'):3000"
    log_info "API Docs: http://$(hostname -I | awk '{print $1}'):3000/api/docs"
    log_info "=========================================="
}

cleanup() {
    log_info "Cleaning up old Docker images..."
    docker system prune -f
}

# Main deployment flow
main() {
    echo ""
    log_info "Starting deployment process..."
    echo ""
    
    check_requirements
    create_directories
    backup_existing
    setup_environment
    deploy_application
    run_migrations
    
    if health_check; then
        show_status
        cleanup
        
        echo ""
        log_info "=========================================="
        log_info "Deployment completed successfully!"
        log_info "=========================================="
        echo ""
    else
        log_error "Deployment failed! Check logs for details."
        docker-compose logs api
        exit 1
    fi
}

# Run main function
main
