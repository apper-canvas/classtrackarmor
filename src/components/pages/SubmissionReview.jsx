import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { useAuth } from "@/context/AuthContext";
import { submissionService } from "@/services/api/submissionService";
import { assignmentService } from "@/services/api/assignmentService";
import { userService } from "@/services/api/userService";
import { formatDate } from "@/utils/dateUtils";
import { calculateGradePercentage } from "@/utils/gradeUtils";

const SubmissionReview = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grading, setGrading] = useState(false);
  const [gradeData, setGradeData] = useState({
    grade: "",
    feedback: ""
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    if (!submissionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const submissionData = await submissionService.getById(parseInt(submissionId));
      if (!submissionData) {
        setError("Submission not found");
        return;
      }
      
      const [assignmentData, studentData] = await Promise.all([
        assignmentService.getById(submissionData.assignmentId),
        userService.getById(submissionData.studentId)
      ]);
      
      setSubmission(submissionData);
      setAssignment(assignmentData);
      setStudent(studentData);
      
      // Pre-fill existing grade data
      if (submissionData.grade !== null) {
        setGradeData({
          grade: submissionData.grade.toString(),
          feedback: submissionData.feedback || ""
        });
      }
      
    } catch (err) {
      setError("Failed to load submission details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [submissionId]);

  const handleGradeSubmit = async () => {
    if (!submission || !assignment) return;
    
    const gradeValue = parseInt(gradeData.grade);
    
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > assignment.pointsPossible) {
      toast.error(`Grade must be between 0 and ${assignment.pointsPossible}`);
      return;
    }
    
    setGrading(true);
    
    try {
      const updatedSubmission = await submissionService.update(submission.Id, {
        grade: gradeValue,
        feedback: gradeData.feedback.trim(),
        status: "graded"
      });
      
      setSubmission(updatedSubmission);
      toast.success("Grade submitted successfully!");
      
    } catch (error) {
      toast.error("Failed to submit grade");
    } finally {
      setGrading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setGradeData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  if (loading) return <Loading className="p-6" />;
  if (error) return <ErrorView message={error} onRetry={loadData} className="min-h-96" />;
  if (!submission || !assignment || !student) {
    return <ErrorView message="Data not found" className="min-h-96" />;
  }

  const percentage = submission.grade !== null ? calculateGradePercentage(submission.grade, assignment.pointsPossible) : null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/teacher")}
            icon="ArrowLeft"
          >
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Review Submission</h1>
            <p className="text-slate-600">{assignment.title}</p>
          </div>
        </div>
        
        <Badge variant={
          submission.status === "graded" ? "success" :
          submission.status === "submitted" ? "warning" : "secondary"
        }>
          {submission.status === "graded" ? "Graded" :
           submission.status === "submitted" ? "Pending Review" : "Draft"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student & Assignment Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="User" className="h-5 w-5 text-blue-600" />
                <span>Student Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {student.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{student.name}</h3>
                  <p className="text-sm text-slate-600">{student.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" className="h-5 w-5 text-emerald-600" />
                <span>Assignment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Points Possible</span>
                <span className="font-semibold">{assignment.pointsPossible}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Due Date</span>
                <span className="text-sm">{formatDate(assignment.dueDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Submitted</span>
                <span className="text-sm">{formatDate(submission.submittedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Current Grade Display */}
          {submission.status === "graded" && (
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">Current Grade</h3>
                  <div className="text-4xl font-bold text-emerald-700 mb-2">
                    {submission.grade}/{assignment.pointsPossible}
                  </div>
                  <Badge variant="success">{percentage}%</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Submission Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="FileText" className="h-5 w-5 text-blue-600" />
                <span>Submitted File</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileText" className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{submission.fileName}</h4>
                    <p className="text-sm text-slate-600">
                      Submitted on {formatDate(submission.submittedAt)}
                    </p>
                  </div>
                  <Button variant="secondary" icon="Download">
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grading Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Edit" className="h-5 w-5 text-amber-600" />
                <span>Grade Submission</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Grade"
                  type="number"
                  min="0"
                  max={assignment.pointsPossible}
                  value={gradeData.grade}
                  onChange={handleChange("grade")}
                  placeholder="Enter grade"
                  required
                />
                <div className="flex items-end">
                  <div className="text-sm text-slate-600">
                    out of {assignment.pointsPossible} points
                    {gradeData.grade && !isNaN(gradeData.grade) && (
                      <div className="mt-1 text-lg font-semibold">
                        {calculateGradePercentage(parseInt(gradeData.grade), assignment.pointsPossible)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Feedback (optional)
                </label>
                <textarea
                  value={gradeData.feedback}
                  onChange={handleChange("feedback")}
                  placeholder="Provide feedback to help the student improve..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/teacher")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGradeSubmit}
                  loading={grading}
                  disabled={!gradeData.grade}
                  icon="Check"
                >
                  {submission.status === "graded" ? "Update Grade" : "Submit Grade"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Info" className="h-5 w-5 text-slate-600" />
                <span>Assignment Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-wrap">{assignment.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmissionReview;