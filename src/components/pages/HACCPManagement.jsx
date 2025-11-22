import React, { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Breadcrumb from "@/components/molecules/Breadcrumb";

function HACCPManagement() {
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const breadcrumbItems = [
    { label: t('dashboard'), href: '/' },
    { label: t('coreOperations'), href: null },
    { label: t('haccpManagement'), href: null }
  ]

useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    try {
      setLoading(true)
      setError(null)
      
      const { haccpRecordService } = await import('@/services/api/haccpRecordService');
      const data = await haccpRecordService.getAll();
      
      setPlans(data)
    } catch (err) {
      console.error('Error loading HACCP plans:', err)
      setError('Failed to load HACCP plans')
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  async function handleCreatePlan(planData) {
    try {
      const { haccpRecordService } = await import('@/services/api/haccpRecordService');
      const created = await haccpRecordService.create({
        Name: 'New HACCP Plan',
        plan_name_c: 'New HACCP Plan',
        plan_type_c: 'standard',
        status_c: 'draft',
        ...planData
      });
      if (created) {
        await loadPlans();
      }
    } catch (err) {
      console.error('Error creating HACCP plan:', err);
      toast.error('Failed to create HACCP plan');
    }
  }

  async function handleUpdatePlan(id, planData) {
    try {
      const { haccpRecordService } = await import('@/services/api/haccpRecordService');
      const updated = await haccpRecordService.update(id, planData);
      if (updated) {
        await loadPlans();
      }
    } catch (err) {
      console.error('Error updating HACCP plan:', err);
      toast.error('Failed to update HACCP plan');
    }
  }

const filteredPlans = plans.filter(plan => {
    if (!plan) return false;
    
    const planName = plan.plan_name_c || plan.Name || '';
    const planDesc = plan.description_c || '';
    const planStatus = plan.status_c || 'draft';
    
    const matchesSearch = planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         planDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || planStatus === filterStatus;
    return matchesSearch && matchesStatus;
  })

  function getStatusVariant(status) {
    switch (status) {
      case 'active': return 'success'
      case 'review_needed': return 'warning'
      case 'draft': return 'secondary'
      case 'expired': return 'destructive'
      default: return 'secondary'
    }
  }

  function formatDate(dateString) {
    if (!dateString) return t('notSet')
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'ar' ? 'ar-MA' : language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  function isOverdue(dateString) {
    if (!dateString) return false
    return new Date(dateString) < new Date()
  }

function handleCreate() {
    handleCreatePlan({
      plan_name_c: 'New HACCP Plan',
      description_c: 'New HACCP plan description'
    });
  }

function handleEdit(plan) {
    handleUpdatePlan(plan.Id, {
      status_c: plan.status_c === 'draft' ? 'active' : 'review_needed'
    });
  }

async function handleDelete(id) {
    if (!confirm(t('confirmDelete'))) return
    
    try {
      const { haccpRecordService } = await import('@/services/api/haccpRecordService');
      const success = await haccpRecordService.remove(id);
      if (success) {
        await loadPlans();
      }
    } catch (err) {
      console.error('Error deleting HACCP plan:', err)
      toast.error(t('failedToDeletePlan'))
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadPlans} />

  return (
    <div className={`p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('haccpManagement')}
          </h1>
          <p className="text-slate-600 mt-1">
            {t('manageHACCPPlansDescription')}
          </p>
        </div>
        
        <Button onClick={handleCreate}>
          <ApperIcon name="Plus" size={16} />
          {t('createPlan')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Input
            placeholder={t('searchHACCPPlans')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">{t('allStatuses')}</option>
          <option value="active">{t('active')}</option>
          <option value="review_needed">{t('reviewNeeded')}</option>
          <option value="draft">{t('draft')}</option>
          <option value="expired">{t('expired')}</option>
        </select>
      </div>

      {filteredPlans.length === 0 ? (
        <Empty 
          icon="Shield"
          title={t('noHACCPPlansFound')}
          description={t('noHACCPPlansDescription')}
          action={
            <Button onClick={handleCreate}>
              <ApperIcon name="Plus" size={16} />
              {t('createPlan')}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
{filteredPlans.map((plan) => (
            <Card key={plan.Id || plan.id} className="h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {plan.plan_name_c || plan.Name || t('untitledPlan')}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {plan.description_c || t('noDescription')}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(plan.status_c || 'draft')}>
                    {t((plan.status_c || 'draft').replace('_', ''))}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">
                      {plan.critical_control_points_c || 0}
                    </div>
                    <div className="text-xs text-slate-600">
                      {t('criticalControlPoints')}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">
                      {plan.monitoring_points_c || 0}
                    </div>
                    <div className="text-xs text-slate-600">
                      {t('monitoringPoints')}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>{t('responsiblePerson')}</span>
                    <span className="font-medium">{plan.responsible_person_c || t('notAssigned')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('lastReview')}</span>
                    <span className="font-medium">{formatDate(plan.last_review_date_c)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('nextReview')}</span>
                    <span className={`font-medium ${isOverdue(plan.next_review_date_c) ? 'text-red-600' : ''}`}>
                      {formatDate(plan.next_review_date_c)}
                    </span>
                  </div>
                  {(plan.corrective_actions_c || 0) > 0 && (
                    <div className="flex items-center justify-between">
                      <span>{t('correctiveActions')}</span>
                      <Badge variant="warning" size="sm">
                        {plan.corrective_actions_c}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-200">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(plan)}
                      className="flex-1"
                    >
                      <ApperIcon name="Edit" size={14} />
                      {t('edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <ApperIcon name="FileText" size={14} />
                      {t('view')}
                    </Button>
<Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(plan.Id || plan.id)}
                      className="px-3"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default HACCPManagement