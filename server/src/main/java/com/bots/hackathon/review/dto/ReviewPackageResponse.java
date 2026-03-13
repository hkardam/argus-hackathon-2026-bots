package com.bots.hackathon.review.dto;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.model.Document;
import com.bots.hackathon.review.model.ReviewPackage;
import java.util.List;

public record ReviewPackageResponse(
        Application application, List<Document> documents, ReviewPackage aiReviewPackage) {}
