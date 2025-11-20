import notificationData from "@/services/mockData/notifications.json";

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const notificationService = {
  async getAll() {
    await delay(300);
    return [...notificationData];
  },

  async getById(id) {
    await delay(200);
    const notification = notificationData.find(n => n.Id === parseInt(id));
    return notification ? { ...notification } : null;
  },

  async getByTeacherId(teacherId) {
    await delay(250);
    return notificationData.filter(n => n.teacherId === teacherId).map(n => ({ ...n }));
  },

  async create(newNotification) {
    await delay(400);
    const notification = {
      Id: Math.max(...notificationData.map(n => n.Id)) + 1,
      ...newNotification,
      createdAt: new Date().toISOString(),
      read: false
    };
    notificationData.push(notification);
    return { ...notification };
  },

  async markAsRead(id) {
    await delay(200);
    const notificationIndex = notificationData.findIndex(n => n.Id === parseInt(id));
    if (notificationIndex === -1) throw new Error("Notification not found");
    
    notificationData[notificationIndex].read = true;
    return { ...notificationData[notificationIndex] };
  },

  async markAllAsRead(teacherId) {
    await delay(300);
    const teacherNotifications = notificationData.filter(n => n.teacherId === teacherId);
    teacherNotifications.forEach(notification => {
      notification.read = true;
    });
    return teacherNotifications.map(n => ({ ...n }));
  },

  async delete(id) {
    await delay(300);
    const notificationIndex = notificationData.findIndex(n => n.Id === parseInt(id));
    if (notificationIndex === -1) throw new Error("Notification not found");
    
    const deletedNotification = { ...notificationData[notificationIndex] };
    notificationData.splice(notificationIndex, 1);
    return deletedNotification;
  }
};

export { notificationService };