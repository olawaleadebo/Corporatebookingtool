/**
 * Generate Bcrypt Password Hash
 * Run this script to generate a proper bcrypt hash for the demo password
 * 
 * Usage:
 *   node generate-password-hash.js
 */

const bcrypt = require('bcrypt');

const password = 'Test123!';
const saltRounds = 10;

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\n✅ Password Hash Generated Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📝 Password: ${password}`);
    console.log(`🔐 Hash:     ${hash}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('💡 Use this hash in your SQL INSERT statement:\n');
    console.log(`'${hash}'`);
    console.log('\n');
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, hash);
    console.log(`✓ Verification test: ${isValid ? 'PASSED ✅' : 'FAILED ❌'}\n`);
    
  } catch (error) {
    console.error('❌ Error generating hash:', error);
  }
}

generateHash();
