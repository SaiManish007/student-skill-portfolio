package com.skillfolio.portfolio.controller;

import com.skillfolio.portfolio.dto.ApiResponse;
import com.skillfolio.portfolio.dto.project.ProjectRequest;
import com.skillfolio.portfolio.dto.project.ProjectResponse;
import com.skillfolio.portfolio.security.UserPrincipal;
import com.skillfolio.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getMyProjects(@AuthenticationPrincipal UserPrincipal principal) {
        List<ProjectResponse> projects = projectService.getProjects(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        ProjectResponse project = projectService.getProject(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProjectRequest request) {
        ProjectResponse created = projectService.createProject(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Project created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request) {
        ProjectResponse updated = projectService.updateProject(principal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        projectService.deleteProject(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}
