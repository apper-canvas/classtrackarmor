import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";

class AnalyticsService {
  constructor() {
    this.apperClient = null;
  }

  async getApperClient() {
    if (!this.apperClient) {
      this.apperClient = await getApperClient();
    }
    return this.apperClient;
  }

  async getDashboardMetrics(dateRange = '30d') {
    try {
      // Mock analytics data
      const metrics = {
        totalWorkflows: 245,
        activeWorkflows: 156,
        completedWorkflows: 89,
        pendingApprovals: 23,
        totalUsers: 87,
        activeUsers: 62,
        totalSites: 15,
        activeSites: 13,
        complianceScore: 85.7,
        trendsData: {
          workflowsCreated: [12, 18, 15, 22, 19, 25, 21],
          workflowsCompleted: [8, 14, 12, 18, 15, 20, 17],
          complianceScores: [82.1, 83.5, 84.2, 85.1, 85.7, 86.2, 85.9]
        },
        generatedAt: new Date().toISOString()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return metrics;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      toast.error('Error fetching dashboard metrics');
      return null;
    }
  }

  async getWorkflowAnalytics(filters = {}) {
    try {
      const analytics = {
        workflowsByStatus: {
          draft: 34,
          active: 156,
          completed: 89,
          cancelled: 12
        },
        workflowsByType: {
          safety_inspection: 98,
          compliance_check: 67,
          incident_report: 45,
          training: 35
        },
        averageCompletionTime: {
          safety_inspection: 2.5, // days
          compliance_check: 1.8,
          incident_report: 0.5,
          training: 7.2
        },
        monthlyTrends: [
          { month: 'Jan', created: 42, completed: 38 },
          { month: 'Feb', created: 35, completed: 41 },
          { month: 'Mar', created: 48, completed: 35 },
          { month: 'Apr', created: 52, completed: 49 },
          { month: 'May', created: 45, completed: 47 },
          { month: 'Jun', created: 38, completed: 42 }
        ]
      };

      await new Promise(resolve => setTimeout(resolve, 600));

      return analytics;
    } catch (error) {
      console.error('Error fetching workflow analytics:', error);
      toast.error('Error fetching workflow analytics');
      return null;
    }
  }

  async getUserActivityAnalytics(userId = null, dateRange = '30d') {
    try {
      const analytics = {
        totalActions: 156,
        workflowsCreated: 23,
        workflowsCompleted: 18,
        approvalsGiven: 34,
        loginFrequency: 'Daily',
        lastActivity: new Date().toISOString(),
        activityByDay: [
          { day: 'Monday', actions: 25 },
          { day: 'Tuesday', actions: 32 },
          { day: 'Wednesday', actions: 18 },
          { day: 'Thursday', actions: 28 },
          { day: 'Friday', actions: 35 },
          { day: 'Saturday', actions: 12 },
          { day: 'Sunday', actions: 6 }
        ]
      };

      await new Promise(resolve => setTimeout(resolve, 500));

      return analytics;
    } catch (error) {
      console.error(`Error fetching user activity analytics for user ${userId}:`, error);
      toast.error('Error fetching user analytics');
      return null;
    }
  }

  async getComplianceAnalytics(siteId = null, dateRange = '30d') {
    try {
      const analytics = {
        overallScore: 85.7,
        categoryScores: {
          safety_protocols: 88.2,
          documentation: 83.5,
          training_compliance: 87.1,
          inspection_frequency: 84.3,
          incident_response: 90.1
        },
        trends: [
          { date: '2024-01-01', score: 82.1 },
          { date: '2024-01-08', score: 83.5 },
          { date: '2024-01-15', score: 84.2 },
          { date: '2024-01-22', score: 85.1 },
          { date: '2024-01-29', score: 85.7 }
        ],
        nonComplianceIssues: [
          {
            category: 'Documentation',
            issue: 'Missing safety protocol documentation',
            severity: 'medium',
            affectedSites: 3
          },
          {
            category: 'Training',
            issue: 'Overdue safety training for 5 employees',
            severity: 'high',
            affectedSites: 2
          }
        ]
      };

      await new Promise(resolve => setTimeout(resolve, 700));

      return analytics;
    } catch (error) {
      console.error(`Error fetching compliance analytics for site ${siteId}:`, error);
      toast.error('Error fetching compliance analytics');
      return null;
    }
  }

  async generateReport(reportType, parameters = {}) {
    try {
      const reportData = {
        reportId: Date.now(),
        type: reportType,
        status: 'generating',
        parameters,
        createdAt: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 30000).toISOString() // 30 seconds
      };

      // Simulate report generation time
      await new Promise(resolve => setTimeout(resolve, 2000));

      reportData.status = 'completed';
      reportData.downloadUrl = `https://api.example.com/reports/${reportData.reportId}/download`;

      toast.success('Report generated successfully');
      return reportData;
    } catch (error) {
      console.error(`Error generating ${reportType} report:`, error);
      toast.error('Error generating report');
      return null;
    }
  }

  async getReportHistory(userId) {
    try {
      const history = [
        {
          id: 1,
          type: 'workflow_summary',
          status: 'completed',
          createdBy: userId,
          createdAt: '2024-01-15T10:30:00Z',
          downloadUrl: '#',
          parameters: { dateRange: '30d', siteId: null }
        },
        {
          id: 2,
          type: 'compliance_report',
          status: 'completed',
          createdBy: userId,
          createdAt: '2024-01-14T14:20:00Z',
          downloadUrl: '#',
          parameters: { dateRange: '7d', siteId: 5 }
        },
        {
          id: 3,
          type: 'user_activity',
          status: 'failed',
          createdBy: userId,
          createdAt: '2024-01-13T09:15:00Z',
          error: 'Insufficient permissions',
          parameters: { dateRange: '30d', userId: null }
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 300));

      return history;
    } catch (error) {
console.error(`Error fetching report history for user ${userId}:`, error);
      toast.error('Error fetching report history');
      return [];
    }
  }

  async getDashboardSummary(options = {}) {
    try {
      const dashboardData = {
        haccp: {
          score: 87.5,
          trend: '+2.3%',
          violations: 3
        },
        onssa: {
          readiness: 92.1,
          trend: '+1.8%',
          gaps: 2
        },
        incidents: {
          total: 12,
          trend: '-15%',
          critical: 1
        },
        tasks: {
          completion: 94.2,
          trend: '+5.1%',
          overdue: 4
        },
        alerts: [
          {
            type: 'Temperature Monitoring',
            severity: 'High',
            count: 2
          },
          {
            type: 'Documentation Updates',
            severity: 'Medium',
            count: 5
          },
          {
            type: 'Training Renewals',
            severity: 'Low',
            count: 8
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));

      return dashboardData;
    } catch (error) {
console.error('Error fetching dashboard summary:', error);
      toast.error('Error fetching dashboard summary');
      return null;
    }
  }

  async getHACCPPerformance(dateRange = '30d') {
    try {
      const haccpData = {
        overallScore: 87.5,
        trend: '+2.3%',
        criticalControlPoints: {
          total: 12,
          compliant: 10,
          nonCompliant: 2,
          needsAttention: 1
        },
        temperatureMonitoring: {
          totalReadings: 2840,
          withinRange: 2785,
          violations: 55,
          averageTemp: 4.2, // Celsius
          lastReading: new Date().toISOString()
        },
        hazardAnalysis: {
          biologicalHazards: 8,
          chemicalHazards: 3,
          physicalHazards: 2,
          allergenControls: 6
        },
        correctiveActions: {
          open: 4,
          closed: 15,
          overdue: 1,
          avgResolutionTime: 2.3 // days
        },
        monthlyTrends: [
          { month: 'Jan', score: 85.2, violations: 8 },
          { month: 'Feb', score: 86.1, violations: 6 },
          { month: 'Mar', score: 86.8, violations: 4 },
          { month: 'Apr', score: 87.2, violations: 3 },
          { month: 'May', score: 87.5, violations: 3 },
          { month: 'Jun', score: 87.8, violations: 2 }
        ],
        recentViolations: [
          {
            id: 1,
            type: 'Temperature Deviation',
            location: 'Cold Storage Unit 2',
            severity: 'High',
            detectedAt: '2024-01-20T14:30:00Z',
            status: 'Under Investigation'
          },
          {
            id: 2,
            type: 'Documentation Gap',
            location: 'Processing Line A',
            severity: 'Medium',
            detectedAt: '2024-01-19T09:15:00Z',
            status: 'Corrective Action Applied'
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
// Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return haccpData;
} catch (error) {
      console.error('Error fetching HACCP performance data:', error);
      toast.error('Error fetching HACCP performance data');
      return null;
    }
  }

  async getONSSACompliance() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      // Mock ONSSA compliance data for Morocco food safety regulations
      const mockData = {
        overallCompliance: 87.3,
        lastUpdated: new Date().toISOString(),
        categories: {
          foodSafety: {
            compliance: 89.2,
            total: 156,
            compliant: 139,
            nonCompliant: 17
          },
          hygiene: {
            compliance: 91.7,
            total: 134,
            compliant: 123,
            nonCompliant: 11
          },
          documentation: {
            compliance: 82.1,
            total: 198,
            compliant: 162,
            nonCompliant: 36
          },
          traceability: {
            compliance: 85.6,
            total: 127,
            compliant: 109,
            nonCompliant: 18
          }
        },
        trends: {
          monthly: [78.5, 81.2, 84.7, 87.3],
          labels: ['3 months ago', '2 months ago', 'Last month', 'This month']
        },
        inspectionResults: {
          passed: 142,
          failed: 23,
          pending: 8,
          total: 173
        },
        certificationStatus: {
          active: 89,
          expired: 12,
          suspended: 3,
          total: 104
        },
        recentFindings: [
          { id: 1, category: 'Food Safety', severity: 'High', description: 'Temperature control deviation', date: '2024-01-15' },
          { id: 2, category: 'Hygiene', severity: 'Medium', description: 'Incomplete cleaning records', date: '2024-01-14' },
          { id: 3, category: 'Documentation', severity: 'Low', description: 'Missing supplier certificates', date: '2024-01-13' }
        ]
      };

      return mockData;
} catch (error) {
      console.error('Error fetching ONSSA compliance data:', error);
      toast.error('Error fetching ONSSA compliance data');
      return null;
    }
  }

  // Get multi-site comparison data
  async getMultiSiteComparisons() {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
    return {
      benchmarks: {
        haccpScore: {
          best: 96,
          average: 87,
          worst: 78
        },
        compliance: {
          best: 98,
          average: 91,
          worst: 83
        },
        incidents: {
          best: 0,
          average: 4,
          worst: 12
        },
        taskCompletion: {
          best: 99,
          average: 93,
          worst: 85
        }
      },
      sites: [
        {
          id: 1,
          name: "Casablanca Central Plant",
          city: "Casablanca",
          overallScore: 96,
          haccpScore: 98,
          complianceRate: 97,
          taskCompletion: 99,
          auditScore: 95,
          incidents: 0,
          trend: "up"
        },
        {
          id: 2,
          name: "Rabat Distribution Center",
          city: "Rabat",
          overallScore: 93,
          haccpScore: 94,
          complianceRate: 95,
          taskCompletion: 96,
          auditScore: 91,
          incidents: 1,
          trend: "up"
        },
        {
          id: 3,
          name: "Tangier Processing Facility",
          city: "Tangier",
          overallScore: 89,
          haccpScore: 91,
          complianceRate: 89,
          taskCompletion: 93,
          auditScore: 87,
          incidents: 2,
          trend: "up"
        },
        {
          id: 4,
          name: "Marrakech Regional Hub",
          city: "Marrakech",
          overallScore: 87,
          haccpScore: 88,
          complianceRate: 90,
          taskCompletion: 89,
          auditScore: 85,
          incidents: 3,
          trend: "down"
        },
        {
          id: 5,
          name: "Fez Manufacturing Unit",
          city: "Fez",
          overallScore: 84,
          haccpScore: 86,
          complianceRate: 85,
          taskCompletion: 87,
          auditScore: 82,
          incidents: 4,
          trend: "up"
        },
        {
          id: 6,
          name: "Agadir Coastal Facility",
          city: "Agadir",
          overallScore: 81,
          haccpScore: 83,
          complianceRate: 82,
          taskCompletion: 85,
          auditScore: 79,
          incidents: 6,
          trend: "down"
        }
      ],
      categories: [
        {
          name: "HACCP Compliance",
          sites: [
            { name: "Casablanca Central Plant", score: 98, rank: 1 },
            { name: "Rabat Distribution Center", score: 94, rank: 2 },
            { name: "Tangier Processing Facility", score: 91, rank: 3 },
            { name: "Marrakech Regional Hub", score: 88, rank: 4 }
          ]
        },
        {
          name: "Task Completion Rate",
          sites: [
            { name: "Casablanca Central Plant", score: 99, rank: 1 },
            { name: "Rabat Distribution Center", score: 96, rank: 2 },
            { name: "Tangier Processing Facility", score: 93, rank: 3 },
            { name: "Marrakech Regional Hub", score: 89, rank: 4 }
          ]
        },
        {
          name: "Safety Incidents",
          sites: [
            { name: "Casablanca Central Plant", score: 100, rank: 1 },
            { name: "Rabat Distribution Center", score: 95, rank: 2 },
            { name: "Tangier Processing Facility", score: 90, rank: 3 },
            { name: "Marrakech Regional Hub", score: 85, rank: 4 }
          ]
        },
        {
          name: "Audit Performance",
          sites: [
            { name: "Casablanca Central Plant", score: 95, rank: 1 },
            { name: "Rabat Distribution Center", score: 91, rank: 2 },
            { name: "Tangier Processing Facility", score: 87, rank: 3 },
            { name: "Marrakech Regional Hub", score: 85, rank: 4 }
          ]
        }
      ],
      bestPractices: [
        {
          practice: "Digital Temperature Monitoring System",
          leader: "Casablanca Central Plant",
          adoption: 85
        },
        {
          practice: "Automated Cleaning Protocols",
          leader: "Rabat Distribution Center",
          adoption: 78
        },
        {
          practice: "Real-time Quality Tracking",
          leader: "Tangier Processing Facility",
          adoption: 72
        },
        {
          practice: "Predictive Maintenance Program",
          leader: "Casablanca Central Plant",
          adoption: 68
        },
        {
          practice: "Staff Cross-training Initiative",
          leader: "Marrakech Regional Hub",
          adoption: 64
}
      ]
    };
    } catch (error) {
      console.error('Error fetching multi-site comparison data:', error);
      toast.error('Error fetching multi-site comparison data');
      return null;
    }
  }
}

export const analyticsService = new AnalyticsService();