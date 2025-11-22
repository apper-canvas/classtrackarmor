import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const getAllTasks = async () => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return [];
    }

    const response = await apperClient.fetchRecords('tasks_c', {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "assigned_to_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "due_date_c"}},
        {"field": {"Name": "created_date_c"}}
      ]
    });
    
    if (!response.success) {
      console.error('Failed to fetch tasks:', response);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    toast.error('Failed to load tasks');
    return [];
  }
};

export const getTaskById = async (taskId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const response = await apperClient.getRecordById('tasks_c', taskId, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "assigned_to_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "due_date_c"}},
        {"field": {"Name": "created_date_c"}}
      ]
    });
    
    if (!response.success) {
      console.error(`Failed to fetch task ${taskId}:`, response);
      toast.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching task ${taskId}:`, error);
    return null;
  }
};

export const createTask = async (taskData) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }

    const response = await apperClient.createRecord('tasks_c', {
      records: [taskData]
    });
    
    if (!response.success) {
      console.error('Failed to create task:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} tasks:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Task created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating task:', error);
    toast.error('Failed to create task');
    return null;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }

    const response = await apperClient.updateRecord('tasks_c', {
      records: [{ Id: taskId, ...taskData }]
    });
    
    if (!response.success) {
      console.error('Failed to update task:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} tasks:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Task updated successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error updating task:', error);
    toast.error('Failed to update task');
    return false;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }

    const response = await apperClient.deleteRecord('tasks_c', {
      RecordIds: [taskId]
    });
    
    if (!response.success) {
      console.error('Failed to delete task:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} tasks:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Task deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting task:', error);
    toast.error('Failed to delete task');
    return false;
  }
};