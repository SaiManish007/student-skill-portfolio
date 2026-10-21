package com.skillfolio.portfolio.service;

import com.skillfolio.portfolio.dto.achievement.AchievementRequest;
import com.skillfolio.portfolio.dto.achievement.AchievementResponse;
import com.skillfolio.portfolio.entity.Achievement;
import com.skillfolio.portfolio.entity.User;
import com.skillfolio.portfolio.exception.ResourceNotFoundException;
import com.skillfolio.portfolio.exception.UnauthorizedException;
import com.skillfolio.portfolio.repository.AchievementRepository;
import com.skillfolio.portfolio.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;

    public AchievementService(AchievementRepository achievementRepository, UserRepository userRepository) {
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AchievementResponse> getAchievements(Long userId) {
        return achievementRepository.findAllByUserIdOrderByEventDateDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AchievementResponse getAchievement(Long userId, Long achievementId) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found with ID: " + achievementId));

        if (!achievement.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to access this achievement");
        }

        return mapToResponse(achievement);
    }

    @Transactional
    public AchievementResponse createAchievement(Long userId, AchievementRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Achievement achievement = new Achievement();
        achievement.setUser(user);
        achievement.setTitle(request.getTitle().trim());
        achievement.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        achievement.setOrganization(request.getOrganization() != null ? request.getOrganization().trim() : null);
        achievement.setEventDate(request.getEventDate());
        achievement.setCategory(request.getCategory().toUpperCase(Locale.ROOT).trim());
        achievement.setEvidenceUrl(request.getEvidenceUrl() != null ? request.getEvidenceUrl().trim() : null);

        Achievement saved = achievementRepository.save(achievement);
        return mapToResponse(saved);
    }

    @Transactional
    public AchievementResponse updateAchievement(Long userId, Long achievementId, AchievementRequest request) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found with ID: " + achievementId));

        if (!achievement.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this achievement");
        }

        achievement.setTitle(request.getTitle().trim());
        achievement.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        achievement.setOrganization(request.getOrganization() != null ? request.getOrganization().trim() : null);
        achievement.setEventDate(request.getEventDate());
        achievement.setCategory(request.getCategory().toUpperCase(Locale.ROOT).trim());
        achievement.setEvidenceUrl(request.getEvidenceUrl() != null ? request.getEvidenceUrl().trim() : null);

        Achievement updated = achievementRepository.save(achievement);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteAchievement(Long userId, Long achievementId) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found with ID: " + achievementId));

        if (!achievement.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this achievement");
        }

        achievementRepository.delete(achievement);
    }

    public AchievementResponse mapToResponse(Achievement achievement) {
        AchievementResponse resp = new AchievementResponse();
        resp.setId(achievement.getId());
        resp.setTitle(achievement.getTitle());
        resp.setDescription(achievement.getDescription());
        resp.setOrganization(achievement.getOrganization());
        resp.setEventDate(achievement.getEventDate());
        resp.setCategory(achievement.getCategory());
        resp.setEvidenceUrl(achievement.getEvidenceUrl());
        resp.setCreatedAt(achievement.getCreatedAt());
        resp.setUpdatedAt(achievement.getUpdatedAt());
        return resp;
    }
}
