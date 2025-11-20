import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { useAuth } from "@/context/AuthContext";
import { assignmentService } from "@/services/api/assignmentService";
import { submissionService } from "@/services/api/submissionService";
import { userService } from "@/services/api/userService";
import { formatDate } from "@/utils/dateUtils";

const TeacherDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [assignmentsData, submissionsData, usersData] = await Promise.all([
        assignmentService.getByTeacherId(currentUser.Id),
        submissionService.getAll(),
        userService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
      setStudents(usersData.filter(u => u.role === "student"));
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  if (loading) return <Loading className="p-6" />;
  if (error) return <ErrorView message={error} onRetry={loadData} className="min-h-96" />;

  // Calculate statistics
  const totalAssignments = assignments.length;
  const pendingSubmissions = submissions.filter(s => s.status === "submitted").length;
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter(s => s.status === "graded").length;

  // Recent submissions needing grading
  const recentSubmissions = submissions
    .filter(s => s.status === "submitted")
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student?.name || "Unknown Student";
  };

  const getAssignmentTitle = (assignmentId) => {
    const assignment = assignments.find(a => a.Id === assignmentId);
    return assignment?.title || "Unknown Assignment";
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="text-blue-100">Here's your teaching overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Assignments</p>
                <p className="text-3xl font-bold text-blue-700">{totalAssignments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ApperIcon name="BookOpen" className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Total Submissions</p>
                <p className="text-3xl font-bold text-emerald-700">{totalSubmissions}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <ApperIcon name="FileText" className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Pending Grading</p>
                <p className="text-3xl font-bold text-amber-700">{pendingSubmissions}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Clock" className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Graded</p>
                <p className="text-3xl font-bold text-purple-700">{gradedSubmissions}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="FileText" className="h-5 w-5 text-amber-600" />
                <span>Recent Submissions</span>
              </CardTitle>
              <Badge variant="warning">{pendingSubmissions} pending</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <Empty 
                icon="FileText"
                title="No submissions pending"
                message="All submissions have been graded!"
                className="py-8"
              />
            ) : (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.Id}
                    className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {getAssignmentTitle(submission.assignmentId)}
                      </h4>
                      <p className="text-sm text-slate-600 mb-2">
                        Submitted by {getStudentName(submission.studentId)}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>Submitted: {formatDate(submission.submittedAt)}</span>
                        <span>{submission.fileName}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant="warning">Pending</Badge>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/review/${submission.Id}`)}
                      >
                        Grade
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignments Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BookOpen" className="h-5 w-5 text-blue-600" />
              <span>My Assignments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <Empty 
                icon="BookOpen"
                title="No assignments yet"
                message="Create your first assignment to get started."
                actionLabel="Create Assignment"
                onAction={() => toast.info("Assignment creation feature coming soon!")}
                className="py-8"
              />
            ) : (
              <div className="space-y-4">
                {assignments.slice(0, 5).map((assignment) => {
                  const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.Id);
                  const submissionCount = assignmentSubmissions.length;
                  const gradedCount = assignmentSubmissions.filter(s => s.status === "graded").length;
                  
                  return (
                    <div
                      key={assignment.Id}
                      className="flex items-start justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {assignment.title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                          {assignment.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                          <span>{assignment.pointsPossible} points</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">
                          {submissionCount} submissions
                        </p>
                        <p className="text-xs text-slate-500">
                          {gradedCount} graded
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;