package com.skillfolio.portfolio.service;

import com.skillfolio.portfolio.dto.certification.CertificationRequest;
import com.skillfolio.portfolio.dto.certification.CertificationResponse;
import com.skillfolio.portfolio.entity.Certification;
import com.skillfolio.portfolio.entity.User;
import com.skillfolio.portfolio.exception.ResourceNotFoundException;
import com.skillfolio.portfolio.exception.UnauthorizedException;
import com.skillfolio.portfolio.repository.CertificationRepository;
import com.skillfolio.portfolio.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final UserRepository userRepository;

    public CertificationService(CertificationRepository certificationRepository, UserRepository userRepository) {
        this.certificationRepository = certificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CertificationResponse> getCertifications(Long userId) {
        return certificationRepository.findAllByUserIdOrderByIssueDateDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CertificationResponse getCertification(Long userId, Long certId) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with ID: " + certId));

        if (!cert.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to access this certification");
        }

        return mapToResponse(cert);
    }

    @Transactional
    public CertificationResponse createCertification(Long userId, CertificationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Certification cert = new Certification();
        cert.setUser(user);
        cert.setName(request.getName().trim());
        cert.setIssuer(request.getIssuer().trim());
        cert.setIssueDate(request.getIssueDate());
        cert.setExpiryDate(request.getExpiryDate());
        cert.setCredentialId(request.getCredentialId() != null ? request.getCredentialId().trim() : null);
        cert.setCredentialUrl(request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null);

        Certification saved = certificationRepository.save(cert);
        return mapToResponse(saved);
    }

    @Transactional
    public CertificationResponse updateCertification(Long userId, Long certId, CertificationRequest request) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with ID: " + certId));

        if (!cert.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this certification");
        }

        cert.setName(request.getName().trim());
        cert.setIssuer(request.getIssuer().trim());
        cert.setIssueDate(request.getIssueDate());
        cert.setExpiryDate(request.getExpiryDate());
        cert.setCredentialId(request.getCredentialId() != null ? request.getCredentialId().trim() : null);
        cert.setCredentialUrl(request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null);

        Certification updated = certificationRepository.save(cert);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteCertification(Long userId, Long certId) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with ID: " + certId));

        if (!cert.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this certification");
        }

        certificationRepository.delete(cert);
    }

    public CertificationResponse mapToResponse(Certification cert) {
        CertificationResponse resp = new CertificationResponse();
        resp.setId(cert.getId());
        resp.setName(cert.getName());
        resp.setIssuer(cert.getIssuer());
        resp.setIssueDate(cert.getIssueDate());
        resp.setExpiryDate(cert.getExpiryDate());
        resp.setCredentialId(cert.getCredentialId());
        resp.setCredentialUrl(cert.getCredentialUrl());
        resp.setCreatedAt(cert.getCreatedAt());
        resp.setUpdatedAt(cert.getUpdatedAt());
        return resp;
    }
}
