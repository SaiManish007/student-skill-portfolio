package com.skillfolio.portfolio.service;

import com.skillfolio.portfolio.dto.skill.SkillRequest;
import com.skillfolio.portfolio.dto.skill.SkillResponse;
import com.skillfolio.portfolio.entity.Skill;
import com.skillfolio.portfolio.entity.User;
import com.skillfolio.portfolio.exception.ResourceNotFoundException;
import com.skillfolio.portfolio.exception.UnauthorizedException;
import com.skillfolio.portfolio.repository.SkillRepository;
import com.skillfolio.portfolio.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillService(SkillRepository skillRepository, UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillResponse> getSkills(Long userId, String category) {
        List<Skill> skills;
        if (StringUtils.hasText(category)) {
            skills = skillRepository.findAllByUserIdAndCategoryIgnoreCaseOrderByCreatedAtDesc(userId, category.trim());
        } else {
            skills = skillRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        }
        return skills.stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public SkillResponse getSkill(Long userId, Long skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + skillId));

        if (!skill.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to access this skill");
        }

        return mapToResponse(skill);
    }

    @Transactional
    public SkillResponse createSkill(Long userId, SkillRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Skill skill = new Skill(
                user,
                request.getName().trim(),
                request.getCategory().toUpperCase(Locale.ROOT).trim(),
                request.getProficiencyLevel().toUpperCase(Locale.ROOT).trim(),
                request.getYearsOfExperience()
        );

        Skill saved = skillRepository.save(skill);
        return mapToResponse(saved);
    }

    @Transactional
    public SkillResponse updateSkill(Long userId, Long skillId, SkillRequest request) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + skillId));

        if (!skill.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this skill");
        }

        skill.setName(request.getName().trim());
        skill.setCategory(request.getCategory().toUpperCase(Locale.ROOT).trim());
        skill.setProficiencyLevel(request.getProficiencyLevel().toUpperCase(Locale.ROOT).trim());
        skill.setYearsOfExperience(request.getYearsOfExperience());

        Skill updated = skillRepository.save(skill);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteSkill(Long userId, Long skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + skillId));

        if (!skill.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this skill");
        }

        skillRepository.delete(skill);
    }

    public SkillResponse mapToResponse(Skill skill) {
        return new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getCategory(),
                skill.getProficiencyLevel(),
                skill.getYearsOfExperience(),
                skill.getCreatedAt(),
                skill.getUpdatedAt()
        );
    }
}
