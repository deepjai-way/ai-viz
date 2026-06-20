/**
 * Draw.io Export Driver
 *
 * Cross-platform detection and export for Draw.io Desktop CLI.
 * Supports Windows, macOS, and Linux.
 */

'use strict';

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Common installation paths for Draw.io Desktop on each platform.
 */
const KNOWN_PATHS = {
  win32: [
    path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'draw.io', 'draw.io.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'draw.io', 'draw.io.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'draw.io', 'draw.io.exe'),
    path.join(process.env.USERPROFILE || '', 'AppData', 'Local', 'Programs', 'draw.io', 'draw.io.exe'),
  ],
  darwin: [
    '/Applications/draw.io.app/Contents/MacOS/draw.io',
    path.join(os.homedir(), 'Applications', 'draw.io.app', 'Contents', 'MacOS', 'draw.io'),
  ],
  linux: [
    '/usr/bin/drawio',
    '/usr/local/bin/drawio',
    '/snap/bin/drawio',
    path.join(os.homedir(), '.local', 'bin', 'drawio'),
  ],
};

/**
 * Detect the Draw.io executable path on the current platform.
 *
 * @returns {string|null} Absolute path to the Draw.io executable, or null if not found.
 */
function detectDrawioPath() {
  const platform = process.platform;

  // 1. Check environment variable override
  if (process.env.DRAWIO_PATH) {
    const envPath = process.env.DRAWIO_PATH;
    if (fs.existsSync(envPath)) {
      return envPath;
    }
  }

  // 2. Check known installation paths
  const candidates = KNOWN_PATHS[platform] || KNOWN_PATHS.linux;
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // 3. Try to find via PATH (which / where)
  try {
    if (platform === 'win32') {
      const result = spawnSync('where', ['draw.io.exe'], {
        encoding: 'utf-8',
        timeout: 5000,
        windowsHide: true,
      });
      if (result.status === 0 && result.stdout.trim()) {
        const found = result.stdout.trim().split(/\r?\n/)[0];
        if (fs.existsSync(found)) {
          return found;
        }
      }
      // Also try "draw.io" without .exe
      const result2 = spawnSync('where', ['draw.io'], {
        encoding: 'utf-8',
        timeout: 5000,
        windowsHide: true,
      });
      if (result2.status === 0 && result2.stdout.trim()) {
        const found = result2.stdout.trim().split(/\r?\n/)[0];
        if (fs.existsSync(found)) {
          return found;
        }
      }
    } else {
      const result = spawnSync('which', ['drawio'], {
        encoding: 'utf-8',
        timeout: 5000,
      });
      if (result.status === 0 && result.stdout.trim()) {
        return result.stdout.trim();
      }
      // Try "draw.io" as well
      const result2 = spawnSync('which', ['draw.io'], {
        encoding: 'utf-8',
        timeout: 5000,
      });
      if (result2.status === 0 && result2.stdout.trim()) {
        return result2.stdout.trim();
      }
    }
  } catch {
    // Ignore lookup errors
  }

  return null;
}

/**
 * Export a Draw.io diagram to the specified format.
 *
 * @param {string} inputFile - Path to the .drawio input file.
 * @param {string} outputFile - Path to the output file (png/svg/pdf).
 * @param {object} [options] - Export options.
 * @param {string} [options.format='png'] - Output format: 'png', 'svg', or 'pdf'.
 * @param {number} [options.scale] - Export scale factor (e.g., 2 for 2x resolution).
 * @param {number} [options.page] - Page index to export (0-based, for multi-page diagrams).
 * @param {number} [options.width] - Output width in pixels.
 * @param {number} [options.height] - Output height in pixels.
 * @param {boolean} [options.transparent=false] - Transparent background (PNG only).
 * @param {number} [options.quality] - JPEG quality (0-100, only for JPEG).
 * @param {number} [options.border] - Border padding in pixels.
 * @returns {{ success: boolean, outputFile: string, error?: string }}
 */
function exportDiagram(inputFile, outputFile, options = {}) {
  const {
    format = 'png',
    scale,
    page,
    width,
    height,
    transparent = false,
    quality,
    border,
  } = options;

  // Validate input file exists
  const resolvedInput = path.resolve(inputFile);
  if (!fs.existsSync(resolvedInput)) {
    return {
      success: false,
      outputFile,
      error: `Input file not found: ${resolvedInput}`,
    };
  }

  // Detect Draw.io executable
  const drawioPath = detectDrawioPath();
  if (!drawioPath) {
    return {
      success: false,
      outputFile,
      error:
        'Draw.io Desktop not found. Please install it from https://github.com/jgraph/drawio-desktop/releases or set DRAWIO_PATH environment variable.',
    };
  }

  // Build command arguments
  const resolvedOutput = path.resolve(outputFile);
  const args = ['-x', '-f', format, '-o', resolvedOutput];

  if (scale != null) {
    args.push('--scale', String(scale));
  }
  if (page != null) {
    args.push('-p', String(page));
  }
  if (width != null) {
    args.push('--width', String(width));
  }
  if (height != null) {
    args.push('--height', String(height));
  }
  if (transparent && format === 'png') {
    args.push('--transparent');
  }
  if (quality != null) {
    args.push('--quality', String(quality));
  }
  if (border != null) {
    args.push('--border', String(border));
  }

  args.push(resolvedInput);

  // Ensure output directory exists
  const outputDir = path.dirname(resolvedOutput);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Execute export
  try {
    const result = spawnSync(drawioPath, args, {
      encoding: 'utf-8',
      timeout: 60000,
      windowsHide: true,
      env: {
        ...process.env,
        // Avoid Electron GPU issues in headless environments
        ELECTRON_DISABLE_GPU: '1',
      },
    });

    if (result.error) {
      return {
        success: false,
        outputFile: resolvedOutput,
        error: `Export process error: ${result.error.message}`,
      };
    }

    if (result.status !== 0) {
      const stderr = (result.stderr || '').trim();
      return {
        success: false,
        outputFile: resolvedOutput,
        error: `Export failed (exit code ${result.status}): ${stderr || 'Unknown error'}`,
      };
    }

    // Verify output file was created
    if (!fs.existsSync(resolvedOutput)) {
      return {
        success: false,
        outputFile: resolvedOutput,
        error: 'Export completed but output file was not created.',
      };
    }

    return {
      success: true,
      outputFile: resolvedOutput,
    };
  } catch (err) {
    return {
      success: false,
      outputFile: resolvedOutput,
      error: `Export exception: ${err.message}`,
    };
  }
}

/**
 * Get information about the Draw.io installation.
 *
 * @returns {{ installed: boolean, path?: string, platform: string }}
 */
function getInfo() {
  const drawioPath = detectDrawioPath();
  return {
    installed: drawioPath != null,
    path: drawioPath || undefined,
    platform: process.platform,
  };
}

module.exports = {
  detectDrawioPath,
  exportDiagram,
  getInfo,
};
