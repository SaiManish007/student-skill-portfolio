package com.skillfolio.portfolio.dto.profile;

import jakarta.validation.constraints.NotNull;

public class PublishStatusRequest {

    @NotNull(message = "Published status is required")
    private Boolean isPublished;

    public PublishStatusRequest() {
    }

    public PublishStatusRequest(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }
}
