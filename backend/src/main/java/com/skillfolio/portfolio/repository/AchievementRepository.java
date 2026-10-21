package com.skillfolio.portfolio.repository;

import com.skillfolio.portfolio.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    List<Achievement> findAllByUserIdOrderByEventDateDesc(Long userId);

    Optional<Achievement> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);
}
