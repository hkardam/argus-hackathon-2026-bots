package com.bots.hackathon.document;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AgreementService {

    // TODO: Inject TemplateRenderer and PdfGenerator when implemented

    /**
     * Generates a grant agreement document for the given award. TODO: Implement template rendering
     * and PDF generation.
     */
    public byte[] generateAgreement(UUID grantAwardId) {
        log.info("Agreement generation requested for grant award: {}", grantAwardId);
        // TODO: Fetch award details, render template, generate PDF
        throw new UnsupportedOperationException("Agreement generation not yet implemented");
    }
}
