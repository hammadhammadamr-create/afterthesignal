import { Accent } from './models';

export const accentOf = (world: string): Accent => (world === 'mars' ? 'mars' : 'cyan');

const COLORS: Record<string, string> = { cyan: '#35D5E8', mars: '#E87543' };

const escapeXml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] as string,
  );

/** صورة SVG بديلة بتظهر لو الصورة الأصلية فشلت. */
export function fallbackSrc(label: string, accent: string = 'cyan'): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">` +
    `<rect width="800" height="500" fill="#142033"/>` +
    `<text x="400" y="255" fill="${COLORS[accent] || COLORS['cyan']}" font-family="monospace" ` +
    `font-size="26" letter-spacing="4" text-anchor="middle">${escapeXml(label.toUpperCase())}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** localStorage آمن (بيرجع null لو المتصفح مانع التخزين). */
export const storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};
