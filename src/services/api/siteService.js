import { toast } from "react-toastify";
import { getApperClient } from "@/services/apperClient";

const TABLE_NAME = 'site_c';

/**
 * Get all sites with all fields
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
        {"field": {"Name": "nameEn_c"}}, 
        {"field": {"Name": "nameAr_c"}},
        {"field": {"Name": "nameFr_c"}},
        {"field": {"Name": "city_c"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "companyId_c"}},
        {"field": {"Name": "managerId_c"}},
        {"field": {"Name": "Owner_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to fetch sites:', response);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching sites:', error?.response?.data?.message || error.message);
    toast.error('Failed to load sites');
    return [];
  }
}

/**
 * Get site by ID with all fields
 */
export async function getById(siteId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return null;

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "nameEn_c"}}, 
        {"field": {"Name": "nameAr_c"}},
        {"field": {"Name": "nameFr_c"}},
        {"field": {"Name": "city_c"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "companyId_c"}},
        {"field": {"Name": "managerId_c"}},
        {"field": {"Name": "Owner_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, siteId, params);
    
    if (!response.success) {
      console.error(`Failed to fetch site with Id: ${siteId}:`, response);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching site ${siteId}:`, error?.response?.data?.message || error.message);
    toast.error('Failed to load site');
    return null;
  }
}

/**
 * Create new site - only include Updateable fields
 */
export async function create(siteData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = {};
    
    if (siteData.Name) recordData.Name = siteData.Name;
    if (siteData.nameEn_c) recordData.nameEn_c = siteData.nameEn_c;
    if (siteData.nameAr_c) recordData.nameAr_c = siteData.nameAr_c;
    if (siteData.nameFr_c) recordData.nameFr_c = siteData.nameFr_c;
    if (siteData.city_c) recordData.city_c = siteData.city_c;
    if (siteData.address_c) recordData.address_c = siteData.address_c;
    if (siteData.status_c) recordData.status_c = siteData.status_c;
    
    // Handle lookup fields - send only ID values
    if (siteData.companyId_c) {
      recordData.companyId_c = siteData.companyId_c?.Id || parseInt(siteData.companyId_c);
    }
    if (siteData.managerId_c) {
      recordData.managerId_c = siteData.managerId_c?.Id || parseInt(siteData.managerId_c);
    }
    if (siteData.ownerId_c) {
      recordData.ownerId_c = siteData.ownerId_c?.Id || parseInt(siteData.ownerId_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to create site:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} sites:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Site created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating site:', error?.response?.data?.message || error.message);
    toast.error('Failed to create site');
    return null;
  }
}

/**
 * Update site - only include Updateable fields
 */
export async function update(siteId, siteData) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return null;
    }
    
    // Only include Updateable fields, convert lookup fields to IDs
    const recordData = { Id: siteId };
    
    if (siteData.Name !== undefined) recordData.Name = siteData.Name;
    if (siteData.nameEn_c !== undefined) recordData.nameEn_c = siteData.nameEn_c;
    if (siteData.nameAr_c !== undefined) recordData.nameAr_c = siteData.nameAr_c;
    if (siteData.nameFr_c !== undefined) recordData.nameFr_c = siteData.nameFr_c;
    if (siteData.city_c !== undefined) recordData.city_c = siteData.city_c;
    if (siteData.address_c !== undefined) recordData.address_c = siteData.address_c;
    if (siteData.status_c !== undefined) recordData.status_c = siteData.status_c;
    
    // Handle lookup fields - send only ID values
    if (siteData.companyId_c !== undefined) {
      recordData.companyId_c = siteData.companyId_c?.Id || parseInt(siteData.companyId_c);
    }
    if (siteData.managerId_c !== undefined) {
      recordData.managerId_c = siteData.managerId_c?.Id || parseInt(siteData.managerId_c);
    }
    if (siteData.ownerId_c !== undefined) {
      recordData.ownerId_c = siteData.ownerId_c?.Id || parseInt(siteData.ownerId_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to update site:', response);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} sites:`, failed);
        failed.forEach(record => {
          if (record.errors) {
            record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          }
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Site updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating site:', error?.response?.data?.message || error.message);
    toast.error('Failed to update site');
    return null;
  }
}

/**
 * Delete site by ID
 */
export async function remove(siteId) {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      toast.error('Database connection not available');
      return false;
    }
    
    const params = {
      RecordIds: [siteId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error('Failed to delete site:', response);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} sites:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successful.length > 0) {
        toast.success('Site deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting site:', error?.response?.data?.message || error.message);
    toast.error('Failed to delete site');
    return false;
  }
}

/**
 * Get sites filtered by company ID
 */
export const getSitesByCompany = async (companyId) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) return [];

    const response = await apperClient.fetchRecords(TABLE_NAME, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "nameEn_c"}},
        {"field": {"Name": "nameAr_c"}},
        {"field": {"Name": "nameFr_c"}},
        {"field": {"Name": "city_c"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "companyId_c"}},
        {"field": {"Name": "managerId_c"}},
        {"field": {"Name": "status_c"}}
      ],
      where: [{
        "FieldName": "companyId_c",
        "Operator": "EqualTo",
        "Values": [parseInt(companyId)]
      }]
    });
    
    if (!response.success) {
      console.error('Failed to fetch sites by company:', response);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching sites by company:', error);
    return [];
  }
};

export const siteService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getSitesByCompany
};