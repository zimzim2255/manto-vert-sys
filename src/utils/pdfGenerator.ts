import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { DocumentData } from '../types';

function isNearWhite(r: number, g: number, b: number, a: number, threshold = 250) {
  // Treat transparent as empty and near-white as background.
  if (a === 0) return true;
  return r >= threshold && g >= threshold && b >= threshold;
}

function cropCanvasToContent(source: HTMLCanvasElement) {
  const ctx = source.getContext('2d');
  if (!ctx) return source;

  const { width, height } = source;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let top = 0;
  let left = 0;
  let right = width - 1;
  let bottom = height - 1;

  // Find top
  outerTop: for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (!isNearWhite(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        top = y;
        break outerTop;
      }
    }
  }

  // Find bottom
  outerBottom: for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (!isNearWhite(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        bottom = y;
        break outerBottom;
      }
    }
  }

  // Find left
  outerLeft: for (let x = 0; x < width; x++) {
    for (let y = top; y <= bottom; y++) {
      const i = (y * width + x) * 4;
      if (!isNearWhite(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        left = x;
        break outerLeft;
      }
    }
  }

  // Find right
  outerRight: for (let x = width - 1; x >= 0; x--) {
    for (let y = top; y <= bottom; y++) {
      const i = (y * width + x) * 4;
      if (!isNearWhite(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        right = x;
        break outerRight;
      }
    }
  }

  const cropWidth = Math.max(1, right - left + 1);
  const cropHeight = Math.max(1, bottom - top + 1);

  // If no crop was detected (or canvas is empty), return original.
  if (cropWidth === width && cropHeight === height) return source;

  const cropped = document.createElement('canvas');
  cropped.width = cropWidth;
  cropped.height = cropHeight;

  const croppedCtx = cropped.getContext('2d');
  if (!croppedCtx) return source;

  croppedCtx.drawImage(source, left, top, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  return cropped;
}

export async function generatePDF(data: DocumentData) {
  const element = document.getElementById('document-preview');
  if (!element) return;

  try {
    // Render the DOM to a canvas at a deterministic A4-sized width.
    // This reduces layout variance between screen and export.
    const A4_WIDTH_PX = 794; // ~210mm @ 96 DPI

    const rawCanvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: A4_WIDTH_PX,
      width: A4_WIDTH_PX,
    });

    // Crop extra white margins so centering is based on actual content.
    const canvas = cropCanvasToContent(rawCanvas);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const marginMm = 8;

    // Fit image within page margins.
    const imgWidth = pageWidth - marginMm * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL('image/png');

    // True centering (after cropping)
    const x = (pageWidth - imgWidth) / 2;
    const y = marginMm;

    // Multi-page support
    let remainingHeight = imgHeight;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    remainingHeight -= pageHeight - y;

    while (remainingHeight > 0) {
      pdf.addPage();
      const positionY = y - (imgHeight - remainingHeight);
      pdf.addImage(imgData, 'PNG', x, positionY, imgWidth, imgHeight);
      remainingHeight -= pageHeight;
    }

    const dateStr = new Date(data.date).toLocaleDateString('fr-FR').replace(/\//g, '-');
    const filename = `${data.type}_${data.documentNumber.replace(/\//g, '-')}_${dateStr}.pdf`;

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Erreur lors de la génération du PDF');
  }
}
