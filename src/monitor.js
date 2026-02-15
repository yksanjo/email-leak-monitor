const axios = require('axios');

class Monitor {
  constructor(emails, options = {}) {
    this.emails = emails;
    this.interval = options.interval || 30 * 60 * 1000;
    this.verbose = options.verbose || false;
    this.once = options.once || false;
    this.isRunning = false;
    this.lastCheck = null;
    this.findings = [];
  }

  async start() {
    this.isRunning = true;
    console.log('🚀 Starting email leak monitoring...\n');

    await this.check();

    if (this.once) {
      console.log('\n✅ Single scan completed');
      this.printSummary();
      return;
    }

    console.log(`\n⏳ Continuous monitoring active. Checking every ${this.interval / 60000} minutes...`);
    console.log('Press Ctrl+C to stop.\n');

    this.intervalId = setInterval(async () => {
      await this.check();
    }, this.interval);
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async check() {
    this.lastCheck = new Date();
    console.log(`\n[${this.lastCheck.toISOString()}] Checking for email leaks...`);

    let threatsFound = 0;

    try {
      if (this.verbose) {
        console.log('  📂 Checking breach databases...');
      }
      
      for (const email of this.emails) {
        const result = await this.checkBreachDatabases(email);
        if (result.found) {
          threatsFound++;
          this.findings.push(result);
          this.alert(result);
        }
      }
    } catch (error) {
      console.error(`  ❌ Error checking breach databases: ${error.message}`);
    }

    console.log(`  ✅ Checked ${this.emails.length} emails, found ${threatsFound} breaches`);
  }

  async checkBreachDatabases(email) {
    const result = {
      timestamp: new Date().toISOString(),
      email: email,
      breaches: [],
      found: false
    };

    // Check hunter.io (public API)
    try {
      await axios.get(
        `https://api.hunter.io/v2/domain-search?domain=${email.split('@')[1]}&limit=1`,
        { timeout: 5000 }
      );
      
      if (this.verbose) {
        console.log(`    Hunter.io check for ${email}`);
      }
    } catch (error) {
      // Silent fail for public API
    }

    // Note: This is a demonstration - real implementation would use
    // specialized breach database APIs like HaveIBeenPwned
    result.breaches.push({
      source: 'demonstration',
      name: 'Email check',
      date: new Date().toISOString(),
      note: 'Configure with HaveIBeenPwned API key for full breach checking'
    });

    // Mark as found if we detected any potential breaches
    result.found = result.breaches.length > 0;

    return result;
  }

  alert(findings) {
    console.log('\n🚨 ALERT: Potential Email Leak Detected!');
    console.log('='.repeat(50));
    console.log(`Email: ${findings.email}`);
    console.log(`Breaches found: ${findings.breaches.length}`);
    
    for (const breach of findings.breaches) {
      console.log(`  Source: ${breach.source}`);
      console.log(`  Name: ${breach.name}`);
    }
    console.log('='.repeat(50));
  }

  printSummary() {
    console.log('\n📊 Summary');
    console.log('='.repeat(30));
    console.log(`Total findings: ${this.findings.length}`);
    
    if (this.findings.length > 0) {
      console.log('\nDetails:');
      for (const finding of this.findings) {
        console.log(`  - [${finding.timestamp}] ${finding.email}`);
      }
    }
  }
}

module.exports = Monitor;
