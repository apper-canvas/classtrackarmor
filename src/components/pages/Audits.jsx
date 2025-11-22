import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";
import { auditService } from "@/services/api/auditService";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import { getAll as getAllRegulations } from "@/services/api/regulatoryAlignmentService";
import { getAll as getAllCompanies } from "@/services/api/companyService";
import { getAll as getAllSites, siteService } from "@/services/api/siteService";
import { getAll as getAllUsers } from "@/services/api/userService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
const Audits = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Set initial tab based on URL path
  const getInitialTab = () => {
    if (location.pathname.includes('/checklists')) return 'checklists';
    return 'audits';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Audit state
  const [audits, setAudits] = useState([]);
  const [sites, setSites] = useState([]);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [editingAudit, setEditingAudit] = useState(null);
  const [auditFormData, setAuditFormData] = useState({
    Name: "",
    type_c: "",
    date_c: "",
    site_c: "",
    compliance_focus_c: ""
  });

  // Non-conformity state
const [nonConformities, setNonConformities] = useState([]);
  const [showNCModal, setShowNCModal] = useState(false);
  const [ncFormData, setNcFormData] = useState({
    Name: "",
    audit_c: "",
    details_c: ""
  });

  // Corrective action state
  const [correctiveActions, setCorrectiveActions] = useState([]);
  const [showCAModal, setShowCAModal] = useState(false);
  const [caFormData, setCaFormData] = useState({
    Name: "",
    non_conformity_c: "",
    description_c: "",
    deadline_c: ""
  });

  // Checklist state
  const [checklists, setChecklists] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [checklistFormData, setChecklistFormData] = useState({
    Name: "",
    audit_c: "",
    description_c: ""
  });
  const [itemFormData, setItemFormData] = useState({
    Name: "",
    checklist_id: "",
    description_c: "",
    is_completed: false
  });
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  // Evidence state
  const [evidence, setEvidence] = useState([]);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceFormData, setEvidenceFormData] = useState({
    Name: "",
    corrective_action_c: "",
    description_c: "",
    file_c: ""
  });

  // Reports state
  const [reports, setReports] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
    loadData();
    if (activeTab === 'checklists') {
      loadChecklistItems();
    }
  }, [activeTab]);

  // Handle URL changes for tab navigation
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'checklists') {
      navigate('/audits/checklists');
    } else if (tabId === 'audits') {
      navigate('/audits');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

const [auditData, siteData] = await Promise.all([
        auditService.getAllAudits(),
        getAllSites()
      ]);

      setAudits(auditData);
      setSites(siteData);

switch (activeTab) {
        case 'non-conformities':
          const ncData = await auditService.getAllNonConformities();
          setNonConformities(ncData);
          break;
        case 'corrective-actions':
          const caData = await auditService.getAllCorrectiveActions();
          setCorrectiveActions(caData);
          break;
        case 'evidence':
          const evidenceData = await auditService.getAllEvidence();
          setEvidence(evidenceData);
          break;
        case 'reports':
          const reportData = await auditService.getAllReports();
          setReports(reportData);
          break;
        case 'checklists':
          const checklistData = await auditService.getAllChecklists();
          setChecklists(checklistData);
          break;
      }
    } catch (err) {
      setError(err.message || "Failed to load audit data");
      toast.error("Failed to load audit data");
    } finally {
      setLoading(false);
    }
  };

  // Audit handlers
  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAudit) {
        await auditService.updateAudit(editingAudit.Id, auditFormData);
      } else {
        await auditService.createAudit(auditFormData);
      }
      setShowAuditModal(false);
      setEditingAudit(null);
      resetAuditForm();
      await loadData();
    } catch (error) {
      toast.error(editingAudit ? "Failed to update audit" : "Failed to create audit");
    }
  };

  const handleAuditEdit = (audit) => {
    setEditingAudit(audit);
    setAuditFormData({
      Name: audit.Name || "",
      type_c: audit.type_c || "",
      date_c: audit.date_c || "",
      site_c: audit.site_c?.Id || "",
      compliance_focus_c: audit.compliance_focus_c || ""
    });
    setShowAuditModal(true);
  };

  const handleAuditDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this audit?")) return;
    const success = await auditService.deleteAudit(id);
    if (success) await loadData();
  };

  const resetAuditForm = () => {
    setAuditFormData({
      Name: "",
      type_c: "",
      date_c: "",
      site_c: "",
      compliance_focus_c: ""
    });
  };

  // Non-conformity handlers
const handleNCSubmit = async (e) => {
    e.preventDefault();
    try {
      await auditService.createNonConformity({
        ...ncFormData,
        audit_c: parseInt(ncFormData.audit_c)
      });
      setShowNCModal(false);
      setNcFormData({ Name: "", audit_c: "", details_c: "" });
      await loadData();
      toast.success("Non-conformity recorded successfully");
    } catch (error) {
      toast.error("Failed to create non-conformity");
    }
  };

  // Corrective action handlers
  const handleCASubmit = async (e) => {
    e.preventDefault();
    try {
      await auditService.createCorrectiveAction({
        ...caFormData,
        non_conformity_c: parseInt(caFormData.non_conformity_c)
      });
      setShowCAModal(false);
      setCaFormData({ Name: "", non_conformity_c: "", description_c: "", deadline_c: "" });
      await loadData();
      toast.success("Corrective action created successfully");
    } catch (error) {
      toast.error("Failed to create corrective action");
    }
  };

  // Evidence handlers
  const handleEvidenceSubmit = async (e) => {
    e.preventDefault();
    try {
      await auditService.createEvidence({
        ...evidenceFormData,
        corrective_action_c: parseInt(evidenceFormData.corrective_action_c)
      });
      setShowEvidenceModal(false);
      setEvidenceFormData({ Name: "", corrective_action_c: "", description_c: "", file_c: "" });
      await loadData();
      toast.success("Evidence uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload evidence");
    }
  };

  // Checklist handlers
  const loadChecklistItems = async () => {
    try {
      const items = await auditService.getAllChecklistItems();
      setChecklistItems(items);
    } catch (error) {
      toast.error("Failed to load checklist items");
    }
  };

  const handleChecklistSubmit = async (e) => {
    e.preventDefault();
    try {
      await auditService.createChecklist({
        ...checklistFormData,
        audit_c: parseInt(checklistFormData.audit_c)
      });
      setShowChecklistModal(false);
      setChecklistFormData({ Name: "", audit_c: "", description_c: "" });
      await loadData();
      toast.success("Checklist created successfully");
    } catch (error) {
      toast.error("Failed to create checklist");
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      await auditService.createChecklistItem({
        ...itemFormData,
        checklist_id: parseInt(itemFormData.checklist_id)
      });
      setShowItemModal(false);
      setItemFormData({ Name: "", checklist_id: "", description_c: "", is_completed: false });
      await loadChecklistItems();
      toast.success("Checklist item added successfully");
    } catch (error) {
      toast.error("Failed to add checklist item");
    }
  };

  const handleItemToggle = async (itemId, currentStatus) => {
    try {
      await auditService.updateChecklistItem(itemId, { is_completed: !currentStatus });
      await loadChecklistItems();
      toast.success("Item status updated");
    } catch (error) {
      toast.error("Failed to update item status");
    }
  };

  // Report generation
  const handleGenerateReport = async (auditId, language) => {
    try {
      setGeneratingReport(true);
      await auditService.generateReport(auditId, language);
      await loadData();
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setGeneratingReport(false);
    }
  };

  const getStatusBadge = (audit) => {
    const auditDate = new Date(audit.date_c);
    const now = new Date();
    
    if (isAfter(auditDate, now)) {
      return <Badge variant="primary" size="sm">Scheduled</Badge>;
    } else {
      return <Badge variant="success" size="sm">Completed</Badge>;
    }
  };

  const getSiteName = (siteId) => {
    const site = sites.find(s => s.Id === siteId);
    return site?.Name || 'Unknown Site';
  };

  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'audits':
return audits.filter(item => {
          const name = String(item.Name || '').toLowerCase();
          const type = String(item.type_c || '').toLowerCase();
          return name.includes(term) || type.includes(term);
        });
case 'non-conformities':
        return nonConformities.filter(item => {
          const name = String(item.Name || '').toLowerCase();
          const details = String(item.details_c || '').toLowerCase();
          return name.includes(term) || details.includes(term);
        });
      case 'corrective-actions':
        return correctiveActions.filter(item => {
          const name = String(item.Name || '').toLowerCase();
          const description = String(item.description_c || '').toLowerCase();
          return name.includes(term) || description.includes(term);
        });
      case 'evidence':
        return evidence.filter(item => {
          const name = String(item.Name || '').toLowerCase();
          const description = String(item.description_c || '').toLowerCase();
          return name.includes(term) || description.includes(term);
        });
      case 'reports':
        return reports.filter(item => {
          const name = String(item.Name || '').toLowerCase();
          return name.includes(term);
        });
      case 'checklists':
        return checklists.filter(item => {
          const name = String(item.Name || '').toLowerCase();
          const description = String(item.description_c || '').toLowerCase();
          return name.includes(term) || description.includes(term);
        });
      default:
        return [];
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  const tabs = [
{ id: 'audits', label: 'Audits', icon: 'CheckCircle' },
    { id: 'non-conformities', label: 'Non-Conformities', icon: 'AlertTriangle' },
    { id: 'corrective-actions', label: 'Corrective Actions', icon: 'Hammer' },
    { id: 'evidence', label: 'Evidence', icon: 'Paperclip' },
    { id: 'checklists', label: 'Checklists', icon: 'ListChecks' },
    { id: 'reports', label: 'Reports', icon: 'FileText' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Audit Management
          </h1>
          <p className="text-slate-600">
            Manage regulatory compliance audits for ONSSA, Labour Code, Protection Civile, and Tourism Ministry
          </p>
        </div>
        <Button 
          variant="primary" 
          icon="Plus"
          onClick={() => setShowAuditModal(true)}
        >
          New Audit
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label?.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          <Button variant="outline" icon="Filter">
            Filter
          </Button>
        </div>
      </Card>

      {/* Content */}
      {activeTab === 'audits' && (
        <div>
          {filteredData().length === 0 ? (
            <Empty
              icon="CheckCircle"
              title="No audits found"
              description="Start by scheduling your first regulatory audit."
              action={
                <Button variant="primary" icon="Plus" onClick={() => setShowAuditModal(true)}>
                  Schedule Audit
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredData().map((audit) => (
                <Card key={audit.Id} className="hover:shadow-lg transition-shadow duration-200">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                          {audit.Name || "Unnamed Audit"}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(audit)}
                          {audit.type_c && (
                            <Badge variant="outline" size="sm">
                              {audit.type_c}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => handleAuditEdit(audit)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleAuditDelete(audit.Id)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <ApperIcon name="Calendar" className="h-4 w-4" />
                        <span>{audit.date_c ? format(new Date(audit.date_c), 'MMM dd, yyyy') : 'No date set'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <ApperIcon name="MapPin" className="h-4 w-4" />
                        <span>{audit.site_c?.Name || 'No site assigned'}</span>
                      </div>

                      {audit.compliance_focus_c && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <ApperIcon name="Shield" className="h-4 w-4" />
                          <span>{audit.compliance_focus_c}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="text-xs text-slate-500">
                        {audit.CreatedOn && (
                          <span>
                            Created {formatDistanceToNow(new Date(audit.CreatedOn), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        icon="FileText"
                        onClick={() => handleGenerateReport(audit.Id, 'English')}
                        disabled={generatingReport}
                      >
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

{activeTab === 'non-conformities' && (
        <div>
          <div className="mb-4">
            <Button 
              variant="primary" 
              icon="Plus"
              onClick={() => setShowNCModal(true)}
            >
              Record Non-Conformity
            </Button>
          </div>
          
          {filteredData().length === 0 ? (
            <Empty
              icon="AlertTriangle"
              title="No non-conformities found"
              description="Record non-conformities found during audits."
            />
          ) : (
            <div className="space-y-4">
{filteredData().map((nc) => (
                <Card key={nc.Id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{nc.Name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{nc.details_c}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                        <span>Audit: {nc.audit_c?.Name || 'Unknown'}</span>
                        {nc.CreatedOn && (
                          <span>
                            Recorded {formatDistanceToNow(new Date(nc.CreatedOn), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="warning" size="sm">Non-Conformity</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'corrective-actions' && (
        <div>
          <div className="mb-4">
            <Button 
variant="primary" 
              icon="Plus"
              onClick={() => setShowCAModal(true)}
            >
              Add Corrective Action
            </Button>
          </div>
          
          {filteredData().length === 0 ? (
            <Empty
              icon="Hammer"
              title="No corrective actions found"
              description="Create corrective actions to address non-conformities."
            />
          ) : (
            <div className="space-y-4">
{filteredData().map((ca) => {
                const isOverdue = ca.deadline_c && isAfter(new Date(), new Date(ca.deadline_c));
                return (
                  <Card key={ca.Id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{ca.Name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{ca.description_c}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                          <span>Non-Conformity: {ca.non_conformity_c?.Name || 'Unknown'}</span>
                          {ca.deadline_c && (
                            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                              Due: {format(new Date(ca.deadline_c), 'MMM dd, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={isOverdue ? "error" : "primary"} size="sm">
                        {isOverdue ? 'Overdue' : 'Pending'}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'evidence' && (
        <div>
          <div className="mb-4">
            <Button 
              variant="primary" 
              icon="Plus"
              onClick={() => setShowEvidenceModal(true)}
            >
              Upload Evidence
            </Button>
          </div>
          
          {filteredData().length === 0 ? (
            <Empty
              icon="Paperclip"
              title="No evidence found"
              description="Upload evidence for corrective actions."
            />
          ) : (
            <div className="space-y-4">
              {filteredData().map((ev) => (
                <Card key={ev.Id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{ev.Name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{ev.description_c}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                        <span>Action: {ev.corrective_action_c?.Name || 'Unknown'}</span>
                        {ev.file_c && (
                          <span className="text-primary-600">File attached</span>
                        )}
                        {ev.CreatedOn && (
                          <span>
                            Uploaded {formatDistanceToNow(new Date(ev.CreatedOn), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                    <ApperIcon name="Paperclip" className="h-5 w-5 text-slate-400" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
{activeTab === 'checklists' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <Button 
              variant="primary" 
              icon="Plus"
              onClick={() => setShowChecklistModal(true)}
            >
              Create Checklist
            </Button>
            {selectedChecklist && (
              <Button 
                variant="outline" 
                icon="Plus"
                onClick={() => {
                  setItemFormData({ ...itemFormData, checklist_id: selectedChecklist.Id });
                  setShowItemModal(true);
                }}
              >
                Add Item
              </Button>
            )}
          </div>
          
          {filteredData().length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="ListChecks" size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 mb-4">No checklists created yet</p>
              <Button 
                variant="primary" 
                icon="Plus"
                onClick={() => setShowChecklistModal(true)}
              >
                Create First Checklist
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData().map((checklist) => {
                const items = checklistItems.filter(item => item.checklist_id === checklist.Id);
                const completedItems = items.filter(item => item.is_completed).length;
                const totalItems = items.length;
                const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
                
                return (
                  <Card key={checklist.Id}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium text-slate-900">{checklist.Name}</h3>
                            <Badge variant={progress === 100 ? "success" : progress > 0 ? "primary" : "outline"} size="sm">
                              {progress}% Complete
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{checklist.description_c}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                            <span>Audit: {checklist.audit_c?.Name || 'Unknown'}</span>
                            <span>{totalItems} items</span>
                            {checklist.CreatedOn && (
                              <span>
                                Created {formatDistanceToNow(new Date(checklist.CreatedOn), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedChecklist(selectedChecklist?.Id === checklist.Id ? null : checklist)}
                        >
                          {selectedChecklist?.Id === checklist.Id ? 'Hide Items' : 'Show Items'}
                        </Button>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      {/* Checklist Items */}
                      {selectedChecklist?.Id === checklist.Id && (
                        <div className="border-t border-slate-200 pt-4">
                          <div className="space-y-2">
                            {items.length === 0 ? (
                              <p className="text-sm text-slate-500 text-center py-4">No items in this checklist</p>
                            ) : (
                              items.map((item) => (
                                <div key={item.Id} className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded-md">
                                  <button
                                    onClick={() => handleItemToggle(item.Id, item.is_completed)}
                                    className="mt-0.5"
                                  >
                                    <ApperIcon 
                                      name={item.is_completed ? "CheckSquare" : "Square"} 
                                      size={16}
                                      className={item.is_completed ? "text-primary-500" : "text-slate-400 hover:text-slate-600"}
                                    />
                                  </button>
                                  <div className="flex-1">
                                    <p className={`text-sm ${item.is_completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                      {item.Name}
                                    </p>
                                    {item.description_c && (
                                      <p className="text-xs text-slate-500 mt-1">{item.description_c}</p>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div>
          {filteredData().length === 0 ? (
            <Empty
              icon="FileText"
              title="No reports found"
              description="Generate audit reports from completed audits."
            />
          ) : (
            <div className="space-y-4">
              {filteredData().map((report) => (
                <Card key={report.Id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{report.Name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                        <span>Language: {report.language_c}</span>
                        {report.report_date_c && (
                          <span>Date: {format(new Date(report.report_date_c), 'MMM dd, yyyy')}</span>
                        )}
                        <span>Audit: {report.audit_c?.Name || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" size="sm">
                        {report.language_c}
                      </Badge>
                      <Button variant="outline" size="sm" icon="Download">
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Audit Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAuditSubmit}>
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingAudit ? "Edit Audit" : "Schedule New Audit"}
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Audit Name
                  </label>
                  <Input
                    value={auditFormData.Name}
                    onChange={(e) => setAuditFormData({ ...auditFormData, Name: e.target.value })}
                    placeholder="Enter audit name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={auditFormData.type_c}
                      onChange={(e) => setAuditFormData({ ...auditFormData, type_c: e.target.value })}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Semi-annual">Semi-annual</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={auditFormData.date_c}
                      onChange={(e) => setAuditFormData({ ...auditFormData, date_c: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Site
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={auditFormData.site_c}
                    onChange={(e) => setAuditFormData({ ...auditFormData, site_c: e.target.value })}
                    required
                  >
                    <option value="">Select site</option>
                    {sites.map((site) => (
                      <option key={site.Id} value={site.Id}>
                        {site.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Compliance Focus
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={auditFormData.compliance_focus_c}
                    onChange={(e) => setAuditFormData({ ...auditFormData, compliance_focus_c: e.target.value })}
                  >
                    <option value="">Select compliance focus</option>
                    <option value="ONSSA">ONSSA</option>
                    <option value="Labour Code">Labour Code</option>
                    <option value="Protection Civile">Protection Civile</option>
                    <option value="Tourism Ministry">Tourism Ministry</option>
                    <option value="ONSSA,Labour Code">ONSSA + Labour Code</option>
                    <option value="ONSSA,Protection Civile">ONSSA + Protection Civile</option>
                    <option value="All">All Regulations</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAuditModal(false);
                    setEditingAudit(null);
                    resetAuditForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingAudit ? "Update" : "Schedule"} Audit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Non-Conformity Modal */}
{showNCModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <form onSubmit={handleNCSubmit}>
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  Record Non-Conformity
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <Input
                    value={ncFormData.Name}
                    onChange={(e) => setNcFormData({ ...ncFormData, Name: e.target.value })}
                    placeholder="Non-conformity title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Audit
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={ncFormData.audit_c}
                    onChange={(e) => setNcFormData({ ...ncFormData, audit_c: e.target.value })}
                    required
                  >
                    <option value="">Select audit</option>
                    {audits.map((audit) => (
                      <option key={audit.Id} value={audit.Id}>
                        {audit.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Details
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="4"
                    value={ncFormData.details_c}
                    onChange={(e) => setNcFormData({ ...ncFormData, details_c: e.target.value })}
                    placeholder="Describe the non-conformity..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNCModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Record Non-Conformity
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checklist Modal */}
      {showChecklistModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <form onSubmit={handleChecklistSubmit}>
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  Create Checklist
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Checklist Name
                  </label>
                  <Input
                    value={checklistFormData.Name}
                    onChange={(e) => setChecklistFormData({ ...checklistFormData, Name: e.target.value })}
                    placeholder="Enter checklist name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Audit
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={checklistFormData.audit_c}
                    onChange={(e) => setChecklistFormData({ ...checklistFormData, audit_c: e.target.value })}
                    required
                  >
                    <option value="">Select audit</option>
                    {audits.map((audit) => (
                      <option key={audit.Id} value={audit.Id}>
                        {audit.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    value={checklistFormData.description_c}
                    onChange={(e) => setChecklistFormData({ ...checklistFormData, description_c: e.target.value })}
                    placeholder="Describe this checklist..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowChecklistModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Checklist
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checklist Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <form onSubmit={handleItemSubmit}>
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  Add Checklist Item
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Item Name
                  </label>
                  <Input
                    value={itemFormData.Name}
                    onChange={(e) => setItemFormData({ ...itemFormData, Name: e.target.value })}
                    placeholder="Enter checklist item"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Checklist
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={itemFormData.checklist_id}
                    onChange={(e) => setItemFormData({ ...itemFormData, checklist_id: e.target.value })}
                    required
                  >
                    <option value="">Select checklist</option>
                    {checklists.map((checklist) => (
                      <option key={checklist.Id} value={checklist.Id}>
                        {checklist.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="2"
                    value={itemFormData.description_c}
                    onChange={(e) => setItemFormData({ ...itemFormData, description_c: e.target.value })}
                    placeholder="Additional details (optional)"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowItemModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Add Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Corrective Action Modal */}
{showCAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <form onSubmit={handleCASubmit}>
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  Add Corrective Action
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Action Name
                  </label>
                  <Input
                    value={caFormData.Name}
                    onChange={(e) => setCaFormData({ ...caFormData, Name: e.target.value })}
                    placeholder="Corrective action name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Non-Conformity
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={caFormData.non_conformity_c}
                    onChange={(e) => setCaFormData({ ...caFormData, non_conformity_c: e.target.value })}
                    required
                  >
                    <option value="">Select non-conformity</option>
                    {nonConformities.map((nc) => (
                      <option key={nc.Id} value={nc.Id}>
                        {nc.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Deadline
                  </label>
                  <Input
                    type="date"
                    value={caFormData.deadline_c}
                    onChange={(e) => setCaFormData({ ...caFormData, deadline_c: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    value={caFormData.description_c}
                    onChange={(e) => setCaFormData({ ...caFormData, description_c: e.target.value })}
                    placeholder="Describe the corrective action..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCAModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Action
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <form onSubmit={handleEvidenceSubmit}>
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  Upload Evidence
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Evidence Name
                  </label>
                  <Input
                    value={evidenceFormData.Name}
                    onChange={(e) => setEvidenceFormData({ ...evidenceFormData, Name: e.target.value })}
                    placeholder="Evidence title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Corrective Action
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={evidenceFormData.corrective_action_c}
                    onChange={(e) => setEvidenceFormData({ ...evidenceFormData, corrective_action_c: e.target.value })}
                    required
                  >
                    <option value="">Select corrective action</option>
                    {correctiveActions.map((ca) => (
                      <option key={ca.Id} value={ca.Id}>
                        {ca.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    File Path
                  </label>
                  <Input
                    value={evidenceFormData.file_c}
                    onChange={(e) => setEvidenceFormData({ ...evidenceFormData, file_c: e.target.value })}
                    placeholder="File path or URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    value={evidenceFormData.description_c}
                    onChange={(e) => setEvidenceFormData({ ...evidenceFormData, description_c: e.target.value })}
                    placeholder="Describe the evidence..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEvidenceModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Upload Evidence
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audits;