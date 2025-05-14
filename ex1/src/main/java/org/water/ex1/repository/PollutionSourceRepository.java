package org.water.ex1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.water.ex1.model.PollutionSource;

public interface PollutionSourceRepository extends JpaRepository<PollutionSource, Long> {
    // 추가적인 쿼리 메서드를 정의할 수 있습니다.
}