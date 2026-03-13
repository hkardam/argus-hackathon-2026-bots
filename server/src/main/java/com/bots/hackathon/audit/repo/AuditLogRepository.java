package com.bots.hackathon.audit.repo;

import com.bots.hackathon.audit.model.AuditLogEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogEntity, Long> {

    List<AuditLogEntity> findByObjectTypeAndObjectIdOrderByTimestampDesc(
            String objectType, String objectId);

    List<AuditLogEntity> findByActorIdOrderByTimestampDesc(Long actorId);

    List<AuditLogEntity> findAllByOrderByTimestampDesc();
}
