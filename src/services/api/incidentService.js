import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'incidents_c';

/**
 * Get all incidents with proper field specifications
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
        {"field": {"Name": "incident_type_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "severity_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "incident_date_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "reported_by_c"}},
        {"field": {"Name": "assigned_to_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "injury_type_c"}},
        {"field": {"Name": "witness_count_c"}},
        {"field": {"Name": "immediate_actions_c"}},
        {"field": {"Name": "investigation_status_c"}},
        {"field": {"Name": "corrective_actions_c"}},
        {"field": {"Name": "follow_up_required_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch incidents:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching incidents:', error?.response?.data?.message || error.message);
    toast.error('Failed to load incidents');
    return [];
  }
}

/**
 * Get incident by ID with all fields
 */
export async function getById(incidentId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "incident_type_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "severity_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "incident_date_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "reported_by_c"}},
        {"field": {"Name": "assigned_to_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "injury_type_c"}},
        {"field": {"Name": "witness_count_c"}},
        {"field": {"Name": "immediate_actions_c"}},
        {"field": {"Name": "investigation_status_c"}},
        {"field": {"Name": "corrective_actions_c"}},
        {"field": {"Name": "follow_up_required_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, incidentId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch incident with Id: ${incidentId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching incident ${incidentId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load incident');
    return null;
  }
}

/**
 * Create new incident - only include Updateable fields
 */
export async function create(incidentData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = {};
    
    if (incidentData.Name) recordData.Name = incidentData.Name;
    if (incidentData.incident_type_c) recordData.incident_type_c = incidentData.incident_type_c;
    if (incidentData.description_c) recordData.description_c = incidentData.description_c;
    if (incidentData.severity_c) recordData.severity_c = incidentData.severity_c;
    if (incidentData.status_c) recordData.status_c = incidentData.status_c;
    if (incidentData.incident_date_c) recordData.incident_date_c = incidentData.incident_date_c;
    if (incidentData.location_c) recordData.location_c = incidentData.location_c;
    if (incidentData.reported_by_c) recordData.reported_by_c = incidentData.reported_by_c;
    if (incidentData.injury_type_c) recordData.injury_type_c = incidentData.injury_type_c;
    if (incidentData.witness_count_c !== undefined) recordData.witness_count_c = parseInt(incidentData.witness_count_c);
    if (incidentData.immediate_actions_c) recordData.immediate_actions_c = incidentData.immediate_actions_c;
    if (incidentData.investigation_status_c) recordData.investigation_status_c = incidentData.investigation_status_c;
    if (incidentData.corrective_actions_c) recordData.corrective_actions_c = incidentData.corrective_actions_c;
    if (incidentData.follow_up_required_c !== undefined) recordData.follow_up_required_c = incidentData.follow_up_required_c;
    
    // Handle lookup fields - send only ID values
    if (incidentData.assigned_to_c) {
      recordData.assigned_to_c = incidentData.assigned_to_c?.Id || parseInt(incidentData.assigned_to_c);
    }
    if (incidentData.site_id_c) {
      recordData.site_id_c = incidentData.site_id_c?.Id || parseInt(incidentData.site_id_c);
    }

    // Set defaults
    if (!recordData.status_c) recordData.status_c = 'open';
    if (!recordData.severity_c) recordData.severity_c = 'medium';
    if (!recordData.investigation_status_c) recordData.investigation_status_c = 'pending';
    if (!recordData.incident_date_c) recordData.incident_date_c = new Date().toISOString().split('T')[0];

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create incident:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} incidents:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Incident created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating incident:', error?.response?.data?.message || error.message);
    toast.error('Failed to create incident');
    return null;
  }
}

/**
 * Update incident - only include Updateable fields
 */
export async function update(incidentId, incidentData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = { Id: incidentId };
    
    if (incidentData.Name !== undefined) recordData.Name = incidentData.Name;
    if (incidentData.incident_type_c !== undefined) recordData.incident_type_c = incidentData.incident_type_c;
    if (incidentData.description_c !== undefined) recordData.description_c = incidentData.description_c;
    if (incidentData.severity_c !== undefined) recordData.severity_c = incidentData.severity_c;
    if (incidentData.status_c !== undefined) recordData.status_c = incidentData.status_c;
    if (incidentData.incident_date_c !== undefined) recordData.incident_date_c = incidentData.incident_date_c;
    if (incidentData.location_c !== undefined) recordData.location_c = incidentData.location_c;
    if (incidentData.reported_by_c !== undefined) recordData.reported_by_c = incidentData.reported_by_c;
    if (incidentData.injury_type_c !== undefined) recordData.injury_type_c = incidentData.injury_type_c;
    if (incidentData.witness_count_c !== undefined) recordData.witness_count_c = parseInt(incidentData.witness_count_c);
    if (incidentData.immediate_actions_c !== undefined) recordData.immediate_actions_c = incidentData.immediate_actions_c;
    if (incidentData.investigation_status_c !== undefined) recordData.investigation_status_c = incidentData.investigation_status_c;
    if (incidentData.corrective_actions_c !== undefined) recordData.corrective_actions_c = incidentData.corrective_actions_c;
    if (incidentData.follow_up_required_c !== undefined) recordData.follow_up_required_c = incidentData.follow_up_required_c;
    
    // Handle lookup fields - send only ID values
    if (incidentData.assigned_to_c !== undefined) {
      recordData.assigned_to_c = incidentData.assigned_to_c?.Id || parseInt(incidentData.assigned_to_c);
    }
    if (incidentData.site_id_c !== undefined) {
      recordData.site_id_c = incidentData.site_id_c?.Id || parseInt(incidentData.site_id_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update incident:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} incidents:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Incident updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating incident:', error?.response?.data?.message || error.message);
    toast.error('Failed to update incident');
    return null;
  }
}

/**
 * Delete incident by ID
 */
export async function remove(incidentId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }
    
    const params = {
      RecordIds: [incidentId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to delete incident:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} incidents:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Incident deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting incident:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete incident');
    return false;
  }
}

/**
 * Get incidents filtered by severity
 */
export const getIncidentsBySeverity = async (severity) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "incident_type_c"}},
        {"field": {"Name": "severity_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "incident_date_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "site_id_c"}}
      ],
      where: [{
        "FieldName": "severity_c",
        "Operator": "EqualTo",
        "Values": [severity]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch incidents by severity:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching incidents by severity:', error);
    return [];
  }
};

/**
 * Get incidents filtered by site ID
 */
export const getIncidentsBySite = async (siteId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "incident_type_c"}},
        {"field": {"Name": "severity_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "incident_date_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "site_id_c"}}
      ],
      where: [{
        "FieldName": "site_id_c",
        "Operator": "EqualTo",
        "Values": [parseInt(siteId)]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch incidents by site:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching incidents by site:', error);
    return [];
  }
};

export const incidentService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getIncidentsBySeverity,
  getIncidentsBySite
};