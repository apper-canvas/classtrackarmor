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
import DeadlineCountdown from "@/components/molecules/DeadlineCountdown";
import ProgressChart from "@/components/molecules/ProgressChart";
import { useAuth } from "@/context/AuthContext";
import { assignmentService } from "@/services/api/assignmentService";
import { submissionService } from "@/services/api/submissionService";
import { formatDate, isDeadlinePassed } from "@/utils/dateUtils";
import { calculateOverallGrade } from "@/utils/gradeUtils";

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const submittedCount = submissions.filter(s => s.status === "submitted" || s.status === "graded").length;
  const pendingCount = assignments.length - submittedCount;
  const overallGrade = calculateOverallGrade(submissions.map(s => ({
    ...s,
    pointsPossible: assignments.find(a => a.Id === s.assignmentId)?.pointsPossible || 0
  })));

  const upcomingAssignments = assignments
    .filter(a => !submissions.find(s => s.assignmentId === a.Id))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recentFeedback = submissions
    .filter(s => s.feedback && s.status === "graded")
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 3);

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="text-blue-100">Here's your academic progress overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Overall Grade</p>
                <p className="text-3xl font-bold text-emerald-700">{overallGrade}%</p>
              </div>
              <ProgressChart percentage={overallGrade} color="emerald" size="md" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Submitted</p>
                <p className="text-3xl font-bold text-blue-700">{submittedCount}</p>
                <p className="text-blue-500 text-xs">assignments</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-amber-700">{pendingCount}</p>
                <p className="text-amber-500 text-xs">assignments</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Clock" className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" className="h-5 w-5 text-blue-600" />
                <span>Upcoming Assignments</span>
              </CardTitle>
              <Badge variant="secondary">{upcomingAssignments.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingAssignments.length === 0 ? (
              <Empty 
                icon="CheckCircle"
                title="All caught up!"
                message="You don't have any pending assignments right now."
                className="py-8"
              />
            ) : (
              <div className="space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <div
                    key={assignment.Id}
                    className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
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
                    <div className="flex flex-col items-end space-y-2">
                      <DeadlineCountdown dueDate={assignment.dueDate} />
                      <Button
                        size="sm"
                        onClick={() => navigate(`/assignment/${assignment.Id}`)}
                        disabled={isDeadlinePassed(assignment.dueDate)}
                      >
                        {isDeadlinePassed(assignment.dueDate) ? "Closed" : "View"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="MessageSquare" className="h-5 w-5 text-emerald-600" />
              <span>Recent Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentFeedback.length === 0 ? (
              <Empty 
                icon="MessageSquare"
                title="No feedback yet"
                message="Your graded assignments will appear here with teacher feedback."
                className="py-8"
              />
            ) : (
              <div className="space-y-4">
                {recentFeedback.map((submission) => {
                  const assignment = assignments.find(a => a.Id === submission.assignmentId);
                  if (!assignment) return null;
                  
                  return (
                    <div
                      key={submission.Id}
                      className="p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">
                          {assignment.title}
                        </h4>
                        <Badge variant="success">
                          {submission.grade}/{assignment.pointsPossible}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {submission.feedback}
                      </p>
                      <p className="text-xs text-slate-500">
                        Graded on {formatDate(submission.submittedAt)}
                      </p>
                    </div>
                  );
                })}
                
                <div className="text-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/grades")}
                    icon="ArrowRight"
                    iconPosition="right"
                  >
                    View all grades
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;