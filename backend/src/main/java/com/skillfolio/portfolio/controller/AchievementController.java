package com.skillfolio.portfolio.controller;

import com.skillfolio.portfolio.dto.ApiResponse;
import com.skillfolio.portfolio.dto.achievement.AchievementRequest;
import com.skillfolio.portfolio.dto.achievement.AchievementResponse;
import com.skillfolio.portfolio.security.UserPrincipal;
import com.skillfolio.portfolio.service.AchievementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AchievementResponse>>> getMyAchievements(@AuthenticationPrincipal UserPrincipal principal) {
        List<AchievementResponse> achievements = achievementService.getAchievements(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(achievements));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AchievementResponse>> getAchievement(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        AchievementResponse achievement = achievementService.getAchievement(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(achievement));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AchievementResponse>> createAchievement(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AchievementRequest request) {
        AchievementResponse created = achievementService.createAchievement(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Achievement recorded successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AchievementResponse>> updateAchievement(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody AchievementRequest request) {
        AchievementResponse updated = achievementService.updateAchievement(principal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Achievement updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAchievement(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        achievementService.deleteAchievement(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Achievement deleted successfully", null));
    }
}
