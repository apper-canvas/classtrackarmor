import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'regulatory_alignment_c';

/**
 * Get all regulatory alignments with proper field specifications
 */
export async function getAll() {
  try {
    const apperClient = getApperClient();
const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "Tags"}},
        {"field": {"Name": "feature_area_c"}},
        {"field": {"Name": "relevant_moroccan_laws_c"}},
        {"field": {"Name": "compliance_objectives_c"}},
        {"field": {"Name": "obligatory_records_c"}},
        {"field": {"Name": "record_retention_requirements_c"}},
        {"field": {"Name": "inspection_needs_c"}},
        {"field": {"Name": "reporting_obligations_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch regulatory alignments:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching regulatory alignments:', error?.response?.data?.message || error.message);
    toast.error('Failed to load regulatory alignments');
    return [];
  }
}

/**
 * Get regulatory alignment by ID with all fields
 */
export async function getById(alignmentId) {
  try {
    const apperClient = getApperClient();
const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "Tags"}},
        {"field": {"Name": "feature_area_c"}},
        {"field": {"Name": "relevant_moroccan_laws_c"}},
        {"field": {"Name": "compliance_objectives_c"}},
        {"field": {"Name": "obligatory_records_c"}},
        {"field": {"Name": "record_retention_requirements_c"}},
        {"field": {"Name": "inspection_needs_c"}},
        {"field": {"Name": "reporting_obligations_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, alignmentId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch regulatory alignment with Id: ${alignmentId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching regulatory alignment ${alignmentId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load regulatory alignment');
    return null;
  }
}

/**
 * Create new regulatory alignment - only include Updateable fields
 */
export async function create(alignmentData) {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const recordData = {};
    
    if (alignmentData.Name) recordData.Name = alignmentData.Name;
    if (alignmentData.feature_area_c) recordData.feature_area_c = alignmentData.feature_area_c;
    if (alignmentData.relevant_moroccan_laws_c) recordData.relevant_moroccan_laws_c = alignmentData.relevant_moroccan_laws_c;
    if (alignmentData.compliance_objectives_c) recordData.compliance_objectives_c = alignmentData.compliance_objectives_c;
    if (alignmentData.obligatory_records_c) recordData.obligatory_records_c = alignmentData.obligatory_records_c;
    if (alignmentData.record_retention_requirements_c) recordData.record_retention_requirements_c = alignmentData.record_retention_requirements_c;
    if (alignmentData.inspection_needs_c) recordData.inspection_needs_c = alignmentData.inspection_needs_c;
    if (alignmentData.reporting_obligations_c) recordData.reporting_obligations_c = alignmentData.reporting_obligations_c;

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create regulatory alignment:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} regulatory alignments:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Regulatory alignment created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating regulatory alignment:', error?.response?.data?.message || error.message);
    toast.error('Failed to create regulatory alignment');
    return null;
  }
}

/**
 * Update regulatory alignment - only include Updateable fields
 */
export async function update(alignmentId, alignmentData) {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const recordData = { Id: alignmentId };
    
    if (alignmentData.Name !== undefined) recordData.Name = alignmentData.Name;
    if (alignmentData.feature_area_c !== undefined) recordData.feature_area_c = alignmentData.feature_area_c;
    if (alignmentData.relevant_moroccan_laws_c !== undefined) recordData.relevant_moroccan_laws_c = alignmentData.relevant_moroccan_laws_c;
    if (alignmentData.compliance_objectives_c !== undefined) recordData.compliance_objectives_c = alignmentData.compliance_objectives_c;
    if (alignmentData.obligatory_records_c !== undefined) recordData.obligatory_records_c = alignmentData.obligatory_records_c;
    if (alignmentData.record_retention_requirements_c !== undefined) recordData.record_retention_requirements_c = alignmentData.record_retention_requirements_c;
    if (alignmentData.inspection_needs_c !== undefined) recordData.inspection_needs_c = alignmentData.inspection_needs_c;
    if (alignmentData.reporting_obligations_c !== undefined) recordData.reporting_obligations_c = alignmentData.reporting_obligations_c;

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update regulatory alignment:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} regulatory alignments:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Regulatory alignment updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating regulatory alignment:', error?.response?.data?.message || error.message);
    toast.error('Failed to update regulatory alignment');
    return null;
  }
}

/**
 * Delete regulatory alignment by ID
 */
export async function remove(alignmentId) {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [alignmentId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to delete regulatory alignment:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} regulatory alignments:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Regulatory alignment deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting regulatory alignment:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete regulatory alignment');
    return false;
  }
}
export const regulatoryAlignmentService = {
  getAll,
  getById,
  create,
  update,
  remove
};