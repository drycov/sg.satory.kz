import { sequelize } from '../config/database';

// Модели
import { SystemUser } from './system_user.model';
import { AuditLog } from './auditlog.model';
import { Router } from './router.model';
import { RouterEndpoint } from './router_endpoints.model';
import { AssignmentGroup } from './assignment-group.model';
import { IpPool } from './ip_pool.model';
import { User } from './user.model';
import { UserProfile } from './user_profile.model';
import { UserIp } from './user_ip.model';

// ====================================================
// 🔗  ASSOCIATIONS
// ====================================================


// 🌐 Router ↔ IpPool (1:N)
Router.hasMany(IpPool, { foreignKey: 'router_id', as: 'ip_pools', onDelete: 'CASCADE' });
IpPool.belongsTo(Router, { foreignKey: 'router_id', as: 'router' });

// 🌍 Router ↔ RouterEndpoint (1:N)
Router.hasMany(RouterEndpoint, { foreignKey: 'router_id', as: 'endpoints', onDelete: 'CASCADE' });
RouterEndpoint.belongsTo(Router, { foreignKey: 'router_id', as: 'router' });

// 🧩 AssignmentGroup ↔ IpPool (1:N)
AssignmentGroup.hasMany(IpPool, { foreignKey: 'group_id', as: 'ip_pools', onDelete: 'SET NULL' });
IpPool.belongsTo(AssignmentGroup, { foreignKey: 'group_id', as: 'group' });

// 👤 User ↔ IpPool (через UserIp)
User.belongsToMany(IpPool, { through: UserIp, foreignKey: 'user_id', as: 'ip_pools' });
IpPool.belongsToMany(User, { through: UserIp, foreignKey: 'ip_pool_id', as: 'users' });

// Прямая связь для удобства
User.hasMany(UserIp, { foreignKey: 'user_id', as: 'user_ips' });
UserIp.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

IpPool.hasMany(UserIp, { foreignKey: 'ip_pool_id', as: 'user_ips' });
UserIp.belongsTo(IpPool, { foreignKey: 'ip_pool_id', as: 'ip_pool' });

// 👤 User ↔ UserProfile
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile', onDelete: 'CASCADE' });
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 🧾 User ↔ AuditLog
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'audit_logs', onDelete: 'SET NULL' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'audit_user' });

// 🧑‍💼 SystemUser ↔ AuditLog
SystemUser.hasMany(AuditLog, { foreignKey: 'system_user_id', as: 'system_audit_logs' });
AuditLog.belongsTo(SystemUser, { foreignKey: 'system_user_id', as: 'system_user' });

// ====================================================
// 🧱 EXPORT MODELS
// ====================================================

export {
  sequelize,
  SystemUser,
  AuditLog,
  Router,
  RouterEndpoint,
  AssignmentGroup,
  IpPool,
  User,
  UserProfile,
  UserIp,
};
