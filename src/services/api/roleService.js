import { toast } from "react-toastify";
import { permissionService } from "./permissionService";
import { getApperClient } from "@/services/apperClient";

const tableName = 'role_c';

export const roleService = {
  /**
   * Get all roles with proper field specifications
   */
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Id_c"}},
          {"field": {"Name": "nameEn_c"}},
          {"field": {"Name": "nameAr_c"}},
          {"field": {"Name": "nameFr_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "scopeLevel_c"}},
          {"field": {"Name": "isSystemRole_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "code_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error('Failed to fetch roles:', response);
        toast.error(response.message);
        return [];
      }
      return response.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error?.response?.data?.message || error);
      toast.error('Failed to load roles');
      return [];
    }
  },

  async getAllPermissions() {
    return await permissionService.getAllPermissions();
  },

  async getRolePermissions(roleId) {
    return await permissionService.getPermissionsByRole(roleId);
  },

  async checkPermission(roleId, resource, action, scope = null) {
    return await permissionService.checkPermission(roleId, resource, action, scope);
  },

  async createPermission(data) {
    return await permissionService.createPermission(data);
  },

  async updatePermission(id, data) {
    return await permissionService.updatePermission(id, data);
  },

  async deletePermission(id) {
    return await permissionService.deletePermission(id);
  },

  getAvailableResources() {
    return permissionService.getAvailableResources();
  },

  getAvailableActions() {
    return permissionService.getAvailableActions();
  },

  getAvailableScopes() {
    return permissionService.getAvailableScopes();
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "nameEn_c"}},
          {"field": {"Name": "nameAr_c"}},
          {"field": {"Name": "nameFr_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "scopeLevel_c"}},
          {"field": {"Name": "isSystemRole_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch role with Id: ${id}:`, response);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching role ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to load role');
      return null;
    }
  },

  async create(roleData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }
      
      // Only include Updateable fields
      const recordData = {};
      
      if (roleData.Name) recordData.Name = roleData.Name;
      if (roleData.nameEn_c) recordData.nameEn_c = roleData.nameEn_c;
      if (roleData.nameAr_c) recordData.nameAr_c = roleData.nameAr_c;
      if (roleData.nameFr_c) recordData.nameFr_c = roleData.nameFr_c;
      if (roleData.code_c) recordData.code_c = roleData.code_c;
      if (roleData.scopeLevel_c) recordData.scopeLevel_c = roleData.scopeLevel_c;
      if (roleData.isSystemRole_c !== undefined) recordData.isSystemRole_c = roleData.isSystemRole_c;

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error('Failed to create role:', response);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} roles:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Role created successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating role:', error?.response?.data?.message || error.message);
      toast.error('Failed to create role');
      return null;
    }
  },

  async update(roleId, roleData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }
      
      // Only include Updateable fields
      const recordData = { Id: roleId };
      
      if (roleData.Name !== undefined) recordData.Name = roleData.Name;
      if (roleData.nameEn_c !== undefined) recordData.nameEn_c = roleData.nameEn_c;
      if (roleData.nameAr_c !== undefined) recordData.nameAr_c = roleData.nameAr_c;
      if (roleData.nameFr_c !== undefined) recordData.nameFr_c = roleData.nameFr_c;
      if (roleData.code_c !== undefined) recordData.code_c = roleData.code_c;
      if (roleData.scopeLevel_c !== undefined) recordData.scopeLevel_c = roleData.scopeLevel_c;
      if (roleData.isSystemRole_c !== undefined) recordData.isSystemRole_c = roleData.isSystemRole_c;

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error('Failed to update role:', response);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} roles:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Role updated successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating role:', error?.response?.data?.message || error.message);
      toast.error('Failed to update role');
      return null;
    }
  },

  async remove(roleId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }
      
      const params = {
        RecordIds: [roleId]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error('Failed to delete role:', response);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} roles:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Role deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting role:', error?.response?.data?.message || error.message);
      toast.error('Failed to delete role');
      return false;
    }
  }
};