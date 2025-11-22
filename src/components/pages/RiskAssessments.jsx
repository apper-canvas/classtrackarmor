import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { useSelector } from 'react-redux';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow, format } from 'date-fns';

const RiskAssessments = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { user } = useSelector((state) => state.user);

  // State management
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [siteFilter, setSiteFilter] = useState('all');

  // Mock data for demonstration
  const mockRiskAssessments = [
    {
      id: 1,
      title: 'Chemical Handling Assessment',
      description: 'Risk assessment for chemical storage and handling procedures',
      riskType: 'Chemical',
      status: 'Active',
      priority: 'High',
      siteId: 1,
      siteName: 'Main Production Site',
      assessor: 'Ahmed Hassan',
      assessmentDate: '2024-01-15',
      nextReviewDate: '2024-07-15',
      riskLevel: 'High',
      controlMeasures: 5,
      findings: 3,
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: 2,
      title: 'Equipment Safety Evaluation',
      description: 'Comprehensive safety evaluation of production equipment',
      riskType: 'Equipment',
      status: 'In Progress',
      priority: 'Medium',
      siteId: 2,
      siteName: 'Secondary Facility',
      assessor: 'Fatima El Mansouri',
      assessmentDate: '2024-01-20',
      nextReviewDate: '2024-08-20',
      riskLevel: 'Medium',
      controlMeasures: 8,
      findings: 2,
      createdAt: '2024-01-18T10:15:00Z',
      updatedAt: '2024-01-20T16:45:00Z'
    },
    {
      id: 3,
      title: 'Fire Safety Analysis',
      description: 'Fire risk assessment and emergency preparedness evaluation',
      riskType: 'Fire',
      status: 'Pending Review',
      priority: 'High',
      siteId: 1,
      siteName: 'Main Production Site',
      assessor: 'Omar Benali',
      assessmentDate: '2024-01-22',
      nextReviewDate: '2024-07-22',
      riskLevel: 'High',
      controlMeasures: 6,
      findings: 4,
      createdAt: '2024-01-20T11:30:00Z',
      updatedAt: '2024-01-22T13:20:00Z'
    },
    {
      id: 4,
      title: 'Workplace Ergonomics Study',
      description: 'Assessment of ergonomic risks in workplace design and operations',
      riskType: 'Ergonomic',
      status: 'Completed',
      priority: 'Low',
      siteId: 3,
      siteName: 'Warehouse Complex',
      assessor: 'Aicha Kadiri',
      assessmentDate: '2023-12-15',
      nextReviewDate: '2024-06-15',
      riskLevel: 'Low',
      controlMeasures: 4,
      findings: 1,
      createdAt: '2023-12-10T08:45:00Z',
      updatedAt: '2023-12-15T17:15:00Z'
    }
  ];

  // Load risk assessments data
  useEffect(() => {
    const loadRiskAssessments = async () => {
      try {
        setLoading(true);
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setRiskAssessments(mockRiskAssessments);
        setError(null);
      } catch (err) {
        console.error('Error loading risk assessments:', err);
        setError('Failed to load risk assessments');
        toast.error('Failed to load risk assessments');
      } finally {
        setLoading(false);
      }
    };

    loadRiskAssessments();
  }, []);

  // Filter assessments based on search and filters
  useEffect(() => {
    let filtered = riskAssessments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(assessment =>
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.assessor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.riskType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(assessment => assessment.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(assessment => assessment.priority === priorityFilter);
    }

    // Apply site filter
    if (siteFilter !== 'all') {
      filtered = filtered.filter(assessment => assessment.siteId.toString() === siteFilter);
    }

    setFilteredAssessments(filtered);
  }, [riskAssessments, searchTerm, statusFilter, priorityFilter, siteFilter]);

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending Review':
        return 'info';
      case 'Completed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // Get priority badge variant
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Get risk level badge variant
  const getRiskLevelVariant = (level) => {
    switch (level) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Get risk type icon
  const getRiskTypeIcon = (type) => {
    switch (type) {
      case 'Chemical':
        return 'Flask';
      case 'Equipment':
        return 'Cog';
      case 'Fire':
        return 'Flame';
      case 'Ergonomic':
        return 'User';
      default:
        return 'AlertTriangle';
    }
  };

  // Handle assessment actions
  const handleViewAssessment = (assessmentId) => {
    navigate(`/risk-assessments/${assessmentId}`);
  };

  const handleEditAssessment = (assessmentId) => {
    navigate(`/risk-assessments/${assessmentId}/edit`);
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!confirm('Are you sure you want to delete this risk assessment?')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRiskAssessments(prev => prev.filter(a => a.id !== assessmentId));
      toast.success('Risk assessment deleted successfully');
    } catch (err) {
      console.error('Error deleting risk assessment:', err);
      toast.error('Failed to delete risk assessment');
    }
  };

  const handleCreateAssessment = () => {
    navigate('/risk-assessments/create');
  };

  // Get unique sites for filter dropdown
  const uniqueSites = [...new Set(riskAssessments.map(a => ({ id: a.siteId, name: a.siteName })))]
    .filter((site, index, self) => self.findIndex(s => s.id === site.id) === index);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Risk Assessments</h1>
          <p className="text-slate-600 mt-1">
            Manage and monitor workplace risk assessments
          </p>
        </div>
        <Button
          onClick={handleCreateAssessment}
          icon="Plus"
          iconPosition={isRTL ? "right" : "left"}
        >
          New Assessment
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Site Filter */}
        <div className="mt-4">
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Sites</option>
            {uniqueSites.map(site => (
              <option key={site.id} value={site.id.toString()}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Results Summary */}
      {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || siteFilter !== 'all' ? (
        <div className="text-sm text-slate-600">
          Showing {filteredAssessments.length} of {riskAssessments.length} risk assessments
        </div>
      ) : null}

      {/* Risk Assessments List */}
      {filteredAssessments.length === 0 ? (
        <Empty
          title="No Risk Assessments Found"
          description="No risk assessments match your current filters. Try adjusting your search or filters."
          icon="FileX"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Assessment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <ApperIcon
                      name={getRiskTypeIcon(assessment.riskType)}
                      className="h-5 w-5 text-primary-600"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 line-clamp-1">
                      {assessment.title}
                    </h3>
                    <p className="text-sm text-slate-600">{assessment.riskType}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <Badge variant={getStatusVariant(assessment.status)} size="sm">
                    {assessment.status}
                  </Badge>
                </div>
              </div>

              {/* Assessment Details */}
              <div className="space-y-3 mb-4">
                <p className="text-sm text-slate-600 line-clamp-2">
                  {assessment.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge variant={getPriorityVariant(assessment.priority)} size="sm">
                      {assessment.priority}
                    </Badge>
                    <Badge variant={getRiskLevelVariant(assessment.riskLevel)} size="sm">
                      {assessment.riskLevel} Risk
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Site:</span>
                    <p className="font-medium text-slate-900 truncate">
                      {assessment.siteName}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Assessor:</span>
                    <p className="font-medium text-slate-900 truncate">
                      {assessment.assessor}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Controls:</span>
                    <p className="font-medium text-slate-900">
                      {assessment.controlMeasures}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Findings:</span>
                    <p className="font-medium text-slate-900">
                      {assessment.findings}
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-slate-500">Assessment Date:</span>
                  <p className="font-medium text-slate-900">
                    {format(new Date(assessment.assessmentDate), 'MMM dd, yyyy')}
                  </p>
                </div>

                <div className="text-sm">
                  <span className="text-slate-500">Next Review:</span>
                  <p className="font-medium text-slate-900">
                    {format(new Date(assessment.nextReviewDate), 'MMM dd, yyyy')}
                  </p>
                </div>

                <div className="text-xs text-slate-500">
                  Updated {formatDistanceToNow(new Date(assessment.updatedAt))} ago
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewAssessment(assessment.id)}
                  icon="Eye"
                  className="flex-1"
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAssessment(assessment.id)}
                  icon="Edit"
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteAssessment(assessment.id)}
                  icon="Trash2"
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskAssessments;