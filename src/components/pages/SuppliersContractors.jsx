import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';

const SuppliersContractors = () => {
  const { t, dir } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('Suppliers & Contractors', 'الموردون والمقاولون')}
          </h1>
          <p className="text-slate-600 mt-1">
            {t('Manage suppliers and contractors information', 'إدارة معلومات الموردين والمقاولين')}
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {t('Add Supplier/Contractor', 'إضافة مورد/مقاول')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">{t('Total Suppliers', 'إجمالي الموردين')}</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ApperIcon name="Truck" size={20} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">{t('Active Contracts', 'العقود النشطة')}</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ApperIcon name="FileContract" size={20} className="text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">{t('Pending Approvals', 'الموافقات المعلقة')}</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <ApperIcon name="Clock" size={20} className="text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="p-6">
        <div className="text-center py-12">
          <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Building2" size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {t('No Suppliers or Contractors', 'لا يوجد موردون أو مقاولون')}
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            {t(
              'Start by adding your suppliers and contractors to manage their information and track compliance.',
              'ابدأ بإضافة الموردين والمقاولين لإدارة معلوماتهم وتتبع الامتثال.'
            )}
          </p>
          <Button className="flex items-center gap-2 mx-auto">
            <ApperIcon name="Plus" size={16} />
            {t('Add First Supplier/Contractor', 'إضافة أول مورد/مقاول')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SuppliersContractors;