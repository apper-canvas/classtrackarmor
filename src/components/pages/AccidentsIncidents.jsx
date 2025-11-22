import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { incidentService } from "@/services/api/incidentService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const AccidentsIncidents = () => {
  const { t } = useTranslation();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  useEffect(() => {
    loadIncidents();
  }, []);

const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await incidentService.getAll();
      
      setIncidents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading incidents:', err);
      setError('Failed to load incidents data');
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

const handleCreateIncident = async (incidentData) => {
    try {
      const created = await incidentService.create(incidentData);
      if (created) {
        await loadIncidents();
        toast.success('Incident created successfully');
      }
    } catch (err) {
      console.error('Error creating incident:', err);
      toast.error('Failed to create incident');
    }
  };

  const handleUpdateIncident = async (id, incidentData) => {
    try {
      const updated = await incidentService.update(id, incidentData);
      if (updated) {
        await loadIncidents();
        toast.success('Incident updated successfully');
      }
    } catch (err) {
      console.error('Error updating incident:', err);
      toast.error('Failed to update incident');
    }
  };

const handleDeleteIncident = async (id) => {
    if (!confirm(t('confirmDelete', 'Are you sure you want to delete this incident?'))) return;
    
    try {
      const success = await incidentService.remove(id);
      if (success) {
        await loadIncidents();
        toast.success('Incident deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting incident:', err);
      toast.error('Failed to delete incident');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'under investigation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'closed':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

const filteredIncidents = (incidents || []).filter(incident => {
    const matchesSearch = incident?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident?.description_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident?.location_c?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || incident?.status_c?.toLowerCase() === filterStatus.toLowerCase();
    const matchesSeverity = filterSeverity === 'all' || incident?.severity_c?.toLowerCase() === filterSeverity.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('accidents_incidents', 'Accidents & Incidents')}
          </h1>
          <p className="text-slate-600 mt-1">
            {t('manage_workplace_incidents', 'Track and manage workplace accidents and incidents')}
          </p>
</div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => handleCreateIncident({
            Name: 'New Incident Report',
            incident_type_c: 'safety',
            description_c: 'New incident report',
            severity_c: 'medium',
            status_c: 'open'
          })}
        >
          <ApperIcon name="Plus" size={16} />
          {t('report_incident', 'Report Incident')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t('search_incidents', 'Search incidents...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">{t('all_statuses', 'All Statuses')}</option>
          <option value="open">{t('open', 'Open')}</option>
          <option value="investigating">{t('investigating', 'Investigating')}</option>
          <option value="resolved">{t('resolved', 'Resolved')}</option>
          <option value="closed">{t('closed', 'Closed')}</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">{t('all_severities', 'All Severities')}</option>
          <option value="low">{t('low', 'Low')}</option>
          <option value="medium">{t('medium', 'Medium')}</option>
          <option value="high">{t('high', 'High')}</option>
        </select>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('total_incidents', 'Total Incidents')}</p>
              <p className="text-xl font-semibold text-slate-900">{incidents.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ApperIcon name="Clock" size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('under_investigation', 'Under Investigation')}</p>
<p className="text-xl font-semibold text-slate-900">
                {incidents.filter(i => i?.status_c?.toLowerCase() === 'investigating' || i?.status_c?.toLowerCase() === 'under investigation').length}
              </p>
            </div>
          </div>
        </Card>

<Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('resolved', 'Resolved')}</p>
              <p className="text-xl font-semibold text-slate-900">
                {incidents.filter(i => i.status_c === 'resolved' || i.status_c === 'closed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <ApperIcon name="Activity" size={20} className="text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('this_month', 'This Month')}</p>
              <p className="text-xl font-semibold text-slate-900">
                {incidents.filter(i => {
                  if (!i.incident_date_c) return false;
                  const incidentDate = new Date(i.incident_date_c);
                  const now = new Date();
                  return incidentDate.getMonth() === now.getMonth() && 
                         incidentDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Incidents List */}
      {filteredIncidents.length === 0 ? (
        <Empty 
          message={
            searchTerm || filterStatus !== 'all' || filterSeverity !== 'all'
            ? t('no_incidents_found', 'No incidents found matching your criteria')
            : t('no_incidents_reported', 'No incidents have been reported yet')
          } 
        />
      ) : (
        <div className="grid gap-4">
          {filteredIncidents.map((incident) => (
<Card key={incident.Id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{incident.Name}</h3>
                    <div className="flex gap-2">
                      <Badge className={getSeverityColor(incident.severity_c)}>
                        {incident.severity_c}
                      </Badge>
                      <Badge className={getStatusColor(incident.status_c)}>
                        {incident.status_c}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-slate-600">{incident.description_c}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="MapPin" size={14} className="text-slate-400" />
                      <span className="text-slate-600">{incident.location_c}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="User" size={14} className="text-slate-400" />
                      <span className="text-slate-600">{incident.reported_by_c}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Calendar" size={14} className="text-slate-400" />
                      <span className="text-slate-600">{formatDate(incident.incident_date_c)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Eye" size={14} className="text-slate-400" />
                      <span className="text-slate-600">{incident.witness_count_c || 0} witnesses</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">{t('injury_type', 'Injury Type')}:</span>
                    <span className="text-slate-700 font-medium">{incident.injury_type_c}</span>
                  </div>

                  {incident.immediate_actions_c && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <h4 className="text-xs font-medium text-slate-700 mb-1">
                        {t('immediate_actions', 'Immediate Actions')}
                      </h4>
                      <p className="text-xs text-slate-600">{incident.immediate_actions_c}</p>
                    </div>
                  )}
                </div>
<div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Eye" size={14} />
                    {t('view', 'View')}
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateIncident(incident.Id, {
                      status_c: incident.status_c === 'open' ? 'investigating' : 'resolved'
                    })}
                  >
                    <ApperIcon name="Edit" size={14} />
                    {t('edit', 'Edit')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteIncident(incident.Id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccidentsIncidents;