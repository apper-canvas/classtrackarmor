import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { useSelector } from 'react-redux';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import { Button } from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const ResourcesCentre = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { user } = useSelector((state) => state.user);
  
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for resources - in production this would come from a service
  const mockResources = [
    {
      id: 1,
      title: 'HACCP Implementation Guide',
      titleAr: 'دليل تنفيذ نظام الهاسب',
      description: 'Comprehensive guide for implementing HACCP principles in food safety management',
      descriptionAr: 'دليل شامل لتنفيذ مبادئ الهاسب في إدارة سلامة الغذاء',
      category: 'food-safety',
      type: 'guide',
      fileType: 'pdf',
      size: '2.4 MB',
      downloadCount: 156,
      lastUpdated: '2024-01-15',
      tags: ['HACCP', 'Food Safety', 'Implementation']
    },
    {
      id: 2,
      title: 'ONSSA Compliance Checklist',
      titleAr: 'قائمة مراجعة الامتثال لـ ONSSA',
      description: 'Official checklist for ONSSA regulatory compliance requirements',
      descriptionAr: 'قائمة مراجعة رسمية لمتطلبات الامتثال التنظيمي لـ ONSSA',
      category: 'regulatory',
      type: 'checklist',
      fileType: 'pdf',
      size: '1.8 MB',
      downloadCount: 89,
      lastUpdated: '2024-01-10',
      tags: ['ONSSA', 'Compliance', 'Regulatory']
    },
    {
      id: 3,
      title: 'Chemical Safety Data Sheets',
      titleAr: 'صحائف بيانات السلامة الكيميائية',
      description: 'Collection of safety data sheets for common chemicals used in food processing',
      descriptionAr: 'مجموعة من صحائف بيانات السلامة للمواد الكيميائية الشائعة المستخدمة في معالجة الأغذية',
      category: 'chemical-safety',
      type: 'reference',
      fileType: 'zip',
      size: '15.2 MB',
      downloadCount: 203,
      lastUpdated: '2024-01-20',
      tags: ['Chemical Safety', 'SDS', 'Reference']
    },
    {
      id: 4,
      title: 'Audit Templates & Forms',
      titleAr: 'قوالب ونماذج التدقيق',
      description: 'Ready-to-use templates for conducting safety audits and inspections',
      descriptionAr: 'قوالب جاهزة للاستخدام لإجراء عمليات التدقيق والتفتيش الأمني',
      category: 'audit',
      type: 'template',
      fileType: 'docx',
      size: '3.1 MB',
      downloadCount: 124,
      lastUpdated: '2024-01-12',
      tags: ['Audit', 'Templates', 'Forms']
    },
    {
      id: 5,
      title: 'Training Materials - Food Handlers',
      titleAr: 'مواد التدريب - معالجو الطعام',
      description: 'Complete training package for food handlers certification',
      descriptionAr: 'حزمة تدريبية كاملة لشهادة معالجي الطعام',
      category: 'training',
      type: 'training',
      fileType: 'pptx',
      size: '8.7 MB',
      downloadCount: 178,
      lastUpdated: '2024-01-18',
      tags: ['Training', 'Food Handlers', 'Certification']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Resources', labelAr: 'جميع الموارد' },
    { value: 'food-safety', label: 'Food Safety', labelAr: 'سلامة الغذاء' },
    { value: 'regulatory', label: 'Regulatory', labelAr: 'تنظيمي' },
    { value: 'chemical-safety', label: 'Chemical Safety', labelAr: 'السلامة الكيميائية' },
    { value: 'audit', label: 'Audits', labelAr: 'التدقيق' },
    { value: 'training', label: 'Training', labelAr: 'التدريب' }
  ];

  const resourceTypes = {
    guide: { icon: 'Book', color: 'bg-blue-100 text-blue-700' },
    checklist: { icon: 'CheckSquare', color: 'bg-green-100 text-green-700' },
    reference: { icon: 'Library', color: 'bg-purple-100 text-purple-700' },
    template: { icon: 'FileText', color: 'bg-orange-100 text-orange-700' },
    training: { icon: 'GraduationCap', color: 'bg-indigo-100 text-indigo-700' }
  };

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedCategory]);

  const loadResources = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setResources(mockResources);
      setError(null);
    } catch (err) {
      setError('Failed to load resources');
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        (language === 'ar' && (
          resource.titleAr?.toLowerCase().includes(searchLower) ||
          resource.descriptionAr?.toLowerCase().includes(searchLower)
        ))
      );
    }

    setFilteredResources(filtered);
  };

  const handleDownload = (resource) => {
    // In production, this would trigger actual download
    toast.success(`Downloading ${resource.title}...`);
    // Update download count
    setResources(prev => prev.map(r => 
      r.id === resource.id 
        ? { ...r, downloadCount: r.downloadCount + 1 }
        : r
    ));
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return 'FileText';
      case 'docx': return 'FileText';
      case 'pptx': return 'Presentation';
      case 'zip': return 'Archive';
      default: return 'File';
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Resources"
        message={error}
        onRetry={loadResources}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {language === 'ar' ? 'مركز الموارد' : 'Resources Centre'}
          </h1>
          <p className="text-slate-600 mt-1">
            {language === 'ar' 
              ? 'الوصول إلى أدلة السلامة والنماذج والمواد التدريبية'
              : 'Access safety guides, templates, and training materials'
            }
          </p>
        </div>
        <div className="text-sm text-slate-500">
          {filteredResources.length} {language === 'ar' ? 'موارد' : 'resources'}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder={language === 'ar' ? 'البحث في الموارد...' : 'Search resources...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {language === 'ar' ? category.labelAr : category.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <Empty
          title={language === 'ar' ? 'لم يتم العثور على موارد' : 'No resources found'}
          message={language === 'ar' 
            ? 'جرب تعديل مرشحات البحث الخاصة بك'
            : 'Try adjusting your search filters'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => {
            const typeConfig = resourceTypes[resource.type] || resourceTypes.guide;
            return (
              <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${typeConfig.color} flex items-center justify-center`}>
                    <ApperIcon name={typeConfig.icon} size={24} />
                  </div>
                  <Badge variant="outline" size="sm">
                    {resource.fileType.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                  {language === 'ar' ? resource.titleAr : resource.title}
                </h3>

                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {language === 'ar' ? resource.descriptionAr : resource.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                  {resource.tags.length > 2 && (
                    <Badge variant="secondary" size="sm">
                      +{resource.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <ApperIcon name={getFileIcon(resource.fileType)} size={16} />
                    {resource.size}
                  </span>
                  <span className="flex items-center gap-1">
                    <ApperIcon name="Download" size={16} />
                    {resource.downloadCount}
                  </span>
                </div>

                <Button
                  onClick={() => handleDownload(resource)}
                  className="w-full"
                  size="sm"
                >
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  {language === 'ar' ? 'تحميل' : 'Download'}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResourcesCentre;