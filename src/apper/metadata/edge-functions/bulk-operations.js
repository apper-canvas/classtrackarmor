import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    const requestBody = await req.json();
    const { operation, tableName, data, filters } = requestBody;

    if (!operation || !tableName) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Operation and tableName are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result;

    switch (operation) {
      case 'bulkCreate':
        if (!data || !Array.isArray(data)) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Data must be an array for bulk create operation'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        result = await apperClient.createRecord(tableName, {
          records: data
        });
        break;

      case 'bulkUpdate':
        if (!data || !Array.isArray(data)) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Data must be an array for bulk update operation'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Ensure all records have Id
        const updateData = data.map(record => ({
          ...record,
          Id: parseInt(record.Id) || parseInt(record.id)
        }));

        result = await apperClient.updateRecord(tableName, {
          records: updateData
        });
        break;

      case 'bulkDelete':
        let recordIds = [];
        
        if (data && Array.isArray(data)) {
          // Direct IDs provided
          recordIds = data.map(id => parseInt(id));
        } else if (filters) {
          // Get records by filters first
          const fetchResult = await apperClient.fetchRecords(tableName, {
            fields: [{"field": {"Name": "Id"}}],
            where: filters.where || [],
            whereGroups: filters.whereGroups || []
          });
          
          if (!fetchResult.success) {
            return new Response(JSON.stringify({
              success: false,
              message: 'Failed to fetch records for deletion'
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          recordIds = (fetchResult.data || []).map(record => record.Id);
        } else {
          return new Response(JSON.stringify({
            success: false,
            message: 'Either data (array of IDs) or filters must be provided for bulk delete'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (recordIds.length === 0) {
          return new Response(JSON.stringify({
            success: true,
            message: 'No records found to delete',
            data: { deletedCount: 0 }
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        result = await apperClient.deleteRecord(tableName, {
          RecordIds: recordIds
        });
        break;

      case 'bulkStatusUpdate':
        if (!data || !data.status || !data.recordIds) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Status and recordIds are required for bulk status update'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const statusUpdateData = data.recordIds.map(id => ({
          Id: parseInt(id),
          status_c: data.status
        }));

        result = await apperClient.updateRecord(tableName, {
          records: statusUpdateData
        });
        break;

      case 'export':
        const exportFields = data?.fields || [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Id"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ];

        const exportParams = {
          fields: exportFields,
          ...(filters?.where && { where: filters.where }),
          ...(filters?.whereGroups && { whereGroups: filters.whereGroups }),
          ...(filters?.orderBy && { orderBy: filters.orderBy }),
          pagingInfo: { limit: 1000, offset: 0 } // Export up to 1000 records
        };

        result = await apperClient.fetchRecords(tableName, exportParams);
        
        if (result.success) {
          // Format for CSV export
          const csvData = {
            headers: exportFields.map(f => f.field.Name),
            rows: (result.data || []).map(record => 
              exportFields.map(f => record[f.field.Name] || '')
            ),
            total: result.total
          };
          
          return new Response(JSON.stringify({
            success: true,
            data: csvData,
            format: 'csv'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      default:
        return new Response(JSON.stringify({
          success: false,
          message: `Unsupported operation: ${operation}. Supported: bulkCreate, bulkUpdate, bulkDelete, bulkStatusUpdate, export`
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        message: result.message || 'Operation failed'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process results for bulk operations
    if (result.results && Array.isArray(result.results)) {
      const successful = result.results.filter(r => r.success);
      const failed = result.results.filter(r => !r.success);
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          operation,
          tableName,
          successCount: successful.length,
          failureCount: failed.length,
          successful: successful.map(r => r.data),
          failed: failed.map(r => ({ 
            id: r.id, 
            errors: r.errors, 
            message: r.message 
          }))
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: result.data || result
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});