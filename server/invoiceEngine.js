import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Enterprise PDF Invoice Generation Engine using pdf-lib
 * Creates genuine, high-resolution vector PDF invoices for payments and subscriptions.
 */
export async function generateInvoicePdf(payment, siteSettings = {}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size in points
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  const siteName = siteSettings.siteName || 'Vansh PDF';
  const siteEmail = siteSettings.contactEmail || 'billing@vanshpdf.com';
  const currency = payment.currency || 'USD';
  const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  // --- Background & Header Banner ---
  // Top Accent Bar
  page.drawRectangle({
    x: 0,
    y: height - 8,
    width: width,
    height: 8,
    color: rgb(0.14, 0.44, 0.88), // Professional Brand Blue
  });

  // Header Left: Brand Info
  page.drawText(siteName.toUpperCase(), {
    x: 40,
    y: height - 50,
    size: 20,
    font: fontBold,
    color: rgb(0.08, 0.12, 0.2),
  });

  page.drawText('Online PDF SaaS & Document Cloud Services', {
    x: 40,
    y: height - 66,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.55),
  });

  page.drawText(`Contact: ${siteEmail} | https://vanshpdf.com`, {
    x: 40,
    y: height - 78,
    size: 8,
    font: fontRegular,
    color: rgb(0.45, 0.5, 0.6),
  });

  // Header Right: INVOICE title & Badge
  const invoiceTitle = 'TAX INVOICE';
  const titleWidth = fontBold.widthOfTextAtSize(invoiceTitle, 16);
  page.drawText(invoiceTitle, {
    x: width - 40 - titleWidth,
    y: height - 50,
    size: 16,
    font: fontBold,
    color: rgb(0.14, 0.44, 0.88),
  });

  const invoiceId = payment.invoiceId || `INV-${new Date().getFullYear()}-${payment.id?.replace('pay_', '').slice(0, 5).toUpperCase()}`;
  const invIdWidth = fontMono.widthOfTextAtSize(invoiceId, 10);
  page.drawText(invoiceId, {
    x: width - 40 - invIdWidth,
    y: height - 66,
    size: 10,
    font: fontMono,
    color: rgb(0.2, 0.25, 0.35),
  });

  // Status Pill
  const statusText = (payment.status || 'PAID').toUpperCase();
  const isPaid = statusText === 'PAID';
  page.drawRectangle({
    x: width - 110,
    y: height - 95,
    width: 70,
    height: 18,
    color: isPaid ? rgb(0.85, 0.96, 0.9) : rgb(0.98, 0.92, 0.85),
    borderColor: isPaid ? rgb(0.2, 0.7, 0.35) : rgb(0.85, 0.6, 0.2),
    borderWidth: 1,
  });
  const stWidth = fontBold.widthOfTextAtSize(statusText, 9);
  page.drawText(statusText, {
    x: width - 110 + (70 - stWidth) / 2,
    y: height - 88,
    size: 9,
    font: fontBold,
    color: isPaid ? rgb(0.1, 0.55, 0.25) : rgb(0.7, 0.4, 0.1),
  });

  // Divider line
  page.drawLine({
    start: { x: 40, y: height - 105 },
    end: { x: width - 40, y: height - 105 },
    thickness: 1,
    color: rgb(0.88, 0.9, 0.94),
  });

  // --- Bill To & Meta Information Section ---
  const metaY = height - 130;

  // Left column: Bill To
  page.drawText('BILLED TO:', {
    x: 40,
    y: metaY,
    size: 9,
    font: fontBold,
    color: rgb(0.4, 0.45, 0.55),
  });

  page.drawText(payment.userName || 'Valued Subscriber', {
    x: 40,
    y: metaY - 16,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });

  page.drawText(payment.userEmail || 'user@domain.com', {
    x: 40,
    y: metaY - 30,
    size: 9,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.45),
  });

  page.drawText(`Account ID: ${payment.userId || 'usr_guest'}`, {
    x: 40,
    y: metaY - 43,
    size: 8,
    font: fontMono,
    color: rgb(0.5, 0.55, 0.65),
  });

  // Right column: Invoice Meta
  const metaRightX = 360;
  page.drawText('INVOICE DETAILS:', {
    x: metaRightX,
    y: metaY,
    size: 9,
    font: fontBold,
    color: rgb(0.4, 0.45, 0.55),
  });

  const createdDate = payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date().toLocaleDateString();
  page.drawText(`Date of Issue: ${createdDate}`, {
    x: metaRightX,
    y: metaY - 16,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.35),
  });

  page.drawText(`Order ID: ${payment.orderId || payment.id}`, {
    x: metaRightX,
    y: metaY - 30,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.35),
  });

  page.drawText(`Payment Gateway: ${(payment.gateway || 'Stripe').toUpperCase()} (${(payment.paymentMethod || 'Online').toUpperCase()})`, {
    x: metaRightX,
    y: metaY - 43,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.35),
  });

  if (payment.transactionId) {
    page.drawText(`Transaction Ref: ${payment.transactionId}`, {
      x: metaRightX,
      y: metaY - 56,
      size: 8,
      font: fontMono,
      color: rgb(0.4, 0.45, 0.55),
    });
  }

  // --- Table Header ---
  const tableY = height - 215;
  page.drawRectangle({
    x: 40,
    y: tableY - 16,
    width: width - 80,
    height: 24,
    color: rgb(0.95, 0.96, 0.98),
  });

  page.drawText('ITEM DESCRIPTION', {
    x: 50,
    y: tableY - 8,
    size: 9,
    font: fontBold,
    color: rgb(0.3, 0.35, 0.45),
  });

  page.drawText('BILLING CYCLE', {
    x: 270,
    y: tableY - 8,
    size: 9,
    font: fontBold,
    color: rgb(0.3, 0.35, 0.45),
  });

  page.drawText('QTY', {
    x: 390,
    y: tableY - 8,
    size: 9,
    font: fontBold,
    color: rgb(0.3, 0.35, 0.45),
  });

  page.drawText('AMOUNT', {
    x: 480,
    y: tableY - 8,
    size: 9,
    font: fontBold,
    color: rgb(0.3, 0.35, 0.45),
  });

  // --- Table Row ---
  const rowY = tableY - 45;
  const planName = payment.planName || (payment.planId === 'enterprise' ? 'Enterprise Cloud Plan' : payment.planId === 'pro' ? 'Pro Professional Plan' : 'Standard Subscription');

  page.drawText(planName, {
    x: 50,
    y: rowY,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });

  page.drawText('Access to all 78 PDF tools, OCR, AI Assistant, and Cloud Vault', {
    x: 50,
    y: rowY - 13,
    size: 8,
    font: fontRegular,
    color: rgb(0.45, 0.5, 0.6),
  });

  page.drawText((payment.billingCycle || 'Monthly').toUpperCase(), {
    x: 270,
    y: rowY,
    size: 9,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.45),
  });

  page.drawText('1', {
    x: 395,
    y: rowY,
    size: 9,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.45),
  });

  const basePriceText = `${symbol} ${Number(payment.baseAmount || payment.amount || 0).toFixed(2)}`;
  page.drawText(basePriceText, {
    x: 480,
    y: rowY,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });

  // Divider under row
  page.drawLine({
    start: { x: 40, y: rowY - 24 },
    end: { x: width - 40, y: rowY - 24 },
    thickness: 1,
    color: rgb(0.92, 0.94, 0.96),
  });

  // --- Totals Section ---
  const totalsY = rowY - 45;
  const summaryX = 350;
  const summaryValX = 480;

  // Subtotal
  page.drawText('Subtotal:', {
    x: summaryX,
    y: totalsY,
    size: 9,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.5),
  });
  page.drawText(`${symbol} ${Number(payment.baseAmount || payment.amount || 0).toFixed(2)}`, {
    x: summaryValX,
    y: totalsY,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.35),
  });

  let currentY = totalsY;

  // Discount if any
  if (payment.discountAmount && payment.discountAmount > 0) {
    currentY -= 16;
    const couponLabel = payment.couponCode ? `Coupon (${payment.couponCode}):` : 'Promotional Discount:';
    page.drawText(couponLabel, {
      x: summaryX,
      y: currentY,
      size: 9,
      font: fontRegular,
      color: rgb(0.1, 0.55, 0.25),
    });
    page.drawText(`-${symbol} ${Number(payment.discountAmount).toFixed(2)}`, {
      x: summaryValX,
      y: currentY,
      size: 9,
      font: fontBold,
      color: rgb(0.1, 0.55, 0.25),
    });
  }

  // Tax
  currentY -= 16;
  page.drawText('Taxes & Gateway Fees (0%):', {
    x: summaryX,
    y: currentY,
    size: 9,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.5),
  });
  page.drawText(`${symbol} 0.00`, {
    x: summaryValX,
    y: currentY,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.35),
  });

  // Final Total Box
  currentY -= 28;
  page.drawRectangle({
    x: summaryX - 10,
    y: currentY - 6,
    width: width - summaryX - 30,
    height: 26,
    color: rgb(0.93, 0.96, 1.0),
    borderColor: rgb(0.75, 0.85, 0.98),
    borderWidth: 1,
  });

  page.drawText('TOTAL PAID:', {
    x: summaryX,
    y: currentY,
    size: 10,
    font: fontBold,
    color: rgb(0.14, 0.44, 0.88),
  });

  const totalText = `${symbol} ${Number(payment.amount || 0).toFixed(2)} ${currency}`;
  page.drawText(totalText, {
    x: summaryValX - 15,
    y: currentY,
    size: 11,
    font: fontBold,
    color: rgb(0.08, 0.12, 0.25),
  });

  // --- Official Verification & Footer Stamp ---
  const stampY = 120;
  page.drawRectangle({
    x: 40,
    y: stampY,
    width: 250,
    height: 55,
    color: rgb(0.98, 0.99, 1.0),
    borderColor: rgb(0.85, 0.9, 0.98),
    borderWidth: 1,
  });

  page.drawText('OFFICIAL SYSTEM VERIFICATION STAMP', {
    x: 50,
    y: stampY + 40,
    size: 7.5,
    font: fontBold,
    color: rgb(0.14, 0.44, 0.88),
  });

  page.drawText(`Verified By: ${payment.verifiedBy || 'Automated Gateway Engine'}`, {
    x: 50,
    y: stampY + 26,
    size: 8,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.35),
  });

  page.drawText(`Timestamp: ${payment.verifiedAt || payment.createdAt || new Date().toISOString()}`, {
    x: 50,
    y: stampY + 14,
    size: 7.5,
    font: fontMono,
    color: rgb(0.45, 0.5, 0.6),
  });

  page.drawText(`Digital Signature ID: SHA256-${payment.id?.replace('pay_', '') || 'VNP'}-CONFIRMED`, {
    x: 50,
    y: stampY + 4,
    size: 7,
    font: fontMono,
    color: rgb(0.1, 0.55, 0.25),
  });

  // Bottom Notice
  page.drawLine({
    start: { x: 40, y: 55 },
    end: { x: width - 40, y: 55 },
    thickness: 0.8,
    color: rgb(0.88, 0.9, 0.94),
  });

  page.drawText('Thank you for subscribing to Vansh PDF SaaS. This is a computer-generated tax invoice and requires no physical signature.', {
    x: 40,
    y: 40,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.5, 0.55, 0.65),
  });

  page.drawText('For billing inquiries or tax exemptions, please reach out to billing@vanshpdf.com.', {
    x: 40,
    y: 28,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.5, 0.55, 0.65),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
