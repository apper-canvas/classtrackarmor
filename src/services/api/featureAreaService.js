import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const tableName = 'regulatory_alignment_c';

export const featureAreaService = {
  async getAll() {
    try {
const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(tableName, {
        fields: [
          {"field": {"Name": "Name"}},
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
        orderBy: [{"fieldName": "feature_area_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error('Failed to fetch feature areas:', response);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching feature areas:', error?.response?.data?.message || error);
      toast.error('Failed to load feature areas');
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById(tableName, id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "feature_area_c"}},
          {"field": {"Name": "relevant_moroccan_laws_c"}},
          {"field": {"Name": "compliance_objectives_c"}},
          {"field": {"Name": "obligatory_records_c"}},
          {"field": {"Name": "record_retention_requirements_c"}},
          {"field": {"Name": "inspection_needs_c"}},
          {"field": {"Name": "reporting_obligations_c"}}
        ]
      });

      if (!response.success) {
        console.error(`Failed to fetch feature area with Id: ${id}:`, response);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching feature area ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to load feature area details');
      return null;
    }
  },

  async create(data) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          Name: data.Name,
          feature_area_c: data.feature_area_c,
          relevant_moroccan_laws_c: data.relevant_moroccan_laws_c,
          compliance_objectives_c: data.compliance_objectives_c,
          obligatory_records_c: data.obligatory_records_c,
          record_retention_requirements_c: data.record_retention_requirements_c,
          inspection_needs_c: data.inspection_needs_c,
          reporting_obligations_c: data.reporting_obligations_c
        }]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error('Failed to create feature area:', response);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} feature area records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Feature area created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating feature area:', error?.response?.data?.message || error);
      toast.error('Failed to create feature area');
      return null;
    }
  },

  async update(id, data) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields that have values
      if (data.Name) updateData.Name = data.Name;
      if (data.feature_area_c) updateData.feature_area_c = data.feature_area_c;
      if (data.relevant_moroccan_laws_c) updateData.relevant_moroccan_laws_c = data.relevant_moroccan_laws_c;
      if (data.compliance_objectives_c) updateData.compliance_objectives_c = data.compliance_objectives_c;
      if (data.obligatory_records_c) updateData.obligatory_records_c = data.obligatory_records_c;
      if (data.record_retention_requirements_c) updateData.record_retention_requirements_c = data.record_retention_requirements_c;
      if (data.inspection_needs_c) updateData.inspection_needs_c = data.inspection_needs_c;
      if (data.reporting_obligations_c) updateData.reporting_obligations_c = data.reporting_obligations_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error('Failed to update feature area:', response);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} feature area records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Feature area updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating feature area:', error?.response?.data?.message || error);
      toast.error('Failed to update feature area');
      return null;
    }
  },

  async remove(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error('Failed to delete feature area:', response);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} feature area records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Feature area deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting feature area:', error?.response?.data?.message || error);
      toast.error('Failed to delete feature area');
      return false;
    }
  },

  async getFeatureAreas() {
    // Get unique feature areas
    try {
      const records = await this.getAll();
      const uniqueAreas = [...new Set(records.map(r => r.feature_area_c).filter(Boolean))];
      return uniqueAreas.sort();
    } catch (error) {
      console.error('Error getting feature areas:', error);
      return [];
    }
  }
};