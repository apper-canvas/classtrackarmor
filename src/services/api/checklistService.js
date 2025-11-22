import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'checklists_c';

/**
 * Get all checklists with proper field specifications
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
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "created_by_c"}},
        {"field": {"Name": "completed_items_c"}},
        {"field": {"Name": "total_items_c"}},
        {"field": {"Name": "completion_percentage_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch checklists:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching checklists:', error?.response?.data?.message || error.message);
    toast.error('Failed to load checklists');
    return [];
  }
}

/**
 * Get checklist by ID with all fields
 */
export async function getById(checklistId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "created_by_c"}},
        {"field": {"Name": "completed_items_c"}},
        {"field": {"Name": "total_items_c"}},
        {"field": {"Name": "completion_percentage_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, checklistId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch checklist with Id: ${checklistId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching checklist ${checklistId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load checklist');
    return null;
  }
}

/**
 * Create new checklist - only include Updateable fields
 */
export async function create(checklistData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = {};
    
    if (checklistData.Name) recordData.Name = checklistData.Name;
    if (checklistData.description_c) recordData.description_c = checklistData.description_c;
    if (checklistData.type_c) recordData.type_c = checklistData.type_c;
    if (checklistData.status_c) recordData.status_c = checklistData.status_c;
    if (checklistData.completed_items_c !== undefined) recordData.completed_items_c = checklistData.completed_items_c;
    if (checklistData.total_items_c !== undefined) recordData.total_items_c = checklistData.total_items_c;
    if (checklistData.completion_percentage_c !== undefined) recordData.completion_percentage_c = checklistData.completion_percentage_c;
    
    // Handle lookup fields - send only ID values
    if (checklistData.site_id_c) {
      recordData.site_id_c = checklistData.site_id_c?.Id || parseInt(checklistData.site_id_c);
    }
    if (checklistData.created_by_c) {
      recordData.created_by_c = checklistData.created_by_c?.Id || parseInt(checklistData.created_by_c);
    }

    // Set defaults
    if (!recordData.status_c) recordData.status_c = 'draft';
    if (recordData.completed_items_c === undefined) recordData.completed_items_c = 0;
    if (recordData.total_items_c === undefined) recordData.total_items_c = 0;
    if (recordData.completion_percentage_c === undefined) recordData.completion_percentage_c = 0;

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create checklist:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} checklists:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Checklist created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating checklist:', error?.response?.data?.message || error.message);
    toast.error('Failed to create checklist');
    return null;
  }
}

/**
 * Update checklist - only include Updateable fields
 */
export async function update(checklistId, checklistData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = { Id: checklistId };
    
    if (checklistData.Name !== undefined) recordData.Name = checklistData.Name;
    if (checklistData.description_c !== undefined) recordData.description_c = checklistData.description_c;
    if (checklistData.type_c !== undefined) recordData.type_c = checklistData.type_c;
    if (checklistData.status_c !== undefined) recordData.status_c = checklistData.status_c;
    if (checklistData.completed_items_c !== undefined) recordData.completed_items_c = checklistData.completed_items_c;
    if (checklistData.total_items_c !== undefined) recordData.total_items_c = checklistData.total_items_c;
    if (checklistData.completion_percentage_c !== undefined) recordData.completion_percentage_c = checklistData.completion_percentage_c;
    
    // Handle lookup fields - send only ID values
    if (checklistData.site_id_c !== undefined) {
      recordData.site_id_c = checklistData.site_id_c?.Id || parseInt(checklistData.site_id_c);
    }
    if (checklistData.created_by_c !== undefined) {
      recordData.created_by_c = checklistData.created_by_c?.Id || parseInt(checklistData.created_by_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update checklist:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} checklists:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Checklist updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating checklist:', error?.response?.data?.message || error.message);
    toast.error('Failed to update checklist');
    return null;
  }
}

/**
 * Delete checklist by ID
 */
export async function remove(checklistId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }
    
    const params = {
      RecordIds: [checklistId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to delete checklist:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} checklists:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Checklist deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting checklist:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete checklist');
    return false;
  }
}

/**
 * Get checklists filtered by site ID
 */
export const getChecklistsBySite = async (siteId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "completion_percentage_c"}},
        {"field": {"Name": "CreatedOn"}}
      ],
      where: [{
        "FieldName": "site_id_c",
        "Operator": "EqualTo",
        "Values": [parseInt(siteId)]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch checklists by site:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching checklists by site:', error);
    return [];
  }
};

export const checklistService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getChecklistsBySite
};