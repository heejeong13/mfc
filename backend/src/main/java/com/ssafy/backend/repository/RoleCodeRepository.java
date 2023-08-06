package com.ssafy.backend.repository;

import com.ssafy.backend.entity.RoleCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleCodeRepository extends JpaRepository<RoleCode, Long> {
    Optional<RoleCode> findById(Long id);
}
