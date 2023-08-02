package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

}