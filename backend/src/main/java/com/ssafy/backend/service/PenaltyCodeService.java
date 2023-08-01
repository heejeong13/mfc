package com.ssafy.backend.service;

import com.ssafy.backend.entity.PenaltyCode;
import com.ssafy.backend.repository.PenaltyCodeRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PenaltyCodeService {

  private final PenaltyCodeRepository penaltyCodeRepository;

  public PenaltyCode findByCode(Long code) {
    Optional<PenaltyCode> penaltyCode = penaltyCodeRepository.findById(code);
    return penaltyCode.get();
  }

}