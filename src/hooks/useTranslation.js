import { useLanguage } from "@/hooks/useLanguage";

// Translation keys for the application
const translations = {
  // Navigation
  "nav.dashboard": {
    en: "Dashboard",
    fr: "Tableau de bord",
    ar: "لوحة التحكم"
},
  "nav.features": {
    en: "Features",
    fr: "Fonctionnalités",
    ar: "الميزات"
  },
  "nav.companies": {
    en: "Companies",
    fr: "Entreprises", 
    ar: "الشركات"
  },
  "nav.sites": {
    en: "Sites",
    fr: "Sites",
    ar: "المواقع"
  },
  "nav.users": {
    en: "Users",
    fr: "Utilisateurs",
    ar: "المستخدمون"
  },
  "nav.settings": {
    en: "Settings",
    fr: "Paramètres",
    ar: "الإعدادات"
  },

  // Role names
  "roles.ceo.name": {
    en: "CEO",
    fr: "PDG",
    ar: "الرئيس التنفيذي"
  },
  "roles.manager.name": {
    en: "Manager",
    fr: "Gestionnaire",
    ar: "المدير"
  },
  "roles.user.name": {
    en: "User",
    fr: "Utilisateur",
    ar: "المستخدم"
  },

  // Actions
  "actions.create": {
    en: "Create",
    fr: "Créer",
    ar: "إنشاء"
  },
  "actions.edit": {
    en: "Edit",
    fr: "Modifier",
    ar: "تحرير"
  },
  "actions.delete": {
    en: "Delete",
    fr: "Supprimer",
    ar: "حذف"
  },
  "actions.invite": {
    en: "Invite User",
    fr: "Inviter un utilisateur",
    ar: "دعوة مستخدم"
  },
  "actions.save": {
    en: "Save",
    fr: "Enregistrer",
    ar: "حفظ"
  },
  "actions.cancel": {
    en: "Cancel",
    fr: "Annuler",
    ar: "إلغاء"
  },

  // Status
  "status.active": {
    en: "Active",
    fr: "Actif",
    ar: "نشط"
  },
  "status.inactive": {
    en: "Inactive",
    fr: "Inactif",
    ar: "غير نشط"
  },
  "status.invited": {
    en: "Invited",
    fr: "Invité",
    ar: "مدعو"
  },
  "status.suspended": {
    en: "Suspended",
    fr: "Suspendu",
    ar: "معلق"
  },

  // Common
  "common.name": {
    en: "Name",
    fr: "Nom",
    ar: "الاسم"
  },
  "common.email": {
    en: "Email",
    fr: "E-mail",
    ar: "البريد الإلكتروني"
  },
  "common.role": {
    en: "Role",
    fr: "Rôle",
    ar: "الدور"
  },
  "common.site": {
    en: "Site",
    fr: "Site",
    ar: "الموقع"
  },
  "common.company": {
    en: "Company",
    fr: "Entreprise",
    ar: "الشركة"
  },
  "common.location": {
    en: "Location",
    fr: "Emplacement",
    ar: "الموقع الجغرافي"
  },
  "common.manager": {
    en: "Manager",
    fr: "Gestionnaire",
    ar: "المدير"
  },
  "common.users": {
    en: "users",
    fr: "utilisateurs",
    ar: "مستخدمين"
  },
  "common.sites": {
    en: "sites",
    fr: "sites",
    ar: "مواقع"
  },

  // Dashboard
  "dashboard.overview": {
    en: "System Overview",
    fr: "Aperçu du système",
    ar: "نظرة عامة على النظام"
  },
  "dashboard.total_companies": {
    en: "Total Companies",
    fr: "Total des entreprises",
    ar: "إجمالي الشركات"
  },
  "dashboard.total_sites": {
    en: "Total Sites",
    fr: "Total des sites",
    ar: "إجمالي المواقع"
  },
  "dashboard.total_users": {
    en: "Total Users",
    fr: "Total des utilisateurs",
    ar: "إجمالي المستخدمين"
  },
  "dashboard.pending_invitations": {
    en: "Pending Invitations",
    fr: "Invitations en attente",
    ar: "الدعوات المعلقة"
  },

  // Empty states
  "empty.companies": {
    en: "No companies yet. Create your first company to get started.",
    fr: "Aucune entreprise pour le moment. Créez votre première entreprise pour commencer.",
    ar: "لا توجد شركات حتى الآن. أنشئ شركتك الأولى للبدء."
  },
  "empty.sites": {
    en: "No sites yet. Create your first site to get started.",
    fr: "Aucun site pour le moment. Créez votre premier site pour commencer.",
    ar: "لا توجد مواقع حتى الآن. أنشئ موقعك الأول للبدء."
  },
  "empty.users": {
en: "No users yet. Invite your first user to get started.",
    fr: "Aucun utilisateur pour le moment. Invitez votre premier utilisateur pour commencer.",
    ar: "لا يوجد مستخدمون حتى الآن. ادع مستخدمك الأول للبدء."
  },

  // Features page
  "features.title": {
    en: "Feature Areas Overview",
    fr: "Aperçu des domaines fonctionnels",
    ar: "نظرة عامة على المجالات الوظيفية"
  },
  "features.subtitle": {
    en: "Comprehensive safety and compliance management for Moroccan hospitality industry",
    fr: "Gestion complète de la sécurité et de la conformité pour l'industrie hôtelière marocaine",
    ar: "إدارة شاملة للسلامة والامتثال لصناعة الضيافة المغربية"
  },

  // Feature area names
  "feature.audits.name": {
    en: "Audits",
    fr: "Audits",
    ar: "المراجعات"
  },
  "feature.checklists.name": {
    en: "Checklists",
    fr: "Listes de contrôle",
    ar: "قوائم التحقق"
  },
  "feature.temperature_records.name": {
    en: "Temperature Records",
    fr: "Relevés de température",
    ar: "سجلات درجة الحرارة"
  },
  "feature.food_complaints.name": {
    en: "Food Complaints",
    fr: "Plaintes alimentaires",
    ar: "شكاوى الطعام"
  },
  "feature.enforcement_visits.name": {
    en: "Enforcement Visits",
    fr: "Visites d'application",
    ar: "زيارات الإنفاذ"
  },
  "feature.accidents_incidents.name": {
    en: "Accidents & Incidents",
    fr: "Accidents et incidents",
    ar: "الحوادث والوقائع"
  },
  "feature.haccp.name": {
    en: "HACCP",
    fr: "HACCP",
    ar: "نظام تحليل المخاطر"
  },
  "feature.property_inspections.name": {
    en: "Property Inspections & Certificates",
    fr: "Inspections et certificats de propriété",
    ar: "فحوصات الممتلكات والشهادات"
  },
  "feature.risk_assessments.name": {
    en: "Risk Assessments",
    fr: "Évaluations des risques",
    ar: "تقييمات المخاطر"
  },
  "feature.chemical_safety.name": {
    en: "Chemical Safety (FDS/MSDS)",
    fr: "Sécurité chimique (FDS/FSDS)",
    ar: "السلامة الكيميائية (صحائف البيانات)"
  },
  "feature.safety_policies.name": {
    en: "Safety Policies",
    fr: "Politiques de sécurité",
    ar: "سياسات السلامة"
  },
  "feature.task_manager.name": {
    en: "Task Manager",
    fr: "Gestionnaire de tâches",
    ar: "مدير المهام"
  },
  "feature.document_centre.name": {
    en: "Document Centre",
    fr: "Centre de documents",
    ar: "مركز الوثائق"
  },
  "feature.supplier_contractor.name": {
    en: "Supplier & Contractor Records",
    fr: "Dossiers fournisseurs et contractants",
    ar: "سجلات الموردين والمقاولين"
  },
  "feature.training_dashboard.name": {
    en: "Training Dashboard",
    fr: "Tableau de bord de formation",
    ar: "لوحة تحكم التدريب"
  },
  "feature.supply_chain_complaints.name": {
    en: "Supply Chain Complaints",
    fr: "Plaintes de chaîne d'approvisionnement",
    ar: "شكاوى سلسلة التوريد"
  },
  "feature.resources_centre.name": {
    en: "Resources Centre",
    fr: "Centre de ressources",
    ar: "مركز الموارد"
  },

  // Common feature labels
  "feature.purpose": {
    en: "Purpose",
    fr: "Objectif",
    ar: "الغرض"
  },
  "feature.data_objects": {
    en: "Main Data Objects",
    fr: "Objets de données principaux",
    ar: "كائنات البيانات الرئيسية"
  },
  "feature.site_user_relationship": {
    en: "Site & User Relationship",
    fr: "Relation site et utilisateur",
    ar: "علاقة الموقع والمستخدم"
  },
  "feature.multilingual_needs": {
    en: "Key Multilingual Needs",
    fr: "Besoins multilingues clés",
    ar: "الاحتياجات متعددة اللغات"
  }
};

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const t = (key, fallback = key) => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return fallback;
    }

    return translation[currentLanguage] || translation.en || translation.fr || translation.ar || fallback;
  };

  return { t };
};