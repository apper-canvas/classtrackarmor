import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { workflowService } from '@/services/api/workflowService';
import { userService } from '@/services/api/userService';
import { siteService } from '@/services/api/siteService';
import { companyService } from '@/services/api/companyService';
import { notificationService } from '@/services/api/notificationService';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow, format, isAfter } from 'date-fns';
import CreateWorkflowModal from '@/components/organisms/CreateWorkflowModal';

const Workflows = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  
  const [workflows, setWorkflows] = useState([]);
  const [workflowStats, setWorkflowStats] = useState({});
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters and UI state
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [workflowsData, usersData, sitesData, companiesData] = await Promise.all([
        workflowService.getAll(),
        userService.getAll(),
        siteService.getAll(),
        companyService.getAll()
      ]);

      // Apply role-based filtering
      let filteredWorkflows = workflowsData;
      if (user?.roleId_c) {
        const userRole = usersData.find(u => u.Id_c === user.Id)?.role?.code_c;
        
        switch (userRole) {
          case 'user':
            // Users see only workflows assigned to them
            filteredWorkflows = workflowsData.filter(w => w.assignedTo_c === user.Id);
            break;
          case 'manager':
            // Managers see workflows in their site
            const userSiteId = usersData.find(u => u.Id_c === user.Id)?.siteId_c;
            filteredWorkflows = workflowsData.filter(w => w.siteId_c === userSiteId);
            break;
          case 'ceo':
            // CEOs see all workflows
            filteredWorkflows = workflowsData;
            break;
          default:
            filteredWorkflows = workflowsData.filter(w => w.assignedTo_c === user.Id);
        }
      }

      setWorkflows(filteredWorkflows);
      setUsers(usersData);
      setSites(sitesData);
      setCompanies(companiesData);

      // Load statistics
      const stats = await workflowService.getStats();
      setWorkflowStats(stats);

    } catch (err) {
      setError(err.message || 'Failed to load workflows');
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.Id]);

  const getWorkflowTitle = (workflow) => {
    const langSuffix = currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
    return workflow[`title${langSuffix}_c`] || workflow.titleEn_c;
  };

  const getWorkflowDescription = (workflow) => {
    const langSuffix = currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
    return workflow[`description${langSuffix}_c`] || workflow.descriptionEn_c;
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.Id_c === userId);
    if (!user) return 'Unknown User';
    const langSuffix = currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
    return user[`fullName${langSuffix}_c`] || user.fullNameEn_c;
  };

  const getSiteName = (siteId) => {
    const site = sites.find(s => s.Id_c === siteId);
    if (!site) return 'Unknown Site';
    const langSuffix = currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
    return site[`name${langSuffix}_c`] || site.nameEn_c;
  };

  const getStatusVariant = (status) => {
    const statusMap = {
      draft: 'default',
      assigned: 'warning',
      in_progress: 'primary',
      completed: 'success',
      approved: 'success',
      rejected: 'danger'
    };
    return statusMap[status] || 'default';
  };

  const getPriorityVariant = (priority) => {
    const priorityMap = {
      low: 'success',
      medium: 'warning', 
      high: 'danger',
      critical: 'danger'
    };
    return priorityMap[priority] || 'default';
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      safety_inspection: 'Shield',
      fire_safety: 'Flame',
      equipment_check: 'Wrench',
      compliance_audit: 'ClipboardCheck',
      incident_report: 'AlertTriangle'
    };
    return iconMap[type] || 'FileText';
  };

  const handleWorkflowAction = async (workflowId, action) => {
    try {
      switch (action) {
        case 'start':
await workflowService.start(workflowId, user.Id_c || user.Id);
          toast.success('Workflow started successfully');
          break;
        case 'complete':
          navigate(`/workflows/${workflowId}`);
          return;
        case 'approve':
await workflowService.approve(workflowId, user.Id_c || user.Id);
          toast.success('Workflow approved successfully');
          break;
        case 'view':
          navigate(`/workflows/${workflowId}`);
          return;
        default:
          break;
      }
      loadData(); // Refresh data after action
    } catch (error) {
      toast.error(error.message || `Failed to ${action} workflow`);
    }
  };

  const handleCreateWorkflow = async (workflowData) => {
try {
      const newWorkflow = await workflowService.create({
        ...workflowData,
        createdBy_c: user.Id_c || user.Id,
        siteId_c: user.siteId_c?.Id || user.siteId_c || workflowData.siteId_c
      });
      
      notificationService.success('Workflow created successfully');
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create workflow');
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    if (statusFilter !== 'all' && workflow.status_c !== statusFilter) return false;
    if (typeFilter !== 'all' && workflow.type_c !== typeFilter) return false;
    if (priorityFilter !== 'all' && workflow.priority_c !== priorityFilter) return false;
    return true;
  });

  const isOverdue = (workflow) => {
    return new Date(workflow.dueDate_c) < new Date() && 
           !['approved', 'rejected'].includes(workflow.status_c);
  };

  const canCreateWorkflow = () => {
    const userRole = users.find(u => u.Id_c === user?.Id)?.role?.code_c;
    return ['ceo', 'manager'].includes(userRole);
  };

  const canApproveWorkflow = (workflow) => {
    const userRole = users.find(u => u.Id_c === user?.Id)?.role?.code_c;
    return ['ceo', 'manager'].includes(userRole) && workflow.status_c === 'completed';
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Workflows"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
Workflows
          </h1>
          <p className="text-slate-600">
            Manage safety inspections, compliance audits, and workflow processes
          </p>
        </div>
        
        {canCreateWorkflow() && (
          <Button 
            icon="Plus" 
            onClick={() => setShowCreateModal(true)}
          >
            Create Workflow
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ApperIcon name="FileText" className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{workflowStats.total || 0}</p>
              <p className="text-sm text-slate-600">Total Workflows</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <ApperIcon name="Clock" className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{workflowStats.inProgress || 0}</p>
              <p className="text-sm text-slate-600">In Progress</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{workflowStats.completed || 0}</p>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ApperIcon name="AlertTriangle" className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{workflowStats.overdue || 0}</p>
              <p className="text-sm text-slate-600">Overdue</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="safety_inspection">Safety Inspection</option>
              <option value="fire_safety">Fire Safety</option>
              <option value="equipment_check">Equipment Check</option>
              <option value="compliance_audit">Compliance Audit</option>
              <option value="incident_report">Incident Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <Empty
          icon="FileText"
          title="No Workflows Found"
          message="No workflows match your current filters."
          actionLabel={canCreateWorkflow() ? "Create Workflow" : undefined}
          onAction={canCreateWorkflow() ? () => setShowCreateModal(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <Card 
              key={workflow.Id} 
              className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer relative"
              gradient
              onClick={() => navigate(`/workflows/${workflow.Id}`)}
            >
              {isOverdue(workflow) && (
                <div className="absolute top-3 right-3">
                  <Badge variant="danger" size="sm">
                    Overdue
                  </Badge>
                </div>
              )}
              
              <div className="space-y-4">
                {/* Workflow Header */}
                <div className="flex items-start space-x-3">
                  <div className="p-3 bg-gradient-to-br from-primary-400 to-primary-500 rounded-lg flex-shrink-0">
                    <ApperIcon name={getTypeIcon(workflow.type_c)} className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                      {getWorkflowTitle(workflow)}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                      {getWorkflowDescription(workflow)}
                    </p>
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusVariant(workflow.status_c)}>
                    {workflow.status_c.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant={getPriorityVariant(workflow.priority_c)} size="sm">
                    {workflow.priority_c.toUpperCase()}
                  </Badge>
                </div>

                {/* Workflow Details */}
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center">
                    <ApperIcon name="User" className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Assigned to: {getUserName(workflow.assignedTo_c)}</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="MapPin" className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Site: {getSiteName(workflow.siteId_c)}</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Calendar" className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Due: {format(new Date(workflow.dueDate_c), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    Created {formatDistanceToNow(new Date(workflow.createdAt_c))} ago
                  </div>
                  <div className="flex items-center space-x-2">
                    {workflow.status_c === 'assigned' && workflow.assignedTo_c === user?.Id && (
                      <Button 
                        size="sm" 
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWorkflowAction(workflow.Id, 'start');
                        }}
                      >
                        Start
                      </Button>
                    )}
                    
                    {workflow.status_c === 'in_progress' && workflow.assignedTo_c === user?.Id && (
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWorkflowAction(workflow.Id, 'complete');
                        }}
                      >
                        Complete
                      </Button>
                    )}

                    {canApproveWorkflow(workflow) && (
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWorkflowAction(workflow.Id, 'approve');
                        }}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <CreateWorkflowModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateWorkflow}
          sites={sites}
          users={users}
        />
      )}
    </div>
  );
};

export default Workflows;