import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'maintenance_logs_c';

/**
 * Get all maintenance logs with proper field specifications
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
        {"field": {"Name": "equipment_name_c"}},
        {"field": {"Name": "maintenance_type_c"}},
        {"field": {"Name": "scheduled_date_c"}},
        {"field": {"Name": "completed_date_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "technician_name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "parts_used_c"}},
        {"field": {"Name": "cost_c"}},
        {"field": {"Name": "downtime_hours_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "next_maintenance_date_c"}},
        {"field": {"Name": "safety_notes_c"}},
        {"field": {"Name": "performance_impact_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch maintenance logs:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching maintenance logs:', error?.response?.data?.message || error.message);
    toast.error('Failed to load maintenance logs');
    return [];
  }
}

/**
 * Get maintenance log by ID with all fields
 */
export async function getById(logId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "equipment_name_c"}},
        {"field": {"Name": "maintenance_type_c"}},
        {"field": {"Name": "scheduled_date_c"}},
        {"field": {"Name": "completed_date_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "technician_name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "parts_used_c"}},
        {"field": {"Name": "cost_c"}},
        {"field": {"Name": "downtime_hours_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "next_maintenance_date_c"}},
        {"field": {"Name": "safety_notes_c"}},
        {"field": {"Name": "performance_impact_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, logId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch maintenance log with Id: ${logId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching maintenance log ${logId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load maintenance log');
    return null;
  }
}

/**
 * Create new maintenance log - only include Updateable fields
 */
export async function create(logData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = {};
    
    if (logData.Name) recordData.Name = logData.Name;
    if (logData.equipment_name_c) recordData.equipment_name_c = logData.equipment_name_c;
    if (logData.maintenance_type_c) recordData.maintenance_type_c = logData.maintenance_type_c;
    if (logData.scheduled_date_c) recordData.scheduled_date_c = logData.scheduled_date_c;
    if (logData.completed_date_c) recordData.completed_date_c = logData.completed_date_c;
    if (logData.status_c) recordData.status_c = logData.status_c;
    if (logData.priority_c) recordData.priority_c = logData.priority_c;
    if (logData.technician_name_c) recordData.technician_name_c = logData.technician_name_c;
    if (logData.description_c) recordData.description_c = logData.description_c;
    if (logData.parts_used_c) recordData.parts_used_c = logData.parts_used_c;
    if (logData.cost_c !== undefined) recordData.cost_c = parseFloat(logData.cost_c);
    if (logData.downtime_hours_c !== undefined) recordData.downtime_hours_c = parseFloat(logData.downtime_hours_c);
    if (logData.next_maintenance_date_c) recordData.next_maintenance_date_c = logData.next_maintenance_date_c;
    if (logData.safety_notes_c) recordData.safety_notes_c = logData.safety_notes_c;
    if (logData.performance_impact_c) recordData.performance_impact_c = logData.performance_impact_c;
    
    // Handle lookup fields - send only ID values
    if (logData.site_id_c) {
      recordData.site_id_c = logData.site_id_c?.Id || parseInt(logData.site_id_c);
    }

    // Set defaults
    if (!recordData.status_c) recordData.status_c = 'scheduled';
    if (!recordData.priority_c) recordData.priority_c = 'medium';
    if (!recordData.maintenance_type_c) recordData.maintenance_type_c = 'preventive';
    if (!recordData.scheduled_date_c) recordData.scheduled_date_c = new Date().toISOString().split('T')[0];

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create maintenance log:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} maintenance logs:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Maintenance log created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating maintenance log:', error?.response?.data?.message || error.message);
    toast.error('Failed to create maintenance log');
    return null;
  }
}

/**
 * Update maintenance log - only include Updateable fields
 */
export async function update(logId, logData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = { Id: logId };
    
    if (logData.Name !== undefined) recordData.Name = logData.Name;
    if (logData.equipment_name_c !== undefined) recordData.equipment_name_c = logData.equipment_name_c;
    if (logData.maintenance_type_c !== undefined) recordData.maintenance_type_c = logData.maintenance_type_c;
    if (logData.scheduled_date_c !== undefined) recordData.scheduled_date_c = logData.scheduled_date_c;
    if (logData.completed_date_c !== undefined) recordData.completed_date_c = logData.completed_date_c;
    if (logData.status_c !== undefined) recordData.status_c = logData.status_c;
    if (logData.priority_c !== undefined) recordData.priority_c = logData.priority_c;
    if (logData.technician_name_c !== undefined) recordData.technician_name_c = logData.technician_name_c;
    if (logData.description_c !== undefined) recordData.description_c = logData.description_c;
    if (logData.parts_used_c !== undefined) recordData.parts_used_c = logData.parts_used_c;
    if (logData.cost_c !== undefined) recordData.cost_c = parseFloat(logData.cost_c);
    if (logData.downtime_hours_c !== undefined) recordData.downtime_hours_c = parseFloat(logData.downtime_hours_c);
    if (logData.next_maintenance_date_c !== undefined) recordData.next_maintenance_date_c = logData.next_maintenance_date_c;
    if (logData.safety_notes_c !== undefined) recordData.safety_notes_c = logData.safety_notes_c;
    if (logData.performance_impact_c !== undefined) recordData.performance_impact_c = logData.performance_impact_c;
    
    // Handle lookup fields - send only ID values
    if (logData.site_id_c !== undefined) {
      recordData.site_id_c = logData.site_id_c?.Id || parseInt(logData.site_id_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update maintenance log:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} maintenance logs:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Maintenance log updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating maintenance log:', error?.response?.data?.message || error.message);
    toast.error('Failed to update maintenance log');
    return null;
  }
}

/**
 * Delete maintenance log by ID
 */
export async function remove(logId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }
    
    const params = {
      RecordIds: [logId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to delete maintenance log:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} maintenance logs:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Maintenance log deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting maintenance log:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete maintenance log');
    return false;
  }
}

/**
 * Get maintenance logs filtered by equipment
 */
export const getLogsByEquipment = async (equipmentName) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "equipment_name_c"}},
        {"field": {"Name": "maintenance_type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "scheduled_date_c"}},
        {"field": {"Name": "technician_name_c"}},
        {"field": {"Name": "site_id_c"}}
      ],
      where: [{
        "FieldName": "equipment_name_c",
        "Operator": "Contains",
        "Values": [equipmentName]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch logs by equipment:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching logs by equipment:', error);
    return [];
  }
};

export const maintenanceLogService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getLogsByEquipment
};