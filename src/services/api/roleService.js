import rolesData from "@/services/mockData/roles.json";
import permissionsData from "@/services/mockData/permissions.json";

let roles = [...rolesData];
let permissions = [...permissionsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const roleService = {
  async getAll() {
    await delay(200);
    return [...roles];
  },

  async getById(id) {
    await delay(150);
    const role = roles.find(r => r.Id === parseInt(id));
    if (!role) {
      throw new Error("Role not found");
    }
    return { ...role };
  },

  async getPermissions(roleId) {
    await delay(200);
    return permissions.filter(p => p.roleId === parseInt(roleId));
  },

  async getAllPermissions() {
    await delay(200);
    return [...permissions];
  }
};