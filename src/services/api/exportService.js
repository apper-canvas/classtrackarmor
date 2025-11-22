import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class ExportService {
  constructor() {
    this.apperClient = null;
  }

  async getApperClient() {
    if (!this.apperClient) {
      this.apperClient = await getApperClient();
    }
    return this.apperClient;
  }

  async exportUsers(filters = {}) {
    try {
      const apperClient = await this.getApperClient();
      
      // Build query parameters for export
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "fullNameEn_c"}},
          {"field": {"Name": "fullNameAr_c"}},
          {"field": {"Name": "fullNameFr_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "preferredLanguage_c"}},
          {"field": {"Name": "lastLoginAt_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('user_c', params);
      
      if (!response.success) {
        console.error('Failed to export users:', response);
        toast.error(response.message);
        return null;
      }

      // Process export data
      const exportData = {
        filename: `users_export_${new Date().toISOString().split('T')[0]}.csv`,
        format: 'csv',
        recordCount: response.data?.length || 0,
        generatedAt: new Date().toISOString(),
        data: response.data
      };

      toast.success('User data exported successfully');
      return exportData;
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Error exporting users');
      return null;
    }
  }

  async exportSites(filters = {}) {
    try {
      const apperClient = await this.getApperClient();
      
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
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('site_c', params);
      
      if (!response.success) {
        console.error('Failed to export sites:', response);
        toast.error(response.message);
        return null;
      }

      const exportData = {
        filename: `sites_export_${new Date().toISOString().split('T')[0]}.csv`,
        format: 'csv',
        recordCount: response.data?.length || 0,
        generatedAt: new Date().toISOString(),
        data: response.data
      };

      toast.success('Site data exported successfully');
      return exportData;
    } catch (error) {
      console.error('Error exporting sites:', error);
      toast.error('Error exporting sites');
      return null;
    }
  }

  async exportCompanies(filters = {}) {
    try {
      const apperClient = await this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "nameEn_c"}},
          {"field": {"Name": "nameAr_c"}},
          {"field": {"Name": "nameFr_c"}},
          {"field": {"Name": "primaryLanguage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('company_c', params);
      
      if (!response.success) {
        console.error('Failed to export companies:', response);
        toast.error(response.message);
        return null;
      }

      const exportData = {
        filename: `companies_export_${new Date().toISOString().split('T')[0]}.csv`,
        format: 'csv',
        recordCount: response.data?.length || 0,
        generatedAt: new Date().toISOString(),
        data: response.data
      };

      toast.success('Company data exported successfully');
      return exportData;
    } catch (error) {
      console.error('Error exporting companies:', error);
      toast.error('Error exporting companies');
      return null;
    }
  }

  async exportRegulatoryAlignment(filters = {}) {
    try {
      const apperClient = await this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "feature_area_c"}},
          {"field": {"Name": "relevant_moroccan_laws_c"}},
          {"field": {"Name": "compliance_objectives_c"}},
          {"field": {"Name": "obligatory_records_c"}},
          {"field": {"Name": "record_retention_requirements_c"}},
          {"field": {"Name": "inspection_needs_c"}},
          {"field": {"Name": "reporting_obligations_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('regulatory_alignment_c', params);
      
      if (!response.success) {
        console.error('Failed to export regulatory alignments:', response);
        toast.error(response.message);
        return null;
      }

      const exportData = {
        filename: `regulatory_alignment_export_${new Date().toISOString().split('T')[0]}.csv`,
        format: 'csv',
        recordCount: response.data?.length || 0,
        generatedAt: new Date().toISOString(),
        data: response.data
      };

      toast.success('Regulatory alignment data exported successfully');
      return exportData;
    } catch (error) {
      console.error('Error exporting regulatory alignments:', error);
      toast.error('Error exporting regulatory alignments');
      return null;
    }
  }

  async getExportHistory(userId) {
    try {
      // For now, return empty array as we don't have export history table
      // In future, this would query an export_history_c table
      await new Promise(resolve => setTimeout(resolve, 300));
      return [];
    } catch (error) {
      console.error(`Error fetching export history for user ${userId}:`, error);
      toast.error('Error fetching export history');
      return [];
    }
  }

  async downloadExport(exportData) {
    try {
      if (!exportData || !exportData.data) {
        toast.error('No data available for download');
        return null;
      }

      // Convert data to CSV format
      const csvContent = this.convertToCSV(exportData.data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', exportData.filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
      return url;
    } catch (error) {
      console.error('Error downloading export:', error);
      toast.error('Error downloading export');
      return null;
    }
  }

  convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    // Get headers from first row
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle lookup fields that might be objects
        if (typeof value === 'object' && value !== null) {
          return `"${value.Name || JSON.stringify(value)}"`;
        }
        return `"${value || ''}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

  async generatePDF(haccpData, options = {}) {
    try {
      if (!haccpData) {
        toast.error('No HACCP data available for PDF export');
        return null;
      }

      // For now, convert to CSV format and download as PDF would require additional libraries
      // In a production environment, you would use libraries like jsPDF or similar
      const csvContent = this.convertHACCPToCSV(haccpData, options);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const filename = `${options.title || 'HACCP_Analysis'}_${new Date().toISOString().split('T')[0]}.csv`;
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('HACCP data exported as CSV (PDF export requires additional setup)');
      return url;
    } catch (error) {
      console.error('Error generating PDF export:', error);
      toast.error('Error generating PDF export');
      return null;
    }
  }

  async generateExcel(haccpData, options = {}) {
    try {
      if (!haccpData) {
        toast.error('No HACCP data available for Excel export');
        return null;
      }

      // Convert to CSV format (Excel can open CSV files)
      const csvContent = this.convertHACCPToCSV(haccpData, options);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const filename = `${options.title || 'HACCP_Analysis'}_${new Date().toISOString().split('T')[0]}.csv`;
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('HACCP data exported as CSV (Excel compatible)');
      return url;
    } catch (error) {
      console.error('Error generating Excel export:', error);
      toast.error('Error generating Excel export');
      return null;
    }
  }

  async generateCSV(haccpData, options = {}) {
    try {
      if (!haccpData) {
        toast.error('No HACCP data available for CSV export');
        return null;
      }

      const csvContent = this.convertHACCPToCSV(haccpData, options);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const filename = `${options.title || 'HACCP_Analysis'}_${new Date().toISOString().split('T')[0]}.csv`;
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('HACCP data exported as CSV');
      return url;
    } catch (error) {
      console.error('Error generating CSV export:', error);
      toast.error('Error generating CSV export');
      return null;
    }
  }

  convertHACCPToCSV(haccpData, options = {}) {
    try {
      const rows = [];
      
      // Add header
      rows.push(`"${options.title || 'HACCP Performance Analysis'}"`);
      rows.push(`"Generated on: ${new Date().toLocaleString()}"`);
      rows.push(`"Language: ${options.language || 'en'}"`);
      rows.push(''); // Empty row for spacing
      
      // Process HACCP data based on its structure
      if (Array.isArray(haccpData)) {
        // If it's an array of objects
        if (haccpData.length > 0) {
          const headers = Object.keys(haccpData[0]);
          rows.push(headers.map(h => `"${h}"`).join(','));
          
          haccpData.forEach(item => {
            const values = headers.map(header => {
              const value = item[header];
              if (typeof value === 'object' && value !== null) {
                return `"${value.Name || JSON.stringify(value)}"`;
              }
              return `"${value || ''}"`;
            });
            rows.push(values.join(','));
          });
        }
      } else if (typeof haccpData === 'object' && haccpData !== null) {
        // If it's a single object, convert to key-value pairs
        Object.entries(haccpData).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            rows.push(`"${key}","${value.Name || JSON.stringify(value)}"`);
          } else {
            rows.push(`"${key}","${value || ''}"`);
          }
        });
      } else {
        rows.push('"No data available"');
      }
      
      return rows.join('\n');
    } catch (error) {
      console.error('Error converting HACCP data to CSV:', error);
      return '"Error processing data"';
    }
  }
}

export const exportService = new ExportService();