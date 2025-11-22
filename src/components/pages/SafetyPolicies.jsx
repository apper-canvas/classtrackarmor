import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'react-toastify';

const SafetyPolicies = () => {
  const { t, dir } = useTranslation();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const loadPolicies = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockPolicies = [
          {
            id: 1,
            title: t('workplace_safety_policy'),
            category: 'workplace',
            lastUpdated: '2024-01-15',
            status: 'active',
            version: '2.1',
            approvedBy: 'Safety Manager',
            documentUrl: '#'
          },
          {
            id: 2,
            title: t('chemical_handling_policy'),
            category: 'chemical',
            lastUpdated: '2024-01-10',
            status: 'active',
            version: '1.3',
            approvedBy: 'Chemical Safety Officer',
            documentUrl: '#'
          },
          {
            id: 3,
            title: t('emergency_response_policy'),
            category: 'emergency',
            lastUpdated: '2024-01-05',
            status: 'review',
            version: '3.0',
            approvedBy: 'Emergency Coordinator',
            documentUrl: '#'
          },
          {
            id: 4,
            title: t('food_safety_policy'),
            category: 'food',
            lastUpdated: '2023-12-20',
            status: 'active',
            version: '2.5',
            approvedBy: 'Food Safety Manager',
            documentUrl: '#'
          }
        ];
        setPolicies(mockPolicies);
        setLoading(false);
      }, 1000);
    };

    loadPolicies();
  }, [t]);

  const categories = [
    { value: 'all', label: t('all_categories') },
    { value: 'workplace', label: t('workplace_safety') },
    { value: 'chemical', label: t('chemical_safety') },
    { value: 'emergency', label: t('emergency_response') },
    { value: 'food', label: t('food_safety') },
    { value: 'environmental', label: t('environmental') }
  ];

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreatePolicy = () => {
    setShowCreateModal(true);
  };

  const handleDownloadPolicy = (policy) => {
    toast.success(t('downloading_policy', { title: policy.title }));
  };

  const handleUpdatePolicy = (policy) => {
    toast.info(t('policy_update_initiated', { title: policy.title }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'success', label: t('active') },
      review: { variant: 'warning', label: t('under_review') },
      draft: { variant: 'secondary', label: t('draft') },
      expired: { variant: 'error', label: t('expired') }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const breadcrumbItems = [
    { label: t('dashboard'), href: '/dashboard' },
    { label: t('safety_policies'), href: '/safety-policies', current: true }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            <p className="text-slate-600">{t('loading_policies')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={dir}>
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('safety_policies')}</h1>
          <p className="text-slate-600 mt-1">{t('safety_policies_description')}</p>
        </div>
        <Button onClick={handleCreatePolicy} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {t('create_policy')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={16} 
                className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 ${
                  dir === 'rtl' ? 'right-3' : 'left-3'
                }`} 
              />
              <Input
                type="text"
                placeholder={t('search_policies')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={dir === 'rtl' ? 'pr-10' : 'pl-10'}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                    {policy.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(policy.status)}
                    <span className="text-sm text-slate-500">v{policy.version}</span>
                  </div>
                </div>
                <ApperIcon name="FileText" size={20} className="text-slate-400 flex-shrink-0" />
              </div>
              
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ApperIcon name="Calendar" size={14} />
                  <span>{t('last_updated')}: {policy.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ApperIcon name="User" size={14} />
                  <span>{t('approved_by')}: {policy.approvedBy}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadPolicy(policy)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <ApperIcon name="Download" size={14} />
                  {t('download')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUpdatePolicy(policy)}
                  className="flex items-center justify-center gap-2"
                >
                  <ApperIcon name="Edit" size={14} />
                  {t('edit')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPolicies.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <ApperIcon name="FileX" size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {t('no_policies_found')}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? t('no_policies_match_filters')
              : t('no_policies_created_yet')
            }
          </p>
          {(!searchTerm && selectedCategory === 'all') && (
            <Button onClick={handleCreatePolicy} className="flex items-center gap-2 mx-auto">
              <ApperIcon name="Plus" size={16} />
              {t('create_first_policy')}
            </Button>
          )}
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <ApperIcon name="FileText" size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('total_policies')}</p>
              <p className="text-2xl font-bold text-slate-900">{policies.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('active_policies')}</p>
              <p className="text-2xl font-bold text-slate-900">
                {policies.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <ApperIcon name="Clock" size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('under_review')}</p>
              <p className="text-2xl font-bold text-slate-900">
                {policies.filter(p => p.status === 'review').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 rounded-lg">
              <ApperIcon name="RefreshCw" size={20} className="text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('recent_updates')}</p>
              <p className="text-2xl font-bold text-slate-900">
                {policies.filter(p => {
                  const updatedDate = new Date(p.lastUpdated);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return updatedDate > thirtyDaysAgo;
                }).length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SafetyPolicies;