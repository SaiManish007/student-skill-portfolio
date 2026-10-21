package com.skillfolio.portfolio.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SlugUpdateRequest {

    @NotBlank(message = "Portfolio slug cannot be empty")
    @Size(min = 3, max = 60, message = "Portfolio slug must be between 3 and 60 characters")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Portfolio slug must contain only lowercase letters, numbers, and hyphens without consecutive hyphens")
    private String portfolioSlug;

    public SlugUpdateRequest() {
    }

    public SlugUpdateRequest(String portfolioSlug) {
        this.portfolioSlug = portfolioSlug;
    }

    public String getPortfolioSlug() {
        return portfolioSlug;
    }

    public void setPortfolioSlug(String portfolioSlug) {
        this.portfolioSlug = portfolioSlug;
    }
}
