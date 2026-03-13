package com.bots.hackathon.document;

public interface PdfGenerator {

    /**
     * Generates a PDF from HTML content. TODO: Implement with a PDF library (e.g., iText, OpenPDF).
     */
    byte[] generateFromHtml(String htmlContent);
}
