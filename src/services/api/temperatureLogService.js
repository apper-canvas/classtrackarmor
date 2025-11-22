import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'temperature_logs_c';

/**
 * Get all temperature logs with proper field specifications
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
        {"field": {"Name": "device_name_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "temperature_c"}},
        {"field": {"Name": "humidity_c"}},
        {"field": {"Name": "recorded_at_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "alert_threshold_min_c"}},
        {"field": {"Name": "alert_threshold_max_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "recorded_at_c", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch temperature logs:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching temperature logs:', error?.response?.data?.message || error.message);
    toast.error('Failed to load temperature logs');
    return [];
  }
}

/**
 * Get temperature log by ID with all fields
 */
export async function getById(logId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "device_name_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "temperature_c"}},
        {"field": {"Name": "humidity_c"}},
        {"field": {"Name": "recorded_at_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "alert_threshold_min_c"}},
        {"field": {"Name": "alert_threshold_max_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, logId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch temperature log with Id: ${logId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching temperature log ${logId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load temperature log');
    return null;
  }
}

/**
 * Create new temperature log - only include Updateable fields
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
    if (logData.device_name_c) recordData.device_name_c = logData.device_name_c;
    if (logData.location_c) recordData.location_c = logData.location_c;
    if (logData.temperature_c !== undefined) recordData.temperature_c = parseFloat(logData.temperature_c);
    if (logData.humidity_c !== undefined) recordData.humidity_c = parseFloat(logData.humidity_c);
    if (logData.recorded_at_c) recordData.recorded_at_c = logData.recorded_at_c;
    if (logData.status_c) recordData.status_c = logData.status_c;
    if (logData.alert_threshold_min_c !== undefined) recordData.alert_threshold_min_c = parseFloat(logData.alert_threshold_min_c);
    if (logData.alert_threshold_max_c !== undefined) recordData.alert_threshold_max_c = parseFloat(logData.alert_threshold_max_c);
    if (logData.notes_c) recordData.notes_c = logData.notes_c;
    
    // Handle lookup fields - send only ID values
    if (logData.site_id_c) {
      recordData.site_id_c = logData.site_id_c?.Id || parseInt(logData.site_id_c);
    }

    // Set defaults
    if (!recordData.status_c) recordData.status_c = 'normal';
    if (!recordData.recorded_at_c) recordData.recorded_at_c = new Date().toISOString();

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create temperature log:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} temperature logs:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Temperature log created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating temperature log:', error?.response?.data?.message || error.message);
    toast.error('Failed to create temperature log');
    return null;
  }
}

/**
 * Update temperature log - only include Updateable fields
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
    if (logData.device_name_c !== undefined) recordData.device_name_c = logData.device_name_c;
    if (logData.location_c !== undefined) recordData.location_c = logData.location_c;
    if (logData.temperature_c !== undefined) recordData.temperature_c = parseFloat(logData.temperature_c);
    if (logData.humidity_c !== undefined) recordData.humidity_c = parseFloat(logData.humidity_c);
    if (logData.recorded_at_c !== undefined) recordData.recorded_at_c = logData.recorded_at_c;
    if (logData.status_c !== undefined) recordData.status_c = logData.status_c;
    if (logData.alert_threshold_min_c !== undefined) recordData.alert_threshold_min_c = parseFloat(logData.alert_threshold_min_c);
    if (logData.alert_threshold_max_c !== undefined) recordData.alert_threshold_max_c = parseFloat(logData.alert_threshold_max_c);
    if (logData.notes_c !== undefined) recordData.notes_c = logData.notes_c;
    
    // Handle lookup fields - send only ID values
    if (logData.site_id_c !== undefined) {
      recordData.site_id_c = logData.site_id_c?.Id || parseInt(logData.site_id_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update temperature log:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} temperature logs:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Temperature log updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating temperature log:', error?.response?.data?.message || error.message);
    toast.error('Failed to update temperature log');
    return null;
  }
}

/**
 * Delete temperature log by ID
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
      console.error('Failed to delete temperature log:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} temperature logs:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Temperature log deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting temperature log:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete temperature log');
    return false;
  }
}

/**
 * Get temperature logs filtered by site ID
 */
export const getLogsBySite = async (siteId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "device_name_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "temperature_c"}},
        {"field": {"Name": "recorded_at_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "site_id_c"}}
      ],
      where: [{
        "FieldName": "site_id_c",
        "Operator": "EqualTo",
        "Values": [parseInt(siteId)]
      }],
      orderBy: [{"fieldName": "recorded_at_c", "sorttype": "DESC"}]
    });
    
    if (!response.success) {
      console.error('Failed to fetch temperature logs by site:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching temperature logs by site:', error);
    return [];
  }
};

/**
 * Get temperature logs with alerts (outside thresholds)
 */
export const getLogsWithAlerts = async (siteId = null) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const whereConditions = [{
      "FieldName": "status_c",
      "Operator": "NotEqualTo",
      "Values": ["normal"]
    }];

    if (siteId) {
      whereConditions.push({
        "FieldName": "site_id_c",
        "Operator": "EqualTo",
        "Values": [parseInt(siteId)]
      });
    }

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "device_name_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "temperature_c"}},
        {"field": {"Name": "recorded_at_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "site_id_c"}}
      ],
      where: whereConditions,
      orderBy: [{"fieldName": "recorded_at_c", "sorttype": "DESC"}]
    });
    
    if (!response.success) {
      console.error('Failed to fetch temperature alerts:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching temperature alerts:', error);
    return [];
  }
};

export const temperatureLogService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getLogsBySite,
  getLogsWithAlerts
};