package com.skillfolio.portfolio.service;

import com.skillfolio.portfolio.dto.project.ProjectRequest;
import com.skillfolio.portfolio.dto.project.ProjectResponse;
import com.skillfolio.portfolio.entity.Project;
import com.skillfolio.portfolio.entity.User;
import com.skillfolio.portfolio.exception.ResourceNotFoundException;
import com.skillfolio.portfolio.exception.UnauthorizedException;
import com.skillfolio.portfolio.repository.ProjectRepository;
import com.skillfolio.portfolio.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects(Long userId) {
        return projectRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(Long userId, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        if (!project.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to access this project");
        }

        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse createProject(Long userId, ProjectRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Project project = new Project();
        project.setUser(user);
        project.setTitle(request.getTitle().trim());
        project.setDescription(request.getDescription().trim());
        project.setTechnologies(request.getTechnologies().trim());
        project.setRole(request.getRole() != null ? request.getRole().trim() : null);
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : null);
        project.setLiveDemoUrl(request.getLiveDemoUrl() != null ? request.getLiveDemoUrl().trim() : null);
        project.setStatus(request.getStatus().toUpperCase(Locale.ROOT).trim());

        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    @Transactional
    public ProjectResponse updateProject(Long userId, Long projectId, ProjectRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        if (!project.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this project");
        }

        project.setTitle(request.getTitle().trim());
        project.setDescription(request.getDescription().trim());
        project.setTechnologies(request.getTechnologies().trim());
        project.setRole(request.getRole() != null ? request.getRole().trim() : null);
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : null);
        project.setLiveDemoUrl(request.getLiveDemoUrl() != null ? request.getLiveDemoUrl().trim() : null);
        project.setStatus(request.getStatus().toUpperCase(Locale.ROOT).trim());

        Project updated = projectRepository.save(project);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteProject(Long userId, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        if (!project.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this project");
        }

        projectRepository.delete(project);
    }

    public ProjectResponse mapToResponse(Project project) {
        ProjectResponse resp = new ProjectResponse();
        resp.setId(project.getId());
        resp.setTitle(project.getTitle());
        resp.setDescription(project.getDescription());
        resp.setTechnologies(project.getTechnologies());
        resp.setRole(project.getRole());
        resp.setStartDate(project.getStartDate());
        resp.setEndDate(project.getEndDate());
        resp.setGithubUrl(project.getGithubUrl());
        resp.setLiveDemoUrl(project.getLiveDemoUrl());
        resp.setStatus(project.getStatus());
        resp.setCreatedAt(project.getCreatedAt());
        resp.setUpdatedAt(project.getUpdatedAt());
        return resp;
    }
}
