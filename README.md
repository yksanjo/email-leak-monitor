# Email Leak Monitor

A CLI tool that monitors email addresses for leaks from data breaches.

## Installation

```bash
cd email-leak-monitor
npm install
```

## Usage

```bash
# Single scan
node src/index.js -e user@example.com -o

# Continuous monitoring
node src/index.js -e user@example.com,admin@company.com
```

## Options

| Option | Short | Description |
|--------|-------|-------------|
| `--emails` | `-e` | Comma-separated list of emails |
| `--once` | `-o` | Run once and exit |
| `--interval` | `-i` | Check interval in minutes |
| `--verbose` | `-v` | Verbose output |

## Features

- Checks breach databases
- Monitors email exposure
- Supports continuous monitoring

## License

MIT
