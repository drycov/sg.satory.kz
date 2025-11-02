export type Role = 'user' | 'admin' | 'moderator';

export interface RolePermissions {
  [key: string]: string[];
}

export const ROLE_PERMISSIONS: RolePermissions = {
  user: ['read'],
  moderator: ['read', 'write'],
  admin: ['read', 'write', 'delete', 'admin'],
};