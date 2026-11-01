import { wrapText } from '@/lib/text';

export interface CertificateData {
  name: string;
  paperTitle: string;
  citation: string;
  archetype: string;
  verdict: string;
  site: string;
}

const W = 1080;
const H = 1350;

/** Draws the shareable certificate on a 1080×1350 canvas (Instagram portrait). */
export async function drawCertificate(data: CertificateData): Promise<HTMLCanvasElement> {
  await Promise.all([
    document.fonts.load('700 80px Gaegu'),
    document.fonts.load('500 60px "Fraunces Variable"'),
    document.fonts.load('italic 400 36px Newsreader'),
    document.fonts.load('400 28px "IBM Plex Mono"'),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const ink = '#121211';
  const paper = '#fbfaf6';

  // Paper + graph grid
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#efeee8';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 36) line(ctx, x, 0, x, H);
  for (let y = 0; y <= H; y += 36) line(ctx, 0, y, W, y);

  // Double border
  ctx.strokeStyle = ink;
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 2;
  ctx.strokeRect(58, 58, W - 116, H - 116);

  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Header
  ctx.font = 'italic 400 30px "Fraunces Variable", Georgia, serif';
  ctx.fillText('Certificate of scientific personality', W / 2, 140);
  ctx.font = '700 66px Gaegu, cursive';
  const logoWidth = ctx.measureText('Little Miss Research').width;
  ctx.fillText('Little Miss Research', W / 2 + 34, 228);
  drawMagnifier(ctx, W / 2 + 34 - logoWidth / 2 - 48, 192, 0.85, ink, paper);

  ctx.fillRect(140, 265, W - 280, 3);
  ctx.fillRect(140, 273, W - 280, 1);

  // Body
  ctx.font = 'italic 400 36px Newsreader, Georgia, serif';
  ctx.fillText('This is to certify that', W / 2, 360);

  ctx.font = '700 104px Gaegu, cursive';
  const name = data.name || 'An Anonymous Scientist';
  fitText(ctx, name, W - 240, 104, '700 {size}px Gaegu, cursive');
  ctx.fillText(name, W / 2, 480);
  ctx.fillRect(220, 500, W - 440, 2);

  ctx.font = 'italic 400 34px Newsreader, Georgia, serif';
  ctx.fillText('is, according to rigorous* science, the research paper:', W / 2, 580);

  ctx.font = '500 50px "Fraunces Variable", Georgia, serif';
  const titleLines = wrapText(`“${data.paperTitle}”`, W - 260, (s) => ctx.measureText(s).width).slice(0, 5);
  let y = 670;
  for (const l of titleLines) {
    ctx.fillText(l, W / 2, y);
    y += 64;
  }

  ctx.font = '400 24px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#5c5c58';
  wrapText(data.citation, W - 300, (s) => ctx.measureText(s).width)
    .slice(0, 2)
    .forEach((l, i) => ctx.fillText(l, W / 2, y + 10 + i * 34));
  ctx.fillStyle = ink;

  // Archetype badge
  y = Math.max(y + 120, 960);
  ctx.font = 'italic 400 28px "Fraunces Variable", Georgia, serif';
  ctx.fillText('Personality type', W / 2, y);
  ctx.font = '700 64px Gaegu, cursive';
  ctx.fillText(data.archetype, W / 2, y + 70);

  ctx.font = 'italic 400 32px Newsreader, Georgia, serif';
  wrapText(`“${data.verdict}”`, W - 520, (s) => ctx.measureText(s).width)
    .slice(0, 2)
    .forEach((l, i) => ctx.fillText(l, W / 2, y + 135 + i * 42));

  // Stamp
  ctx.save();
  ctx.translate(W - 175, H - 180);
  ctx.scale(0.78, 0.78);
  ctx.rotate(-0.22);
  ctx.lineWidth = 4;
  circle(ctx, 0, 0, 92);
  ctx.lineWidth = 2;
  circle(ctx, 0, 0, 80);
  ctx.font = 'italic 500 26px "Fraunces Variable", Georgia, serif';
  ctx.fillText('Peer', 0, -14);
  ctx.fillText('reviewed', 0, 16);
  ctx.font = '700 22px Gaegu, cursive';
  ctx.fillText('(by a cat)', 0, 44);
  ctx.restore();

  // Footer
  ctx.textAlign = 'left';
  ctx.font = '700 30px Gaegu, cursive';
  ctx.fillText('*not rigorous', 110, H - 150);
  ctx.font = 'italic 400 24px "Fraunces Variable", Georgia, serif';
  ctx.fillText(`Find yours at ${data.site}/quiz`, 110, H - 112);

  return canvas;
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, max: number, start: number, font: string) {
  let size = start;
  ctx.font = font.replace('{size}', String(size));
  while (ctx.measureText(text).width > max && size > 40) {
    size -= 4;
    ctx.font = font.replace('{size}', String(size));
  }
}

function drawMagnifier(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, ink: string, paper: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = ink;
  ctx.fillStyle = paper;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.lineCap = 'round';
  ctx.lineWidth = 10;
  line(ctx, 20, 20, 44, 46);
  ctx.restore();
  ctx.fillStyle = ink;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  a.click();
}
