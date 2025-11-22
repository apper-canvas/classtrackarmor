import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'company_c';

/**
 * Get all companies with proper field specifications
 */
export async function getAll() {
  try {
    const apperClient = getApperClient();
const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "Tags"}},
        {"field": {"Name": "nameEn_c"}},
        {"field": {"Name": "nameAr_c"}}, 
        {"field": {"Name": "nameFr_c"}},
        {"field": {"Name": "primaryLanguage_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "Owner_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch companies:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching companies:', error?.response?.data?.message || error.message);
    toast.error('Failed to load companies');
    return [];
  }
}

/**
 * Get company by ID with all fields
 */
export async function getById(companyId) {
  try {
    const apperClient = getApperClient();
const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "Tags"}},
        {"field": {"Name": "nameEn_c"}},
        {"field": {"Name": "nameAr_c"}},
        {"field": {"Name": "nameFr_c"}}, 
        {"field": {"Name": "primaryLanguage_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "Owner_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, companyId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch company with Id: ${companyId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching company ${companyId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load company');
    return null;
  }
}

/**
 * Create new company - only include Updateable fields
 */
export async function create(companyData) {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const recordData = {};
    
    if (companyData.Name) recordData.Name = companyData.Name;
    if (companyData.nameEn_c) recordData.nameEn_c = companyData.nameEn_c;
    if (companyData.nameAr_c) recordData.nameAr_c = companyData.nameAr_c;
    if (companyData.nameFr_c) recordData.nameFr_c = companyData.nameFr_c;
    if (companyData.primaryLanguage_c) recordData.primaryLanguage_c = companyData.primaryLanguage_c;
    if (companyData.status_c) recordData.status_c = companyData.status_c;
    
    // Handle lookup fields - send only ID values
    if (companyData.Owner_c) {
      recordData.Owner_c = companyData.Owner_c?.Id || parseInt(companyData.Owner_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create company:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} companies:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Company created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating company:', error?.response?.data?.message || error.message);
    toast.error('Failed to create company');
    return null;
  }
}

/**
 * Update company - only include Updateable fields
 */
export async function update(companyId, companyData) {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const recordData = { Id: companyId };
    
    if (companyData.Name !== undefined) recordData.Name = companyData.Name;
    if (companyData.nameEn_c !== undefined) recordData.nameEn_c = companyData.nameEn_c;
    if (companyData.nameAr_c !== undefined) recordData.nameAr_c = companyData.nameAr_c;
    if (companyData.nameFr_c !== undefined) recordData.nameFr_c = companyData.nameFr_c;
    if (companyData.primaryLanguage_c !== undefined) recordData.primaryLanguage_c = companyData.primaryLanguage_c;
    if (companyData.status_c !== undefined) recordData.status_c = companyData.status_c;
    
    // Handle lookup fields - send only ID values
    if (companyData.Owner_c !== undefined) {
      recordData.Owner_c = companyData.Owner_c?.Id || parseInt(companyData.Owner_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update company:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} companies:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Company updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating company:', error?.response?.data?.message || error.message);
    toast.error('Failed to update company');
    return null;
  }
}

/**
 * Delete company by ID
 */
export async function remove(companyId) {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [companyId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to delete company:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} companies:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Company deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting company:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete company');
    return false;
  }
}
export const companyService = {
  getAll,
  getById,
  create,
  update,
  remove
};