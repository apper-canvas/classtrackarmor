import React from 'react';
import Layout from '@/components/organisms/Layout';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const ChemicalSafety = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Chemical Safety' }
  ];

  return (
    <Layout>
      <div className="p-6">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Chemical Safety Management</h1>
          <p className="text-slate-600">Manage chemical inventory, safety protocols, and compliance tracking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Chemical Inventory</h3>
              <ApperIcon name="Beaker" className="h-6 w-6 text-sky-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-2">124</p>
            <p className="text-sm text-slate-600">Active chemicals</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Safety Protocols</h3>
              <ApperIcon name="Shield" className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-2">18</p>
            <p className="text-sm text-slate-600">Active protocols</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Risk Assessments</h3>
              <ApperIcon name="AlertTriangle" className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-2">7</p>
            <p className="text-sm text-slate-600">Pending reviews</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Recent Chemical Activities</h2>
              <Button variant="outline" size="sm">
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add Chemical
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Sodium Hypochlorite</p>
                  <p className="text-sm text-slate-600">Added to inventory</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Hydrogen Peroxide</p>
                  <p className="text-sm text-slate-600">Safety protocol updated</p>
                </div>
                <Badge variant="warning">Review</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Quaternary Ammonium</p>
                  <p className="text-sm text-slate-600">Risk assessment completed</p>
                </div>
                <Badge variant="success">Compliant</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Compliance Status</h2>
              <Button variant="outline" size="sm">
                <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center">
                  <ApperIcon name="CheckCircle" className="h-5 w-5 text-emerald-600 mr-3" />
                  <div>
                    <p className="font-medium text-slate-900">SDS Documentation</p>
                    <p className="text-sm text-slate-600">All chemicals documented</p>
                  </div>
                </div>
                <Badge variant="success">100%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center">
                  <ApperIcon name="AlertCircle" className="h-5 w-5 text-amber-600 mr-3" />
                  <div>
                    <p className="font-medium text-slate-900">Training Records</p>
                    <p className="text-sm text-slate-600">Some staff need updates</p>
                  </div>
                </div>
                <Badge variant="warning">85%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center">
                  <ApperIcon name="Shield" className="h-5 w-5 text-sky-600 mr-3" />
                  <div>
                    <p className="font-medium text-slate-900">PPE Requirements</p>
                    <p className="text-sm text-slate-600">All protocols current</p>
                  </div>
                </div>
                <Badge variant="success">100%</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ChemicalSafety;