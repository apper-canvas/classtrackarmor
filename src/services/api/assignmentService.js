import assignmentData from "@/services/mockData/assignments.json";

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignmentData];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignmentData.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  async getByTeacherId(teacherId) {
    await delay(250);
    return assignmentData.filter(a => a.createdBy === teacherId).map(a => ({ ...a }));
  },

  async create(newAssignment) {
    await delay(400);
    const assignment = {
      Id: Math.max(...assignmentData.map(a => a.Id)) + 1,
      ...newAssignment,
      createdAt: new Date().toISOString()
    };
    assignmentData.push(assignment);
    return { ...assignment };
  },

  async update(id, updateData) {
    await delay(350);
    const assignmentIndex = assignmentData.findIndex(a => a.Id === parseInt(id));
    if (assignmentIndex === -1) throw new Error("Assignment not found");
    
    const updatedAssignment = { ...assignmentData[assignmentIndex], ...updateData };
    assignmentData[assignmentIndex] = updatedAssignment;
    return { ...updatedAssignment };
  },

  async delete(id) {
    await delay(300);
    const assignmentIndex = assignmentData.findIndex(a => a.Id === parseInt(id));
    if (assignmentIndex === -1) throw new Error("Assignment not found");
    
    const deletedAssignment = { ...assignmentData[assignmentIndex] };
    assignmentData.splice(assignmentIndex, 1);
    return deletedAssignment;
  }
};

export { assignmentService };