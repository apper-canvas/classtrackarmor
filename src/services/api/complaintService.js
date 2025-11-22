import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'complaints_c';

/**
 * Get all complaints with proper field specifications
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
        {"field": {"Name": "complaint_type_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "complainant_name_c"}},
        {"field": {"Name": "complainant_contact_c"}},
        {"field": {"Name": "product_involved_c"}},
        {"field": {"Name": "incident_date_c"}},
        {"field": {"Name": "resolution_c"}},
        {"field": {"Name": "assigned_to_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch complaints:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching complaints:', error?.response?.data?.message || error.message);
    toast.error('Failed to load complaints');
    return [];
  }
}

/**
 * Get complaint by ID with all fields
 */
export async function getById(complaintId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "complaint_type_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "complainant_name_c"}},
        {"field": {"Name": "complainant_contact_c"}},
        {"field": {"Name": "product_involved_c"}},
        {"field": {"Name": "incident_date_c"}},
        {"field": {"Name": "resolution_c"}},
        {"field": {"Name": "assigned_to_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, complaintId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch complaint with Id: ${complaintId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching complaint ${complaintId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load complaint');
    return null;
  }
}

/**
 * Create new complaint - only include Updateable fields
 */
export async function create(complaintData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = {};
    
    if (complaintData.Name) recordData.Name = complaintData.Name;
    if (complaintData.complaint_type_c) recordData.complaint_type_c = complaintData.complaint_type_c;
    if (complaintData.description_c) recordData.description_c = complaintData.description_c;
    if (complaintData.status_c) recordData.status_c = complaintData.status_c;
    if (complaintData.priority_c) recordData.priority_c = complaintData.priority_c;
    if (complaintData.complainant_name_c) recordData.complainant_name_c = complaintData.complainant_name_c;
    if (complaintData.complainant_contact_c) recordData.complainant_contact_c = complaintData.complainant_contact_c;
    if (complaintData.product_involved_c) recordData.product_involved_c = complaintData.product_involved_c;
    if (complaintData.incident_date_c) recordData.incident_date_c = complaintData.incident_date_c;
    if (complaintData.resolution_c) recordData.resolution_c = complaintData.resolution_c;
    
    // Handle lookup fields - send only ID values
    if (complaintData.site_id_c) {
      recordData.site_id_c = complaintData.site_id_c?.Id || parseInt(complaintData.site_id_c);
    }
    if (complaintData.assigned_to_c) {
      recordData.assigned_to_c = complaintData.assigned_to_c?.Id || parseInt(complaintData.assigned_to_c);
    }

    // Set defaults
    if (!recordData.status_c) recordData.status_c = 'open';
    if (!recordData.priority_c) recordData.priority_c = 'medium';
    if (!recordData.incident_date_c) recordData.incident_date_c = new Date().toISOString().split('T')[0];

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create complaint:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} complaints:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Complaint created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating complaint:', error?.response?.data?.message || error.message);
    toast.error('Failed to create complaint');
    return null;
  }
}

/**
 * Update complaint - only include Updateable fields
 */
export async function update(complaintId, complaintData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = { Id: complaintId };
    
    if (complaintData.Name !== undefined) recordData.Name = complaintData.Name;
    if (complaintData.complaint_type_c !== undefined) recordData.complaint_type_c = complaintData.complaint_type_c;
    if (complaintData.description_c !== undefined) recordData.description_c = complaintData.description_c;
    if (complaintData.status_c !== undefined) recordData.status_c = complaintData.status_c;
    if (complaintData.priority_c !== undefined) recordData.priority_c = complaintData.priority_c;
    if (complaintData.complainant_name_c !== undefined) recordData.complainant_name_c = complaintData.complainant_name_c;
    if (complaintData.complainant_contact_c !== undefined) recordData.complainant_contact_c = complaintData.complainant_contact_c;
    if (complaintData.product_involved_c !== undefined) recordData.product_involved_c = complaintData.product_involved_c;
    if (complaintData.incident_date_c !== undefined) recordData.incident_date_c = complaintData.incident_date_c;
    if (complaintData.resolution_c !== undefined) recordData.resolution_c = complaintData.resolution_c;
    
    // Handle lookup fields - send only ID values
    if (complaintData.site_id_c !== undefined) {
      recordData.site_id_c = complaintData.site_id_c?.Id || parseInt(complaintData.site_id_c);
    }
    if (complaintData.assigned_to_c !== undefined) {
      recordData.assigned_to_c = complaintData.assigned_to_c?.Id || parseInt(complaintData.assigned_to_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update complaint:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} complaints:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Complaint updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating complaint:', error?.response?.data?.message || error.message);
    toast.error('Failed to update complaint');
    return null;
  }
}

/**
 * Delete complaint by ID
 */
export async function remove(complaintId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }
    
    const params = {
      RecordIds: [complaintId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to delete complaint:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} complaints:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Complaint deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting complaint:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete complaint');
    return false;
  }
}

/**
 * Get complaints filtered by type
 */
export const getComplaintsByType = async (complaintType) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "complaint_type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "incident_date_c"}},
        {"field": {"Name": "site_id_c"}}
      ],
      where: [{
        "FieldName": "complaint_type_c",
        "Operator": "EqualTo",
        "Values": [complaintType]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch complaints by type:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching complaints by type:', error);
    return [];
  }
};

/**
 * Get complaints filtered by site ID
 */
export const getComplaintsBySite = async (siteId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "complaint_type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "incident_date_c"}},
        {"field": {"Name": "site_id_c"}}
      ],
      where: [{
        "FieldName": "site_id_c",
        "Operator": "EqualTo",
        "Values": [parseInt(siteId)]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch complaints by site:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching complaints by site:', error);
    return [];
  }
};

export const complaintService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getComplaintsByType,
  getComplaintsBySite
};