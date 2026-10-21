package com.skillfolio.portfolio.dto.skill;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class SkillRequest {

    @NotBlank(message = "Skill name is required")
    @Size(min = 1, max = 100, message = "Skill name must be between 1 and 100 characters")
    private String name;

    @NotBlank(message = "Category is required")
    @Pattern(regexp = "^(?i)(TECHNICAL|SOFT|TOOLS)$", message = "Category must be TECHNICAL, SOFT, or TOOLS")
    private String category;

    @NotBlank(message = "Proficiency level is required")
    @Pattern(regexp = "^(?i)(BEGINNER|INTERMEDIATE|ADVANCED|EXPERT)$", message = "Proficiency level must be BEGINNER, INTERMEDIATE, ADVANCED, or EXPERT")
    private String proficiencyLevel;

    @DecimalMin(value = "0.0", message = "Years of experience cannot be negative")
    @DecimalMax(value = "50.0", message = "Years of experience cannot exceed 50")
    private BigDecimal yearsOfExperience;

    public SkillRequest() {
    }

    public SkillRequest(String name, String category, String proficiencyLevel, BigDecimal yearsOfExperience) {
        this.name = name;
        this.category = category;
        this.proficiencyLevel = proficiencyLevel;
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(String proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public BigDecimal getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(BigDecimal yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }
}
