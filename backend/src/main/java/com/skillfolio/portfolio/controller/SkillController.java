package com.skillfolio.portfolio.controller;

import com.skillfolio.portfolio.dto.ApiResponse;
import com.skillfolio.portfolio.dto.skill.SkillRequest;
import com.skillfolio.portfolio.dto.skill.SkillResponse;
import com.skillfolio.portfolio.security.UserPrincipal;
import com.skillfolio.portfolio.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillResponse>>> getMySkills(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String category) {
        List<SkillResponse> skills = skillService.getSkills(principal.getId(), category);
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillResponse>> getSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        SkillResponse skill = skillService.getSkill(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(skill));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SkillResponse>> createSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SkillRequest request) {
        SkillResponse created = skillService.createSkill(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Skill created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillResponse>> updateSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody SkillRequest request) {
        SkillResponse updated = skillService.updateSkill(principal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Skill updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        skillService.deleteSkill(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted successfully", null));
    }
}
