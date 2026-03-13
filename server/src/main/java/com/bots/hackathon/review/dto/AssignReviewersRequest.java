package com.bots.hackathon.review.dto;

import java.util.List;

public record AssignReviewersRequest(List<Long> reviewerIds) {}
