import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import FileUpload from "@/components/molecules/FileUpload";
import DeadlineCountdown from "@/components/molecules/DeadlineCountdown";
import { useAuth } from "@/context/AuthContext";
import { assignmentService } from "@/services/api/assignmentService";
import { submissionService } from "@/services/api/submissionService";
import { formatDate, isDeadlinePassed } from "@/utils/dateUtils";

const AssignmentDetail = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    if (!currentUser || !id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const assignmentData = await assignmentService.getById(parseInt(id));
      if (!assignmentData) {
        setError("Assignment not found");
        return;
      }
      
      setAssignment(assignmentData);
      
      // Load existing submission if any
      const submissions = await submissionService.getByStudentId(currentUser.Id);
      const existingSubmission = submissions.find(s => s.assignmentId === assignmentData.Id);
      setSubmission(existingSubmission || null);
      
    } catch (err) {
      setError("Failed to load assignment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, currentUser]);

  const handleFileUpload = async (file) => {
    if (!assignment || !currentUser) return;
    
    setUploading(true);
    
    try {
      // Create submission data
      const submissionData = {
        assignmentId: assignment.Id,
        studentId: currentUser.Id,
        fileName: file.name,
        fileUrl: `uploads/${file.name}`, // Mock file URL
        submittedAt: new Date().toISOString(),
        status: "submitted",
        grade: null,
        feedback: ""
      };
      
      const newSubmission = await submissionService.create(submissionData);
      setSubmission(newSubmission);
      
      toast.success("Assignment submitted successfully!");
      
    } catch (error) {
      toast.error("Failed to submit assignment");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loading className="p-6" />;
  if (error) return <ErrorView message={error} onRetry={loadData} className="min-h-96" />;
  if (!assignment) return <ErrorView message="Assignment not found" className="min-h-96" />;

  const isOverdue = isDeadlinePassed(assignment.dueDate);
  const hasSubmitted = submission && submission.status !== "draft";
  const isGraded = submission && submission.status === "graded";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon="ArrowLeft"
        >
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{assignment.title}</h1>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-slate-600">Due: {formatDate(assignment.dueDate)}</span>
            <Badge variant="secondary">{assignment.pointsPossible} points</Badge>
          </div>
        </div>
        <DeadlineCountdown dueDate={assignment.dueDate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignment Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="FileText" className="h-5 w-5 text-blue-600" />
                <span>Assignment Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-wrap">{assignment.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Submission Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Upload" className="h-5 w-5 text-emerald-600" />
                  <span>Submission</span>
                </div>
                {hasSubmitted && (
                  <Badge variant={isGraded ? "success" : "info"}>
                    {isGraded ? "Graded" : "Submitted"}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasSubmitted ? (
                <div className="space-y-4">
                  {/* Submitted File Info */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="CheckCircle" className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-emerald-900">Submission Complete</h4>
                        <p className="text-sm text-emerald-700">
                          File: {submission.fileName}
                        </p>
                        <p className="text-xs text-emerald-600">
                          Submitted on {formatDate(submission.submittedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grade and Feedback */}
                  {isGraded && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-blue-900">Grade</h4>
                        <Badge variant="success">
                          {submission.grade}/{assignment.pointsPossible}
                        </Badge>
                      </div>
                      {submission.feedback && (
                        <div>
                          <h5 className="font-medium text-blue-900 mb-2">Teacher Feedback</h5>
                          <p className="text-blue-800 text-sm bg-blue-100 p-3 rounded">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <FileUpload
                  onUpload={handleFileUpload}
                  disabled={isOverdue}
                  className="w-full"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Points</span>
                <span className="font-semibold">{assignment.pointsPossible}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Due Date</span>
                <span className="font-semibold text-sm">{formatDate(assignment.dueDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Status</span>
                {hasSubmitted ? (
                  <Badge variant={isGraded ? "success" : "info"}>
                    {isGraded ? "Graded" : "Submitted"}
                  </Badge>
                ) : isOverdue ? (
                  <Badge variant="danger">Overdue</Badge>
                ) : (
                  <Badge variant="warning">Pending</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start space-x-2">
                  <ApperIcon name="FileText" className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Accepted formats: PDF, DOC, DOCX, TXT</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ApperIcon name="HardDrive" className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Maximum file size: 10MB</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ApperIcon name="Clock" className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Submissions after deadline are not accepted</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ApperIcon name="AlertTriangle" className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span>Once submitted, you cannot resubmit</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;