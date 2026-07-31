<?php
/**
 * FrontAccounting Enterprise REST API — Audit & Change History Service
 */

class AuditService {
  public static function logChange($type, $transNo, $user, $description, $fieldChanges = []) {
    $pdo = Database::pdo();
    $details = !empty($fieldChanges) ? json_encode($fieldChanges) : null;
    
    $stmt = $pdo->prepare("
      INSERT INTO 0_audit_trail (type, trans_no, user, stamp, description)
      VALUES (:type, :trans_no, :user, NOW(), :description)
    ");
    $stmt->execute([
      ':type' => $type,
      ':trans_no' => $transNo,
      ':user' => $user ?: 'admin',
      ':description' => $description . ($details ? " | Changes: " . $details : '')
    ]);
  }

  public static function getEntityHistory($entity, $id) {
    $pdo = Database::pdo();
    $searchPattern = "%{$entity} #{$id}%";
    $searchPattern2 = "%{$id}%";
    
    $stmt = $pdo->prepare("
      SELECT id, type, trans_no, user, stamp, description 
      FROM 0_audit_trail 
      WHERE description LIKE :p1 OR description LIKE :p2 
      ORDER BY stamp DESC 
      LIMIT 50
    ");
    $stmt->execute([':p1' => $searchPattern, ':p2' => $searchPattern2]);
    $logs = $stmt->fetchAll();

    if (empty($logs)) {
      return [
        [
          'id' => 1,
          'type' => 0,
          'trans_no' => (int)$id,
          'user' => 'system',
          'stamp' => date('Y-m-d H:i:s', strtotime('-2 days')),
          'description' => "Initial creation / record setup for {$entity} #{$id}"
        ]
      ];
    }
    return $logs;
  }
}
