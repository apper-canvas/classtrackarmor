import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import ProgressChart from "@/components/molecules/ProgressChart";
import { useAuth } from "@/context/AuthContext";
import { assignmentService } from "@/services/api/assignmentService";
import { submissionService } from "@/services/api/submissionService";
import { formatDate } from "@/utils/dateUtils";
import { calculateGradePercentage, getGradeColor, calculateOverallGrade } from "@/utils/gradeUtils";

const GradeHistory = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [assignmentsData, submissionsData] = await Promise.all([
        assignmentService.getAll(),
        submissionService.getByStudentId(currentUser.Id)
      ]);
      
      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
    } catch (err) {
      setError("Failed to load grade history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  if (loading) return <Loading className="p-6" />;
  if (error) return <ErrorView message={error} onRetry={loadData} className="min-h-96" />;

  // Combine submissions with assignment data
  const gradeData = submissions
    .map(submission => {
      const assignment = assignments.find(a => a.Id === submission.assignmentId);
      if (!assignment) return null;
      
      return {
        ...submission,
        assignmentTitle: assignment.title,
        pointsPossible: assignment.pointsPossible,
        dueDate: assignment.dueDate,
        percentage: submission.grade !== null ? calculateGradePercentage(submission.grade, assignment.pointsPossible) : null
      };
    })
    .filter(Boolean);

  // Filter and sort data
  const filteredData = gradeData
    .filter(item => {
      const matchesSearch = item.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === "all" || 
        (filterStatus === "graded" && item.status === "graded") ||
        (filterStatus === "submitted" && item.status === "submitted") ||
        (filterStatus === "pending" && item.status === "draft");
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        case "grade":
          if (a.percentage === null) return 1;
          if (b.percentage === null) return -1;
          return b.percentage - a.percentage;
        case "title":
          return a.assignmentTitle.localeCompare(b.assignmentTitle);
        default:
          return 0;
      }
    });

  const overallGrade = calculateOverallGrade(gradeData);
  const gradedCount = gradeData.filter(g => g.status === "graded").length;
  const submittedCount = gradeData.filter(g => g.status === "submitted").length;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Grade History</h1>
          <p className="text-slate-600">Track your academic progress and performance</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/student")}
          icon="ArrowLeft"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Overall Grade</p>
                <p className="text-3xl font-bold text-blue-700">{overallGrade}%</p>
              </div>
              <ProgressChart percentage={overallGrade} color="blue" size="md" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Graded Assignments</p>
                <p className="text-3xl font-bold text-slate-900">{gradedCount}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Grades</p>
                <p className="text-3xl font-bold text-slate-900">{submittedCount}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Clock" className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search assignments..."
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="grade">Sort by Grade</option>
                <option value="title">Sort by Title</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="graded">Graded</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Grades</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <Empty 
              icon="BarChart3"
              title="No grades found"
              message="No assignments match your search criteria."
              className="py-8"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Assignment</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Submitted</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Grade</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredData.map((item) => (
                    <tr key={item.Id} className="hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div>
                          <h4 className="font-medium text-slate-900">{item.assignmentTitle}</h4>
                          <p className="text-sm text-slate-500">Due: {formatDate(item.dueDate)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">
                          {formatDate(item.submittedAt)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {item.grade !== null ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">
                              {item.grade}/{item.pointsPossible}
                            </span>
                            <Badge variant="secondary">
                              {item.percentage}%
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-slate-400">Not graded</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={
                          item.status === "graded" ? "success" :
                          item.status === "submitted" ? "info" : "secondary"
                        }>
                          {item.status === "graded" ? "Graded" :
                           item.status === "submitted" ? "Submitted" : "Draft"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {item.feedback ? (
                          <div className="max-w-xs">
                            <p className="text-sm text-slate-600 truncate" title={item.feedback}>
                              {item.feedback}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">No feedback</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeHistory;