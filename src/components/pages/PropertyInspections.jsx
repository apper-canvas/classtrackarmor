import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "react-toastify";
import { format } from "date-fns";
import * as regulatoryAlignmentService from "@/services/api/regulatoryAlignmentService";
import * as temperatureLogService from "@/services/api/temperatureLogService";
import * as companyService from "@/services/api/companyService";
import * as incidentService from "@/services/api/incidentService";
import * as complaintService from "@/services/api/complaintService";
import * as enforcementInspectionService from "@/services/api/enforcementInspectionService";
import * as siteService from "@/services/api/siteService";
import * as maintenanceLogService from "@/services/api/maintenanceLogService";
import * as userService from "@/services/api/userService";
import * as haccpRecordService from "@/services/api/haccpRecordService";
import * as checklistService from "@/services/api/checklistService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
const PropertyInspections = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadInspections();
  }, []);

const loadInspections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the enforcement inspection service
      const data = await enforcementInspectionService.getAll();
      
      setInspections(data || []);
    } catch (err) {
      console.error('Error loading enforcement inspections:', err);
      setError('Failed to load enforcement inspections');
      toast.error('Failed to load enforcement inspections');
    } finally {
      setLoading(false);
    }
  };

const handleCreateInspection = async (inspectionData) => {
    try {
      const created = await enforcementInspectionService.create({
        Name: 'New Enforcement Inspection',
        inspection_type_c: 'routine',
        status_c: 'scheduled',
        priority_c: 'medium',
        ...inspectionData
      });
      if (created) {
        toast.success('Inspection created successfully');
        await loadInspections();
      }
    } catch (err) {
      console.error('Error creating inspection:', err);
      toast.error('Failed to create inspection');
    }
  };

const handleUpdateInspection = async (id, inspectionData) => {
    try {
      const updated = await enforcementInspectionService.update(id, inspectionData);
      if (updated) {
        toast.success('Inspection updated successfully');
        await loadInspections();
      }
    } catch (err) {
      console.error('Error updating inspection:', err);
      toast.error('Failed to update inspection');
    }
  };

const handleDeleteInspection = async (id) => {
    if (!confirm('Are you sure you want to delete this inspection?')) return;
    
    try {
      const success = await enforcementInspectionService.remove(id);
      if (success) {
        toast.success('Inspection deleted successfully');
        await loadInspections();
      }
    } catch (err) {
      console.error('Error deleting inspection:', err);
      toast.error('Failed to delete inspection');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = (inspection.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (inspection.inspector_name_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (inspection.inspection_type_c || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
                         (inspection.status_c || '').toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

const handleViewDetails = (inspection) => {
    toast.info(`Viewing details for ${inspection.Name}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadInspections} />;
  }

return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('propertyInspections.title', 'Property Inspections')}
          </h1>
          <p className="text-slate-600 mt-1">
            {t('propertyInspections.subtitle', 'Monitor and manage property safety inspections')}
          </p>
        </div>
        <Button 
          onClick={() => handleCreateInspection({
            Name: 'New Property Inspection',
            inspection_type_c: 'property'
          })}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          {t('propertyInspections.createNew', 'Schedule Inspection')}
        </Button>
      </div>
{/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder={t('propertyInspections.searchPlaceholder', 'Search inspections...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="all">{t('propertyInspections.allStatuses', 'All Statuses')}</option>
              <option value="scheduled">{t('propertyInspections.scheduled', 'Scheduled')}</option>
              <option value="in_progress">{t('propertyInspections.inProgress', 'In Progress')}</option>
              <option value="completed">{t('propertyInspections.completed', 'Completed')}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Inspections List */}
      {filteredInspections.length === 0 ? (
        <Empty message={t('propertyInspections.noInspections', 'No inspections found')} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInspections.map((inspection) => (
            <Card key={inspection.Id} className="p-0 overflow-hidden">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {inspection.Name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="User" className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{inspection.inspector_name_c}</span>
                      </div>
                      <div className="flex items-center gap-2">
<ApperIcon name="Calendar" className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          {t('propertyInspections.scheduledFor', 'Scheduled for')} {inspection.scheduled_date_c ? format(new Date(inspection.scheduled_date_c), 'MMM d, yyyy') : 'Not scheduled'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="FileText" className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{inspection.inspection_type_c}</span>
</div>
                      {inspection.actual_date_c && (
                        <div className="flex items-center gap-2">
<ApperIcon name="Clock" className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600">
                            {t('propertyInspections.completed', 'Completed')}: {inspection.actual_date_c ? format(new Date(inspection.actual_date_c), 'MMM d, yyyy') : 'Date not available'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge 
                    variant={
                      inspection.status_c === 'completed' ? 'success' :
                      inspection.status_c === 'in_progress' ? 'warning' : 'secondary'
                    }
>
                    {inspection.status_c ? inspection.status_c.charAt(0).toUpperCase() + inspection.status_c.slice(1).replace('_', ' ') : 'Unknown'}
                  </Badge>
                  <Badge 
                    variant={
inspection.priority_c === 'high' ? 'error' :
                      inspection.priority_c === 'medium' ? 'warning' : 'secondary'
                    }
>
                    {inspection.priority_c ? inspection.priority_c.charAt(0).toUpperCase() + inspection.priority_c.slice(1) : 'None'}
                  </Badge>
                </div>

                {inspection.findings_c && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                    <h4 className="text-xs font-medium text-slate-700 mb-1">
                      {t('propertyInspections.findings', 'Findings')}
                    </h4>
                    <p className="text-xs text-slate-600">{inspection.findings_c}</p>
                  </div>
                )}

<div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <div className="text-sm text-slate-500">
                    {t('propertyInspections.inspector', 'Inspector')}: {inspection.inspector_name_c || 'Not assigned'}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(inspection)}
                      className="flex items-center gap-1"
                    >
                      <ApperIcon name="Eye" size={14} />
                      {t('propertyInspections.viewDetails', 'View')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateInspection(inspection.Id, {
                        status_c: inspection.status_c === 'scheduled' ? 'in_progress' : 'completed'
                      })}
                      className="flex items-center gap-1"
                    >
                      <ApperIcon name="Edit" size={14} />
                      {t('propertyInspections.edit', 'Edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteInspection(inspection.Id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={14} />
                      {t('propertyInspections.delete', 'Delete')}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {inspections.filter(i => i.status_c === 'scheduled').length}
          </div>
          <div className="text-sm text-slate-600">
            {t('propertyInspections.scheduledCount', 'Scheduled')}
          </div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {inspections.filter(i => i.status_c === 'in_progress').length}
          </div>
          <div className="text-sm text-slate-600">
            {t('propertyInspections.inProgressCount', 'In Progress')}
          </div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {inspections.filter(i => i.status_c === 'completed').length}
          </div>
          <div className="text-sm text-slate-600">
            {t('propertyInspections.completedCount', 'Completed')}
          </div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {inspections.filter(i => i.priority_c === 'high').length}
          </div>
          <div className="text-sm text-slate-600">
            {t('propertyInspections.highPriorityCount', 'High Priority')}
          </div>
</Card>
      </div>
    </div>
  );
};

export default PropertyInspections;