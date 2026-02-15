#!/usr/bin/env node

const { Command } = require('commander');
const Monitor = require('./monitor');
const { loadConfig, validateEmails } = require('./config');

const program = new Command();

program
  .name('email-leak-monitor')
  .description('Monitor email addresses for leaks from data breaches')
  .version('1.0.0')
  .option('-c, --config <path>', 'Path to config file', 'config.json')
  .option('-e, --emails <emails>', 'Comma-separated list of emails to monitor')
  .option('-o, --once', 'Run once and exit (default is continuous monitoring)')
  .option('-i, --interval <minutes>', 'Check interval in minutes', '30')
  .option('-v, --verbose', 'Verbose output')
  .parse(process.argv);

const options = program.opts();

async function main() {
  console.log('🔍 Email Leak Monitor');
  console.log('==========================\n');

  // Load configuration
  const config = loadConfig(options.config);
  
  // Get emails from CLI or config
  let emails = [];
  if (options.emails) {
    emails = options.emails.split(',').map(e => e.trim());
  } else if (config.emails) {
    emails = config.emails;
  } else {
    console.error('Error: No emails specified. Use -e option or config.json');
    process.exit(1);
  }

  // Validate emails
  const validEmails = validateEmails(emails);
  if (validEmails.length === 0) {
    console.error('Error: No valid emails provided');
    process.exit(1);
  }

  console.log(`Monitoring ${validEmails.length} email(s): ${validEmails.join(', ')}`);
  console.log(`Check interval: ${options.interval} minutes`);
  console.log(`Mode: ${options.once ? 'Single scan' : 'Continuous monitoring'}\n`);

  const monitor = new Monitor(validEmails, {
    interval: parseInt(options.interval) * 60 * 1000,
    verbose: options.verbose,
    once: options.once
  });

  try {
    await monitor.start();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
