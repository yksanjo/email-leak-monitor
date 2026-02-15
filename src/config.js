const fs = require('fs');

function loadConfig(configPath) {
  const defaultConfig = {
    emails: [],
    interval: 30,
    verbose: false
  };

  try {
    if (fs.existsSync(configPath)) {
      const fileContent = fs.readFileSync(configPath, 'utf8');
      const userConfig = JSON.parse(fileContent);
      return { ...defaultConfig, ...userConfig };
    }
  } catch (error) {
    console.warn(`Warning: Could not load config from ${configPath}: ${error.message}`);
  }

  return defaultConfig;
}

function validateEmails(emails) {
  if (!Array.isArray(emails)) {
    return [];
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emails
    .map(e => e.toLowerCase().trim())
    .filter(e => emailRegex.test(e));
}

module.exports = {
  loadConfig,
  validateEmails
};
