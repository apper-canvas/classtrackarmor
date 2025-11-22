import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import { toast } from 'react-toastify';

const DocumentCentre = () => {
  const { language, isRTL } = useLanguage();
  const { t } = useTranslation();
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Sample document data - replace with actual service call
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const sampleDocuments = [
          {
            id: 1,
            name: 'Safety Policy Manual',
            nameAr: 'دليل سياسة السلامة',
            type: 'PDF',
            size: '2.4 MB',
            category: 'policy',
            dateModified: '2024-01-15',
            author: 'Safety Team',
            status: 'active'
          },
          {
            id: 2,
            name: 'HACCP Procedures',
            nameAr: 'إجراءات الهاسب',
            type: 'PDF',
            size: '1.8 MB',
            category: 'procedure',
            dateModified: '2024-01-10',
            author: 'Quality Dept',
            status: 'active'
          },
          {
            id: 3,
            name: 'Training Materials',
            nameAr: 'مواد التدريب',
            type: 'ZIP',
            size: '15.2 MB',
            category: 'training',
            dateModified: '2024-01-08',
            author: 'HR Department',
            status: 'active'
          },
          {
            id: 4,
            name: 'Regulatory Updates',
            nameAr: 'التحديثات التنظيمية',
            type: 'PDF',
            size: '892 KB',
            category: 'regulation',
            dateModified: '2024-01-05',
            author: 'Compliance Team',
            status: 'active'
          }
        ];
        
        setDocuments(sampleDocuments);
        setLoading(false);
      } catch (error) {
        console.error('Error loading documents:', error);
        toast.error('Failed to load documents');
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const categories = [
    { id: 'all', name: 'All Documents', nameAr: 'جميع المستندات' },
    { id: 'policy', name: 'Policies', nameAr: 'السياسات' },
    { id: 'procedure', name: 'Procedures', nameAr: 'الإجراءات' },
    { id: 'training', name: 'Training', nameAr: 'التدريب' },
    { id: 'regulation', name: 'Regulations', nameAr: 'الأنظمة' },
    { id: 'template', name: 'Templates', nameAr: 'القوالب' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.nameAr.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    toast.info('Document upload functionality will be implemented');
  };

  const handleDownload = (document) => {
    toast.success(`Downloading ${document.name}`);
  };

  const handleView = (document) => {
    toast.info(`Opening ${document.name}`);
  };

  const handleDelete = (document) => {
    if (window.confirm(`Are you sure you want to delete ${document.name}?`)) {
      setDocuments(prev => prev.filter(doc => doc.id !== document.id));
      toast.success('Document deleted successfully');
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'FileText';
      case 'doc':
      case 'docx': return 'FileEdit';
      case 'xls':
      case 'xlsx': return 'Sheet';
      case 'zip':
      case 'rar': return 'Archive';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'Image';
      default: return 'File';
    }
  };

  const breadcrumbItems = [
    { label: language === 'ar' ? 'الرئيسية' : 'Home', href: '/dashboard' },
    { label: language === 'ar' ? 'مركز المستندات' : 'Document Centre' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={cn("p-6", isRTL && "text-right")}>
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'ar' ? 'مركز المستندات' : 'Document Centre'}
            </h1>
            <p className="text-slate-600 mt-1">
              {language === 'ar' 
                ? 'إدارة وتنظيم مستندات السلامة والجودة'
                : 'Manage and organize safety and quality documents'
              }
            </p>
          </div>
          <Button onClick={handleUpload} className="flex items-center gap-2">
            <ApperIcon name="Upload" size={16} />
            {language === 'ar' ? 'رفع مستند' : 'Upload Document'}
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <ApperIcon 
                  name="Search" 
                  size={16} 
                  className={cn(
                    "absolute top-3 text-slate-400",
                    isRTL ? "right-3" : "left-3"
                  )} 
                />
                <Input
                  placeholder={language === 'ar' ? 'البحث في المستندات...' : 'Search documents...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(isRTL ? "pr-10" : "pl-10")}
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {language === 'ar' ? category.nameAr : category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'grid' ? "bg-primary-100 text-primary-600" : "hover:bg-slate-100"
                )}
              >
                <ApperIcon name="Grid3X3" size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'list' ? "bg-primary-100 text-primary-600" : "hover:bg-slate-100"
                )}
              >
                <ApperIcon name="List" size={16} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Documents Display */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <ApperIcon name="FileX" size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {language === 'ar' ? 'لا توجد مستندات' : 'No documents found'}
            </h3>
            <p className="text-slate-600">
              {language === 'ar' 
                ? 'لم يتم العثور على مستندات تطابق البحث الحالي'
                : 'No documents match your current search criteria'
              }
            </p>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map(document => (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ApperIcon name={getFileIcon(document.type)} size={20} className="text-primary-600" />
                    <Badge variant="secondary" className="text-xs">
                      {document.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(document)}
                      className="p-1 hover:bg-slate-100 rounded"
                      title={language === 'ar' ? 'عرض' : 'View'}
                    >
                      <ApperIcon name="Eye" size={14} />
                    </button>
                    <button
                      onClick={() => handleDownload(document)}
                      className="p-1 hover:bg-slate-100 rounded"
                      title={language === 'ar' ? 'تحميل' : 'Download'}
                    >
                      <ApperIcon name="Download" size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(document)}
                      className="p-1 hover:bg-red-50 text-red-600 rounded"
                      title={language === 'ar' ? 'حذف' : 'Delete'}
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">
                  {language === 'ar' ? document.nameAr : document.name}
                </h3>
                
                <div className="space-y-1 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'الحجم:' : 'Size:'}</span>
                    <span>{document.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'المؤلف:' : 'Author:'}</span>
                    <span>{document.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'التعديل:' : 'Modified:'}</span>
                    <span>{new Date(document.dateModified).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className={cn("py-3 px-4 font-medium text-slate-900", isRTL ? "text-right" : "text-left")}>
                    {language === 'ar' ? 'المستند' : 'Document'}
                  </th>
                  <th className={cn("py-3 px-4 font-medium text-slate-900", isRTL ? "text-right" : "text-left")}>
                    {language === 'ar' ? 'النوع' : 'Type'}
                  </th>
                  <th className={cn("py-3 px-4 font-medium text-slate-900", isRTL ? "text-right" : "text-left")}>
                    {language === 'ar' ? 'الحجم' : 'Size'}
                  </th>
                  <th className={cn("py-3 px-4 font-medium text-slate-900", isRTL ? "text-right" : "text-left")}>
                    {language === 'ar' ? 'المؤلف' : 'Author'}
                  </th>
                  <th className={cn("py-3 px-4 font-medium text-slate-900", isRTL ? "text-right" : "text-left")}>
                    {language === 'ar' ? 'تاريخ التعديل' : 'Modified'}
                  </th>
                  <th className={cn("py-3 px-4 font-medium text-slate-900", isRTL ? "text-right" : "text-left")}>
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map(document => (
                  <tr key={document.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <ApperIcon name={getFileIcon(document.type)} size={20} className="text-primary-600" />
                        <span className="font-medium text-slate-900">
                          {language === 'ar' ? document.nameAr : document.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{document.type}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{document.size}</td>
                    <td className="py-3 px-4 text-slate-600">{document.author}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(document.dateModified).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(document)}
                          className="p-1 hover:bg-slate-100 rounded"
                          title={language === 'ar' ? 'عرض' : 'View'}
                        >
                          <ApperIcon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(document)}
                          className="p-1 hover:bg-slate-100 rounded"
                          title={language === 'ar' ? 'تحميل' : 'Download'}
                        >
                          <ApperIcon name="Download" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(document)}
                          className="p-1 hover:bg-red-50 text-red-600 rounded"
                          title={language === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DocumentCentre;