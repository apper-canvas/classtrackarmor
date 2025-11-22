import { toast } from "react-toastify";
import { getApperClient } from "@/services/apperClient";

const TABLE_NAME = 'user_c';

/**
 * Get all users with standardized fields
 */
export async function getAll() {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return [];
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "fullNameEn_c"}},
        {"field": {"Name": "fullNameAr_c"}}, 
        {"field": {"Name": "fullNameFr_c"}},
        {"field": {"Name": "preferredLanguage_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "lastLoginAt_c"}},
        {"field": {"Name": "siteId_c"}},
        {"field": {"Name": "roleId_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch users:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching users:', error?.response?.data?.message || error.message);
    toast.error('Failed to load users');
    return [];
  }
}

/**
 * Get user by ID with all fields
 */
export async function getById(userId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "fullNameEn_c"}},
        {"field": {"Name": "fullNameAr_c"}}, 
        {"field": {"Name": "fullNameFr_c"}},
        {"field": {"Name": "preferredLanguage_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "lastLoginAt_c"}},
        {"field": {"Name": "siteId_c"}},
        {"field": {"Name": "roleId_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, userId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch user with Id: ${userId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load user');
    return null;
  }
}

/**
 * Create new user - only include Updateable fields
 */
export async function create(userData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = {};
    
    if (userData.Name) recordData.Name = userData.Name;
    if (userData.email_c) recordData.email_c = userData.email_c;
    if (userData.fullNameEn_c) recordData.fullNameEn_c = userData.fullNameEn_c;
    if (userData.fullNameAr_c) recordData.fullNameAr_c = userData.fullNameAr_c;
    if (userData.fullNameFr_c) recordData.fullNameFr_c = userData.fullNameFr_c;
    if (userData.preferredLanguage_c) recordData.preferredLanguage_c = userData.preferredLanguage_c;
    if (userData.status_c) recordData.status_c = userData.status_c;
    if (userData.lastLoginAt_c) recordData.lastLoginAt_c = userData.lastLoginAt_c;
    
    // Handle lookup fields - send only ID values
    if (userData.siteId_c) {
      recordData.siteId_c = userData.siteId_c?.Id || parseInt(userData.siteId_c);
    }
    if (userData.roleId_c) {
      recordData.roleId_c = userData.roleId_c?.Id || parseInt(userData.roleId_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create user:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} users:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('User created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating user:', error?.response?.data?.message || error.message);
    toast.error('Failed to create user');
    return null;
  }
}

/**
 * Update user - only include Updateable fields
 */
export async function update(userId, userData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = { Id: userId };
    
    if (userData.Name !== undefined) recordData.Name = userData.Name;
    if (userData.email_c !== undefined) recordData.email_c = userData.email_c;
    if (userData.fullNameEn_c !== undefined) recordData.fullNameEn_c = userData.fullNameEn_c;
    if (userData.fullNameAr_c !== undefined) recordData.fullNameAr_c = userData.fullNameAr_c;
    if (userData.fullNameFr_c !== undefined) recordData.fullNameFr_c = userData.fullNameFr_c;
    if (userData.preferredLanguage_c !== undefined) recordData.preferredLanguage_c = userData.preferredLanguage_c;
    if (userData.status_c !== undefined) recordData.status_c = userData.status_c;
    if (userData.lastLoginAt_c !== undefined) recordData.lastLoginAt_c = userData.lastLoginAt_c;
    
    // Handle lookup fields - send only ID values
    if (userData.siteId_c !== undefined) {
      recordData.siteId_c = userData.siteId_c?.Id || parseInt(userData.siteId_c);
    }
    if (userData.roleId_c !== undefined) {
      recordData.roleId_c = userData.roleId_c?.Id || parseInt(userData.roleId_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update user:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} users:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('User updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating user:', error?.response?.data?.message || error.message);
    toast.error('Failed to update user');
    return null;
  }
}

/**
 * Delete user by ID
 */
export async function remove(userId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }
    
    const params = {
      RecordIds: [userId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to delete user:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} users:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('User deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting user:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete user');
    return false;
  }
}

/**
 * Get users filtered by role ID
 */
export const getUsersByRole = async (roleId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "fullNameEn_c"}},
        {"field": {"Name": "roleId_c"}},
        {"field": {"Name": "siteId_c"}},
        {"field": {"Name": "status_c"}}
      ],
      where: [{
        "FieldName": "roleId_c",
        "Operator": "EqualTo",
        "Values": [parseInt(roleId)]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch users by role:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return [];
  }
};

/**
 * Get users filtered by site ID
 */
export const getUsersBySite = async (siteId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "fullNameEn_c"}},
        {"field": {"Name": "roleId_c"}},
        {"field": {"Name": "siteId_c"}},
        {"field": {"Name": "status_c"}}
      ],
      where: [{
        "FieldName": "siteId_c",
        "Operator": "EqualTo",
        "Values": [parseInt(siteId)]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch users by site:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching users by site:', error);
    return [];
  }
};

// Service object export
export const userService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getUsersByRole,
  getUsersBySite
};

// Legacy exports for backward compatibility
export const getAllUsers = getAll;
export const getUserById = getById;
export const createUser = create;
export const updateUser = update;
export const deleteUser = remove;