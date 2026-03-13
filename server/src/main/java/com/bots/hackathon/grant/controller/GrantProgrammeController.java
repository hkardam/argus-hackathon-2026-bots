package com.bots.hackathon.grant.controller;

import com.bots.hackathon.common.dto.ApiResponse;
import com.bots.hackathon.grant.dto.GrantProgrammeResponse;
import com.bots.hackathon.grant.service.GrantProgrammeService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/programmes")
@RequiredArgsConstructor
public class GrantProgrammeController {

    private final GrantProgrammeService grantProgrammeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GrantProgrammeResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(grantProgrammeService.getAllActiveProgrammes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GrantProgrammeResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(grantProgrammeService.getProgrammeById(id)));
    }
}
