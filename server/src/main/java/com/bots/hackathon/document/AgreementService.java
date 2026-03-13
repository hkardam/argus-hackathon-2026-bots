package com.bots.hackathon.document;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AgreementService {

    /**
     * Generates a grant agreement document for the given award. Requires TemplateRenderer and
     * PdfGenerator implementations to be wired.
     */
    public byte[] generateAgreement(UUID grantAwardId) {
        log.info("Agreement generation requested for grant award: {}", grantAwardId);
        throw new UnsupportedOperationException("Agreement generation not yet implemented");
    }
}
