import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'haccp_records_c';

/**
 * Get all HACCP records with proper field specifications
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
        {"field": {"Name": "plan_name_c"}},
        {"field": {"Name": "plan_type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "critical_control_points_c"}},
        {"field": {"Name": "monitoring_frequency_c"}},
        {"field": {"Name": "responsible_person_c"}},
        {"field": {"Name": "last_review_date_c"}},
        {"field": {"Name": "next_review_date_c"}},
        {"field": {"Name": "approved_by_c"}},
        {"field": {"Name": "approved_date_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "verification_records_c"}},
        {"field": {"Name": "corrective_actions_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch HACCP records:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching HACCP records:', error?.response?.data?.message || error.message);
    toast.error('Failed to load HACCP records');
    return [];
  }
}

/**
 * Get HACCP record by ID with all fields
 */
export async function getById(recordId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "plan_name_c"}},
        {"field": {"Name": "plan_type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "critical_control_points_c"}},
        {"field": {"Name": "monitoring_frequency_c"}},
        {"field": {"Name": "responsible_person_c"}},
        {"field": {"Name": "last_review_date_c"}},
        {"field": {"Name": "next_review_date_c"}},
        {"field": {"Name": "approved_by_c"}},
        {"field": {"Name": "approved_date_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "verification_records_c"}},
        {"field": {"Name": "corrective_actions_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, recordId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch HACCP record with Id: ${recordId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching HACCP record ${recordId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load HACCP record');
    return null;
  }
}

/**
 * Create new HACCP record - only include Updateable fields
 */
export async function create(recordData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const data = {};
    
    if (recordData.Name) data.Name = recordData.Name;
    if (recordData.plan_name_c) data.plan_name_c = recordData.plan_name_c;
    if (recordData.plan_type_c) data.plan_type_c = recordData.plan_type_c;
    if (recordData.status_c) data.status_c = recordData.status_c;
    if (recordData.description_c) data.description_c = recordData.description_c;
    if (recordData.critical_control_points_c !== undefined) data.critical_control_points_c = parseInt(recordData.critical_control_points_c);
    if (recordData.monitoring_frequency_c) data.monitoring_frequency_c = recordData.monitoring_frequency_c;
    if (recordData.responsible_person_c) data.responsible_person_c = recordData.responsible_person_c;
    if (recordData.last_review_date_c) data.last_review_date_c = recordData.last_review_date_c;
    if (recordData.next_review_date_c) data.next_review_date_c = recordData.next_review_date_c;
    if (recordData.approved_by_c) data.approved_by_c = recordData.approved_by_c;
    if (recordData.approved_date_c) data.approved_date_c = recordData.approved_date_c;
    if (recordData.verification_records_c !== undefined) data.verification_records_c = parseInt(recordData.verification_records_c);
    if (recordData.corrective_actions_c !== undefined) data.corrective_actions_c = parseInt(recordData.corrective_actions_c);
    
    // Handle lookup fields - send only ID values
    if (recordData.site_id_c) {
      data.site_id_c = recordData.site_id_c?.Id || parseInt(recordData.site_id_c);
    }

    // Set defaults
    if (!data.status_c) data.status_c = 'draft';
    if (!data.plan_type_c) data.plan_type_c = 'standard';

    const params = {
      records: [data]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create HACCP record:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} HACCP records:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('HACCP record created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating HACCP record:', error?.response?.data?.message || error.message);
    toast.error('Failed to create HACCP record');
    return null;
  }
}

/**
 * Update HACCP record - only include Updateable fields
 */
export async function update(recordId, recordData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const data = { Id: recordId };
    
    if (recordData.Name !== undefined) data.Name = recordData.Name;
    if (recordData.plan_name_c !== undefined) data.plan_name_c = recordData.plan_name_c;
    if (recordData.plan_type_c !== undefined) data.plan_type_c = recordData.plan_type_c;
    if (recordData.status_c !== undefined) data.status_c = recordData.status_c;
    if (recordData.description_c !== undefined) data.description_c = recordData.description_c;
    if (recordData.critical_control_points_c !== undefined) data.critical_control_points_c = parseInt(recordData.critical_control_points_c);
    if (recordData.monitoring_frequency_c !== undefined) data.monitoring_frequency_c = recordData.monitoring_frequency_c;
    if (recordData.responsible_person_c !== undefined) data.responsible_person_c = recordData.responsible_person_c;
    if (recordData.last_review_date_c !== undefined) data.last_review_date_c = recordData.last_review_date_c;
    if (recordData.next_review_date_c !== undefined) data.next_review_date_c = recordData.next_review_date_c;
    if (recordData.approved_by_c !== undefined) data.approved_by_c = recordData.approved_by_c;
    if (recordData.approved_date_c !== undefined) data.approved_date_c = recordData.approved_date_c;
    if (recordData.verification_records_c !== undefined) data.verification_records_c = parseInt(recordData.verification_records_c);
    if (recordData.corrective_actions_c !== undefined) data.corrective_actions_c = parseInt(recordData.corrective_actions_c);
    
    // Handle lookup fields - send only ID values
    if (recordData.site_id_c !== undefined) {
      data.site_id_c = recordData.site_id_c?.Id || parseInt(recordData.site_id_c);
    }

    const params = {
      records: [data]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update HACCP record:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} HACCP records:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('HACCP record updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating HACCP record:', error?.response?.data?.message || error.message);
    toast.error('Failed to update HACCP record');
    return null;
  }
}

/**
 * Delete HACCP record by ID
 */
export async function remove(recordId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }
    
    const params = {
      RecordIds: [recordId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to delete HACCP record:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} HACCP records:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('HACCP record deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting HACCP record:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete HACCP record');
    return false;
  }
}

export const haccpRecordService = {
  getAll,
  getById,
  create,
  update,
  remove
};