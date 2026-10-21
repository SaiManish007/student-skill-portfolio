package com.skillfolio.portfolio.service;

import com.skillfolio.portfolio.dto.profile.StudentProfileRequest;
import com.skillfolio.portfolio.dto.profile.StudentProfileResponse;
import com.skillfolio.portfolio.entity.StudentProfile;
import com.skillfolio.portfolio.exception.BadRequestException;
import com.skillfolio.portfolio.exception.ResourceNotFoundException;
import com.skillfolio.portfolio.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class ProfileService {

    private final StudentProfileRepository profileRepository;

    public ProfileService(StudentProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfile(Long userId) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));
        return mapToResponse(profile);
    }

    @Transactional
    public StudentProfileResponse updateProfile(Long userId, StudentProfileRequest request) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));

        profile.setFullName(request.getFullName().trim());
        profile.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        profile.setCollege(request.getCollege() != null ? request.getCollege().trim() : null);
        profile.setDepartment(request.getDepartment() != null ? request.getDepartment().trim() : null);
        profile.setDegree(request.getDegree() != null ? request.getDegree().trim() : null);
        profile.setAcademicYear(request.getAcademicYear() != null ? request.getAcademicYear().trim() : null);
        profile.setGraduationYear(request.getGraduationYear());
        profile.setBio(request.getBio() != null ? request.getBio().trim() : null);
        profile.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);
        profile.setProfileImageUrl(request.getProfileImageUrl() != null ? request.getProfileImageUrl().trim() : null);
        profile.setLinkedinUrl(request.getLinkedinUrl() != null ? request.getLinkedinUrl().trim() : null);
        profile.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : null);
        profile.setLeetcodeUrl(request.getLeetcodeUrl() != null ? request.getLeetcodeUrl().trim() : null);
        profile.setCodechefUrl(request.getCodechefUrl() != null ? request.getCodechefUrl().trim() : null);

        StudentProfile updated = profileRepository.save(profile);
        return mapToResponse(updated);
    }

    @Transactional
    public StudentProfileResponse updateSlug(Long userId, String newSlug) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));

        String cleanSlug = newSlug.trim().toLowerCase(Locale.ROOT);

        if (profileRepository.existsByPortfolioSlugIgnoreCaseAndUserIdNot(cleanSlug, userId)) {
            throw new BadRequestException("This portfolio URL slug is already taken. Please choose another one.");
        }

        profile.setPortfolioSlug(cleanSlug);
        StudentProfile updated = profileRepository.save(profile);
        return mapToResponse(updated);
    }

    @Transactional
    public StudentProfileResponse updatePublishStatus(Long userId, boolean isPublished) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));

        profile.setPublished(isPublished);
        StudentProfile updated = profileRepository.save(profile);
        return mapToResponse(updated);
    }

    public StudentProfileResponse mapToResponse(StudentProfile profile) {
        StudentProfileResponse resp = new StudentProfileResponse();
        resp.setId(profile.getId());
        resp.setUserId(profile.getUser().getId());
        resp.setEmail(profile.getUser().getEmail());
        resp.setFullName(profile.getFullName());
        resp.setPhone(profile.getPhone());
        resp.setCollege(profile.getCollege());
        resp.setDepartment(profile.getDepartment());
        resp.setDegree(profile.getDegree());
        resp.setAcademicYear(profile.getAcademicYear());
        resp.setGraduationYear(profile.getGraduationYear());
        resp.setBio(profile.getBio());
        resp.setLocation(profile.getLocation());
        resp.setProfileImageUrl(profile.getProfileImageUrl());
        resp.setLinkedinUrl(profile.getLinkedinUrl());
        resp.setGithubUrl(profile.getGithubUrl());
        resp.setLeetcodeUrl(profile.getLeetcodeUrl());
        resp.setCodechefUrl(profile.getCodechefUrl());
        resp.setPortfolioSlug(profile.getPortfolioSlug());
        resp.setPublished(profile.isPublished());
        resp.setCreatedAt(profile.getCreatedAt());
        resp.setUpdatedAt(profile.getUpdatedAt());
        return resp;
    }
}
