package com.spendwise.backend.controller;

import com.spendwise.backend.security.UserPrincipal;
import com.spendwise.backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<?> getDashboard(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam String month) {
        return ResponseEntity.ok(dashboardService.getDashboard(principal.getUserId(), month));
    }
}
