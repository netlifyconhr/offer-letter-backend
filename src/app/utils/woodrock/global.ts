export async function generateWoodrockHeader(
  doc: PDFKit.PDFDocument,
  imageHeight?: number
) {
  doc.image("./woodrock-small-height_banner.png", 50, 20, {
    width: 495,
    height: imageHeight || 90,
  });
}
