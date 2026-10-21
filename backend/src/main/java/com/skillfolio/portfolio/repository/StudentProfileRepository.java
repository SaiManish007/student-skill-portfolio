package com.skillfolio.portfolio.repository;

import com.skillfolio.portfolio.entity.StudentProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUserId(Long userId);

    Optional<StudentProfile> findByPortfolioSlugIgnoreCase(String portfolioSlug);

    boolean existsByPortfolioSlugIgnoreCase(String portfolioSlug);

    boolean existsByPortfolioSlugIgnoreCaseAndUserIdNot(String portfolioSlug, Long userId);

    long countByIsPublishedTrue();

    @Query("SELECT p FROM StudentProfile p JOIN p.user u WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(p.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.college) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.department) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<StudentProfile> searchProfiles(@Param("query") String query, Pageable pageable);
}
