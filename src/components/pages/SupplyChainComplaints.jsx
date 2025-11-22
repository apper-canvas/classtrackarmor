import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguage } from '@/hooks/useLanguage'
import { useSelector } from 'react-redux'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { formatDistanceToNow, format } from 'date-fns'

function SupplyChainComplaints() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { user } = useSelector(state => state.user)
  
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    supplierName: '',
    productType: '',
    issueDescription: '',
    status: 'open',
    priority: 'medium',
    contactEmail: '',
    contactPhone: '',
    expectedResolution: '',
    category: 'quality'
  })

  useEffect(() => {
    loadComplaints()
  }, [])

  async function loadComplaints() {
    try {
      setLoading(true)
      // Mock data for supply chain complaints since no database table provided
      const mockComplaints = [
        {
          Id: 1,
          supplierName: 'ABC Suppliers Co.',
          productType: 'Raw Materials',
          issueDescription: 'Late delivery affecting production schedule',
          status: 'open',
          priority: 'high',
          contactEmail: 'contact@abcsuppliers.com',
          contactPhone: '+212-600-123456',
          expectedResolution: '2024-02-15',
          category: 'delivery',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          reportedBy: 'Supply Chain Manager'
        },
        {
          Id: 2,
          supplierName: 'Quality Parts Ltd.',
          productType: 'Components',
          issueDescription: 'Quality issues with recent shipment batch #QP2024-01',
          status: 'investigating',
          priority: 'high',
          contactEmail: 'quality@qualityparts.com',
          contactPhone: '+212-600-654321',
          expectedResolution: '2024-02-10',
          category: 'quality',
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-12T09:15:00Z',
          reportedBy: 'Quality Control Inspector'
        },
        {
          Id: 3,
          supplierName: 'Fast Logistics Inc.',
          productType: 'Packaging',
          issueDescription: 'Incorrect packaging specifications received',
          status: 'resolved',
          priority: 'medium',
          contactEmail: 'support@fastlogistics.com',
          contactPhone: '+212-600-789012',
          expectedResolution: '2024-01-20',
          category: 'specification',
          createdAt: '2024-01-08T11:45:00Z',
          updatedAt: '2024-01-18T16:20:00Z',
          reportedBy: 'Procurement Officer'
        }
      ]
      
      setComplaints(mockComplaints)
      setError(null)
    } catch (err) {
      console.error('Error loading supply chain complaints:', err)
      setError('Failed to load supply chain complaints')
      setComplaints([])
    } finally {
      setLoading(false)
    }
  }

  function getStatusVariant(status) {
    const variants = {
      open: 'bg-red-100 text-red-800 border-red-200',
      investigating: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      closed: 'bg-slate-100 text-slate-800 border-slate-200'
    }
    return variants[status] || variants.open
  }

  function getPriorityVariant(priority) {
    const variants = {
      low: 'bg-slate-100 text-slate-700 border-slate-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      high: 'bg-red-100 text-red-800 border-red-200',
      critical: 'bg-red-200 text-red-900 border-red-300'
    }
    return variants[priority] || variants.medium
  }

  function getCategoryIcon(category) {
    const icons = {
      quality: 'AlertTriangle',
      delivery: 'Truck',
      specification: 'FileText',
      cost: 'DollarSign',
      communication: 'MessageSquare',
      other: 'HelpCircle'
    }
    return icons[category] || icons.other
  }

  async function handleCreateComplaint() {
    try {
      if (!formData.supplierName || !formData.issueDescription) {
        toast.error('Please fill in all required fields')
        return
      }

      const newComplaint = {
        Id: Math.max(...complaints.map(c => c.Id)) + 1,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reportedBy: user?.firstName + ' ' + user?.lastName || 'Unknown User'
      }

      setComplaints(prev => [newComplaint, ...prev])
      setShowCreateModal(false)
      resetForm()
      toast.success('Supply chain complaint created successfully')
    } catch (err) {
      console.error('Error creating complaint:', err)
      toast.error('Failed to create complaint')
    }
  }

  async function handleEditComplaint() {
    try {
      if (!selectedComplaint || !formData.supplierName || !formData.issueDescription) {
        toast.error('Please fill in all required fields')
        return
      }

      const updatedComplaint = {
        ...selectedComplaint,
        ...formData,
        updatedAt: new Date().toISOString()
      }

      setComplaints(prev => prev.map(c => 
        c.Id === selectedComplaint.Id ? updatedComplaint : c
      ))
      
      setShowEditModal(false)
      setSelectedComplaint(null)
      resetForm()
      toast.success('Supply chain complaint updated successfully')
    } catch (err) {
      console.error('Error updating complaint:', err)
      toast.error('Failed to update complaint')
    }
  }

  async function handleStatusChange(complaintId, newStatus) {
    try {
      const updatedComplaint = complaints.find(c => c.Id === complaintId)
      if (!updatedComplaint) return

      const updated = {
        ...updatedComplaint,
        status: newStatus,
        updatedAt: new Date().toISOString()
      }

      setComplaints(prev => prev.map(c => 
        c.Id === complaintId ? updated : c
      ))

      toast.success(`Complaint status updated to ${newStatus}`)
    } catch (err) {
      console.error('Error updating status:', err)
      toast.error('Failed to update status')
    }
  }

  async function handleDeleteComplaint(complaintId) {
    try {
      if (!window.confirm('Are you sure you want to delete this complaint?')) {
        return
      }

      setComplaints(prev => prev.filter(c => c.Id !== complaintId))
      toast.success('Supply chain complaint deleted successfully')
    } catch (err) {
      console.error('Error deleting complaint:', err)
      toast.error('Failed to delete complaint')
    }
  }

  function openEditModal(complaint) {
    setSelectedComplaint(complaint)
    setFormData({
      supplierName: complaint.supplierName,
      productType: complaint.productType,
      issueDescription: complaint.issueDescription,
      status: complaint.status,
      priority: complaint.priority,
      contactEmail: complaint.contactEmail,
      contactPhone: complaint.contactPhone,
      expectedResolution: complaint.expectedResolution,
      category: complaint.category
    })
    setShowEditModal(true)
  }

  function resetForm() {
    setFormData({
      supplierName: '',
      productType: '',
      issueDescription: '',
      status: 'open',
      priority: 'medium',
      contactEmail: '',
      contactPhone: '',
      expectedResolution: '',
      category: 'quality'
    })
  }

  function canManageComplaints() {
    return user && (user.role === 'admin' || user.role === 'manager' || user.role === 'quality_manager')
  }

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority
    const matchesSearch = !searchQuery || 
      complaint.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.issueDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.productType.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadComplaints} />

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {t('Supply Chain Complaints')}
          </h1>
          <p className="text-slate-600 mt-2">
            {t('Manage and track supply chain related complaints and issues')}
          </p>
        </div>
        
        {canManageComplaints() && (
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            {t('Report Issue')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              type="text"
              placeholder={t('Search complaints...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">{t('All Status')}</option>
              <option value="open">{t('Open')}</option>
              <option value="investigating">{t('Investigating')}</option>
              <option value="resolved">{t('Resolved')}</option>
              <option value="closed">{t('Closed')}</option>
            </select>
          </div>
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">{t('All Priority')}</option>
              <option value="low">{t('Low')}</option>
              <option value="medium">{t('Medium')}</option>
              <option value="high">{t('High')}</option>
              <option value="critical">{t('Critical')}</option>
            </select>
          </div>
          <div className="text-sm text-slate-600 flex items-center">
            {t('Total')}: {filteredComplaints.length} {t('complaints')}
          </div>
        </div>
      </Card>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <Empty 
          message={t('No supply chain complaints found')}
          description={t('Start by reporting a supply chain issue or complaint')}
        />
      ) : (
        <div className="grid gap-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <ApperIcon name={getCategoryIcon(complaint.category)} size={20} className="text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900 mb-1">
                        {complaint.supplierName}
                      </h3>
                      <p className="text-slate-600 text-sm mb-2">
                        {t('Product')}: {complaint.productType} | {t('Category')}: {complaint.category}
                      </p>
                      <p className="text-slate-700 mb-3">
                        {complaint.issueDescription}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <span>{t('Reported by')}: {complaint.reportedBy}</span>
                        <span>•</span>
                        <span>{t('Created')}: {formatDistanceToNow(new Date(complaint.createdAt))} ago</span>
                        {complaint.expectedResolution && (
                          <>
                            <span>•</span>
                            <span>{t('Expected resolution')}: {format(new Date(complaint.expectedResolution), 'MMM dd, yyyy')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={getStatusVariant(complaint.status)}>
                      {t(complaint.status)}
                    </Badge>
                    <Badge className={getPriorityVariant(complaint.priority)}>
                      {t(complaint.priority)} {t('priority')}
                    </Badge>
                  </div>
                </div>

                {canManageComplaints() && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint.Id, e.target.value)}
                        className="px-3 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="open">{t('Open')}</option>
                        <option value="investigating">{t('Investigating')}</option>
                        <option value="resolved">{t('Resolved')}</option>
                        <option value="closed">{t('Closed')}</option>
                      </select>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(complaint)}
                      className="flex items-center gap-1"
                    >
                      <ApperIcon name="Edit" size={14} />
                      {t('Edit')}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteComplaint(complaint.Id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <ApperIcon name="Trash2" size={14} />
                      {t('Delete')}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {t('Report Supply Chain Issue')}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Supplier Name')} *
                  </label>
                  <Input
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplierName: e.target.value }))}
                    placeholder={t('Enter supplier name')}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Product Type')}
                  </label>
                  <Input
                    type="text"
                    value={formData.productType}
                    onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                    placeholder={t('Enter product type')}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('Issue Description')} *
                </label>
                <textarea
                  value={formData.issueDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
                  placeholder={t('Describe the issue in detail')}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Category')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="quality">{t('Quality')}</option>
                    <option value="delivery">{t('Delivery')}</option>
                    <option value="specification">{t('Specification')}</option>
                    <option value="cost">{t('Cost')}</option>
                    <option value="communication">{t('Communication')}</option>
                    <option value="other">{t('Other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Priority')}
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="low">{t('Low')}</option>
                    <option value="medium">{t('Medium')}</option>
                    <option value="high">{t('High')}</option>
                    <option value="critical">{t('Critical')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Expected Resolution')}
                  </label>
                  <Input
                    type="date"
                    value={formData.expectedResolution}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedResolution: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Contact Email')}
                  </label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder={t('supplier@example.com')}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Contact Phone')}
                  </label>
                  <Input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder={t('+212-600-000000')}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
              >
                {t('Cancel')}
              </Button>
              <Button onClick={handleCreateComplaint}>
                {t('Report Issue')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {t('Edit Supply Chain Complaint')}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Supplier Name')} *
                  </label>
                  <Input
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplierName: e.target.value }))}
                    placeholder={t('Enter supplier name')}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Product Type')}
                  </label>
                  <Input
                    type="text"
                    value={formData.productType}
                    onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                    placeholder={t('Enter product type')}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('Issue Description')} *
                </label>
                <textarea
                  value={formData.issueDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
                  placeholder={t('Describe the issue in detail')}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Category')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="quality">{t('Quality')}</option>
                    <option value="delivery">{t('Delivery')}</option>
                    <option value="specification">{t('Specification')}</option>
                    <option value="cost">{t('Cost')}</option>
                    <option value="communication">{t('Communication')}</option>
                    <option value="other">{t('Other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Priority')}
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="low">{t('Low')}</option>
                    <option value="medium">{t('Medium')}</option>
                    <option value="high">{t('High')}</option>
                    <option value="critical">{t('Critical')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Expected Resolution')}
                  </label>
                  <Input
                    type="date"
                    value={formData.expectedResolution}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedResolution: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Contact Email')}
                  </label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder={t('supplier@example.com')}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('Contact Phone')}
                  </label>
                  <Input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder={t('+212-600-000000')}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedComplaint(null)
                  resetForm()
                }}
              >
                {t('Cancel')}
              </Button>
              <Button onClick={handleEditComplaint}>
                {t('Update Complaint')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplyChainComplaints