import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { isRTL, currentLanguage } = useLanguage();
  const { t } = useTranslation();
const navigationItems = [
    {
      icon: "Home",
      path: "/",
      label: {
        en: "Dashboard",
        fr: "Tableau de bord", 
        ar: "لوحة التحكم"
      }
    }
  ];

// Navigation sections with role-based grouping
const navigationSections = [
  {
    id: "analytics",
    title: {
      en: "Analytics & Reporting",
      fr: "Analytique et rapports",
      ar: "التحليلات والتقارير"
    },
    items: [
      {
        icon: "BarChart3",
        path: "/analytics",
        label: {
          en: "Analytics Overview",
          fr: "Aperçu analytique",
          ar: "نظرة عامة على التحليلات"
        }
      },
      {
        icon: "Shield",
        path: "/analytics/haccp",
        label: {
          en: "HACCP Analytics",
          fr: "Analytique HACCP",
          ar: "تحليلات تحليل المخاطر"
        }
      },
      {
        icon: "CheckCircle",
        path: "/analytics/onssa",
        label: {
          en: "ONSSA Compliance",
          fr: "Conformité ONSSA",
          ar: "امتثال أونسا"
        }
      },
      {
        icon: "TrendingUp",
        path: "/analytics/comparison",
        label: {
          en: "Multi-Site Comparison",
          fr: "Comparaison multi-sites",
          ar: "مقارنة متعددة المواقع"
        }
      }
    ]
  },
  {
    id: "core-operations",
    title: {
      en: "Core Operations",
      fr: "Opérations principales",
      ar: "العمليات الأساسية"
    },
    items: [
      {
        icon: "ClipboardCheck",
        path: "/audits",
        label: {
          en: "Audits",
          fr: "Audits",
          ar: "التدقيق"
        }
      },
      {
        icon: "CheckSquare",
        path: "/checklists",
        label: {
          en: "Checklists",
          fr: "Listes de contrôle",
          ar: "قوائم التحقق"
        }
      },
      {
        icon: "Thermometer",
        path: "/temperature-records",
        label: {
          en: "Temperature Records",
          fr: "Relevés de température",
          ar: "سجلات درجة الحرارة"
        }
      },
      {
        icon: "Shield",
        path: "/haccp",
        label: {
          en: "HACCP Management",
          fr: "Gestion HACCP",
          ar: "إدارة تحليل المخاطر"
        }
      }
    ]
  },
  {
    id: "risk-safety",
    title: {
      en: "Risk & Safety Management",
      fr: "Gestion des risques et sécurité",
      ar: "إدارة المخاطر والسلامة"
    },
    items: [
      {
        icon: "AlertOctagon",
        path: "/accidents-incidents",
        label: {
          en: "Accidents & Incidents",
          fr: "Accidents et incidents",
          ar: "الحوادث والوقائع"
        }
      },
      {
        icon: "AlertCircle",
        path: "/risk-assessments",
        label: {
          en: "Risk Assessments",
          fr: "Évaluations de risques",
          ar: "تقييمات المخاطر"
        }
      },
      {
        icon: "Flask",
        path: "/chemical-safety",
        label: {
          en: "Chemical Safety",
          fr: "Sécurité chimique",
          ar: "السلامة الكيميائية"
        }
      },
      {
        icon: "Building",
        path: "/property-inspections",
        label: {
          en: "Property Inspections",
          fr: "Inspections de propriété",
          ar: "فحوصات الممتلكات"
        }
      }
    ]
  },
  {
    id: "compliance",
    title: {
      en: "Compliance & Regulatory",
      fr: "Conformité et réglementation",
      ar: "الامتثال والتنظيم"
    },
    items: [
      {
        icon: "Badge",
        path: "/enforcement-visits",
        label: {
          en: "Enforcement Visits",
          fr: "Visites d'application",
          ar: "زيارات الإنفاذ"
        }
      },
      {
        icon: "Scale",
        path: "/regulatory-alignment",
        label: {
          en: "Regulatory Alignment",
          fr: "Alignement réglementaire",
          ar: "التوافق التنظيمي"
        }
      },
      {
        icon: "AlertTriangle",
        path: "/food-complaints",
        label: {
          en: "Food Complaints",
          fr: "Plaintes alimentaires",
          ar: "شكاوى الطعام"
        }
      },
      {
        icon: "Truck",
        path: "/supply-chain-complaints",
        label: {
          en: "Supply Chain Complaints",
          fr: "Plaintes chaîne d'approvisionnement",
          ar: "شكاوى سلسلة التوريد"
        }
      }
    ]
  },
  {
    id: "management",
    title: {
      en: "Management & Administration",
      fr: "Gestion et administration",
      ar: "الإدارة والتشغيل"
    },
    items: [
      {
        icon: "Building2",
        path: "/companies",
        label: {
          en: "Companies",
          fr: "Entreprises",
          ar: "الشركات"
        }
      },
      {
        icon: "MapPin",
        path: "/sites",
        label: {
          en: "Sites",
          fr: "Sites",
          ar: "المواقع"
        }
      },
      {
        icon: "Users",
        path: "/users",
        label: {
          en: "Users",
          fr: "Utilisateurs",
          ar: "المستخدمون"
        }
      },
      {
        icon: "GitBranch",
        path: "/workflows",
        label: {
          en: "Workflows",
          fr: "Flux de travail",
          ar: "تدفقات العمل"
        }
      },
      {
        icon: "CheckCircle",
        path: "/task-manager",
        label: {
          en: "Task Manager",
          fr: "Gestionnaire de tâches",
          ar: "مدير المهام"
        }
      },
      {
        icon: "Truck",
        path: "/suppliers-contractors",
        label: {
          en: "Suppliers & Contractors",
          fr: "Fournisseurs et contractants",
          ar: "الموردون والمقاولون"
        }
      }
    ]
  },
  {
    id: "knowledge",
    title: {
      en: "Knowledge & Training",
      fr: "Connaissances et formation",
      ar: "المعرفة والتدريب"
    },
    items: [
      {
        icon: "GraduationCap",
        path: "/training",
        label: {
          en: "Training Dashboard",
          fr: "Tableau de bord formation",
          ar: "لوحة معلومات التدريب"
        }
      },
      {
        icon: "FolderOpen",
        path: "/documents",
        label: {
          en: "Document Centre",
          fr: "Centre de documents",
          ar: "مركز الوثائق"
        }
      },
      {
        icon: "FileText",
        path: "/safety-policies",
        label: {
          en: "Safety Policies",
          fr: "Politiques de sécurité",
          ar: "سياسات السلامة"
        }
      },
      {
        icon: "BookOpen",
        path: "/resources",
        label: {
          en: "Resources Centre",
          fr: "Centre de ressources",
          ar: "مركز الموارد"
        }
      }
    ]
  },
  {
    id: "system",
    title: {
      en: "System",
      fr: "Système",
      ar: "النظام"
    },
    items: [
      {
        icon: "FileText",
        path: "/features",
        label: {
          en: "Feature Overview",
          fr: "Aperçu des fonctionnalités",
          ar: "نظرة عامة على الميزات"
        }
      },
      {
        icon: "Layers",
        path: "/feature-areas",
        label: {
          en: "Feature Areas",
          fr: "Domaines fonctionnels",
          ar: "المجالات الوظيفية"
        }
      },
      {
        icon: "Settings",
        path: "/settings",
        label: {
          en: "Settings",
          fr: "Paramètres",
          ar: "الإعدادات"
        }
      }
    ]
}
];

  return (
    <div className={cn(
      "h-screen bg-white border-r border-slate-200 flex flex-col",
      "w-64 fixed left-0 top-0 z-30 sidebar-transition",
      isRTL ? "left-auto right-0 border-r-0 border-l" : "",
      "lg:translate-x-0",
      "max-lg:transform max-lg:-translate-x-full",
      "max-lg:shadow-lg"
    )}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">SH</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">SafetyHub</h1>
              <p className="text-xs text-slate-500">Morocco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-100 rounded-md transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Dashboard Link */}
      <div className="px-4 pt-4">
        <NavLink
          to="/"
          className={({ isActive }) => cn(
            "flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            isActive
              ? "bg-primary-50 text-primary-700 border border-primary-100"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          )}
        >
<ApperIcon name="Home" size={18} />
          <span>{typeof navigationItems[0]?.label === 'object' ? (navigationItems[0].label[currentLanguage] || navigationItems[0].label.en || navigationItems[0].label.fr || navigationItems[0].label.ar || 'Dashboard') : (navigationItems[0]?.label || 'Dashboard')}</span>
        </NavLink>
      </div>

      {/* Navigation Sections */}
<nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {/* Dashboard - Always visible */}
        <div>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 rtl:space-x-reverse px-3 py-2 rounded-md text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <ApperIcon name={item.icon} size={16} />
                <span>{typeof item.label === 'object' ? (item.label[currentLanguage] || item.label.en || item.label.fr || item.label.ar || 'Menu Item') : (item.label || 'Menu Item')}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Role-based navigation sections */}
        {navigationSections.map((section) => (
          <div key={section.id}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {typeof section.title === 'object' ? (section.title[currentLanguage] || section.title.en || section.title.fr || section.title.ar || 'Section') : (section.title || 'Section')}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) => cn(
                    "flex items-center space-x-3 rtl:space-x-reverse px-3 py-2 rounded-md text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span>{typeof item.label === 'object' ? (item.label[currentLanguage] || item.label.en || item.label.fr || item.label.ar || 'Menu Item') : (item.label || 'Menu Item')}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

{/* Footer */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="text-xs text-slate-400 text-center">
          © 2024 SafetyHub
        </div>
      </div>
    </div>
  );
};

export default Sidebar;