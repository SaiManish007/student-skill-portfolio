package com.skillfolio.portfolio.controller;

import com.skillfolio.portfolio.dto.ApiResponse;
import com.skillfolio.portfolio.dto.portfolio.PublicPortfolioDto;
import com.skillfolio.portfolio.service.PublicPortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicPortfolioController {

    private final PublicPortfolioService publicPortfolioService;

    public PublicPortfolioController(PublicPortfolioService publicPortfolioService) {
        this.publicPortfolioService = publicPortfolioService;
    }

    @GetMapping("/portfolio/{slug}")
    public ResponseEntity<ApiResponse<PublicPortfolioDto>> getPublicPortfolio(@PathVariable String slug) {
        PublicPortfolioDto portfolio = publicPortfolioService.getPublicPortfolioBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(portfolio));
    }
}
