import { useState, useEffect } from 'react';

const KEY = 'partnerColors';

export const PARTNER_COLOR_NAMES: Record<string, string> = {
  '#5a85a1': 'Steel Blue',
  '#00A6C8': 'Cyan',
  '#00BFA0': 'Teal',
  '#4CB81B': 'Green',
  '#8DBE1B': 'Lime',
  '#C9B800': 'Yellow',
  '#CC7A18': 'Orange',
  '#D43012': 'Red',
  '#C0238A': 'Magenta',
  '#1B81C5': 'Blue',
  '#00A49E': 'Seafoam',
  '#00C660': 'Emerald',
  '#7B5EA7': 'Purple',
  '#E05C8A': 'Pink',
  '#6B8E23': 'Olive',
  '#B8860B': 'Gold',
  '#E0E0E0': 'Gray',
};

export function getPartnerColors(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function setPartnerColor(name: string, color: string): void {
  const c = getPartnerColors();
  c[name] = color;
  localStorage.setItem(KEY, JSON.stringify(c));
  window.dispatchEvent(new CustomEvent('partnerColorsChanged'));
}

export function clearPartnerColor(name: string): void {
  const c = getPartnerColors();
  delete c[name];
  localStorage.setItem(KEY, JSON.stringify(c));
  window.dispatchEvent(new CustomEvent('partnerColorsChanged'));
}

export function usePartnerColors(): Record<string, string> {
  const [colors, setColors] = useState<Record<string, string>>(getPartnerColors);
  useEffect(() => {
    const handler = () => setColors(getPartnerColors());
    window.addEventListener('partnerColorsChanged', handler);
    return () => window.removeEventListener('partnerColorsChanged', handler);
  }, []);
  return colors;
}
