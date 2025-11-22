import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createTask, deleteTask, getAllTasks, updateTask } from "@/services/api/taskService";
import { toast } from "react-toastify";
import { getAll } from "@/services/api/siteService";
import { getAllUsers } from "@/services/api/userService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const TaskManager = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    status_c: 'Pending',
    priority_c: 'Medium',
    assigned_to_c: '',
    site_id_c: '',
    due_date_c: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

const [tasksData, usersData, sitesData] = await Promise.all([
        getAllTasks(),
        getAllUsers(),
        getAll()
      ]);

      setTasks(tasksData);
      setUsers(usersData);
      setSites(sitesData);
    } catch (err) {
      console.error('Error loading task manager data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Role-based filtering
    if (user?.role_id_c?.Name === 'Site Manager' && user?.site_id_c?.Id) {
      filtered = filtered.filter(task => task.site_id_c?.Id === user.site_id_c.Id);
    } else if (user?.role_id_c?.Name === 'User') {
      filtered = filtered.filter(task => task.assigned_to_c?.Id === user.Id);
    }

    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(task => task.status_c === filter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const taskData = {
        ...formData,
        assigned_to_c: formData.assigned_to_c ? parseInt(formData.assigned_to_c) : null,
        site_id_c: formData.site_id_c ? parseInt(formData.site_id_c) : null
      };

      let success;
      if (editingTask) {
        success = await updateTask(editingTask.Id, taskData);
      } else {
        const newTask = await createTask(taskData);
        success = !!newTask;
      }

      if (success) {
        await loadData();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      name_c: task.name_c || '',
      description_c: task.description_c || '',
      status_c: task.status_c || 'Pending',
      priority_c: task.priority_c || 'Medium',
      assigned_to_c: task.assigned_to_c?.Id?.toString() || '',
      site_id_c: task.site_id_c?.Id?.toString() || '',
      due_date_c: task.due_date_c || ''
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    const success = await deleteTask(taskId);
    if (success) {
      await loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      name_c: '',
      description_c: '',
      status_c: 'Pending',
      priority_c: 'Medium',
      assigned_to_c: '',
      site_id_c: '',
      due_date_c: ''
    });
    setEditingTask(null);
    setShowCreateModal(false);
  };

  const canCreateTask = user?.role_id_c?.Name === 'CEO' || user?.role_id_c?.Name === 'Site Manager';
  const filteredTasks = getFilteredTasks();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        title="Task Manager Error"
        message={`Failed to load tasks: ${error}`}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Manager</h1>
          <p className="text-slate-600">Manage and track tasks across your sites</p>
        </div>
        {canCreateTask && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Tasks</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description={searchTerm ? "No tasks match your search criteria" : "No tasks have been created yet"}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card key={task.Id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {task.name_c}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {task.description_c}
                  </p>
                </div>
                {canCreateTask && (
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(task)}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task.Id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <Badge
                    variant={
                      task.status_c === 'Completed' ? 'success' :
                      task.status_c === 'In Progress' ? 'info' :
                      task.status_c === 'Cancelled' ? 'error' :
                      'warning'
                    }
                  >
                    {task.status_c || 'Pending'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Priority</span>
                  <Badge
                    variant={
                      task.priority_c === 'Critical' ? 'error' :
                      task.priority_c === 'High' ? 'warning' :
                      task.priority_c === 'Medium' ? 'info' :
                      'default'
                    }
                  >
                    {task.priority_c || 'Low'}
                  </Badge>
                </div>

                {task.assigned_to_c && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Assigned to</span>
                    <span className="text-sm font-medium text-slate-900">
                      {task.assigned_to_c.Name}
                    </span>
                  </div>
                )}

                {task.site_id_c && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Site</span>
                    <span className="text-sm font-medium text-slate-900">
                      {task.site_id_c.Name}
                    </span>
                  </div>
                )}

                {task.due_date_c && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Due Date</span>
                    <span className="text-sm font-medium text-slate-900">
                      {new Date(task.due_date_c).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-90vh overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Task Name *
                </label>
                <Input
                  type="text"
                  value={formData.name_c}
                  onChange={(e) => setFormData({...formData, name_c: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description_c}
                  onChange={(e) => setFormData({...formData, description_c: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status_c}
                    onChange={(e) => setFormData({...formData, status_c: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority_c}
                    onChange={(e) => setFormData({...formData, priority_c: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Assign To
                </label>
                <select
                  value={formData.assigned_to_c}
                  onChange={(e) => setFormData({...formData, assigned_to_c: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.Id} value={user.Id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Site
                </label>
                <select
                  value={formData.site_id_c}
                  onChange={(e) => setFormData({...formData, site_id_c: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Site</option>
                  {sites.map((site) => (
                    <option key={site.Id} value={site.Id}>
                      {site.name_c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={formData.due_date_c}
                  onChange={(e) => setFormData({...formData, due_date_c: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;