package com.skillfolio.portfolio.repository;

import com.skillfolio.portfolio.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    List<Skill> findAllByUserIdAndCategoryIgnoreCaseOrderByCreatedAtDesc(Long userId, String category);

    Optional<Skill> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndCategoryIgnoreCase(Long userId, String category);
}
