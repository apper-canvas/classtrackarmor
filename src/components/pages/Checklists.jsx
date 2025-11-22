import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslation } from '@/hooks/useTranslation'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import Breadcrumb from '@/components/molecules/Breadcrumb'

function Checklists() {
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [checklists, setChecklists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedChecklist, setSelectedChecklist] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const breadcrumbItems = [
    { label: t('dashboard'), href: '/' },
    { label: t('coreOperations'), href: null },
    { label: t('checklists'), href: null }
  ]

  const mockChecklists = [
    {
      id: 1,
      name: {
        en: "Daily Kitchen Safety Checklist",
        fr: "Liste de contrôle quotidienne de sécurité cuisine",
        ar: "قائمة التحقق اليومية لسلامة المطبخ"
      },
      description: {
        en: "Daily safety checks for kitchen equipment and procedures",
        fr: "Contrôles de sécurité quotidiens pour les équipements et procédures de cuisine",
        ar: "فحوصات السلامة اليومية لمعدات وإجراءات المطبخ"
      },
      category: 'kitchen',
      status: 'active',
      priority: 'high',
      frequency: 'daily',
      itemCount: 15,
      completionRate: 92,
      lastCompleted: '2024-01-15T08:30:00Z',
      assignedTo: 'Kitchen Staff',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: 2,
      name: {
        en: "Weekly Hygiene Inspection",
        fr: "Inspection hebdomadaire d'hygiène",
        ar: "التفتيش الأسبوعي للنظافة"
      },
      description: {
        en: "Comprehensive hygiene inspection of all areas",
        fr: "Inspection complète d'hygiène de toutes les zones",
        ar: "تفتيش شامل للنظافة لجميع المناطق"
      },
      category: 'hygiene',
      status: 'active',
      priority: 'medium',
      frequency: 'weekly',
      itemCount: 25,
      completionRate: 88,
      lastCompleted: '2024-01-12T14:20:00Z',
      assignedTo: 'Hygiene Team',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: 3,
      name: {
        en: "Equipment Maintenance Check",
        fr: "Contrôle de maintenance équipement",
        ar: "فحص صيانة المعدات"
      },
      description: {
        en: "Monthly maintenance verification for all equipment",
        fr: "Vérification mensuelle de maintenance pour tous les équipements",
        ar: "التحقق الشهري من صيانة جميع المعدات"
      },
      category: 'maintenance',
      status: 'draft',
      priority: 'low',
      frequency: 'monthly',
      itemCount: 12,
      completionRate: 75,
      lastCompleted: '2024-01-10T16:45:00Z',
      assignedTo: 'Maintenance Team',
      createdAt: '2024-01-01T10:00:00Z'
    }
  ]

  useEffect(() => {
    loadChecklists()
  }, [])

  async function loadChecklists() {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setChecklists(mockChecklists)
      setError(null)
    } catch (err) {
      console.error('Error loading checklists:', err)
      setError('Failed to load checklists')
      setChecklists([])
    } finally {
      setLoading(false)
    }
  }

  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = checklist.name[language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         checklist.description[language]?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || checklist.status === filterStatus
    return matchesSearch && matchesStatus
  })

  function getStatusVariant(status) {
    switch (status) {
      case 'active': return 'success'
      case 'draft': return 'warning' 
      case 'archived': return 'secondary'
      default: return 'secondary'
    }
  }

  function getPriorityVariant(priority) {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'warning'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  function handleEdit(checklist) {
    setSelectedChecklist(checklist)
    setIsEditing(true)
    setShowModal(true)
  }

  function handleCreate() {
    setSelectedChecklist(null)
    setIsEditing(false)
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setSelectedChecklist(null)
    setIsEditing(false)
  }

  async function handleDelete(id) {
    if (!confirm(t('confirmDelete'))) return
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setChecklists(prev => prev.filter(item => item.id !== id))
      toast.success(t('checklistDeletedSuccessfully'))
    } catch (err) {
      console.error('Error deleting checklist:', err)
      toast.error(t('failedToDeleteChecklist'))
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadChecklists} />

  return (
    <div className={`p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('checklists')}
          </h1>
          <p className="text-slate-600 mt-1">
            {t('manageChecklistsDescription')}
          </p>
        </div>
        
        <Button onClick={handleCreate}>
          <ApperIcon name="Plus" size={16} />
          {t('createChecklist')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Input
            placeholder={t('searchChecklists')}
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
          <option value="draft">{t('draft')}</option>
          <option value="archived">{t('archived')}</option>
        </select>
      </div>

      {filteredChecklists.length === 0 ? (
        <Empty 
          icon="CheckSquare"
          title={t('noChecklistsFound')}
          description={t('noChecklistsFoundDescription')}
          action={
            <Button onClick={handleCreate}>
              <ApperIcon name="Plus" size={16} />
              {t('createChecklist')}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChecklists.map((checklist) => (
            <Card key={checklist.id} className="h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {checklist.name[language]}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {checklist.description[language]}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={getStatusVariant(checklist.status)}>
                    {t(checklist.status)}
                  </Badge>
                  <Badge variant={getPriorityVariant(checklist.priority)}>
                    {t(checklist.priority)}
                  </Badge>
                  <Badge variant="outline">
                    {t(checklist.frequency)}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>{t('items')}</span>
                    <span className="font-medium">{checklist.itemCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('completionRate')}</span>
                    <span className="font-medium">{checklist.completionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('assignedTo')}</span>
                    <span className="font-medium">{checklist.assignedTo}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-200">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(checklist)}
                      className="flex-1"
                    >
                      <ApperIcon name="Edit" size={14} />
                      {t('edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(checklist.id)}
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

export default Checklists