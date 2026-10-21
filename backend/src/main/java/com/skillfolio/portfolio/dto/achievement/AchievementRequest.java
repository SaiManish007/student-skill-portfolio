package com.skillfolio.portfolio.dto.achievement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class AchievementRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 200, message = "Title must be between 2 and 200 characters")
    private String title;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @Size(max = 200, message = "Organization name cannot exceed 200 characters")
    private String organization;

    private LocalDate eventDate;

    @NotBlank(message = "Category is required")
    @Pattern(regexp = "^(?i)(HACKATHON|ACADEMIC|EXTRACURRICULAR|LEADERSHIP|OTHER)$", message = "Category must be HACKATHON, ACADEMIC, EXTRACURRICULAR, LEADERSHIP, or OTHER")
    private String category;

    @Pattern(regexp = "^(https?://.+)?$", message = "Evidence URL must be a valid URL starting with http:// or https://")
    @Size(max = 500, message = "Evidence URL cannot exceed 500 characters")
    private String evidenceUrl;

    public AchievementRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getEvidenceUrl() {
        return evidenceUrl;
    }

    public void setEvidenceUrl(String evidenceUrl) {
        this.evidenceUrl = evidenceUrl;
    }
}
