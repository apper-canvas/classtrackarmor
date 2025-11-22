import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'enforcement_inspections_c';

/**
 * Get all enforcement inspections with proper field specifications
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
        {"field": {"Name": "inspection_type_c"}},
        {"field": {"Name": "scheduled_date_c"}},
        {"field": {"Name": "actual_date_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "inspector_name_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "compliance_score_c"}},
        {"field": {"Name": "findings_c"}},
        {"field": {"Name": "violations_found_c"}},
        {"field": {"Name": "corrective_actions_required_c"}},
        {"field": {"Name": "follow_up_date_c"}},
        {"field": {"Name": "report_generated_c"}},
        {"field": {"Name": "regulatory_body_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "scheduled_date_c", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch enforcement inspections:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching enforcement inspections:', error?.response?.data?.message || error.message);
    toast.error('Failed to load enforcement inspections');
    return [];
  }
}

/**
 * Get enforcement inspection by ID with all fields
 */
export async function getById(inspectionId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "inspection_type_c"}},
        {"field": {"Name": "scheduled_date_c"}},
        {"field": {"Name": "actual_date_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "inspector_name_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "compliance_score_c"}},
        {"field": {"Name": "findings_c"}},
        {"field": {"Name": "violations_found_c"}},
        {"field": {"Name": "corrective_actions_required_c"}},
        {"field": {"Name": "follow_up_date_c"}},
        {"field": {"Name": "report_generated_c"}},
        {"field": {"Name": "regulatory_body_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, inspectionId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch enforcement inspection with Id: ${inspectionId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching enforcement inspection ${inspectionId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load enforcement inspection');
    return null;
  }
}

/**
 * Create new enforcement inspection - only include Updateable fields
 */
export async function create(inspectionData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = {};
    
    if (inspectionData.Name) recordData.Name = inspectionData.Name;
    if (inspectionData.inspection_type_c) recordData.inspection_type_c = inspectionData.inspection_type_c;
    if (inspectionData.scheduled_date_c) recordData.scheduled_date_c = inspectionData.scheduled_date_c;
    if (inspectionData.actual_date_c) recordData.actual_date_c = inspectionData.actual_date_c;
    if (inspectionData.status_c) recordData.status_c = inspectionData.status_c;
    if (inspectionData.priority_c) recordData.priority_c = inspectionData.priority_c;
    if (inspectionData.inspector_name_c) recordData.inspector_name_c = inspectionData.inspector_name_c;
    if (inspectionData.compliance_score_c !== undefined) recordData.compliance_score_c = parseFloat(inspectionData.compliance_score_c);
    if (inspectionData.findings_c) recordData.findings_c = inspectionData.findings_c;
    if (inspectionData.violations_found_c !== undefined) recordData.violations_found_c = inspectionData.violations_found_c;
    if (inspectionData.corrective_actions_required_c) recordData.corrective_actions_required_c = inspectionData.corrective_actions_required_c;
    if (inspectionData.follow_up_date_c) recordData.follow_up_date_c = inspectionData.follow_up_date_c;
    if (inspectionData.report_generated_c !== undefined) recordData.report_generated_c = inspectionData.report_generated_c;
    if (inspectionData.regulatory_body_c) recordData.regulatory_body_c = inspectionData.regulatory_body_c;
    
    // Handle lookup fields - send only ID values
    if (inspectionData.site_id_c) {
      recordData.site_id_c = inspectionData.site_id_c?.Id || parseInt(inspectionData.site_id_c);
    }

    // Set defaults
    if (!recordData.status_c) recordData.status_c = 'scheduled';
    if (!recordData.priority_c) recordData.priority_c = 'medium';
    if (!recordData.scheduled_date_c) recordData.scheduled_date_c = new Date().toISOString().split('T')[0];

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create enforcement inspection:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} enforcement inspections:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Enforcement inspection created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating enforcement inspection:', error?.response?.data?.message || error.message);
    toast.error('Failed to create enforcement inspection');
    return null;
  }
}

/**
 * Update enforcement inspection - only include Updateable fields
 */
export async function update(inspectionId, inspectionData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = { Id: inspectionId };
    
    if (inspectionData.Name !== undefined) recordData.Name = inspectionData.Name;
    if (inspectionData.inspection_type_c !== undefined) recordData.inspection_type_c = inspectionData.inspection_type_c;
    if (inspectionData.scheduled_date_c !== undefined) recordData.scheduled_date_c = inspectionData.scheduled_date_c;
    if (inspectionData.actual_date_c !== undefined) recordData.actual_date_c = inspectionData.actual_date_c;
    if (inspectionData.status_c !== undefined) recordData.status_c = inspectionData.status_c;
    if (inspectionData.priority_c !== undefined) recordData.priority_c = inspectionData.priority_c;
    if (inspectionData.inspector_name_c !== undefined) recordData.inspector_name_c = inspectionData.inspector_name_c;
    if (inspectionData.compliance_score_c !== undefined) recordData.compliance_score_c = parseFloat(inspectionData.compliance_score_c);
    if (inspectionData.findings_c !== undefined) recordData.findings_c = inspectionData.findings_c;
    if (inspectionData.violations_found_c !== undefined) recordData.violations_found_c = inspectionData.violations_found_c;
    if (inspectionData.corrective_actions_required_c !== undefined) recordData.corrective_actions_required_c = inspectionData.corrective_actions_required_c;
    if (inspectionData.follow_up_date_c !== undefined) recordData.follow_up_date_c = inspectionData.follow_up_date_c;
    if (inspectionData.report_generated_c !== undefined) recordData.report_generated_c = inspectionData.report_generated_c;
    if (inspectionData.regulatory_body_c !== undefined) recordData.regulatory_body_c = inspectionData.regulatory_body_c;
    
    // Handle lookup fields - send only ID values
    if (inspectionData.site_id_c !== undefined) {
      recordData.site_id_c = inspectionData.site_id_c?.Id || parseInt(inspectionData.site_id_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update enforcement inspection:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} enforcement inspections:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Enforcement inspection updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating enforcement inspection:', error?.response?.data?.message || error.message);
    toast.error('Failed to update enforcement inspection');
    return null;
  }
}

/**
 * Delete enforcement inspection by ID
 */
export async function remove(inspectionId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }
    
    const params = {
      RecordIds: [inspectionId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to delete enforcement inspection:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} enforcement inspections:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Enforcement inspection deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting enforcement inspection:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete enforcement inspection');
    return false;
  }
}

/**
 * Get inspections filtered by status
 */
export const getInspectionsByStatus = async (status) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "inspection_type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "scheduled_date_c"}},
        {"field": {"Name": "inspector_name_c"}},
        {"field": {"Name": "site_id_c"}}
      ],
      where: [{
        "FieldName": "status_c",
        "Operator": "EqualTo",
        "Values": [status]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch inspections by status:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching inspections by status:', error);
    return [];
  }
};

export const enforcementInspectionService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getInspectionsByStatus
};