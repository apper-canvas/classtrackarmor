import React, { useState, useEffect } from 'react';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import * as regulatoryAlignmentService from '@/services/api/regulatoryAlignmentService';

const RegulatoryAlignment = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Feature area translations
  const featureAreaTranslations = {
    audits: {
      en: "Audits",
      fr: "Audits",
      ar: "عمليات المراجعة"
    },
    checklists: {
      en: "Checklists",
      fr: "Listes de contrôle",
      ar: "قوائم التحقق"
    },
    temperature_records: {
      en: "Temperature Records",
      fr: "Enregistrements de température",
      ar: "سجلات درجة الحرارة"
    },
    food_complaints: {
      en: "Food Complaints",
      fr: "Plaintes alimentaires",
      ar: "شكاوى الطعام"
    },
    enforcement_visits: {
      en: "Enforcement Visits",
      fr: "Visites d'application",
      ar: "زيارات الإنفاذ"
    },
    accidents_incidents: {
      en: "Accidents & Incidents",
      fr: "Accidents et incidents",
      ar: "الحوادث والوقائع"
    },
    haccp: {
      en: "HACCP",
      fr: "HACCP",
      ar: "تحليل المخاطر"
    },
    property_inspections: {
      en: "Property Inspections",
      fr: "Inspections de propriété",
      ar: "فحوصات الممتلكات"
    },
    risk_assessments: {
      en: "Risk Assessments",
      fr: "Évaluations de risques",
      ar: "تقييمات المخاطر"
    },
    chemical_safety: {
      en: "Chemical Safety",
      fr: "Sécurité chimique",
      ar: "السلامة الكيميائية"
    },
    safety_policies: {
      en: "Safety Policies",
      fr: "Politiques de sécurité",
      ar: "سياسات السلامة"
    },
    task_manager: {
      en: "Task Manager",
      fr: "Gestionnaire de tâches",
      ar: "مدير المهام"
    },
    document_centre: {
      en: "Document Centre",
      fr: "Centre de documents",
      ar: "مركز الوثائق"
    },
    supplier_contractor: {
      en: "Supplier & Contractor",
      fr: "Fournisseur et contractant",
      ar: "المورد والمقاول"
    },
    training_dashboard: {
      en: "Training Dashboard",
      fr: "Tableau de bord de formation",
      ar: "لوحة التدريب"
    },
    supply_chain_complaints: {
      en: "Supply Chain Complaints",
      fr: "Plaintes de chaîne d'approvisionnement",
      ar: "شكاوى سلسلة التوريد"
    },
    resources_centre: {
      en: "Resources Centre",
      fr: "Centre de ressources",
      ar: "مركز الموارد"
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await regulatoryAlignmentService.getAll();
        setData(result);
      } catch (err) {
        console.error("Error loading regulatory alignment data:", err);
        setError(err.message || 'Failed to load regulatory alignment data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getFeatureAreaName = (key) => {
    return featureAreaTranslations[key]?.[language] || key;
  };

  const filteredData = data.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const featureName = getFeatureAreaName(item.feature_area_c).toLowerCase();
    const laws = (item.relevant_moroccan_laws_c || '').toLowerCase();
    const objectives = (item.compliance_objectives_c || '').toLowerCase();
    
    return featureName.includes(searchLower) || 
           laws.includes(searchLower) || 
           objectives.includes(searchLower);
  });

  const formatMultilineText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, index) => (
      <div key={index} className="mb-1">
        {line.startsWith('•') ? (
          <div className="flex items-start gap-2">
            <span className="text-slate-400 mt-1">•</span>
            <span>{line.substring(1).trim()}</span>
          </div>
        ) : (
          <span>{line}</span>
        )}
      </div>
    ));
  };

  const columnHeaders = {
    featureArea: {
      en: "Feature Area",
      fr: "Domaine fonctionnel",
      ar: "المجال الوظيفي"
    },
    laws: {
      en: "Relevant Moroccan Laws",
      fr: "Lois marocaines pertinentes",
      ar: "القوانين المغربية ذات الصلة"
    },
    objectives: {
      en: "Compliance Objectives",
      fr: "Objectifs de conformité",
      ar: "أهداف الامتثال"
    },
    records: {
      en: "Obligatory Records",
      fr: "Dossiers obligatoires",
      ar: "السجلات الإلزامية"
    },
    retention: {
      en: "Record Retention Requirements",
      fr: "Exigences de conservation des dossiers",
      ar: "متطلبات الاحتفاظ بالسجلات"
    },
    inspections: {
      en: "Inspection Needs",
      fr: "Besoins d'inspection",
      ar: "احتياجات التفتيش"
    },
    reporting: {
      en: "Reporting Obligations",
      fr: "Obligations de rapport",
      ar: "التزامات التقرير"
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} />;
  if (!data.length) return <Empty message="No regulatory alignment data available" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
Moroccan Regulatory Alignment
        </h1>
        <p className="text-slate-600">
          Comprehensive mapping of feature areas to Moroccan regulatory requirements including laws, compliance objectives, record retention, and reporting obligations.
        </p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <ApperIcon name="Search" size={20} className="absolute left-3 top-3 text-slate-400" />
          <Input
            type="text"
            placeholder={t('common.search', {
              en: "Search regulatory requirements...",
              fr: "Rechercher les exigences réglementaires...",
              ar: "البحث في المتطلبات التنظيمية..."
            })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Results */}
      {filteredData.length === 0 ? (
        <Empty message={t('common.noResults', {
          en: "No results found for your search",
          fr: "Aucun résultat trouvé pour votre recherche",
          ar: "لم يتم العثور على نتائج لبحثك"
        })} />
      ) : (
        <div className="space-y-6">
          {filteredData.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  {getFeatureAreaName(item.feature_area_c)}
                </h2>
              </div>

              <div className="p-6">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Relevant Laws */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <ApperIcon name="Scale" size={18} className="text-blue-600" />
                        {columnHeaders.laws[language]}
                      </h3>
                      <div className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4">
                        {formatMultilineText(item.relevant_moroccan_laws_c)}
                      </div>
                    </div>

                    {/* Compliance Objectives */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <ApperIcon name="Target" size={18} className="text-green-600" />
                        {columnHeaders.objectives[language]}
                      </h3>
                      <div className="text-sm text-slate-700 bg-green-50 rounded-lg p-4">
                        {formatMultilineText(item.compliance_objectives_c)}
                      </div>
                    </div>

                    {/* Obligatory Records */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <ApperIcon name="FileText" size={18} className="text-orange-600" />
                        {columnHeaders.records[language]}
                      </h3>
                      <div className="text-sm text-slate-700 bg-orange-50 rounded-lg p-4">
                        {formatMultilineText(item.obligatory_records_c)}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Record Retention */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <ApperIcon name="Archive" size={18} className="text-purple-600" />
                        {columnHeaders.retention[language]}
                      </h3>
                      <div className="text-sm text-slate-700 bg-purple-50 rounded-lg p-4">
                        {formatMultilineText(item.record_retention_requirements_c)}
                      </div>
                    </div>

                    {/* Inspection Needs */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <ApperIcon name="Eye" size={18} className="text-red-600" />
                        {columnHeaders.inspections[language]}
                      </h3>
                      <div className="text-sm text-slate-700 bg-red-50 rounded-lg p-4">
                        {formatMultilineText(item.inspection_needs_c)}
                      </div>
                    </div>

                    {/* Reporting Obligations */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <ApperIcon name="BarChart3" size={18} className="text-teal-600" />
                        {columnHeaders.reporting[language]}
                      </h3>
                      <div className="text-sm text-slate-700 bg-teal-50 rounded-lg p-4">
                        {formatMultilineText(item.reporting_obligations_c)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{filteredData.length}</div>
            <div className="text-sm text-slate-600">
              {t('regulatoryAlignment.stats.featureAreas', {
                en: "Feature Areas",
                fr: "Domaines fonctionnels",
                ar: "المجالات الوظيفية"
              })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">7</div>
            <div className="text-sm text-slate-600">
              {t('regulatoryAlignment.stats.regulatoryBodies', {
                en: "Regulatory Bodies",
                fr: "Organismes de réglementation",
                ar: "الهيئات التنظيمية"
              })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">100%</div>
            <div className="text-sm text-slate-600">
              {t('regulatoryAlignment.stats.coverage', {
                en: "Compliance Coverage",
                fr: "Couverture de conformité",
                ar: "تغطية الامتثال"
              })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">3</div>
            <div className="text-sm text-slate-600">
              {t('regulatoryAlignment.stats.languages', {
                en: "Languages Supported",
                fr: "Langues prises en charge",
                ar: "اللغات المدعومة"
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegulatoryAlignment;