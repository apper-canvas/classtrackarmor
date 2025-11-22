import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import Breadcrumb from '@/components/molecules/Breadcrumb';

// Mock service for checklist management
const mockChecklists = [
  {
    Id: 1,
    title: 'HACCP Food Safety Checklist',
    description: 'Comprehensive HACCP compliance checklist for food processing facilities',
    category: 'Food Safety',
    status: 'active',
    items: 25,
    regulatoryStandard: 'HACCP',
    lastUpdated: '2024-01-15',
    createdBy: 'System Administrator',
    priority: 'high',
    completionRate: 85
  },
  {
    Id: 2,
    title: 'Workplace Safety Inspection',
    description: 'General workplace safety inspection checklist covering essential safety measures',
    category: 'Workplace Safety',
    status: 'active',
    items: 18,
    regulatoryStandard: 'ONSSA',
    lastUpdated: '2024-01-12',
    createdBy: 'Safety Manager',
    priority: 'medium',
    completionRate: 92
  },
  {
    Id: 3,
    title: 'Equipment Maintenance Check',
    description: 'Regular equipment maintenance and safety verification checklist',
    category: 'Equipment',
    status: 'draft',
    items: 15,
    regulatoryStandard: 'ISO 45001',
    lastUpdated: '2024-01-10',
    createdBy: 'Maintenance Lead',
    priority: 'low',
    completionRate: 60
  },
  {
    Id: 4,
    title: 'Emergency Response Procedures',
    description: 'Emergency response readiness and procedure verification checklist',
    category: 'Emergency',
    status: 'active',
    items: 12,
    regulatoryStandard: 'Local Regulations',
    lastUpdated: '2024-01-08',
    createdBy: 'Emergency Coordinator',
    priority: 'high',
    completionRate: 100
  }
];

const checklistService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockChecklists];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const checklist = mockChecklists.find(c => c.Id === parseInt(id));
    if (!checklist) throw new Error('Checklist not found');
    return { ...checklist };
  },

  create: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newChecklist = {
      Id: Math.max(...mockChecklists.map(c => c.Id)) + 1,
      ...data,
      status: 'draft',
      items: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      createdBy: 'Current User',
      completionRate: 0
    };
    mockChecklists.push(newChecklist);
    return { ...newChecklist };
  },

  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockChecklists.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error('Checklist not found');
    
    mockChecklists[index] = {
      ...mockChecklists[index],
      ...data,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    return { ...mockChecklists[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockChecklists.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error('Checklist not found');
    mockChecklists.splice(index, 1);
    return true;
  }
};

const AuditChecklists = () => {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    regulatoryStandard: '',
    priority: 'medium'
  });

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Audits', path: '/audits' },
    { label: 'Checklists', path: '/audits/checklists' }
  ];

  // Load checklists
  useEffect(() => {
    const loadChecklists = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await checklistService.getAll();
        setChecklists(data);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load checklists');
      } finally {
        setLoading(false);
      }
    };

    loadChecklists();
  }, []);

  // Filter checklists
  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checklist.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || checklist.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || checklist.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(checklists.map(c => c.category))];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      if (editingChecklist) {
        const updated = await checklistService.update(editingChecklist.Id, formData);
        setChecklists(prev => prev.map(c => c.Id === updated.Id ? updated : c));
        toast.success('Checklist updated successfully');
      } else {
        const created = await checklistService.create(formData);
        setChecklists(prev => [...prev, created]);
        toast.success('Checklist created successfully');
      }
      
      handleCloseModal();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this checklist? This action cannot be undone.')) {
      return;
    }

    try {
      await checklistService.delete(id);
      setChecklists(prev => prev.filter(c => c.Id !== id));
      toast.success('Checklist deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete checklist');
    }
  };

  // Handle edit
  const handleEdit = (checklist) => {
    setEditingChecklist(checklist);
    setFormData({
      title: checklist.title,
      description: checklist.description,
      category: checklist.category,
      regulatoryStandard: checklist.regulatoryStandard,
      priority: checklist.priority
    });
    setShowCreateModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingChecklist(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      regulatoryStandard: '',
      priority: 'medium'
    });
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'secondary';
      default: return 'secondary';
    }
  };

  // Get priority badge variant
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading && checklists.length === 0) return <Loading />;
  if (error && checklists.length === 0) return <ErrorView message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Audit Checklists</h1>
            <p className="text-slate-600 mt-2">
              Manage safety and compliance checklists for your facilities
            </p>
          </div>
          
          <Button 
            onClick={() => setShowCreateModal(true)}
            icon="Plus"
            iconPosition={isRTL ? "right" : "left"}
          >
            Create Checklist
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search checklists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
              iconPosition={isRTL ? "right" : "left"}
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-slate-600 flex items-center">
            <span>Total: {filteredChecklists.length} checklists</span>
          </div>
        </div>
      </Card>

      {/* Checklists Grid */}
      {filteredChecklists.length === 0 ? (
        <Empty 
          icon="FileText"
          title="No checklists found"
          description={searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
            ? "No checklists match your current filters. Try adjusting your search criteria."
            : "Get started by creating your first audit checklist."
          }
          action={
            <Button 
              onClick={() => setShowCreateModal(true)}
              icon="Plus"
              iconPosition={isRTL ? "right" : "left"}
            >
              Create Checklist
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredChecklists.map((checklist) => (
            <Card key={checklist.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {checklist.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {checklist.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(checklist)}
                      icon="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(checklist.Id)}
                      icon="Trash2"
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getStatusVariant(checklist.status)}>
                    {checklist.status.charAt(0).toUpperCase() + checklist.status.slice(1)}
                  </Badge>
                  <Badge variant={getPriorityVariant(checklist.priority)}>
                    {checklist.priority.charAt(0).toUpperCase() + checklist.priority.slice(1)} Priority
                  </Badge>
                  <Badge variant="secondary">
                    {checklist.category}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="FileText" className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600">{checklist.items} items</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Shield" className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 truncate">{checklist.regulatoryStandard}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Completion Rate</span>
                    <span className="font-medium text-slate-900">{checklist.completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${checklist.completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Updated {checklist.lastUpdated}</span>
                    <span>by {checklist.createdBy}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingChecklist ? 'Edit Checklist' : 'Create New Checklist'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  icon="X"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter checklist title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter checklist description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select category...</option>
                  <option value="Food Safety">Food Safety</option>
                  <option value="Workplace Safety">Workplace Safety</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Quality">Quality</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Regulatory Standard
                </label>
                <select
                  value={formData.regulatoryStandard}
                  onChange={(e) => setFormData(prev => ({ ...prev, regulatoryStandard: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select standard...</option>
                  <option value="HACCP">HACCP</option>
                  <option value="ONSSA">ONSSA</option>
                  <option value="ISO 45001">ISO 45001</option>
                  <option value="ISO 22000">ISO 22000</option>
                  <option value="Local Regulations">Local Regulations</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  icon={editingChecklist ? "Save" : "Plus"}
                  iconPosition={isRTL ? "right" : "left"}
                >
                  {editingChecklist ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditChecklists;