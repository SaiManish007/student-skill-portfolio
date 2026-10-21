package com.skillfolio.portfolio.dto.auth;

import com.skillfolio.portfolio.entity.Role;

public class UserSummaryDto {

    private Long id;
    private String email;
    private Role role;
    private String fullName;
    private String portfolioSlug;
    private boolean isPublished;

    public UserSummaryDto() {
    }

    public UserSummaryDto(Long id, String email, Role role, String fullName, String portfolioSlug, boolean isPublished) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.portfolioSlug = portfolioSlug;
        this.isPublished = isPublished;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPortfolioSlug() {
        return portfolioSlug;
    }

    public void setPortfolioSlug(String portfolioSlug) {
        this.portfolioSlug = portfolioSlug;
    }

    public boolean isPublished() {
        return isPublished;
    }

    public void setPublished(boolean published) {
        isPublished = published;
    }
}
