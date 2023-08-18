package com.ssafy.backend.dto.request;


import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddPenaltyDto {

  private Long roomId;
  private Long userId;
  private Long penaltyCodeId;
  private LocalDateTime penaltyTime;

}
