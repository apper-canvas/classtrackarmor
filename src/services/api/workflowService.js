import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'workflow_c';

class WorkflowService {
  constructor() {
    this.apperClient = null;
  }

  async getApperClient() {
    if (!this.apperClient) {
      this.apperClient = await getApperClient();
    }
    return this.apperClient;
  }

  async getAll() {
    try {
      const apperClient = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "siteId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completionPercentage_c"}},
          {"field": {"Name": "stepsCompleted_c"}},
          {"field": {"Name": "totalSteps_c"}},
          {"field": {"Name": "approvalRequired_c"}},
          {"field": {"Name": "approvedBy_c"}},
          {"field": {"Name": "createdBy_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Failed to fetch workflows:', response);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching workflows:', error?.response?.data?.message || error.message);
      toast.error('Failed to load workflows');
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "siteId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completionPercentage_c"}},
          {"field": {"Name": "stepsCompleted_c"}},
          {"field": {"Name": "totalSteps_c"}},
          {"field": {"Name": "approvalRequired_c"}},
          {"field": {"Name": "approvedBy_c"}},
          {"field": {"Name": "createdBy_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch workflow with Id: ${id}:`, response);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching workflow ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to load workflow');
      return null;
    }
  }

  async create(workflowData) {
    try {
      const apperClient = await this.getApperClient();
      
      const recordData = {};
      
      if (workflowData.Name) recordData.Name = workflowData.Name;
      if (workflowData.name) recordData.Name = workflowData.name;
      if (workflowData.description_c) recordData.description_c = workflowData.description_c;
      if (workflowData.description) recordData.description_c = workflowData.description;
      if (workflowData.type_c) recordData.type_c = workflowData.type_c;
      if (workflowData.type) recordData.type_c = workflowData.type;
      if (workflowData.status_c) recordData.status_c = workflowData.status_c;
      if (workflowData.priority_c) recordData.priority_c = workflowData.priority_c;
      if (workflowData.priority) recordData.priority_c = workflowData.priority;
      if (workflowData.dueDate_c) recordData.dueDate_c = workflowData.dueDate_c;
      if (workflowData.dueDate) recordData.dueDate_c = workflowData.dueDate;
      if (workflowData.completionPercentage_c !== undefined) recordData.completionPercentage_c = workflowData.completionPercentage_c;
      if (workflowData.stepsCompleted_c !== undefined) recordData.stepsCompleted_c = workflowData.stepsCompleted_c;
      if (workflowData.totalSteps_c !== undefined) recordData.totalSteps_c = workflowData.totalSteps_c;
      if (workflowData.totalSteps !== undefined) recordData.totalSteps_c = workflowData.totalSteps;
      if (workflowData.approvalRequired_c !== undefined) recordData.approvalRequired_c = workflowData.approvalRequired_c;
      if (workflowData.approvalRequired !== undefined) recordData.approvalRequired_c = workflowData.approvalRequired;
      
      // Handle lookup fields - send only ID values
      if (workflowData.assignedTo_c) {
        recordData.assignedTo_c = workflowData.assignedTo_c?.Id || parseInt(workflowData.assignedTo_c);
      }
      if (workflowData.siteId_c) {
        recordData.siteId_c = workflowData.siteId_c?.Id || parseInt(workflowData.siteId_c);
      }
      if (workflowData.siteId) {
        recordData.siteId_c = parseInt(workflowData.siteId);
      }
      if (workflowData.approvedBy_c) {
        recordData.approvedBy_c = workflowData.approvedBy_c?.Id || parseInt(workflowData.approvedBy_c);
      }
      if (workflowData.createdBy_c) {
        recordData.createdBy_c = workflowData.createdBy_c?.Id || parseInt(workflowData.createdBy_c);
      }

      // Set default values
      if (!recordData.status_c) recordData.status_c = 'draft';
      if (!recordData.completionPercentage_c) recordData.completionPercentage_c = 0;
      if (!recordData.stepsCompleted_c) recordData.stepsCompleted_c = 0;
      if (!recordData.totalSteps_c) recordData.totalSteps_c = 1;
      if (recordData.approvalRequired_c === undefined) recordData.approvalRequired_c = false;

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Failed to create workflow:', response);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} workflows:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Workflow created successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating workflow:', error?.response?.data?.message || error.message);
      toast.error('Failed to create workflow');
      return null;
    }
  }

  async update(id, workflowData) {
    try {
      const apperClient = await this.getApperClient();
      
      const recordData = { Id: id };
      
      if (workflowData.Name !== undefined) recordData.Name = workflowData.Name;
      if (workflowData.name !== undefined) recordData.Name = workflowData.name;
      if (workflowData.description_c !== undefined) recordData.description_c = workflowData.description_c;
      if (workflowData.description !== undefined) recordData.description_c = workflowData.description;
      if (workflowData.type_c !== undefined) recordData.type_c = workflowData.type_c;
      if (workflowData.type !== undefined) recordData.type_c = workflowData.type;
      if (workflowData.status_c !== undefined) recordData.status_c = workflowData.status_c;
      if (workflowData.status !== undefined) recordData.status_c = workflowData.status;
      if (workflowData.priority_c !== undefined) recordData.priority_c = workflowData.priority_c;
      if (workflowData.priority !== undefined) recordData.priority_c = workflowData.priority;
      if (workflowData.dueDate_c !== undefined) recordData.dueDate_c = workflowData.dueDate_c;
      if (workflowData.dueDate !== undefined) recordData.dueDate_c = workflowData.dueDate;
      if (workflowData.completionPercentage_c !== undefined) recordData.completionPercentage_c = workflowData.completionPercentage_c;
      if (workflowData.stepsCompleted_c !== undefined) recordData.stepsCompleted_c = workflowData.stepsCompleted_c;
      if (workflowData.totalSteps_c !== undefined) recordData.totalSteps_c = workflowData.totalSteps_c;
      if (workflowData.approvalRequired_c !== undefined) recordData.approvalRequired_c = workflowData.approvalRequired_c;
      
      // Handle lookup fields - send only ID values
      if (workflowData.assignedTo_c !== undefined) {
        recordData.assignedTo_c = workflowData.assignedTo_c?.Id || parseInt(workflowData.assignedTo_c);
      }
      if (workflowData.siteId_c !== undefined) {
        recordData.siteId_c = workflowData.siteId_c?.Id || parseInt(workflowData.siteId_c);
      }
      if (workflowData.approvedBy_c !== undefined) {
        recordData.approvedBy_c = workflowData.approvedBy_c?.Id || parseInt(workflowData.approvedBy_c);
      }
      if (workflowData.createdBy_c !== undefined) {
        recordData.createdBy_c = workflowData.createdBy_c?.Id || parseInt(workflowData.createdBy_c);
      }

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Failed to update workflow:', response);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} workflows:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Workflow updated successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating workflow:', error?.response?.data?.message || error.message);
      toast.error('Failed to update workflow');
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = await this.getApperClient();
      
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Failed to delete workflow:', response);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} workflows:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Workflow deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting workflow:', error?.response?.data?.message || error.message);
      toast.error('Failed to delete workflow');
      return false;
    }
  }

  async updateStatus(id, status) {
    try {
      return await this.update(id, { status_c: status });
    } catch (error) {
      console.error(`Error updating workflow status ${id}:`, error);
      toast.error('Error updating workflow status');
      return null;
    }
  }

  async updateProgress(id, stepsCompleted, totalSteps) {
    try {
      const completionPercentage = Math.round((stepsCompleted / totalSteps) * 100);
      return await this.update(id, { 
        stepsCompleted_c: stepsCompleted,
        totalSteps_c: totalSteps,
        completionPercentage_c: completionPercentage
      });
    } catch (error) {
      console.error(`Error updating workflow progress ${id}:`, error);
      toast.error('Error updating workflow progress');
      return null;
    }
  }

  async getBySiteId(siteId) {
    try {
      const apperClient = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "siteId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completionPercentage_c"}},
          {"field": {"Name": "stepsCompleted_c"}},
          {"field": {"Name": "totalSteps_c"}},
          {"field": {"Name": "approvalRequired_c"}},
          {"field": {"Name": "approvedBy_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{"FieldName": "siteId_c", "Operator": "EqualTo", "Values": [parseInt(siteId)]}]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Failed to fetch workflows for site ${siteId}:`, response);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching workflows for site ${siteId}:`, error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const apperClient = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "siteId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completionPercentage_c"}},
          {"field": {"Name": "stepsCompleted_c"}},
          {"field": {"Name": "totalSteps_c"}},
          {"field": {"Name": "approvalRequired_c"}},
          {"field": {"Name": "approvedBy_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(`Failed to fetch workflows with status ${status}:`, response);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching workflows with status ${status}:`, error);
      return [];
    }
  }

  async getPendingApprovals() {
    try {
      const apperClient = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "siteId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completionPercentage_c"}},
          {"field": {"Name": "stepsCompleted_c"}},
          {"field": {"Name": "totalSteps_c"}},
          {"field": {"Name": "approvalRequired_c"}},
          {"field": {"Name": "approvedBy_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "status_c", "operator": "EqualTo", "values": ["pending_approval"]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "approvalRequired_c", "operator": "EqualTo", "values": [true]},
                {"fieldName": "approvedBy_c", "operator": "DoesNotHaveValue", "values": [""]}
              ]
            }
          ]
        }]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Failed to fetch pending approvals:', response);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      return [];
    }
  }

  async assignWorkflow(id, assigneeId) {
    try {
      return await this.update(id, { assignedTo_c: parseInt(assigneeId) });
    } catch (error) {
      console.error(`Error assigning workflow ${id}:`, error);
      toast.error('Error assigning workflow');
      return null;
    }
  }

  // Additional workflow-specific methods
  async start(id, userId) {
    return await this.update(id, { status_c: 'in_progress' });
  }

  async complete(id, completionData) {
    const updateData = { 
      status_c: 'completed',
      completionPercentage_c: 100
    };
    return await this.update(id, updateData);
  }

  async approve(id, userId) {
    return await this.update(id, { 
      status_c: 'completed',
      approvedBy_c: parseInt(userId)
    });
  }

  async reject(id, userId, reason) {
    return await this.update(id, { 
      status_c: 'draft'
    });
  }

  async getStats() {
    try {
      const workflows = await this.getAll();
      return {
        total: workflows.length,
        draft: workflows.filter(w => w.status_c === 'draft').length,
        inProgress: workflows.filter(w => w.status_c === 'in_progress').length,
        completed: workflows.filter(w => w.status_c === 'completed').length,
        pendingApproval: workflows.filter(w => w.status_c === 'pending_approval').length
      };
    } catch (error) {
      console.error('Error fetching workflow stats:', error);
      return {
        total: 0,
        draft: 0,
        inProgress: 0,
        completed: 0,
        pendingApproval: 0
      };
    }
  }
}

export const workflowService = new WorkflowService();