import userData from "@/services/mockData/users.json";

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userService = {
  async getAll() {
    await delay(300);
    return [...userData];
  },

  async getById(id) {
    await delay(200);
    const user = userData.find(u => u.Id === parseInt(id));
    return user ? { ...user } : null;
  },

  async getByRole(role) {
    await delay(250);
    return userData.filter(u => u.role === role).map(u => ({ ...u }));
  },

  async create(userData) {
    await delay(400);
    const newUser = {
      Id: Math.max(...userData.map(u => u.Id)) + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    return { ...newUser };
  },

  async update(id, updateData) {
    await delay(350);
    const userIndex = userData.findIndex(u => u.Id === parseInt(id));
    if (userIndex === -1) throw new Error("User not found");
    
    const updatedUser = { ...userData[userIndex], ...updateData };
    userData[userIndex] = updatedUser;
    return { ...updatedUser };
  },

  async delete(id) {
    await delay(300);
    const userIndex = userData.findIndex(u => u.Id === parseInt(id));
    if (userIndex === -1) throw new Error("User not found");
    
    const deletedUser = { ...userData[userIndex] };
    userData.splice(userIndex, 1);
    return deletedUser;
  }
};

export { userService };