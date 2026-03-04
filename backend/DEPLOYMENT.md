# COBT Backend Deployment Guide

## Prerequisites

### 1. VPS Requirements
- **OS**: Ubuntu 20.04 LTS or later
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: Minimum 40GB SSD
- **CPU**: 2+ cores recommended
- **Network**: Public IP address

### 2. Required Software
- Docker (20.10+)
- Docker Compose (2.0+)
- Git
- Nginx (if not using Docker nginx)

---

## Quick Deployment (Automated)

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd backend
```

### 2. Configure Environment
```bash
cp .env.example .env
nano .env  # Edit with production values
```

**Important environment variables:**
```bash
# Production Database
DB_PASSWORD=<strong-secure-password>

# JWT Secrets (use strong random strings)
JWT_SECRET=<generate-with: openssl rand -base64 64>
JWT_REFRESH_SECRET=<generate-with: openssl rand -base64 64>

# Amadeus Production Credentials
AMADEUS_CLIENT_ID=<your-production-client-id>
AMADEUS_CLIENT_SECRET=<your-production-client-secret>
AMADEUS_HOSTNAME=production.api.amadeus.com

# Paystack Production Keys
PAYSTACK_SECRET_KEY=sk_live_<your-live-secret-key>
PAYSTACK_PUBLIC_KEY=pk_live_<your-live-public-key>
PAYSTACK_WEBHOOK_SECRET=<your-webhook-secret>

# CORS (add your frontend domain)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

### 3. Run Deployment Script
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

The script will:
- Check requirements
- Create necessary directories
- Backup existing deployment
- Deploy with Docker Compose
- Run database migrations
- Perform health checks

---

## Manual Deployment

### Step 1: Install Docker

```bash
# Update packages
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Setup Application Directory

```bash
# Create application directory
sudo mkdir -p /opt/cobt
sudo chown $USER:$USER /opt/cobt
cd /opt/cobt

# Clone repository
git clone <your-repository-url> .
```

### Step 3: Configure Environment

```bash
# Copy and edit environment file
cp .env.example .env
nano .env
```

### Step 4: Deploy with Docker Compose

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Step 5: Database Migrations

```bash
# Run migrations
docker-compose exec api npm run migration:run
```

### Step 6: Verify Deployment

```bash
# Check health endpoint
curl http://localhost:3000/api/v1/health

# Expected response:
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "memory_rss": { "status": "up" },
    "disk": { "status": "up" }
  }
}
```

---

## SSL/HTTPS Setup (Let's Encrypt)

### Option 1: Using Certbot with Nginx

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Certificates will be automatically configured
# Renewal is automatic via cron job
```

### Option 2: Manual SSL Configuration

1. Place your SSL certificates in `/opt/cobt/ssl/`:
   ```bash
   /opt/cobt/ssl/cert.pem
   /opt/cobt/ssl/key.pem
   ```

2. Uncomment HTTPS section in `nginx.conf`

3. Restart nginx:
   ```bash
   docker-compose restart nginx
   ```

---

## Domain Configuration

### 1. DNS Records
Point your domain to your VPS IP address:

```
Type    Name    Value           TTL
A       api     <YOUR_VPS_IP>   3600
```

### 2. Nginx Configuration
Update `nginx.conf` with your domain:

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... rest of configuration
}
```

---

## Database Management

### Backup Database

```bash
# Manual backup
docker exec cobt-postgres pg_dump -U cobt_user cobt_db > backup-$(date +%Y%m%d).sql

# Automated daily backup (crontab)
0 2 * * * docker exec cobt-postgres pg_dump -U cobt_user cobt_db > /opt/cobt-backups/backup-$(date +\%Y\%m\%d).sql
```

### Restore Database

```bash
# Stop API to prevent conflicts
docker-compose stop api

# Restore from backup
cat backup-20260303.sql | docker exec -i cobt-postgres psql -U cobt_user cobt_db

# Start API
docker-compose start api
```

### Database Migrations

```bash
# Generate new migration
docker-compose exec api npm run migration:generate -- -n MigrationName

# Run migrations
docker-compose exec api npm run migration:run

# Revert last migration
docker-compose exec api npm run migration:revert
```

---

## Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api

# Last 100 lines
docker-compose logs --tail=100 api

# Application logs (inside container)
docker-compose exec api cat logs/combined.log
docker-compose exec api cat logs/error.log
```

### Monitor Resources

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Specific container
docker stats cobt-api
```

---

## Kafka Management

### View Topics

```bash
docker-compose exec kafka kafka-topics --list --bootstrap-server localhost:9092
```

### View Consumer Groups

```bash
docker-compose exec kafka kafka-consumer-groups --list --bootstrap-server localhost:9092
```

### View Messages in Topic

```bash
docker-compose exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic booking-events \
  --from-beginning
```

---

## Scaling

### Horizontal Scaling (Multiple API Instances)

```bash
# Scale API to 3 instances
docker-compose up -d --scale api=3

# Update nginx upstream configuration
upstream api {
    server api:3000;
    server api:3001;
    server api:3002;
}
```

### Vertical Scaling (Resource Limits)

Edit `docker-compose.yml`:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## Maintenance

### Update Application

```bash
cd /opt/cobt

# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run migrations if needed
docker-compose exec api npm run migration:run
```

### Clean Up Docker Resources

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Full system prune
docker system prune -a --volumes
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart api

# Graceful restart (zero downtime)
docker-compose up -d --force-recreate --no-deps api
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (UFW)
  ```bash
  sudo ufw allow 22/tcp    # SSH
  sudo ufw allow 80/tcp    # HTTP
  sudo ufw allow 443/tcp   # HTTPS
  sudo ufw enable
  ```
- [ ] Restrict database access
- [ ] Enable fail2ban
- [ ] Regular security updates
- [ ] Configure Paystack webhooks
- [ ] Set up monitoring/alerting
- [ ] Regular backups

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs api

# Check if ports are available
sudo netstat -tulpn | grep :3000

# Restart from scratch
docker-compose down -v
docker-compose up -d
```

### Database Connection Issues

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec api psql -h postgres -U cobt_user -d cobt_db

# Verify environment variables
docker-compose exec api env | grep DB_
```

### Kafka Issues

```bash
# Check Kafka logs
docker-compose logs kafka

# Check Zookeeper
docker-compose logs zookeeper

# Restart Kafka
docker-compose restart zookeeper kafka
```

---

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] SSL/HTTPS enabled
- [ ] Database backups scheduled
- [ ] Monitoring set up
- [ ] Amadeus production credentials configured
- [ ] Paystack production keys configured
- [ ] Webhook URLs registered with Paystack
- [ ] CORS configured for production domain
- [ ] Rate limiting tested
- [ ] Load testing completed
- [ ] Disaster recovery plan documented

---

## Support

For issues and questions:
- **Email**: support@btmtravel.com
- **Documentation**: [Your docs URL]
- **Logs Location**: `/opt/cobt/logs/`

---

## Useful Commands

```bash
# Quick restart
docker-compose restart api

# View real-time logs
docker-compose logs -f api

# Execute command in container
docker-compose exec api npm run migration:run

# Shell access
docker-compose exec api sh

# Check application health
curl http://localhost:3000/api/v1/health

# View API documentation
curl http://localhost:3000/api/docs
```
