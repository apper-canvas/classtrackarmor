import { toast } from "react-toastify";
import { getApperClient } from "@/services/apperClient";

export const getAllAudits = async () => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return [];
    }

    const response = await apperClient.fetchRecords('audit_c', {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "audit_title_c"}},
        {"field": {"Name": "audit_type_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "auditor_id_c"}},
        {"field": {"Name": "audit_date_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "score_c"}},
        {"field": {"Name": "created_date_c"}}
      ]
    });
    
    if (!response.success) {
      console.error('Failed to fetch audits:', response);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching audits:', error);
    toast.error('Failed to load audits');
    return [];
  }
};

export const getAuditById = async (auditId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const response = await apperClient.getRecordById('audit_c', auditId, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "audit_title_c"}},
        {"field": {"Name": "audit_type_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "auditor_id_c"}},
        {"field": {"Name": "audit_date_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "score_c"}},
        {"field": {"Name": "findings_c"}},
        {"field": {"Name": "recommendations_c"}},
        {"field": {"Name": "created_date_c"}}
      ]
    });
    
    if (!response.success) {
      console.error(`Failed to fetch audit ${auditId}:`, response);
      toast.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching audit ${auditId}:`, error);
    return null;
  }
};

export const createAudit = async (auditData) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }

    const response = await apperClient.createRecord('audit_c', {
      records: [auditData]
    });
    
    if (!response.success) {
      console.error('Failed to create audit:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} audits:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Audit created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating audit:', error);
    toast.error('Failed to create audit');
    return null;
  }
};

export const updateAudit = async (auditId, auditData) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }

    const response = await apperClient.updateRecord('audit_c', {
      records: [{ Id: auditId, ...auditData }]
    });
    
    if (!response.success) {
      console.error('Failed to update audit:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} audits:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Audit updated successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error updating audit:', error);
    toast.error('Failed to update audit');
    return false;
  }
};

export const deleteAudit = async (auditId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }

    const response = await apperClient.deleteRecord('audit_c', {
      RecordIds: [auditId]
    });
    
    if (!response.success) {
      console.error('Failed to delete audit:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} audits:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Audit deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting audit:', error);
    toast.error('Failed to delete audit');
    return false;
  }
};

export const getAuditsBySite = async (siteId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords('audit_c', {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "audit_title_c"}},
        {"field": {"Name": "audit_type_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "auditor_id_c"}},
        {"field": {"Name": "audit_date_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "score_c"}}
      ],
      where: [{
        "FieldName": "site_id_c",
        "Operator": "EqualTo",
        "Values": [parseInt(siteId)]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch audits by site:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching audits by site:', error);
    return [];
  }
};

export const getAuditsByDateRange = async (startDate, endDate) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords('audit_c', {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "audit_title_c"}},
        {"field": {"Name": "audit_type_c"}},
        {"field": {"Name": "site_id_c"}},
        {"field": {"Name": "auditor_id_c"}},
        {"field": {"Name": "audit_date_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "score_c"}}
      ],
      where: [{
        "FieldName": "audit_date_c",
        "Operator": "GreaterThanOrEqualTo",
        "Values": [startDate]
      }, {
        "FieldName": "audit_date_c",
        "Operator": "LessThanOrEqualTo",
        "Values": [endDate]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch audits by date range:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching audits by date range:', error);
    return [];
  }
};
// Service class for comprehensive audit management
class AuditService {
  constructor() {
    this.apperClient = null;
  }

  async getApperClient() {
    if (!this.apperClient) {
      this.apperClient = await getApperClient();
    }
    if (!this.apperClient) {
      throw new Error('ApperClient not available');
    }
    return this.apperClient;
  }

  // AUDIT METHODS
  async getAllAudits() {
    try {
      const client = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "site_c"}},
          {"field": {"Name": "compliance_focus_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await client.fetchRecords('audit_c', params);
      
      if (!response.success) {
        console.error('Failed to fetch audits:', response);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching audits:', error);
      toast.error('Error fetching audits');
      return [];
    }
  }

  async getAuditById(id) {
    try {
      const client = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "site_c"}},
          {"field": {"Name": "compliance_focus_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await client.getRecordById('audit_c', id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch audit ${id}:`, response);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching audit ${id}:`, error);
      toast.error('Error fetching audit');
      return null;
    }
  }

  async createAudit(auditData) {
    try {
      const client = await this.getApperClient();
      const params = {
        records: [auditData]
      };

      const response = await client.createRecord('audit_c', params);
      
      if (!response.success) {
        console.error('Failed to create audit:', response);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} audits:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Audit created successfully');
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error creating audit:', error);
      toast.error('Error creating audit');
      return null;
    }
  }

  async updateAudit(id, auditData) {
    try {
      const client = await this.getApperClient();
      const params = {
        records: [{ Id: id, ...auditData }]
      };

      const response = await client.updateRecord('audit_c', params);
      
      if (!response.success) {
        console.error('Failed to update audit:', response);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} audits:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Audit updated successfully');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error updating audit:', error);
      toast.error('Error updating audit');
      return false;
    }
  }

  async deleteAudit(id) {
    try {
      const client = await this.getApperClient();
      const params = { RecordIds: [id] };

      const response = await client.deleteRecord('audit_c', params);
      
      if (!response.success) {
        console.error('Failed to delete audit:', response);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} audits:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Audit deleted successfully');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error deleting audit:', error);
      toast.error('Error deleting audit');
      return false;
    }
  }

  // NON-CONFORMITY METHODS
  async getAllNonConformities(auditId = null) {
    try {
      const client = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "audit_c"}},
          {"field": {"Name": "details_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      if (auditId) {
        params.where = [{
          "FieldName": "audit_c",
          "Operator": "EqualTo",
          "Values": [parseInt(auditId)]
        }];
      }

      const response = await client.fetchRecords('non_conformity_c', params);
      
      if (!response.success) {
        console.error('Failed to fetch non-conformities:', response);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching non-conformities:', error);
      toast.error('Error fetching non-conformities');
      return [];
    }
  }

  async createNonConformity(nonConformityData) {
    try {
      const client = await this.getApperClient();
      const params = {
        records: [nonConformityData]
      };

      const response = await client.createRecord('non_conformity_c', params);
      
      if (!response.success) {
        console.error('Failed to create non-conformity:', response);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        
        if (successful.length > 0) {
          toast.success('Non-conformity recorded successfully');
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error creating non-conformity:', error);
      toast.error('Error creating non-conformity');
      return null;
    }
  }

  // CORRECTIVE ACTION METHODS
  async getAllCorrectiveActions(nonConformityId = null) {
    try {
      const client = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "non_conformity_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "deadline_c", "sorttype": "ASC"}]
      };

      if (nonConformityId) {
        params.where = [{
          "FieldName": "non_conformity_c",
          "Operator": "EqualTo",
          "Values": [parseInt(nonConformityId)]
        }];
      }

      const response = await client.fetchRecords('corrective_action_c', params);
      
      if (!response.success) {
        console.error('Failed to fetch corrective actions:', response);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching corrective actions:', error);
      toast.error('Error fetching corrective actions');
      return [];
    }
  }

  async createCorrectiveAction(actionData) {
    try {
      const client = await this.getApperClient();
      const params = {
        records: [actionData]
      };

      const response = await client.createRecord('corrective_action_c', params);
      
      if (!response.success) {
        console.error('Failed to create corrective action:', response);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        
        if (successful.length > 0) {
          toast.success('Corrective action created successfully');
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error creating corrective action:', error);
      toast.error('Error creating corrective action');
      return null;
    }
  }

  // EVIDENCE METHODS
  async getAllEvidence(correctiveActionId = null) {
    try {
      const client = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "corrective_action_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      if (correctiveActionId) {
        params.where = [{
          "FieldName": "corrective_action_c",
          "Operator": "EqualTo",
          "Values": [parseInt(correctiveActionId)]
        }];
      }

      const response = await client.fetchRecords('evidence_c', params);
      
      if (!response.success) {
        console.error('Failed to fetch evidence:', response);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching evidence:', error);
      toast.error('Error fetching evidence');
      return [];
    }
  }

  async createEvidence(evidenceData) {
    try {
      const client = await this.getApperClient();
      const params = {
        records: [evidenceData]
      };

      const response = await client.createRecord('evidence_c', params);
      
      if (!response.success) {
        console.error('Failed to create evidence:', response);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        
        if (successful.length > 0) {
          toast.success('Evidence uploaded successfully');
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error creating evidence:', error);
      toast.error('Error creating evidence');
      return null;
    }
  }

  // AUDIT REPORT METHODS
  async getAllReports(auditId = null) {
    try {
      const client = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "audit_c"}},
          {"field": {"Name": "report_date_c"}},
          {"field": {"Name": "language_c"}},
          {"field": {"Name": "report_content_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "report_date_c", "sorttype": "DESC"}]
      };

      if (auditId) {
        params.where = [{
          "FieldName": "audit_c",
          "Operator": "EqualTo",
          "Values": [parseInt(auditId)]
        }];
      }

      const response = await client.fetchRecords('audit_report_c', params);
      
      if (!response.success) {
        console.error('Failed to fetch audit reports:', response);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching audit reports:', error);
      toast.error('Error fetching audit reports');
      return [];
    }
  }

  async generateReport(auditId, language = 'English') {
    try {
      const reportContent = await this.generateReportContent(auditId, language);
      const reportData = {
        Name: `Audit Report - ${new Date().toLocaleDateString()}`,
        audit_c: parseInt(auditId),
        report_date_c: new Date().toISOString().split('T')[0],
        language_c: language,
        report_content_c: reportContent
      };

      return await this.createReport(reportData);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error generating report');
      return null;
    }
  }

  async createReport(reportData) {
    try {
      const client = await this.getApperClient();
      const params = {
        records: [reportData]
      };

      const response = await client.createRecord('audit_report_c', params);
      
      if (!response.success) {
        console.error('Failed to create audit report:', response);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        
        if (successful.length > 0) {
          toast.success('Audit report generated successfully');
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error creating audit report:', error);
      toast.error('Error creating audit report');
      return null;
    }
  }

  async generateReportContent(auditId, language) {
    try {
      // Get audit details
      const audit = await this.getAuditById(auditId);
      const nonConformities = await this.getAllNonConformities(auditId);
      
      // Get all corrective actions for this audit's non-conformities
      let correctiveActions = [];
      for (const nc of nonConformities) {
        const actions = await this.getAllCorrectiveActions(nc.Id);
        correctiveActions = [...correctiveActions, ...actions];
      }

      const templates = {
        English: {
          title: 'Audit Report',
          auditInfo: 'Audit Information',
          nonConformitiesTitle: 'Non-Conformities Found',
          correctiveActionsTitle: 'Corrective Actions',
          summary: 'Summary'
        },
        French: {
          title: 'Rapport d\'Audit',
          auditInfo: 'Informations sur l\'Audit',
          nonConformitiesTitle: 'Non-Conformités Trouvées',
          correctiveActionsTitle: 'Actions Correctives',
          summary: 'Résumé'
        },
        Arabic: {
          title: 'تقرير التدقيق',
          auditInfo: 'معلومات التدقيق',
          nonConformitiesTitle: 'عدم المطابقة الموجودة',
          correctiveActionsTitle: 'الإجراءات التصحيحية',
          summary: 'الملخص'
        }
      };

      const t = templates[language] || templates.English;
      
      let content = `${t.title}\n\n`;
      content += `${t.auditInfo}:\n`;
      content += `- Name: ${audit?.Name || 'N/A'}\n`;
      content += `- Type: ${audit?.type_c || 'N/A'}\n`;
      content += `- Date: ${audit?.date_c || 'N/A'}\n`;
      content += `- Compliance Focus: ${audit?.compliance_focus_c || 'N/A'}\n\n`;
      
      content += `${t.nonConformitiesTitle} (${nonConformities.length}):\n`;
      nonConformities.forEach((nc, index) => {
        content += `${index + 1}. ${nc.Name}: ${nc.details_c || 'No details'}\n`;
      });
      content += '\n';
      
      content += `${t.correctiveActionsTitle} (${correctiveActions.length}):\n`;
      correctiveActions.forEach((action, index) => {
        content += `${index + 1}. ${action.Name}: ${action.description_c || 'No description'}\n`;
        content += `   Deadline: ${action.deadline_c || 'Not set'}\n`;
      });
      content += '\n';
      
      content += `${t.summary}:\n`;
      content += `Total Non-Conformities: ${nonConformities.length}\n`;
      content += `Corrective Actions Required: ${correctiveActions.length}\n`;
      content += `Report Generated: ${new Date().toLocaleDateString()}\n`;
      
      return content;
    } catch (error) {
      console.error('Error generating report content:', error);
      return 'Error generating report content';
    }
  }
// CHECKLIST METHODS
  async getAllChecklists() {
    try {
      const apperClient = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "frequency_c"}},
          {"field": {"Name": "itemCount_c"}},
          {"field": {"Name": "completionRate_c"}},
          {"field": {"Name": "lastCompleted_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "audit_c"}},
          {"field": {"Name": "compliance_focus_c"}},
          {"field": {"Name": "regulatoryStandard_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('checklist_c', params);
      
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

  async createChecklist(checklistData) {
    try {
      const apperClient = await this.getApperClient();
      
      const recordData = {};
      
      if (checklistData.Name) recordData.Name = checklistData.Name;
      if (checklistData.description_c) recordData.description_c = checklistData.description_c;
      if (checklistData.category_c) recordData.category_c = checklistData.category_c;
      if (checklistData.status_c) recordData.status_c = checklistData.status_c;
      if (checklistData.priority_c) recordData.priority_c = checklistData.priority_c;
      if (checklistData.frequency_c) recordData.frequency_c = checklistData.frequency_c;
      if (checklistData.itemCount_c !== undefined) recordData.itemCount_c = checklistData.itemCount_c;
      if (checklistData.completionRate_c !== undefined) recordData.completionRate_c = checklistData.completionRate_c;
      if (checklistData.lastCompleted_c) recordData.lastCompleted_c = checklistData.lastCompleted_c;
      if (checklistData.assignedTo_c) recordData.assignedTo_c = checklistData.assignedTo_c;
      if (checklistData.compliance_focus_c) recordData.compliance_focus_c = checklistData.compliance_focus_c;
      if (checklistData.regulatoryStandard_c) recordData.regulatoryStandard_c = checklistData.regulatoryStandard_c;
      
      // Handle lookup fields - send only ID values
      if (checklistData.audit_c) {
        recordData.audit_c = checklistData.audit_c?.Id || parseInt(checklistData.audit_c);
      }

      // Set defaults
      if (!recordData.status_c) recordData.status_c = 'active';
      if (!recordData.itemCount_c) recordData.itemCount_c = 0;

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord('checklist_c', params);
      
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

  async getChecklistById(id) {
    try {
      const apperClient = await this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "frequency_c"}},
          {"field": {"Name": "itemCount_c"}},
          {"field": {"Name": "completionRate_c"}},
          {"field": {"Name": "lastCompleted_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "audit_c"}},
          {"field": {"Name": "compliance_focus_c"}},
          {"field": {"Name": "regulatoryStandard_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('checklist_c', id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch checklist with Id: ${id}:`, response);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching checklist ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to load checklist');
      return null;
    }
  }

  async updateChecklist(id, checklistData) {
    try {
      const apperClient = await this.getApperClient();
      
      const recordData = { Id: id };
      
      if (checklistData.Name !== undefined) recordData.Name = checklistData.Name;
      if (checklistData.description_c !== undefined) recordData.description_c = checklistData.description_c;
      if (checklistData.category_c !== undefined) recordData.category_c = checklistData.category_c;
      if (checklistData.status_c !== undefined) recordData.status_c = checklistData.status_c;
      if (checklistData.priority_c !== undefined) recordData.priority_c = checklistData.priority_c;
      if (checklistData.frequency_c !== undefined) recordData.frequency_c = checklistData.frequency_c;
      if (checklistData.itemCount_c !== undefined) recordData.itemCount_c = checklistData.itemCount_c;
      if (checklistData.completionRate_c !== undefined) recordData.completionRate_c = checklistData.completionRate_c;
      if (checklistData.lastCompleted_c !== undefined) recordData.lastCompleted_c = checklistData.lastCompleted_c;
      if (checklistData.assignedTo_c !== undefined) recordData.assignedTo_c = checklistData.assignedTo_c;
      if (checklistData.compliance_focus_c !== undefined) recordData.compliance_focus_c = checklistData.compliance_focus_c;
      if (checklistData.regulatoryStandard_c !== undefined) recordData.regulatoryStandard_c = checklistData.regulatoryStandard_c;
      
      // Handle lookup fields - send only ID values
      if (checklistData.audit_c !== undefined) {
        recordData.audit_c = checklistData.audit_c?.Id || parseInt(checklistData.audit_c);
      }

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord('checklist_c', params);
      
      if (!response.success) {
        console.error('Failed to update checklist:', response);
        toast.error(response.message);
        return false;
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
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error updating checklist:', error?.response?.data?.message || error.message);
      toast.error('Failed to update checklist');
      return false;
    }
  }

  async deleteChecklist(id) {
    try {
      const apperClient = await this.getApperClient();
      
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('checklist_c', params);
      
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
}

export const auditService = new AuditService();