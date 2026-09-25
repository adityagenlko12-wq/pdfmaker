/**
 * Pure TypeScript mathematical and formatting engines for ToolMatrix
 * 100% Real computations with zero mock data.
 */

// --- 1. Color Science & WCAG Contrast ---
export interface ColorAnalysis {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
  luminance: number;
  contrastWithWhite: number;
  contrastWithBlack: number;
  wcagWhite: { aaNormal: boolean; aaLarge: boolean; aaaNormal: boolean };
  wcagBlack: { aaNormal: boolean; aaLarge: boolean; aaaNormal: boolean };
  harmonies: {
    complementary: string;
    analogous1: string;
    analogous2: string;
    triadic1: string;
    triadic2: string;
  };
}

export function parseHexColor(inputHex: string): ColorAnalysis {
  let hex = inputHex.trim().replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    hex = '4f46e5'; // default indigo fallback
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // RGB to HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  // RGB to CMYK
  const k = 1 - max;
  const c = k === 1 ? 0 : Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = k === 1 ? 0 : Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = k === 1 ? 0 : Math.round(((1 - bNorm - k) / (1 - k)) * 100);

  // Relative Luminance (sRGB standard)
  const toLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  // WCAG Contrast Ratio
  const contrastWithWhite = (1.0 + 0.05) / (lum + 0.05);
  const contrastWithBlack = (lum + 0.05) / (0.0 + 0.05);

  const hslToHex = (hue: number, sat: number, lit: number): string => {
    hue = (hue % 360 + 360) % 360;
    const sNorm = sat / 100;
    const lNorm = lit / 100;
    const cVal = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const xVal = cVal * (1 - Math.abs((hue / 60) % 2 - 1));
    const mVal = lNorm - cVal / 2;

    let rPrime = 0, gPrime = 0, bPrime = 0;
    if (hue < 60) { rPrime = cVal; gPrime = xVal; }
    else if (hue < 120) { rPrime = xVal; gPrime = cVal; }
    else if (hue < 180) { gPrime = cVal; bPrime = xVal; }
    else if (hue < 240) { gPrime = xVal; bPrime = cVal; }
    else if (hue < 300) { rPrime = xVal; bPrime = cVal; }
    else { rPrime = cVal; bPrime = xVal; }

    const rFinal = Math.round((rPrime + mVal) * 255).toString(16).padStart(2, '0');
    const gFinal = Math.round((gPrime + mVal) * 255).toString(16).padStart(2, '0');
    const bFinal = Math.round((bPrime + mVal) * 255).toString(16).padStart(2, '0');
    return `#${rFinal}${gFinal}${bFinal}`;
  };

  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return {
    hex: `#${hex.toUpperCase()}`,
    rgb: { r, g, b },
    hsl: { h, s: sPct, l: lPct },
    cmyk: { c, m, y, k: Math.round(k * 100) },
    luminance: Number(lum.toFixed(4)),
    contrastWithWhite: Number(contrastWithWhite.toFixed(2)),
    contrastWithBlack: Number(contrastWithBlack.toFixed(2)),
    wcagWhite: {
      aaNormal: contrastWithWhite >= 4.5,
      aaLarge: contrastWithWhite >= 3.0,
      aaaNormal: contrastWithWhite >= 7.0
    },
    wcagBlack: {
      aaNormal: contrastWithBlack >= 4.5,
      aaLarge: contrastWithBlack >= 3.0,
      aaaNormal: contrastWithBlack >= 7.0
    },
    harmonies: {
      complementary: hslToHex(h + 180, sPct, lPct),
      analogous1: hslToHex(h - 30, sPct, lPct),
      analogous2: hslToHex(h + 30, sPct, lPct),
      triadic1: hslToHex(h + 120, sPct, lPct),
      triadic2: hslToHex(h + 240, sPct, lPct)
    }
  };
}

// --- 2. Password Strength & Entropy Engine ---
export interface PasswordMetrics {
  entropyBits: number;
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  crackTime: string;
  charPoolSize: number;
}

export function evaluatePassword(pwd: string): PasswordMetrics {
  let pool = 0;
  if (/[a-z]/.test(pwd)) pool += 26;
  if (/[A-Z]/.test(pwd)) pool += 26;
  if (/[0-9]/.test(pwd)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) pool += 33;

  if (pool === 0 || pwd.length === 0) {
    return { entropyBits: 0, strength: 'Very Weak', crackTime: '0 seconds', charPoolSize: 0 };
  }

  const entropyBits = Math.round(pwd.length * Math.log2(pool));

  let strength: PasswordMetrics['strength'] = 'Very Weak';
  let crackTime = 'Instantly';

  if (entropyBits < 28) {
    strength = 'Very Weak';
    crackTime = 'A few seconds';
  } else if (entropyBits < 36) {
    strength = 'Weak';
    crackTime = 'A few minutes';
  } else if (entropyBits < 60) {
    strength = 'Fair';
    crackTime = 'Several months';
  } else if (entropyBits < 80) {
    strength = 'Strong';
    crackTime = 'Several centuries';
  } else {
    strength = 'Very Strong';
    crackTime = 'Millions of years';
  }

  return { entropyBits, strength, crackTime, charPoolSize: pool };
}

// --- 3. Unit Conversion Engine ---
export const UNIT_CONVERSIONS: Record<string, { base: string; units: Record<string, number> }> = {
  length: {
    base: 'meter',
    units: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.344
    }
  },
  weight: {
    base: 'gram',
    units: {
      gram: 1,
      kilogram: 1000,
      milligram: 0.001,
      pound: 453.59237,
      ounce: 28.349523
    }
  },
  digital: {
    base: 'byte',
    units: {
      byte: 1,
      kilobyte: 1024,
      megabyte: 1048576,
      gigabyte: 1073741824,
      terabyte: 1099511627776
    }
  },
  speed: {
    base: 'm/s',
    units: {
      'm/s': 1,
      'km/h': 0.277778,
      mph: 0.44704,
      knot: 0.514444
    }
  }
};

export function convertUnits(
  val: number,
  category: string,
  fromUnit: string,
  toUnit: string
): { result: number; formula: string } {
  if (category === 'temperature') {
    let kelvin = 0;
    if (fromUnit === 'celsius') kelvin = val + 273.15;
    else if (fromUnit === 'fahrenheit') kelvin = (val - 32) * (5 / 9) + 273.15;
    else kelvin = val;

    let target = 0;
    if (toUnit === 'celsius') target = kelvin - 273.15;
    else if (toUnit === 'fahrenheit') target = (kelvin - 273.15) * (9 / 5) + 32;
    else target = kelvin;

    return {
      result: Number(target.toFixed(4)),
      formula: `${val} ${fromUnit} → ${target.toFixed(2)} ${toUnit}`
    };
  }

  const catData = UNIT_CONVERSIONS[category];
  if (!catData) return { result: val, formula: '1:1' };

  const fromFactor = catData.units[fromUnit] ?? 1;
  const toFactor = catData.units[toUnit] ?? 1;

  const inBase = val * fromFactor;
  const res = inBase / toFactor;

  return {
    result: Number(res.toPrecision(7)),
    formula: `1 ${fromUnit} = ${(fromFactor / toFactor).toPrecision(6)} ${toUnit}`
  };
}

// --- 4. Authentic Lorem Ipsum Generator ---
const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus, nec vehicula diam fermentum sit amet.',
  'Integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque.',
  'Facilisi morbi tempus iaculis urna id volutpat lacus laoreet non.',
  'Viverra justo nec ultrices dui sapien eget mi proin sed.',
  'Mauris ultrices eros in cursus turpis massa tincidunt dui ut.',
  'Condimentum lacinia quis vel eros donec ac odio tempor orci.',
  'Pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies.'
];

export function generateLoremIpsum(count: number, unit: 'paragraphs' | 'sentences' | 'words', startWithLorem = true): string {
  if (unit === 'words') {
    const allWords = LOREM_SENTENCES.join(' ').replace(/[.,]/g, '').split(' ');
    const res: string[] = [];
    if (startWithLorem) res.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
    while (res.length < count) {
      res.push(allWords[res.length % allWords.length]);
    }
    return res.slice(0, count).join(' ') + '.';
  }

  if (unit === 'sentences') {
    const res: string[] = [];
    for (let i = 0; i < count; i++) {
      res.push(LOREM_SENTENCES[i % LOREM_SENTENCES.length]);
    }
    return res.join(' ');
  }

  // Paragraphs
  const paragraphs: string[] = [];
  for (let p = 0; p < count; p++) {
    const pSentences: string[] = [];
    const numSentences = 4 + (p % 3);
    for (let s = 0; s < numSentences; s++) {
      pSentences.push(LOREM_SENTENCES[(p * 4 + s) % LOREM_SENTENCES.length]);
    }
    paragraphs.push(pSentences.join(' '));
  }
  return paragraphs.join('\n\n');
}
