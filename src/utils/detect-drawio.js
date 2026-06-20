'use strict';

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Detect whether draw.io desktop application is installed.
 *
 * @returns {{installed: boolean, path: string|null, version: string|null}}
 */
function detectDrawio() {
  const result = { installed: false, path: null, version: null };

  // Common installation paths by platform
  const paths = {
    win32: [
      'C:\\Program Files\\draw.io\\draw.io.exe',
      `${process.env.LOCALAPPDATA}\\Programs\\draw.io\\draw.io.exe`,
    ],
    darwin: [
      '/Applications/draw.io.app/Contents/MacOS/draw.io',
    ],
    linux: [
      '/usr/bin/drawio',
      '/usr/local/bin/drawio',
      '/snap/bin/drawio',
    ],
  };

  const platform = process.platform;
  const candidates = paths[platform] || [];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      result.installed = true;
      result.path = candidate;
      break;
    }
  }

  // Try to get version from CLI
  if (result.installed && result.path) {
    try {
      const output = execSync(`"${result.path}" --version`, {
        encoding: 'utf-8',
        timeout: 5000,
      }).trim();
      result.version = output;
    } catch {
      // Version detection failed, but app is still installed
    }
  }

  return result;
}

module.exports = { detectDrawio };
