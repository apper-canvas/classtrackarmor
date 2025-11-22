import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { workflowService } from '@/services/api/workflowService';
import { workflowApprovalService } from '@/services/api/workflowApprovalService';
import { workflowAttachmentService } from '@/services/api/workflowAttachmentService';
import { userService } from '@/services/api/userService';
import { siteService } from '@/services/api/siteService';
import { notificationService } from '@/services/api/notificationService';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import { formatDistanceToNow, format } from 'date-fns';

const WorkflowDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const user = useSelector(state => state.user.currentUser);

  const [workflow, setWorkflow] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [completionForm, setCompletionForm] = useState({
    completionNotesEn_c: '',
    completionNotesAr_c: '',
    completionNotesFr_c: ''
  });
  const [approvalForm, setApprovalForm] = useState({
    commentsEn_c: '',
    commentsAr_c: '',
    commentsFr_c: ''
  });
  const [rejectionForm, setRejectionForm] = useState({
    rejectionReason: '',
    commentsEn_c: '',
    commentsAr_c: '',
    commentsFr_c: ''
  });

  // UI states
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [workflowData, usersData, sitesData] = await Promise.all([
        workflowService.getById(id),
        userService.getAll(),
        siteService.getAll()
      ]);

      setWorkflow(workflowData);
      setUsers(usersData);
      setSites(sitesData);

      // Load approvals and attachments
      const [approvalsData, attachmentsData] = await Promise.all([
        workflowApprovalService.getByWorkflowId(id),
        workflowAttachmentService.getByWorkflowId(id)
      ]);

      setApprovals(approvalsData);
      setAttachments(attachmentsData);

    } catch (err) {
      setError(err.message || 'Failed to load workflow');
      toast.error('Failed to load workflow details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

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

  const canUserStartWorkflow = () => {
    return workflow?.status_c === 'assigned' && workflow?.assignedTo_c === user?.Id;
  };

  const canUserCompleteWorkflow = () => {
    return workflow?.status_c === 'in_progress' && workflow?.assignedTo_c === user?.Id;
  };

  const canUserApproveWorkflow = () => {
    const userRole = users.find(u => u.Id_c === user?.Id)?.role?.code_c;
    return ['ceo', 'manager'].includes(userRole) && workflow?.status_c === 'completed';
  };

  const handleAction = async (action) => {
    try {
      setActionLoading({ [action]: true });

      switch (action) {
        case 'start':
          await workflowService.start(workflow.Id, user.Id);
          notificationService.success('Workflow started successfully');
          break;
        case 'complete':
          setShowCompletionForm(true);
          return;
        case 'approve':
          setShowApprovalForm(true);
          return;
        case 'reject':
          setShowRejectionForm(true);
          return;
        default:
          break;
      }

      loadData(); // Refresh data
    } catch (error) {
      toast.error(error.message || `Failed to ${action} workflow`);
    } finally {
      setActionLoading({ [action]: false });
    }
  };

  const handleComplete = async () => {
    try {
      setActionLoading({ complete: true });
      
      await workflowService.complete(workflow.Id, completionForm);
      notificationService.success('Workflow completed successfully');
      
      setShowCompletionForm(false);
      setCompletionForm({
        completionNotesEn_c: '',
        completionNotesAr_c: '',
        completionNotesFr_c: ''
      });
      
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to complete workflow');
    } finally {
      setActionLoading({ complete: false });
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading({ approve: true });
      
      await workflowService.approve(workflow.Id, user.Id);
      notificationService.success('Workflow approved successfully');
      
      setShowApprovalForm(false);
      setApprovalForm({
        commentsEn_c: '',
        commentsAr_c: '',
        commentsFr_c: ''
      });
      
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to approve workflow');
    } finally {
      setActionLoading({ approve: false });
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading({ reject: true });
      
      await workflowService.reject(workflow.Id, user.Id, rejectionForm.rejectionReason);
      notificationService.error('Workflow rejected');
      
      setShowRejectionForm(false);
      setRejectionForm({
        rejectionReason: '',
        commentsEn_c: '',
        commentsAr_c: '',
        commentsFr_c: ''
      });
      
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to reject workflow');
    } finally {
      setActionLoading({ reject: false });
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      
      for (const file of files) {
        await workflowAttachmentService.upload(workflow.Id, file, {
          uploadedBy_c: user.Id,
          isEvidence_c: true
        });
      }
      
      notificationService.success(`${files.length} file(s) uploaded successfully`);
      loadData(); // Refresh attachments
    } catch (error) {
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const isOverdue = () => {
    return new Date(workflow?.dueDate_c) < new Date() && 
           !['approved', 'rejected'].includes(workflow?.status_c);
  };

  const breadcrumbItems = [
    { label: 'Workflows', href: '/workflows' },
    { label: workflow ? getWorkflowTitle(workflow) : 'Loading...' }
  ];

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Workflow"
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (!workflow) {
    return (
      <ErrorView
        title="Workflow Not Found"
        message="The requested workflow could not be found."
        onRetry={() => navigate('/workflows')}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary-400 to-primary-500 rounded-lg">
              <ApperIcon name={getTypeIcon(workflow.type_c)} className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {getWorkflowTitle(workflow)}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <Badge variant={getStatusVariant(workflow.status_c)}>
                  {workflow.status_c.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant={getPriorityVariant(workflow.priority_c)}>
                  {workflow.priority_c.toUpperCase()}
                </Badge>
                {isOverdue() && (
                  <Badge variant="danger" size="sm">
                    OVERDUE
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {canUserStartWorkflow() && (
            <Button 
              onClick={() => handleAction('start')}
              loading={actionLoading.start}
              icon="Play"
            >
              Start Workflow
            </Button>
          )}
          
          {canUserCompleteWorkflow() && (
            <Button 
              onClick={() => handleAction('complete')}
              loading={actionLoading.complete}
              variant="success"
              icon="CheckCircle"
            >
              Complete
            </Button>
          )}
          
          {canUserApproveWorkflow() && (
            <div className="flex space-x-2">
              <Button 
                onClick={() => handleAction('approve')}
                loading={actionLoading.approve}
                variant="success"
                size="sm"
                icon="Check"
              >
                Approve
              </Button>
              <Button 
                onClick={() => handleAction('reject')}
                loading={actionLoading.reject}
                variant="danger"
                size="sm"
                icon="X"
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Workflow Details */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Workflow Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">
                  {getWorkflowDescription(workflow)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Created By</h3>
                  <p className="text-slate-600">{getUserName(workflow.createdBy_c)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Assigned To</h3>
                  <p className="text-slate-600">{getUserName(workflow.assignedTo_c)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Site</h3>
                  <p className="text-slate-600">{getSiteName(workflow.siteId_c)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Due Date</h3>
                  <p className={`font-medium ${isOverdue() ? 'text-red-600' : 'text-slate-600'}`}>
                    {format(new Date(workflow.dueDate_c), 'PPP')}
                  </p>
                </div>
              </div>

              {workflow.completionNotesEn_c && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Completion Notes</h3>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {workflow.completionNotesEn_c}
                  </p>
                </div>
              )}

              {workflow.rejectionReason_c && (
                <div>
                  <h3 className="text-sm font-medium text-red-700 mb-2">Rejection Reason</h3>
                  <p className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    {workflow.rejectionReason_c}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Attachments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Attachments</h2>
              
              {(canUserCompleteWorkflow() || workflow.status_c === 'in_progress') && (
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <Button size="sm" disabled={uploading} loading={uploading}>
                    <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              )}
            </div>
            
            {attachments.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <ApperIcon name="Paperclip" className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No attachments yet</p>
                <p className="text-sm mt-1">Upload files to document this workflow</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attachments.map((attachment) => (
                  <div key={attachment.Id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <ApperIcon 
                      name={workflowAttachmentService.getFileTypeIcon(attachment.fileType_c)} 
                      className="h-8 w-8 text-slate-500 flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {attachment.fileName_c}
                      </p>
                      <p className="text-xs text-slate-500">
                        {workflowAttachmentService.formatFileSize(attachment.fileSize_c)} • 
                        {formatDistanceToNow(new Date(attachment.uploadedAt_c))} ago
                      </p>
                      {attachment.description_c && (
                        <p className="text-xs text-slate-600 mt-1">{attachment.description_c}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Activity Timeline</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-blue-100 rounded-full">
                  <ApperIcon name="Plus" className="h-3 w-3 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Workflow Created</p>
                  <p className="text-xs text-slate-500">
                    by {getUserName(workflow.createdBy_c)} • {formatDistanceToNow(new Date(workflow.createdAt_c))} ago
                  </p>
                </div>
              </div>

              {workflow.assignedAt_c && (
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-amber-100 rounded-full">
                    <ApperIcon name="UserPlus" className="h-3 w-3 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Assigned</p>
                    <p className="text-xs text-slate-500">
                      to {getUserName(workflow.assignedTo_c)} • {formatDistanceToNow(new Date(workflow.assignedAt_c))} ago
                    </p>
                  </div>
                </div>
              )}

              {workflow.startedAt_c && (
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-primary-100 rounded-full">
                    <ApperIcon name="Play" className="h-3 w-3 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Started</p>
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(workflow.startedAt_c))} ago
                    </p>
                  </div>
                </div>
              )}

              {workflow.completedAt_c && (
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-emerald-100 rounded-full">
                    <ApperIcon name="CheckCircle" className="h-3 w-3 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Completed</p>
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(workflow.completedAt_c))} ago
                    </p>
                  </div>
                </div>
              )}

              {workflow.approvedAt_c && (
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-emerald-100 rounded-full">
                    <ApperIcon name="Check" className="h-3 w-3 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Approved</p>
                    <p className="text-xs text-slate-500">
                      by {getUserName(workflow.approvedBy_c)} • {formatDistanceToNow(new Date(workflow.approvedAt_c))} ago
                    </p>
                  </div>
                </div>
              )}

              {workflow.rejectedAt_c && (
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-red-100 rounded-full">
                    <ApperIcon name="X" className="h-3 w-3 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Rejected</p>
                    <p className="text-xs text-slate-500">
                      by {getUserName(workflow.rejectedBy_c)} • {formatDistanceToNow(new Date(workflow.rejectedAt_c))} ago
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Progress */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Progress</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Approvals</span>
                <span>{workflow.approvalCount_c || 0} / {workflow.requiredApprovals_c}</span>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(((workflow.approvalCount_c || 0) / workflow.requiredApprovals_c) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              
              <div className="text-xs text-slate-500">
                {workflow.requiredApprovals_c - (workflow.approvalCount_c || 0)} more approvals needed
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCompletionForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Complete Workflow</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Completion Notes (English)
                </label>
                <textarea
                  value={completionForm.completionNotesEn_c}
                  onChange={(e) => setCompletionForm(prev => ({ ...prev, completionNotesEn_c: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe the work completed and any important observations"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <Button variant="ghost" onClick={() => setShowCompletionForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleComplete} loading={actionLoading.complete}>
                Complete Workflow
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowApprovalForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Approve Workflow</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Approval Comments (Optional)
                </label>
                <textarea
                  value={approvalForm.commentsEn_c}
                  onChange={(e) => setApprovalForm(prev => ({ ...prev, commentsEn_c: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add any comments about your approval"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <Button variant="ghost" onClick={() => setShowApprovalForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleApprove} loading={actionLoading.approve} variant="success">
                Approve Workflow
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowRejectionForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Reject Workflow</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rejection Reason *
                </label>
                <Input
                  value={rejectionForm.rejectionReason}
                  onChange={(e) => setRejectionForm(prev => ({ ...prev, rejectionReason: e.target.value }))}
                  placeholder="Provide a clear reason for rejection"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  value={rejectionForm.commentsEn_c}
                  onChange={(e) => setRejectionForm(prev => ({ ...prev, commentsEn_c: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Provide additional feedback or suggestions"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <Button variant="ghost" onClick={() => setShowRejectionForm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleReject} 
                loading={actionLoading.reject} 
                variant="danger"
                disabled={!rejectionForm.rejectionReason.trim()}
              >
                Reject Workflow
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowDetail;