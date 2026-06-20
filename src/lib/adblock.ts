// lib/adblock.ts
// Multi-layer adblock detection for Adsterra

export async function detectAdBlock(): Promise<boolean> {
  // Layer 1: Bait element method
  // Adblockers hide/remove elements with ad-related class names
  const bait = document.createElement('div');
  bait.className =
    'ad-banner ads advertisement adsbox doubleclick ad-placement textads sponsor';
  bait.style.cssText =
    'height:1px;width:1px;position:absolute;left:-9999px;top:-9999px;';
  bait.innerHTML = '&nbsp;';
  document.body.appendChild(bait);

  await new Promise<void>((r) => setTimeout(r, 200));

  const style = window.getComputedStyle(bait);
  const blocked =
    bait.offsetHeight === 0 ||
    bait.offsetWidth === 0 ||
    bait.offsetParent === null ||
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0';

  document.body.removeChild(bait);

  if (blocked) return true;

  // Layer 2: Fetch to Adsterra script domain
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    // Intentar descargar uno de los invoke.js
    await fetch(
      'https://www.highperformanceformat.com/2ec7f0b2cfde1bb7fab22507ac425bd7/invoke.js',
      { method: 'HEAD', mode: 'no-cors', signal: controller.signal }
    );
    clearTimeout(timeoutId);
  } catch {
    return true;
  }

  return false;
}

