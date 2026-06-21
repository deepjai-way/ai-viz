/**
 * Excalidraw Export Driver
 *
 * Converts .excalidraw JSON files to SVG and PNG.
 * Uses @resvg/resvg-js for SVG→PNG conversion (no browser required).
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Convert an excalidraw element to SVG string.
 * @param {Object} el - Excalidraw element
 * @returns {string} SVG markup
 */
function elementToSvg(el) {
  if (el.isDeleted) return '';

  const stroke = el.strokeColor || '#1e1e1e';
  const fill = el.backgroundColor || 'transparent';
  const strokeWidth = el.strokeWidth || 1;
  const opacity = el.opacity != null ? el.opacity / 100 : 1;
  const commonAttrs = `stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill === 'transparent' ? 'none' : fill}"`;
  const opacityAttr = opacity < 1 ? ` opacity="${opacity}"` : '';

  switch (el.type) {
    case 'rectangle':
      return `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" ${commonAttrs}${opacityAttr} rx="2"/>`;

    case 'ellipse': {
      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      const rx = el.width / 2;
      const ry = el.height / 2;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${commonAttrs}${opacityAttr}/>`;
    }

    case 'diamond': {
      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      const points = [
        `${cx},${el.y}`,
        `${el.x + el.width},${cy}`,
        `${cx},${el.y + el.height}`,
        `${el.x},${cy}`,
      ].join(' ');
      return `<polygon points="${points}" ${commonAttrs}${opacityAttr}/>`;
    }

    case 'line':
    case 'arrow':
    case 'freedraw': {
      if (!el.points || el.points.length === 0) return '';
      const pathData = el.points
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${el.x + p[0]},${el.y + p[1]}`)
        .join(' ');

      let svg = `<path d="${pathData}" stroke="${stroke}" stroke-width="${strokeWidth}" fill="none"${opacityAttr}/>`;

      // Add arrowhead for arrows
      if (el.type === 'arrow' && el.endArrowhead) {
        const lastPt = el.points[el.points.length - 1];
        const prevPt = el.points.length > 1 ? el.points[el.points.length - 2] : [0, 0];
        const ax = el.x + lastPt[0];
        const ay = el.y + lastPt[1];
        const angle = Math.atan2(lastPt[1] - prevPt[1], lastPt[0] - prevPt[0]);
        const headLen = 12;
        const p1x = ax - headLen * Math.cos(angle - Math.PI / 6);
        const p1y = ay - headLen * Math.sin(angle - Math.PI / 6);
        const p2x = ax - headLen * Math.cos(angle + Math.PI / 6);
        const p2y = ay - headLen * Math.sin(angle + Math.PI / 6);
        svg += `<polygon points="${ax},${ay} ${p1x},${p1y} ${p2x},${p2y}" fill="${stroke}" stroke="none"/>`;
      }
      return svg;
    }

    case 'text': {
      const fontSize = el.fontSize || 16;
      const fontFamily = el.fontFamily === 3 ? 'monospace' : 'sans-serif';
      const escapedText = (el.text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const lines = escapedText.split('\n');
      const lineHeight = fontSize * 1.3;
      let svg = `<g${opacityAttr}>`;
      lines.forEach((line, i) => {
        svg += `<text x="${el.x}" y="${el.y + fontSize + i * lineHeight}" font-size="${fontSize}" font-family="${fontFamily}" fill="${stroke}">${line}</text>`;
      });
      svg += '</g>';
      return svg;
    }

    default:
      return '';
  }
}

/**
 * Calculate the bounding box of all elements.
 * @param {Object[]} elements
 * @returns {{ minX: number, minY: number, maxX: number, maxY: number }}
 */
function getBounds(elements) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const el of elements) {
    if (el.isDeleted) continue;

    if (el.points && el.points.length > 0) {
      for (const p of el.points) {
        const px = el.x + p[0];
        const py = el.y + p[1];
        minX = Math.min(minX, px);
        minY = Math.min(minY, py);
        maxX = Math.max(maxX, px);
        maxY = Math.max(maxY, py);
      }
    } else {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + (el.width || 0));
      maxY = Math.max(maxY, el.y + (el.height || 0));
    }
  }

  if (!isFinite(minX)) {
    return { minX: 0, minY: 0, maxX: 400, maxY: 300 };
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Convert excalidraw JSON to SVG string.
 * @param {Object} data - Parsed excalidraw JSON
 * @param {number} [padding=40] - Padding around the diagram
 * @returns {string} SVG string
 */
function excalidrawToSvg(data, padding = 40) {
  const elements = data.elements || [];
  const bounds = getBounds(elements);

  const width = bounds.maxX - bounds.minX + padding * 2;
  const height = bounds.maxY - bounds.minY + padding * 2;
  const offsetX = -bounds.minX + padding;
  const offsetY = -bounds.minY + padding;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<rect width="100%" height="100%" fill="white"/>`;
  svg += `<g transform="translate(${offsetX},${offsetY})">`;

  for (const el of elements) {
    svg += elementToSvg(el);
  }

  svg += '</g></svg>';
  return svg;
}

/**
 * Export an excalidraw file to SVG or PNG.
 *
 * @param {string} inputFile - Path to the .excalidraw file
 * @param {string} outputFile - Path to the output file
 * @param {object} [options]
 * @param {string} [options.format='svg'] - 'svg' or 'png'
 * @param {number} [options.scale=2] - Scale factor for PNG export
 * @returns {{ success: boolean, outputFile: string, error?: string }}
 */
function exportDiagram(inputFile, outputFile, options = {}) {
  const { format = 'svg', scale = 2 } = options;

  try {
    const resolvedInput = path.resolve(inputFile);
    const resolvedOutput = path.resolve(outputFile);

    if (!fs.existsSync(resolvedInput)) {
      return { success: false, outputFile: resolvedOutput, error: `Input file not found: ${resolvedInput}` };
    }

    const raw = fs.readFileSync(resolvedInput, 'utf-8');
    const data = JSON.parse(raw);

    const svgString = excalidrawToSvg(data);

    if (format === 'svg') {
      fs.writeFileSync(resolvedOutput, svgString, 'utf-8');
      return { success: true, outputFile: resolvedOutput };
    }

    if (format === 'png') {
      let Resvg;
      try {
        Resvg = require('@resvg/resvg-js').Resvg;
      } catch {
        return {
          success: false,
          outputFile: resolvedOutput,
          error: 'PNG export requires @resvg/resvg-js. Run: npm install @resvg/resvg-js',
        };
      }

      const resvg = new Resvg(svgString, {
        fitTo: { mode: 'zoom', value: scale },
        font: { loadSystemFonts: true },
      });
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      const outputDir = path.dirname(resolvedOutput);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(resolvedOutput, pngBuffer);
      return { success: true, outputFile: resolvedOutput };
    }

    return { success: false, outputFile: resolvedOutput, error: `Unsupported format: ${format}. Use 'svg' or 'png'.` };
  } catch (err) {
    return { success: false, outputFile, error: `Export exception: ${err.message}` };
  }
}

/**
 * Get info about the excalidraw export driver.
 * @returns {{ installed: boolean, hasResvg: boolean }}
 */
function getInfo() {
  let hasResvg = false;
  try {
    require('@resvg/resvg-js');
    hasResvg = true;
  } catch {
    // Not installed
  }
  return { installed: true, hasResvg };
}

module.exports = {
  excalidrawToSvg,
  exportDiagram,
  getInfo,
};
