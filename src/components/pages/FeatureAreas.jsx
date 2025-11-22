import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";
import { featureAreaService } from "@/services/api/featureAreaService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const FeatureAreas = () => {
  const { t } = useTranslation();
  const [featureAreas, setFeatureAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFeatureArea, setEditingFeatureArea] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    feature_area_c: "",
    relevant_moroccan_laws_c: "",
    compliance_objectives_c: "",
    obligatory_records_c: "",
    record_retention_requirements_c: "",
    inspection_needs_c: "",
    reporting_obligations_c: ""
  });

  useEffect(() => {
    loadFeatureAreas();
  }, []);

  const loadFeatureAreas = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await featureAreaService.getAll();
      setFeatureAreas(data);
    } catch (err) {
      setError(err.message || "Failed to load feature areas");
      toast.error("Failed to load feature areas");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFeatureArea) {
        await featureAreaService.update(editingFeatureArea.Id, formData);
      } else {
        await featureAreaService.create(formData);
      }
      
      setShowCreateModal(false);
      setEditingFeatureArea(null);
      setFormData({
        Name: "",
        feature_area_c: "",
        relevant_moroccan_laws_c: "",
        compliance_objectives_c: "",
        obligatory_records_c: "",
        record_retention_requirements_c: "",
        inspection_needs_c: "",
        reporting_obligations_c: ""
      });
      
      await loadFeatureAreas();
    } catch (error) {
      toast.error(editingFeatureArea ? "Failed to update feature area" : "Failed to create feature area");
    }
  };

  const handleEdit = (featureArea) => {
    setEditingFeatureArea(featureArea);
    setFormData({
      Name: featureArea.Name || "",
      feature_area_c: featureArea.feature_area_c || "",
      relevant_moroccan_laws_c: featureArea.relevant_moroccan_laws_c || "",
      compliance_objectives_c: featureArea.compliance_objectives_c || "",
      obligatory_records_c: featureArea.obligatory_records_c || "",
      record_retention_requirements_c: featureArea.record_retention_requirements_c || "",
      inspection_needs_c: featureArea.inspection_needs_c || "",
      reporting_obligations_c: featureArea.reporting_obligations_c || ""
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this feature area?")) {
      return;
    }

    const success = await featureAreaService.remove(id);
    if (success) {
      await loadFeatureAreas();
    }
  };

  const filteredFeatureAreas = featureAreas.filter(area =>
    area.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.feature_area_c?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadFeatureAreas} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Feature Areas & Regulatory Alignment
          </h1>
          <p className="text-slate-600">
            Manage compliance requirements and regulatory alignment for different feature areas
          </p>
        </div>
        <Button 
          variant="primary" 
          icon="Plus"
          onClick={() => setShowCreateModal(true)}
        >
          Add Feature Area
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search feature areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          <Button variant="outline" icon="Filter">
            Filter
          </Button>
        </div>
      </Card>

      {/* Feature Areas Grid */}
      {filteredFeatureAreas.length === 0 ? (
        <Empty
          icon="FileText"
          title="No feature areas found"
          description="Start by adding your first feature area and regulatory alignment requirements."
          action={
            <Button variant="primary" icon="Plus" onClick={() => setShowCreateModal(true)}>
              Add Feature Area
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFeatureAreas.map((area) => (
            <Card key={area.Id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {area.Name || "Unnamed Area"}
                    </h3>
                    {area.feature_area_c && (
                      <Badge variant="primary" size="sm">
                        {area.feature_area_c}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => handleEdit(area)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(area.Id)}
                    />
                  </div>
                </div>

                {area.compliance_objectives_c && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Compliance Objectives</h4>
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {area.compliance_objectives_c}
                    </p>
                  </div>
                )}

                {area.relevant_moroccan_laws_c && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Relevant Moroccan Laws</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {area.relevant_moroccan_laws_c}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    {area.CreatedOn && (
                      <span>
                        Created {formatDistanceToNow(new Date(area.CreatedOn), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Shield" className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-emerald-600 font-medium">Compliant</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingFeatureArea ? "Edit Feature Area" : "Add New Feature Area"}
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <Input
                    value={formData.Name}
                    onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                    placeholder="Feature area name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Feature Area
                  </label>
                  <Input
                    value={formData.feature_area_c}
                    onChange={(e) => setFormData({ ...formData, feature_area_c: e.target.value })}
                    placeholder="e.g., HACCP, Food Safety, Temperature Control"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Relevant Moroccan Laws
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    value={formData.relevant_moroccan_laws_c}
                    onChange={(e) => setFormData({ ...formData, relevant_moroccan_laws_c: e.target.value })}
                    placeholder="List relevant Moroccan regulations and laws..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Compliance Objectives
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    value={formData.compliance_objectives_c}
                    onChange={(e) => setFormData({ ...formData, compliance_objectives_c: e.target.value })}
                    placeholder="Define compliance objectives and goals..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Obligatory Records
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    value={formData.obligatory_records_c}
                    onChange={(e) => setFormData({ ...formData, obligatory_records_c: e.target.value })}
                    placeholder="Specify required documentation and records..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Record Retention Requirements
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="2"
                    value={formData.record_retention_requirements_c}
                    onChange={(e) => setFormData({ ...formData, record_retention_requirements_c: e.target.value })}
                    placeholder="Record retention periods and requirements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Inspection Needs
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    value={formData.inspection_needs_c}
                    onChange={(e) => setFormData({ ...formData, inspection_needs_c: e.target.value })}
                    placeholder="Inspection requirements and frequency..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Reporting Obligations
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    value={formData.reporting_obligations_c}
                    onChange={(e) => setFormData({ ...formData, reporting_obligations_c: e.target.value })}
                    placeholder="Reporting requirements and deadlines..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingFeatureArea(null);
                    setFormData({
                      Name: "",
                      feature_area_c: "",
                      relevant_moroccan_laws_c: "",
                      compliance_objectives_c: "",
                      obligatory_records_c: "",
                      record_retention_requirements_c: "",
                      inspection_needs_c: "",
                      reporting_obligations_c: ""
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingFeatureArea ? "Update" : "Create"} Feature Area
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureAreas;