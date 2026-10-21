package com.skillfolio.portfolio.controller;

import com.skillfolio.portfolio.dto.ApiResponse;
import com.skillfolio.portfolio.dto.profile.PublishStatusRequest;
import com.skillfolio.portfolio.dto.profile.SlugUpdateRequest;
import com.skillfolio.portfolio.dto.profile.StudentProfileRequest;
import com.skillfolio.portfolio.dto.profile.StudentProfileResponse;
import com.skillfolio.portfolio.security.UserPrincipal;
import com.skillfolio.portfolio.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        StudentProfileResponse profile = profileService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody StudentProfileRequest request) {
        StudentProfileResponse updated = profileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PatchMapping("/me/slug")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateSlug(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SlugUpdateRequest request) {
        StudentProfileResponse updated = profileService.updateSlug(principal.getId(), request.getPortfolioSlug());
        return ResponseEntity.ok(ApiResponse.success("Portfolio URL slug updated successfully", updated));
    }

    @PatchMapping("/me/publish")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updatePublishStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PublishStatusRequest request) {
        StudentProfileResponse updated = profileService.updatePublishStatus(principal.getId(), request.getIsPublished());
        String msg = updated.isPublished() ? "Portfolio published successfully" : "Portfolio unpublished successfully";
        return ResponseEntity.ok(ApiResponse.success(msg, updated));
    }
}
