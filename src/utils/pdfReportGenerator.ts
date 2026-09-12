import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DalilakBusiness, EcosystemActivityProgress } from '../types';

export interface GeneratePdfOptions {
  business: DalilakBusiness;
  progress: EcosystemActivityProgress;
  elementId?: string;
  onProgress?: (status: string) => void;
}

/**
 * Generates and downloads a branded, high-definition PDF marketing report
 * using html2canvas and jsPDF for 100% accurate Arabic typography and styling.
 */
export async function downloadMarketingPdfReport(options: GeneratePdfOptions): Promise<boolean> {
  const { business, progress, elementId = 'marketing-report-printable', onProgress } = options;

  onProgress?.('جاري تحضير صفحات التقرير والتنسيق البصري...');

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    onProgress?.('جاري معالجة الخطوط والرسومات عالية الدقة (Canvas 2X)...');

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1200,
    });

    onProgress?.('جاري إنشاء ملف الـ PDF وتوزيع الصفحات...');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Additional pages if content spans beyond 1 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const safeBusinessName = (business.name_ar || business.name_en || 'النشاط')
      .replace(/[\\/:*?"<>|]/g, '_')
      .trim();
    const fileName = `تقرير_تسويق_دليلك_${safeBusinessName}.pdf`;

    onProgress?.('تم اكتمال التقرير، جاري بدء التنزيل...');
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    onProgress?.('حدث خطأ أثناء تنزيل الـ PDF، يمكنك استخدام خيار الطباعة المباشرة.');
    return false;
  }
}
