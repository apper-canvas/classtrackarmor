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

// Mock service - replace with actual service when database table is available
const mockComplaints = [
  {
    Id: 1,
    title_c: 'Foreign object found in packaged food',
    description_c: 'Customer found a piece of plastic in canned soup',
    status_c: 'Open',
    priority_c: 'High',
    source_c: 'Customer Call',
    complainant_name_c: 'Ahmed Hassan',
    complainant_email_c: 'ahmed@example.com',
    product_name_c: 'Vegetable Soup Can',
    batch_number_c: 'VS2024001',
    date_received_c: '2024-01-15T10:30:00Z',
    assigned_to_c: 'Food Safety Team',
    resolution_notes_c: '',
    corrective_actions_c: 'Investigation ongoing'
  },
  {
    Id: 2,
    title_c: 'Food poisoning complaint',
    description_c: 'Customer reported illness after consuming restaurant meal',
    status_c: 'In Progress',
    priority_c: 'Critical',
    source_c: 'Online Form',
    complainant_name_c: 'Fatima Al-Zahra',
    complainant_email_c: 'fatima@example.com',
    product_name_c: 'Chicken Tagine',
    batch_number_c: 'CT2024012',
    date_received_c: '2024-01-14T14:20:00Z',
    assigned_to_c: 'Quality Assurance',
    resolution_notes_c: 'Investigating supplier chain',
    corrective_actions_c: 'Supplier audit scheduled'
  },
  {
    Id: 3,
    title_c: 'Expired product sold',
    description_c: 'Customer purchased product past expiration date',
    status_c: 'Resolved',
    priority_c: 'Medium',
    source_c: 'In-Store',
    complainant_name_c: 'Youssef Bennani',
    complainant_email_c: 'youssef@example.com',
    product_name_c: 'Organic Yogurt',
    batch_number_c: 'OY2024005',
    date_received_c: '2024-01-13T09:15:00Z',
    assigned_to_c: 'Store Manager',
    resolution_notes_c: 'Product recalled from shelves, customer refunded',
    corrective_actions_c: 'Updated inventory rotation procedures'
  }
]

// Mock service implementation
const foodComplaintsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockComplaints]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockComplaints.find(c => c.Id === parseInt(id))
  },

  async create(complaint) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newComplaint = {
      ...complaint,
      Id: Math.max(...mockComplaints.map(c => c.Id)) + 1,
      date_received_c: new Date().toISOString()
    }
    mockComplaints.push(newComplaint)
    return newComplaint
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockComplaints.findIndex(c => c.Id === parseInt(id))
    if (index !== -1) {
      mockComplaints[index] = { ...mockComplaints[index], ...updates }
      return mockComplaints[index]
    }
    throw new Error('Complaint not found')
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = mockComplaints.findIndex(c => c.Id === parseInt(id))
    if (index !== -1) {
      mockComplaints.splice(index, 1)
      return true
    }
    throw new Error('Complaint not found')
  }
}

function FoodComplaints() {
  const { t } = useTranslation()
  const { language, isRTL } = useLanguage()
  const { user } = useSelector((state) => state.user)
  
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const [formData, setFormData] = useState({
    title_c: '',
    description_c: '',
    priority_c: 'Medium',
    source_c: 'Customer Call',
    complainant_name_c: '',
    complainant_email_c: '',
    product_name_c: '',
    batch_number_c: '',
    assigned_to_c: '',
    corrective_actions_c: ''
  })

  useEffect(() => {
    loadComplaints()
  }, [])

  async function loadComplaints() {
    try {
      setLoading(true)
      setError(null)
      const data = await foodComplaintsService.getAll()
      setComplaints(data || [])
    } catch (err) {
      console.error('Error loading food complaints:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complainant_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.product_name_c?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || complaint.status_c === statusFilter
    const matchesPriority = priorityFilter === 'all' || complaint.priority_c === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  function getStatusVariant(status) {
    switch (status) {
      case 'Open': return 'warning'
      case 'In Progress': return 'primary'
      case 'Resolved': return 'success'
      case 'Closed': return 'secondary'
      default: return 'secondary'
    }
  }

  function getPriorityVariant(priority) {
    switch (priority) {
      case 'Critical': return 'error'
      case 'High': return 'warning'
      case 'Medium': return 'primary'
      case 'Low': return 'secondary'
      default: return 'secondary'
    }
  }

  function getSourceIcon(source) {
    switch (source) {
      case 'Customer Call': return 'Phone'
      case 'Online Form': return 'Globe'
      case 'In-Store': return 'Store'
      case 'Email': return 'Mail'
      default: return 'MessageSquare'
    }
  }

  async function handleCreateComplaint() {
    if (!formData.title_c || !formData.description_c || !formData.complainant_name_c) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setActionLoading(true)
      const newComplaint = await foodComplaintsService.create({
        ...formData,
        status_c: 'Open'
      })
      
      setComplaints(prev => [newComplaint, ...prev])
      setShowCreateModal(false)
      resetForm()
      toast.success('Food complaint created successfully')
    } catch (err) {
      console.error('Error creating complaint:', err)
      toast.error('Failed to create complaint')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleEditComplaint() {
    if (!selectedComplaint) return

    try {
      setActionLoading(true)
      const updated = await foodComplaintsService.update(selectedComplaint.Id, formData)
      
      setComplaints(prev => prev.map(c => 
        c.Id === selectedComplaint.Id ? updated : c
      ))
      setShowEditModal(false)
      setSelectedComplaint(null)
      resetForm()
      toast.success('Complaint updated successfully')
    } catch (err) {
      console.error('Error updating complaint:', err)
      toast.error('Failed to update complaint')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleStatusChange(complaintId, newStatus) {
    try {
      setActionLoading(true)
      await foodComplaintsService.update(complaintId, { status_c: newStatus })
      
      setComplaints(prev => prev.map(c => 
        c.Id === complaintId ? { ...c, status_c: newStatus } : c
      ))
      toast.success(`Complaint status updated to ${newStatus}`)
    } catch (err) {
      console.error('Error updating status:', err)
      toast.error('Failed to update status')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDeleteComplaint(complaintId) {
    if (!confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return
    }

    try {
      setActionLoading(true)
      await foodComplaintsService.delete(complaintId)
      
      setComplaints(prev => prev.filter(c => c.Id !== complaintId))
      toast.success('Complaint deleted successfully')
    } catch (err) {
      console.error('Error deleting complaint:', err)
      toast.error('Failed to delete complaint')
    } finally {
      setActionLoading(false)
    }
  }

  function openEditModal(complaint) {
    setSelectedComplaint(complaint)
    setFormData({
      title_c: complaint.title_c || '',
      description_c: complaint.description_c || '',
      priority_c: complaint.priority_c || 'Medium',
      source_c: complaint.source_c || 'Customer Call',
      complainant_name_c: complaint.complainant_name_c || '',
      complainant_email_c: complaint.complainant_email_c || '',
      product_name_c: complaint.product_name_c || '',
      batch_number_c: complaint.batch_number_c || '',
      assigned_to_c: complaint.assigned_to_c || '',
      corrective_actions_c: complaint.corrective_actions_c || ''
    })
    setShowEditModal(true)
  }

  function resetForm() {
    setFormData({
      title_c: '',
      description_c: '',
      priority_c: 'Medium',
      source_c: 'Customer Call',
      complainant_name_c: '',
      complainant_email_c: '',
      product_name_c: '',
      batch_number_c: '',
      assigned_to_c: '',
      corrective_actions_c: ''
    })
  }

  function canManageComplaints() {
    return user?.role_c === 'Admin' || user?.role_c === 'Quality Manager'
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadComplaints} />

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Food Complaints Management
            </h1>
            <p className="text-slate-600">
              Track and manage food safety complaints and customer feedback
            </p>
          </div>
          {canManageComplaints() && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Complaint
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              type="search"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <Button 
              variant="outline" 
              onClick={loadComplaints}
              className="w-full"
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <Empty 
          icon="MessageSquare"
          message="No food complaints found"
          description="No complaints match your current filters"
        />
      ) : (
        <div className="grid gap-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.Id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 p-2 bg-slate-100 rounded-lg">
                      <ApperIcon name={getSourceIcon(complaint.source_c)} size={20} className="text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">
                        {complaint.title_c}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                        {complaint.description_c}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <ApperIcon name="User" size={14} />
                          {complaint.complainant_name_c}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Package" size={14} />
                          {complaint.product_name_c}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Calendar" size={14} />
                          {format(new Date(complaint.date_received_c), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getStatusVariant(complaint.status_c)}>
                      {complaint.status_c}
                    </Badge>
                    <Badge variant={getPriorityVariant(complaint.priority_c)}>
                      {complaint.priority_c}
                    </Badge>
                  </div>

                  {canManageComplaints() && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(complaint)}
                        disabled={actionLoading}
                      >
                        <ApperIcon name="Edit3" size={14} className="mr-1" />
                        Edit
                      </Button>
                      
                      {complaint.status_c !== 'Resolved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(complaint.Id, 'Resolved')}
                          disabled={actionLoading}
                          className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                        >
                          <ApperIcon name="Check" size={14} className="mr-1" />
                          Resolve
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteComplaint(complaint.Id)}
                        disabled={actionLoading}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              {complaint.batch_number_c && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-700">Batch Number:</span>
                      <span className="ml-1 text-slate-600">{complaint.batch_number_c}</span>
                    </div>
                    {complaint.assigned_to_c && (
                      <div>
                        <span className="font-medium text-slate-700">Assigned To:</span>
                        <span className="ml-1 text-slate-600">{complaint.assigned_to_c}</span>
                      </div>
                    )}
                    {complaint.corrective_actions_c && (
                      <div className="sm:col-span-2 lg:col-span-1">
                        <span className="font-medium text-slate-700">Actions:</span>
                        <span className="ml-1 text-slate-600">{complaint.corrective_actions_c}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">New Food Complaint</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title *
                </label>
                <Input
                  value={formData.title_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_c: e.target.value }))}
                  placeholder="Brief description of the complaint"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_c: e.target.value }))}
                  placeholder="Detailed description of the complaint"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority_c: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Source
                  </label>
                  <select
                    value={formData.source_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, source_c: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Customer Call">Customer Call</option>
                    <option value="Online Form">Online Form</option>
                    <option value="In-Store">In-Store</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Complainant Name *
                  </label>
                  <Input
                    value={formData.complainant_name_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, complainant_name_c: e.target.value }))}
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Complainant Email
                  </label>
                  <Input
                    type="email"
                    value={formData.complainant_email_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, complainant_email_c: e.target.value }))}
                    placeholder="customer@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Product Name
                  </label>
                  <Input
                    value={formData.product_name_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_name_c: e.target.value }))}
                    placeholder="Product involved in complaint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Batch Number
                  </label>
                  <Input
                    value={formData.batch_number_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, batch_number_c: e.target.value }))}
                    placeholder="Product batch/lot number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Assigned To
                </label>
                <Input
                  value={formData.assigned_to_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, assigned_to_c: e.target.value }))}
                  placeholder="Person or team assigned to handle this complaint"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Corrective Actions
                </label>
                <textarea
                  value={formData.corrective_actions_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, corrective_actions_c: e.target.value }))}
                  placeholder="Actions taken or planned to address this complaint"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCreateComplaint}
                disabled={actionLoading}
                className="flex-1"
              >
                {actionLoading ? 'Creating...' : 'Create Complaint'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Food Complaint</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title *
                </label>
                <Input
                  value={formData.title_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_c: e.target.value }))}
                  placeholder="Brief description of the complaint"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_c: e.target.value }))}
                  placeholder="Detailed description of the complaint"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority_c: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Source
                  </label>
                  <select
                    value={formData.source_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, source_c: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Customer Call">Customer Call</option>
                    <option value="Online Form">Online Form</option>
                    <option value="In-Store">In-Store</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Complainant Name *
                  </label>
                  <Input
                    value={formData.complainant_name_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, complainant_name_c: e.target.value }))}
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Complainant Email
                  </label>
                  <Input
                    type="email"
                    value={formData.complainant_email_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, complainant_email_c: e.target.value }))}
                    placeholder="customer@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Product Name
                  </label>
                  <Input
                    value={formData.product_name_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_name_c: e.target.value }))}
                    placeholder="Product involved in complaint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Batch Number
                  </label>
                  <Input
                    value={formData.batch_number_c}
                    onChange={(e) => setFormData(prev => ({ ...prev, batch_number_c: e.target.value }))}
                    placeholder="Product batch/lot number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Assigned To
                </label>
                <Input
                  value={formData.assigned_to_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, assigned_to_c: e.target.value }))}
                  placeholder="Person or team assigned to handle this complaint"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Corrective Actions
                </label>
                <textarea
                  value={formData.corrective_actions_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, corrective_actions_c: e.target.value }))}
                  placeholder="Actions taken or planned to address this complaint"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleEditComplaint}
                disabled={actionLoading}
                className="flex-1"
              >
                {actionLoading ? 'Updating...' : 'Update Complaint'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodComplaints