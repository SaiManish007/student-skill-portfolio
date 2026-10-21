package com.skillfolio.portfolio.controller;

import com.skillfolio.portfolio.dto.ApiResponse;
import com.skillfolio.portfolio.dto.certification.CertificationRequest;
import com.skillfolio.portfolio.dto.certification.CertificationResponse;
import com.skillfolio.portfolio.security.UserPrincipal;
import com.skillfolio.portfolio.service.CertificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
public class CertificationController {

    private final CertificationService certificationService;

    public CertificationController(CertificationService certificationService) {
        this.certificationService = certificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> getMyCertifications(@AuthenticationPrincipal UserPrincipal principal) {
        List<CertificationResponse> certs = certificationService.getCertifications(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(certs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CertificationResponse>> getCertification(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        CertificationResponse cert = certificationService.getCertification(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(cert));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CertificationResponse>> createCertification(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CertificationRequest request) {
        CertificationResponse created = certificationService.createCertification(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Certification added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CertificationResponse>> updateCertification(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody CertificationRequest request) {
        CertificationResponse updated = certificationService.updateCertification(principal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Certification updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        certificationService.deleteCertification(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Certification deleted successfully", null));
    }
}
