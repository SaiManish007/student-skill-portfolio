package com.skillfolio.portfolio.controller;

import com.skillfolio.portfolio.dto.ApiResponse;
import com.skillfolio.portfolio.dto.PaginatedResponse;
import com.skillfolio.portfolio.dto.admin.AdminStudentDetailDto;
import com.skillfolio.portfolio.dto.admin.AdminStudentSummaryDto;
import com.skillfolio.portfolio.dto.admin.AdminUserStatusRequest;
import com.skillfolio.portfolio.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<PaginatedResponse<AdminStudentSummaryDto>>> getStudents(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Sort sortOrder = Sort.by(Sort.Direction.DESC, "id");
        if (sort.length >= 2) {
            Sort.Direction direction = sort[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            sortOrder = Sort.by(direction, sort[0]);
        }

        Pageable pageable = PageRequest.of(page, size, sortOrder);
        Page<AdminStudentSummaryDto> studentPage = adminService.searchStudents(query, pageable);
        PaginatedResponse<AdminStudentSummaryDto> response = new PaginatedResponse<>(studentPage);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<ApiResponse<AdminStudentDetailDto>> getStudentDetail(@PathVariable Long id) {
        AdminStudentDetailDto detail = adminService.getStudentDetail(id);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    @PatchMapping("/students/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateStudentStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserStatusRequest request) {
        adminService.updateUserActiveStatus(id, request.getActive());
        String msg = request.getActive() ? "Student account activated" : "Student account deactivated";
        return ResponseEntity.ok(ApiResponse.success(msg, null));
    }
}
