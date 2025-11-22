import sitesData from "@/services/mockData/sites.json";

let sites = [...sitesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const siteService = {
  async getAll() {
    await delay(300);
    return [...sites];
  },

  async getById(id) {
    await delay(200);
    const site = sites.find(s => s.Id === parseInt(id));
    if (!site) {
      throw new Error("Site not found");
    }
    return { ...site };
  },

  async getByCompany(companyId) {
    await delay(250);
    return sites.filter(s => s.companyId === parseInt(companyId));
  },

  async create(siteData) {
    await delay(400);
    const newSite = {
      ...siteData,
      Id: Math.max(...sites.map(s => s.Id)) + 1,
      createdAt: new Date().toISOString(),
      status: "active"
    };
    sites.push(newSite);
    return { ...newSite };
  },

  async update(id, siteData) {
    await delay(400);
    const index = sites.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Site not found");
    }
    sites[index] = { ...sites[index], ...siteData };
    return { ...sites[index] };
  },

  async delete(id) {
    await delay(300);
    const index = sites.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Site not found");
    }
    sites.splice(index, 1);
    return { success: true };
  }
};