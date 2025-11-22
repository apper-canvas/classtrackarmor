import { toast } from "react-toastify";
import { roleService } from "./roleService";
import { getApperClient } from "@/services/apperClient";

// Mock permissions data for development/testing
const mockPermissions = [
  // CEO permissions
  { id: 1, roleId: 1, resource: 'companies', action: 'create', scope: 'all', allowed: true },
  { id: 2, roleId: 1, resource: 'companies', action: 'read', scope: 'all', allowed: true },
  { id: 3, roleId: 1, resource: 'companies', action: 'update', scope: 'all', allowed: true },
  { id: 4, roleId: 1, resource: 'companies', action: 'delete', scope: 'all', allowed: true },
  { id: 5, roleId: 1, resource: 'sites', action: 'create', scope: 'all', allowed: true },
  { id: 6, roleId: 1, resource: 'sites', action: 'read', scope: 'all', allowed: true },
  { id: 7, roleId: 1, resource: 'sites', action: 'update', scope: 'all', allowed: true },
  { id: 8, roleId: 1, resource: 'sites', action: 'delete', scope: 'all', allowed: true },
  { id: 9, roleId: 1, resource: 'users', action: 'create', scope: 'all', allowed: true },
  { id: 10, roleId: 1, resource: 'users', action: 'read', scope: 'all', allowed: true },
  { id: 11, roleId: 1, resource: 'users', action: 'update', scope: 'all', allowed: true },
  { id: 12, roleId: 1, resource: 'users', action: 'delete', scope: 'all', allowed: true },
  
  // Manager permissions
  { id: 13, roleId: 2, resource: 'sites', action: 'read', scope: 'site', allowed: true },
  { id: 14, roleId: 2, resource: 'sites', action: 'update', scope: 'site', allowed: true },
  { id: 15, roleId: 2, resource: 'users', action: 'create', scope: 'site', allowed: true },
  { id: 16, roleId: 2, resource: 'users', action: 'read', scope: 'site', allowed: true },
  { id: 17, roleId: 2, resource: 'users', action: 'update', scope: 'site', allowed: true },
  { id: 18, roleId: 2, resource: 'users', action: 'delete', scope: 'site', allowed: true },
  { id: 19, roleId: 2, resource: 'workflows', action: 'create', scope: 'site', allowed: true },
  { id: 20, roleId: 2, resource: 'workflows', action: 'read', scope: 'site', allowed: true },
  { id: 21, roleId: 2, resource: 'workflows', action: 'update', scope: 'site', allowed: true },
  { id: 22, roleId: 2, resource: 'workflows', action: 'delete', scope: 'site', allowed: true },
  
  // User permissions
  { id: 23, roleId: 3, resource: 'users', action: 'read', scope: 'own', allowed: true },
  { id: 24, roleId: 3, resource: 'users', action: 'update', scope: 'own', allowed: true },
  { id: 25, roleId: 3, resource: 'workflows', action: 'read', scope: 'own', allowed: true },
  { id: 26, roleId: 3, resource: 'workflows', action: 'update', scope: 'own', allowed: true },
  { id: 27, roleId: 3, resource: 'audits', action: 'read', scope: 'own', allowed: true },
  { id: 28, roleId: 3, resource: 'checklists', action: 'read', scope: 'own', allowed: true },
  { id: 29, roleId: 3, resource: 'checklists', action: 'create', scope: 'own', allowed: true },
  { id: 30, roleId: 3, resource: 'dashboard', action: 'read', scope: 'own', allowed: true }
];

// Role-based permission matrix using actual database roles
const getRolePermissions = (roleCode) => {
  const basePermissions = {
    // CEO permissions - full access to all resources
    'CEO': [
      { resource: 'companies', actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
      { resource: 'sites', actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
      { resource: 'workflows', actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
      { resource: 'audits', actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
      { resource: 'analytics', actions: ['read'], scope: 'all' },
      { resource: 'settings', actions: ['read', 'update'], scope: 'all' },
      { resource: 'regulatory-alignment', actions: ['create', 'read', 'update', 'delete'], scope: 'all' }
    ],
    
    // Manager permissions - site-level access
    'MANAGER': [
      { resource: 'sites', actions: ['read', 'update'], scope: 'site' },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'], scope: 'site' },
      { resource: 'workflows', actions: ['create', 'read', 'update', 'delete'], scope: 'site' },
      { resource: 'audits', actions: ['create', 'read', 'update'], scope: 'site' },
      { resource: 'analytics', actions: ['read'], scope: 'site' },
      { resource: 'checklists', actions: ['create', 'read', 'update'], scope: 'site' },
      { resource: 'regulatory-alignment', actions: ['read'], scope: 'site' }
    ],
    
    // User permissions - own data access
    'USER': [
      { resource: 'users', actions: ['read', 'update'], scope: 'own' },
      { resource: 'workflows', actions: ['read', 'update'], scope: 'own' },
      { resource: 'audits', actions: ['read'], scope: 'own' },
      { resource: 'checklists', actions: ['read', 'create'], scope: 'own' },
      { resource: 'dashboard', actions: ['read'], scope: 'own' }
    ]
  };

  return basePermissions[roleCode] || [];
};

export const permissionService = {
  async getAllPermissions() {
    try {
      // Simulate API delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 200));
      return [...mockPermissions];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
      return [];
    }
  },

  async getPermissionsByRole(roleId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      return mockPermissions.filter(p => p.roleId === parseInt(roleId));
    } catch (error) {
      console.error(`Error fetching permissions for role ${roleId}:`, error);
      toast.error('Failed to load role permissions');
      return [];
    }
  },

  async getPermissionsByResource(resource) {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      return mockPermissions.filter(p => p.resource === resource);
    } catch (error) {
      console.error(`Error fetching permissions for resource ${resource}:`, error);
      toast.error('Failed to load resource permissions');
      return [];
    }
  },

  async checkPermission(roleId, resource, action, scope = null) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const permission = mockPermissions.find(p => 
        p.roleId === parseInt(roleId) && 
        p.resource === resource && 
        p.action === action &&
        (scope === null || p.scope === scope)
      );
      
      return permission ? permission.allowed : false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  },

  async createPermission(data) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newPermission = {
        id: Math.max(...mockPermissions.map(p => p.id)) + 1,
        roleId: parseInt(data.roleId),
        resource: data.resource,
        action: data.action,
        scope: data.scope,
        allowed: data.allowed !== false
      };
      
      mockPermissions.push(newPermission);
      toast.success('Permission created successfully');
      return newPermission;
    } catch (error) {
      console.error('Error creating permission:', error);
      toast.error('Failed to create permission');
      return null;
    }
  },

  async updatePermission(id, data) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockPermissions.findIndex(p => p.id === parseInt(id));
      if (index === -1) {
        toast.error('Permission not found');
        return null;
      }
      
      mockPermissions[index] = {
        ...mockPermissions[index],
        ...data,
        id: parseInt(id)
      };
      
      toast.success('Permission updated successfully');
      return mockPermissions[index];
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
      return null;
    }
  },

  async deletePermission(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockPermissions.findIndex(p => p.id === parseInt(id));
      if (index === -1) {
        toast.error('Permission not found');
        return false;
      }
      
      mockPermissions.splice(index, 1);
      toast.success('Permission deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting permission:', error);
      toast.error('Failed to delete permission');
      return false;
    }
  },

  getAvailableResources() {
    return ['companies', 'sites', 'users', 'workflows', 'analytics', 'settings'];
  },

  getAvailableActions() {
    return ['create', 'read', 'update', 'delete'];
  },

  getAvailableScopes() {
    return ['all', 'site', 'own'];
  }
};