import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || '3001';
const API_URL = `http://localhost:${PORT}`;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg: string) => console.log(`\n${colors.magenta}${msg}${colors.reset}\n`),
};

async function healthCheck() {
  log.header('🏥 COBT Backend Health Check');

  try {
    // Check if server is running
    log.info('Checking server status...');
    const response = await axios.get(`${API_URL}/health`);
    
    if (response.data.success) {
      log.success('Server is running and healthy');
      log.info(`Timestamp: ${response.data.timestamp}`);
    }

    // Check API version
    log.info('\nChecking API root endpoint...');
    const rootResponse = await axios.get(`${API_URL}/`);
    
    if (rootResponse.data.success) {
      log.success('API root endpoint accessible');
      log.info(`Version: ${rootResponse.data.version}`);
      log.info(`Message: ${rootResponse.data.message}`);
    }

    // Summary
    log.header('📊 Health Check Summary');
    log.success('All systems operational');
    log.info(`Server URL: ${API_URL}`);
    log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    log.info(`MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
    log.info(`Redis: ${process.env.REDIS_URL ? 'Configured' : 'Not configured'}`);
    log.info(`WebSocket: ${process.env.ENABLE_WEBSOCKET === 'true' ? 'Enabled' : 'Disabled'}`);
    log.info(`ngrok URL: ${process.env.NGROK_URL || 'Not configured'}`);

    process.exit(0);
  } catch (error: any) {
    log.error('Health check failed');
    
    if (error.code === 'ECONNREFUSED') {
      log.error('Server is not running');
      log.warning('Start the server with: npm run dev');
    } else {
      log.error(`Error: ${error.message}`);
    }

    process.exit(1);
  }
}

healthCheck();
