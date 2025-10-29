// src/services/audit-log.service.ts
import { AuditLog } from "../models";

export class AuditLogService {
  static async log(userId: number | null, action: string, details?: string) {
    return AuditLog.create({
      user_id: userId,
      action,
      details,
      created_at: new Date(),
    });
  }
}
