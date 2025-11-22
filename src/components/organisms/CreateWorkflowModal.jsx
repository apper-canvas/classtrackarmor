import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const CreateWorkflowModal = ({ isOpen, onClose, onSubmit, sites, users }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  
  const [formData, setFormData] = useState({
    titleEn_c: '',
    titleAr_c: '',
    titleFr_c: '',
    descriptionEn_c: '',
    descriptionAr_c: '',
    descriptionFr_c: '',
    type_c: 'safety_inspection',
    priority_c: 'medium',
    siteId_c: '',
    assignedTo_c: '',
    dueDate_c: '',
    requiredApprovals_c: 2
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const workflowTypes = [
    { value: 'safety_inspection', label: 'Safety Inspection', icon: 'Shield' },
    { value: 'fire_safety', label: 'Fire Safety', icon: 'Flame' },
    { value: 'equipment_check', label: 'Equipment Check', icon: 'Wrench' },
    { value: 'compliance_audit', label: 'Compliance Audit', icon: 'ClipboardCheck' },
    { value: 'incident_report', label: 'Incident Report', icon: 'AlertTriangle' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-emerald-600' },
    { value: 'medium', label: 'Medium', color: 'text-amber-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-700' }
  ];

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titleEn_c.trim()) {
      newErrors.titleEn_c = 'English title is required';
    }
    
    if (!formData.descriptionEn_c.trim()) {
      newErrors.descriptionEn_c = 'English description is required';
    }
    
    if (!formData.siteId_c) {
      newErrors.siteId_c = 'Site is required';
    }
    
    if (!formData.assignedTo_c) {
      newErrors.assignedTo_c = 'Assignee is required';
    }
    
    if (!formData.dueDate_c) {
      newErrors.dueDate_c = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const getSiteName = (site) => {
    const langSuffix = currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
    return site[`name${langSuffix}_c`] || site.nameEn_c;
  };

  const getUserName = (user) => {
    const langSuffix = currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
    return user[`fullName${langSuffix}_c`] || user.fullNameEn_c;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ApperIcon name="Plus" className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Create New Workflow</h2>
              <p className="text-sm text-slate-600">Create a new safety workflow with multilingual support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Workflow Type and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Workflow Type
                </label>
                <select
                  value={formData.type_c}
                  onChange={(e) => handleInputChange('type_c', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {workflowTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority_c}
                  onChange={(e) => handleInputChange('priority_c', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title Fields (Multilingual) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Workflow Title</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <span className="mr-2">🇺🇸</span>
                    English Title *
                  </label>
                  <Input
                    value={formData.titleEn_c}
                    onChange={(e) => handleInputChange('titleEn_c', e.target.value)}
                    placeholder="Enter workflow title in English"
                    error={errors.titleEn_c}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <span className="mr-2">🇲🇦</span>
                    Arabic Title
                  </label>
                  <Input
                    value={formData.titleAr_c}
                    onChange={(e) => handleInputChange('titleAr_c', e.target.value)}
                    placeholder="أدخل عنوان المهمة باللغة العربية"
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <span className="mr-2">🇫🇷</span>
                    French Title
                  </label>
                  <Input
                    value={formData.titleFr_c}
                    onChange={(e) => handleInputChange('titleFr_c', e.target.value)}
                    placeholder="Entrez le titre du flux de travail en français"
                  />
                </div>
              </div>
            </div>

            {/* Description Fields (Multilingual) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Workflow Description</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <span className="mr-2">🇺🇸</span>
                    English Description *
                  </label>
                  <textarea
                    value={formData.descriptionEn_c}
                    onChange={(e) => handleInputChange('descriptionEn_c', e.target.value)}
                    placeholder="Describe the workflow objectives and requirements"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.descriptionEn_c ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.descriptionEn_c && (
                    <p className="text-sm text-red-600 mt-1">{errors.descriptionEn_c}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <span className="mr-2">🇲🇦</span>
                    Arabic Description
                  </label>
                  <textarea
                    value={formData.descriptionAr_c}
                    onChange={(e) => handleInputChange('descriptionAr_c', e.target.value)}
                    placeholder="صف أهداف ومتطلبات المهمة"
                    rows={3}
                    dir="rtl"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-right resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <span className="mr-2">🇫🇷</span>
                    French Description
                  </label>
                  <textarea
                    value={formData.descriptionFr_c}
                    onChange={(e) => handleInputChange('descriptionFr_c', e.target.value)}
                    placeholder="Décrivez les objectifs et exigences du flux de travail"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Assignment and Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Site *
                </label>
                <select
                  value={formData.siteId_c}
                  onChange={(e) => handleInputChange('siteId_c', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.siteId_c ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select a site</option>
                  {sites.map(site => (
                    <option key={site.Id_c} value={site.Id_c}>
                      {getSiteName(site)}
                    </option>
                  ))}
                </select>
                {errors.siteId_c && (
                  <p className="text-sm text-red-600 mt-1">{errors.siteId_c}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assign To *
                </label>
                <select
                  value={formData.assignedTo_c}
                  onChange={(e) => handleInputChange('assignedTo_c', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.assignedTo_c ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select an assignee</option>
                  {users.map(user => (
                    <option key={user.Id_c} value={user.Id_c}>
                      {getUserName(user)}
                    </option>
                  ))}
                </select>
                {errors.assignedTo_c && (
                  <p className="text-sm text-red-600 mt-1">{errors.assignedTo_c}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Due Date *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.dueDate_c}
                  onChange={(e) => handleInputChange('dueDate_c', e.target.value)}
                  error={errors.dueDate_c}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Required Approvals
                </label>
                <select
                  value={formData.requiredApprovals_c}
                  onChange={(e) => handleInputChange('requiredApprovals_c', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={1}>1 - Manager Only</option>
                  <option value={2}>2 - Manager + CEO</option>
                  <option value={3}>3 - Site Manager + Regional Manager + CEO</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            Create Workflow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkflowModal;