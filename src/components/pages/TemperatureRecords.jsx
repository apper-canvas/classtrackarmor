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

function TemperatureRecords() {
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterEquipment, setFilterEquipment] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const breadcrumbItems = [
    { label: t('dashboard'), href: '/' },
    { label: t('coreOperations'), href: null },
    { label: t('temperatureRecords'), href: null }
  ]

  const mockRecords = [
    {
      id: 1,
      equipmentName: {
        en: "Main Refrigerator",
        fr: "Réfrigérateur principal",
        ar: "الثلاجة الرئيسية"
      },
      location: {
        en: "Kitchen - Storage Area",
        fr: "Cuisine - Zone de stockage",
        ar: "المطبخ - منطقة التخزين"
      },
      temperature: 2.5,
      targetRange: { min: 1, max: 4 },
      status: 'normal',
      recordedAt: '2024-01-15T08:30:00Z',
      recordedBy: 'John Smith',
      notes: {
        en: "Temperature within normal range",
        fr: "Température dans la plage normale",
        ar: "درجة الحرارة ضمن النطاق الطبيعي"
      }
    },
    {
      id: 2,
      equipmentName: {
        en: "Freezer Unit 1",
        fr: "Congélateur unité 1",
        ar: "وحدة التجميد 1"
      },
      location: {
        en: "Kitchen - Frozen Storage",
        fr: "Cuisine - Stockage congelé",
        ar: "المطبخ - التخزين المجمد"
      },
      temperature: -18.2,
      targetRange: { min: -20, max: -15 },
      status: 'normal',
      recordedAt: '2024-01-15T08:25:00Z',
      recordedBy: 'Mary Johnson',
      notes: {
        en: "Optimal freezing temperature maintained",
        fr: "Température de congélation optimale maintenue",
        ar: "درجة حرارة التجميد المثلى محافظ عليها"
      }
    },
    {
      id: 3,
      equipmentName: {
        en: "Hot Food Display",
        fr: "Vitrine d'aliments chauds",
        ar: "عرض الطعام الساخن"
      },
      location: {
        en: "Dining Area - Service Counter",
        fr: "Zone de restauration - Comptoir de service",
        ar: "منطقة تناول الطعام - طاولة الخدمة"
      },
      temperature: 62,
      targetRange: { min: 60, max: 70 },
      status: 'normal',
      recordedAt: '2024-01-15T08:15:00Z',
      recordedBy: 'Ahmed Hassan',
      notes: {
        en: "Food held at safe serving temperature",
        fr: "Nourriture maintenue à température de service sûre",
        ar: "الطعام محفوظ في درجة حرارة تقديم آمنة"
      }
    },
    {
      id: 4,
      equipmentName: {
        en: "Walk-in Cooler",
        fr: "Chambre froide",
        ar: "غرفة التبريد"
      },
      location: {
        en: "Kitchen - Back Storage",
        fr: "Cuisine - Stockage arrière",
        ar: "المطبخ - التخزين الخلفي"
      },
      temperature: 6.8,
      targetRange: { min: 1, max: 6 },
      status: 'warning',
      recordedAt: '2024-01-15T08:10:00Z',
      recordedBy: 'Sarah Wilson',
      notes: {
        en: "Temperature slightly above target range - needs attention",
        fr: "Température légèrement au-dessus de la plage cible - nécessite attention",
        ar: "درجة الحرارة أعلى قليلاً من النطاق المستهدف - تحتاج انتباه"
      }
    }
  ]

  useEffect(() => {
    loadRecords()
  }, [])

  async function loadRecords() {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setRecords(mockRecords)
      setError(null)
    } catch (err) {
      console.error('Error loading temperature records:', err)
      setError('Failed to load temperature records')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.equipmentName[language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.location[language]?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEquipment = filterEquipment === 'all' || record.equipmentName.en.toLowerCase().includes(filterEquipment.toLowerCase())
    return matchesSearch && matchesEquipment
  })

  function getStatusVariant(status) {
    switch (status) {
      case 'normal': return 'success'
      case 'warning': return 'warning'
      case 'critical': return 'destructive'
      default: return 'secondary'
    }
  }

  function getTemperatureStatus(temp, range) {
    if (temp >= range.min && temp <= range.max) return 'normal'
    if (temp < range.min - 2 || temp > range.max + 2) return 'critical'
    return 'warning'
  }

  function formatTemperature(temp) {
    return `${temp}°C`
  }

  function formatDateTime(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString(language === 'ar' ? 'ar-MA' : language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function handleAddRecord() {
    setSelectedRecord(null)
    setShowModal(true)
  }

  async function handleDelete(id) {
    if (!confirm(t('confirmDelete'))) return
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setRecords(prev => prev.filter(item => item.id !== id))
      toast.success(t('recordDeletedSuccessfully'))
    } catch (err) {
      console.error('Error deleting record:', err)
      toast.error(t('failedToDeleteRecord'))
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadRecords} />

  return (
    <div className={`p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('temperatureRecords')}
          </h1>
          <p className="text-slate-600 mt-1">
            {t('monitorTemperatureRecordsDescription')}
          </p>
        </div>
        
        <Button onClick={handleAddRecord}>
          <ApperIcon name="Plus" size={16} />
          {t('addRecord')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Input
            placeholder={t('searchEquipmentOrLocation')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <select
          value={filterEquipment}
          onChange={(e) => setFilterEquipment(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">{t('allEquipment')}</option>
          <option value="refrigerator">{t('refrigerator')}</option>
          <option value="freezer">{t('freezer')}</option>
          <option value="display">{t('display')}</option>
          <option value="cooler">{t('cooler')}</option>
        </select>
      </div>

      {filteredRecords.length === 0 ? (
        <Empty 
          icon="Thermometer"
          title={t('noRecordsFound')}
          description={t('noTemperatureRecordsDescription')}
          action={
            <Button onClick={handleAddRecord}>
              <ApperIcon name="Plus" size={16} />
              {t('addRecord')}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {record.equipmentName[language]}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {record.location[language]}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(record.status)}>
                    {t(record.status)}
                  </Badge>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                      {formatTemperature(record.temperature)}
                    </div>
                    <div className="text-sm text-slate-600">
                      {t('target')}: {formatTemperature(record.targetRange.min)} - {formatTemperature(record.targetRange.max)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>{t('recordedAt')}</span>
                    <span className="font-medium">{formatDateTime(record.recordedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('recordedBy')}</span>
                    <span className="font-medium">{record.recordedBy}</span>
                  </div>
                </div>

                {record.notes[language] && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 italic">
                      "{record.notes[language]}"
                    </p>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-slate-200">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <ApperIcon name="TrendingUp" size={14} />
                      {t('viewTrend')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
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

export default TemperatureRecords