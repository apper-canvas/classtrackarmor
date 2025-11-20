import submissionData from "@/services/mockData/submissions.json";

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const submissionService = {
  async getAll() {
    await delay(300);
    return [...submissionData];
  },

  async getById(id) {
    await delay(200);
    const submission = submissionData.find(s => s.Id === parseInt(id));
    return submission ? { ...submission } : null;
  },

  async getByStudentId(studentId) {
    await delay(250);
    return submissionData.filter(s => s.studentId === studentId).map(s => ({ ...s }));
  },

  async getByAssignmentId(assignmentId) {
    await delay(250);
    return submissionData.filter(s => s.assignmentId === assignmentId).map(s => ({ ...s }));
  },

  async create(newSubmission) {
    await delay(400);
    const submission = {
      Id: Math.max(...submissionData.map(s => s.Id)) + 1,
      ...newSubmission
    };
    submissionData.push(submission);
    return { ...submission };
  },

  async update(id, updateData) {
    await delay(350);
    const submissionIndex = submissionData.findIndex(s => s.Id === parseInt(id));
    if (submissionIndex === -1) throw new Error("Submission not found");
    
    const updatedSubmission = { ...submissionData[submissionIndex], ...updateData };
    submissionData[submissionIndex] = updatedSubmission;
    return { ...updatedSubmission };
  },

  async delete(id) {
    await delay(300);
    const submissionIndex = submissionData.findIndex(s => s.Id === parseInt(id));
    if (submissionIndex === -1) throw new Error("Submission not found");
    
    const deletedSubmission = { ...submissionData[submissionIndex] };
    submissionData.splice(submissionIndex, 1);
    return deletedSubmission;
  }
};

export { submissionService };