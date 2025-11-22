import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/hooks/useLanguage";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Features = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const featureAreas = [
    {
      key: "audits",
      icon: "ClipboardCheck",
      color: "from-blue-500 to-blue-600",
      purpose: {
        en: "Systematic evaluation of compliance with safety, hygiene, and operational standards across hospitality establishments",
        fr: "Évaluation systématique de la conformité aux normes de sécurité, d'hygiène et opérationnelles dans les établissements hôteliers",
        ar: "التقييم المنهجي للامتثال لمعايير السلامة والنظافة والتشغيل في المنشآت الفندقية"
      },
      dataObjects: {
        en: "Audit templates, audit records, findings, corrective actions, audit schedules",
        fr: "Modèles d'audit, dossiers d'audit, constatations, actions correctives, calendriers d'audit",
        ar: "قوالب المراجعة، سجلات المراجعة، النتائج، الإجراءات التصحيحية، جداول المراجعة"
      },
      siteRelationship: {
        en: "Each audit is specific to a site. Users are assigned auditor roles per site with appropriate permissions.",
        fr: "Chaque audit est spécifique à un site. Les utilisateurs se voient attribuer des rôles d'auditeur par site avec les autorisations appropriées.",
        ar: "كل مراجعة خاصة بموقع محدد. يتم تخصيص المستخدمين بأدوار المراجعين لكل موقع مع الصلاحيات المناسبة."
      },
      multilingualNeeds: {
        en: "Audit questions, findings descriptions, corrective action plans, compliance terminology",
        fr: "Questions d'audit, descriptions des constatations, plans d'actions correctives, terminologie de conformité",
        ar: "أسئلة المراجعة، أوصاف النتائج، خطط العمل التصحيحية، مصطلحات الامتثال"
      }
    },
    {
      key: "checklists",
      icon: "CheckSquare",
      color: "from-green-500 to-green-600",
      purpose: {
        en: "Daily and routine verification tasks to ensure ongoing compliance with safety and hygiene standards",
        fr: "Tâches de vérification quotidiennes et routinières pour assurer la conformité continue aux normes de sécurité et d'hygiène",
        ar: "مهام التحقق اليومية والروتينية لضمان الامتثال المستمر لمعايير السلامة والنظافة"
      },
      dataObjects: {
        en: "Checklist templates, completed checklists, task items, completion status, responsible staff",
        fr: "Modèles de listes de contrôle, listes complétées, éléments de tâches, statut d'achèvement, personnel responsable",
        ar: "قوالب قوائم التحقق، القوائم المكتملة، عناصر المهام، حالة الإنجاز، الموظفون المسؤولون"
      },
      siteRelationship: {
        en: "Site-specific checklists assigned to staff members. Completion tracked per site location.",
        fr: "Listes de contrôle spécifiques au site attribuées aux membres du personnel. Achèvement suivi par emplacement de site.",
        ar: "قوائم تحقق خاصة بالموقع مُخصصة لأعضاء الفريق. تتبع الإنجاز حسب موقع المنشأة."
      },
      multilingualNeeds: {
        en: "Checklist items, instructions, status messages, completion confirmations",
        fr: "Éléments de liste de contrôle, instructions, messages de statut, confirmations d'achèvement",
        ar: "عناصر قائمة التحقق، التعليمات، رسائل الحالة، تأكيدات الإنجاز"
      }
    },
    {
      key: "temperature_records",
      icon: "Thermometer",
      color: "from-red-500 to-red-600",
      purpose: {
        en: "Monitor and record temperature readings for food storage, refrigeration units, and cooking equipment to ensure food safety",
        fr: "Surveiller et enregistrer les relevés de température pour le stockage des aliments, les unités de réfrigération et les équipements de cuisson pour assurer la sécurité alimentaire",
        ar: "مراقبة وتسجيل قراءات درجة الحرارة لتخزين الطعام ووحدات التبريد ومعدات الطبخ لضمان سلامة الغذاء"
      },
      dataObjects: {
        en: "Temperature logs, equipment readings, alert thresholds, calibration records, monitoring schedules",
        fr: "Journaux de température, lectures d'équipement, seuils d'alerte, dossiers d'étalonnage, calendriers de surveillance",
        ar: "سجلات درجة الحرارة، قراءات المعدات، حدود التنبيه، سجلات المعايرة، جداول المراقبة"
      },
      siteRelationship: {
        en: "Equipment and monitoring points are site-specific. Staff assigned to recording duties per location.",
        fr: "L'équipement et les points de surveillance sont spécifiques au site. Personnel assigné aux tâches d'enregistrement par emplacement.",
        ar: "المعدات ونقاط المراقبة خاصة بالموقع. الموظفون المُكلفون بواجبات التسجيل حسب الموقع."
      },
      multilingualNeeds: {
        en: "Equipment names, temperature ranges, alert messages, recording forms",
        fr: "Noms d'équipements, plages de température, messages d'alerte, formulaires d'enregistrement",
        ar: "أسماء المعدات، نطاقات درجة الحرارة، رسائل التنبيه، نماذج التسجيل"
      }
    },
    {
      key: "food_complaints",
      icon: "AlertTriangle",
      color: "from-orange-500 to-orange-600",
      purpose: {
        en: "Track and manage customer complaints related to food quality, safety, and service to improve operations and prevent issues",
        fr: "Suivre et gérer les plaintes des clients liées à la qualité des aliments, à la sécurité et au service pour améliorer les opérations et prévenir les problèmes",
        ar: "تتبع وإدارة شكاوى العملاء المتعلقة بجودة الطعام والسلامة والخدمة لتحسين العمليات ومنع المشاكل"
      },
      dataObjects: {
        en: "Complaint records, customer details, incident descriptions, investigation notes, resolution actions",
        fr: "Dossiers de plaintes, détails du client, descriptions d'incidents, notes d'enquête, actions de résolution",
        ar: "سجلات الشكاوى، تفاصيل العملاء، أوصاف الحوادث، ملاحظات التحقيق، إجراءات الحل"
      },
      siteRelationship: {
        en: "Complaints linked to specific site locations. Site managers handle local complaint resolution.",
        fr: "Plaintes liées à des emplacements de sites spécifiques. Les gestionnaires de site gèrent la résolution des plaintes locales.",
        ar: "الشكاوى مرتبطة بمواقع محددة. مديرو المواقع يتعاملون مع حل الشكاوى المحلية."
      },
      multilingualNeeds: {
        en: "Complaint categories, resolution status, customer communication, investigation reports",
        fr: "Catégories de plaintes, statut de résolution, communication client, rapports d'enquête",
        ar: "فئات الشكاوى، حالة الحل، التواصل مع العملاء، تقارير التحقيق"
      }
    },
    {
      key: "enforcement_visits",
      icon: "Badge",
      color: "from-purple-500 to-purple-600",
      purpose: {
        en: "Document official inspections and enforcement visits from regulatory authorities and track compliance requirements",
        fr: "Documenter les inspections officielles et les visites d'application des autorités réglementaires et suivre les exigences de conformité",
        ar: "توثيق التفتيشات الرسمية وزيارات الإنفاذ من السلطات التنظيمية وتتبع متطلبات الامتثال"
      },
      dataObjects: {
        en: "Visit records, inspector details, findings, violations, corrective action deadlines, follow-up schedules",
        fr: "Dossiers de visite, détails de l'inspecteur, constatations, violations, délais d'action corrective, calendriers de suivi",
        ar: "سجلات الزيارات، تفاصيل المفتش، النتائج، المخالفات، مواعيد الإجراءات التصحيحية، جداول المتابعة"
      },
      siteRelationship: {
        en: "Enforcement visits are site-specific. Site managers coordinate with inspectors and manage compliance actions.",
        fr: "Les visites d'application sont spécifiques au site. Les gestionnaires de site coordonnent avec les inspecteurs et gèrent les actions de conformité.",
        ar: "زيارات الإنفاذ خاصة بالموقع. مديرو المواقع ينسقون مع المفتشين ويديرون إجراءات الامتثال."
      },
      multilingualNeeds: {
        en: "Regulatory terminology, violation descriptions, compliance actions, legal requirements",
        fr: "Terminologie réglementaire, descriptions de violations, actions de conformité, exigences légales",
        ar: "المصطلحات التنظيمية، أوصاف المخالفات، إجراءات الامتثال، المتطلبات القانونية"
      }
    },
    {
      key: "accidents_incidents",
      icon: "AlertOctagon",
      color: "from-red-600 to-red-700",
      purpose: {
        en: "Record and investigate workplace accidents, incidents, and near-misses to improve safety and prevent future occurrences",
        fr: "Enregistrer et enquêter sur les accidents de travail, les incidents et les quasi-accidents pour améliorer la sécurité et prévenir les occurrences futures",
        ar: "تسجيل والتحقيق في حوادث مكان العمل والوقائع والحوادث المحتملة لتحسين السلامة ومنع حدوثها مستقبلاً"
      },
      dataObjects: {
        en: "Incident reports, involved parties, witness statements, investigation findings, preventive measures",
        fr: "Rapports d'incident, parties impliquées, déclarations de témoins, résultats d'enquête, mesures préventives",
        ar: "تقارير الحوادث، الأطراف المعنية، إفادات الشهود، نتائج التحقيق، التدابير الوقائية"
      },
      siteRelationship: {
        en: "Incidents occur at specific sites. Site safety officers lead investigations and implement corrective measures.",
        fr: "Les incidents se produisent sur des sites spécifiques. Les agents de sécurité du site dirigent les enquêtes et mettent en œuvre des mesures correctives.",
        ar: "الحوادث تحدث في مواقع محددة. ضباط السلامة في الموقع يقودون التحقيقات وينفذون التدابير التصحيحية."
      },
      multilingualNeeds: {
        en: "Incident types, injury descriptions, investigation procedures, safety recommendations",
        fr: "Types d'incidents, descriptions de blessures, procédures d'enquête, recommandations de sécurité",
        ar: "أنواع الحوادث، أوصاف الإصابات، إجراءات التحقيق، توصيات السلامة"
      }
    },
    {
      key: "haccp",
      icon: "Shield",
      color: "from-blue-600 to-blue-700",
      purpose: {
        en: "Implement and maintain Hazard Analysis Critical Control Points system for systematic food safety management",
        fr: "Mettre en œuvre et maintenir le système d'analyse des dangers et points critiques de contrôle pour une gestion systématique de la sécurité alimentaire",
        ar: "تطبيق والحفاظ على نظام تحليل المخاطر ونقاط التحكم الحرجة للإدارة المنهجية لسلامة الغذاء"
      },
      dataObjects: {
        en: "HACCP plans, critical control points, monitoring procedures, corrective actions, verification records",
        fr: "Plans HACCP, points critiques de contrôle, procédures de surveillance, actions correctives, dossiers de vérification",
        ar: "خطط تحليل المخاطر، نقاط التحكم الحرجة، إجراءات المراقبة، الإجراءات التصحيحية، سجلات التحقق"
      },
      siteRelationship: {
        en: "HACCP systems are site-specific based on kitchen operations. Food safety teams implement plans per location.",
        fr: "Les systèmes HACCP sont spécifiques au site en fonction des opérations de cuisine. Les équipes de sécurité alimentaire mettent en œuvre des plans par emplacement.",
        ar: "أنظمة تحليل المخاطر خاصة بالموقع حسب عمليات المطبخ. فرق سلامة الغذاء تنفذ الخطط حسب الموقع."
      },
      multilingualNeeds: {
        en: "Hazard descriptions, control measures, monitoring instructions, HACCP terminology",
        fr: "Descriptions des dangers, mesures de contrôle, instructions de surveillance, terminologie HACCP",
        ar: "أوصاف المخاطر، تدابير التحكم، تعليمات المراقبة، مصطلحات تحليل المخاطر"
      }
    },
    {
      key: "property_inspections",
      icon: "Building",
      color: "from-indigo-500 to-indigo-600",
      purpose: {
        en: "Manage property inspections, safety certificates, and compliance documentation for building and facility requirements",
        fr: "Gérer les inspections de propriété, les certificats de sécurité et la documentation de conformité pour les exigences de bâtiment et d'installation",
        ar: "إدارة فحوصات الممتلكات وشهادات السلامة ووثائق الامتثال لمتطلبات المباني والمرافق"
      },
      dataObjects: {
        en: "Inspection schedules, certificates, compliance documents, property assessments, renewal tracking",
        fr: "Calendriers d'inspection, certificats, documents de conformité, évaluations de propriété, suivi des renouvellements",
        ar: "جداول التفتيش، الشهادات، وثائق الامتثال، تقييمات الممتلكات، تتبع التجديدات"
      },
      siteRelationship: {
        en: "Property inspections are site-specific. Facilities managers coordinate inspections and maintain certificates.",
        fr: "Les inspections de propriété sont spécifiques au site. Les gestionnaires d'installations coordonnent les inspections et maintiennent les certificats.",
        ar: "فحوصات الممتلكات خاصة بالموقع. مديرو المرافق ينسقون التفتيشات ويحافظون على الشهادات."
      },
      multilingualNeeds: {
        en: "Inspection types, certificate names, compliance standards, regulatory requirements",
        fr: "Types d'inspection, noms de certificats, normes de conformité, exigences réglementaires",
        ar: "أنواع التفتيش، أسماء الشهادات، معايير الامتثال، المتطلبات التنظيمية"
      }
    },
    {
      key: "risk_assessments",
      icon: "AlertCircle",
      color: "from-yellow-500 to-yellow-600",
      purpose: {
        en: "Identify, evaluate, and mitigate operational risks to ensure safe working conditions and business continuity",
        fr: "Identifier, évaluer et atténuer les risques opérationnels pour assurer des conditions de travail sûres et la continuité des affaires",
        ar: "تحديد وتقييم وتخفيف المخاطر التشغيلية لضمان ظروف عمل آمنة واستمرارية الأعمال"
      },
      dataObjects: {
        en: "Risk registers, assessment forms, mitigation plans, risk ratings, review schedules",
        fr: "Registres de risques, formulaires d'évaluation, plans d'atténuation, cotes de risque, calendriers de révision",
        ar: "سجلات المخاطر، نماذج التقييم، خطط التخفيف، تقييمات المخاطر، جداول المراجعة"
      },
      siteRelationship: {
        en: "Risk assessments conducted per site based on local operations. Site managers implement mitigation strategies.",
        fr: "Évaluations de risques menées par site basées sur les opérations locales. Les gestionnaires de site mettent en œuvre des stratégies d'atténuation.",
        ar: "تقييمات المخاطر تتم حسب الموقع بناءً على العمليات المحلية. مديرو المواقع ينفذون استراتيجيات التخفيف."
      },
      multilingualNeeds: {
        en: "Risk categories, impact descriptions, mitigation actions, assessment criteria",
        fr: "Catégories de risques, descriptions d'impact, actions d'atténuation, critères d'évaluation",
        ar: "فئات المخاطر، أوصاف التأثير، إجراءات التخفيف، معايير التقييم"
      }
    },
    {
      key: "chemical_safety",
      icon: "Flask",
      color: "from-teal-500 to-teal-600",
      purpose: {
        en: "Manage chemical safety data sheets and ensure proper handling, storage, and disposal of hazardous substances",
        fr: "Gérer les fiches de données de sécurité chimique et assurer la manipulation, le stockage et l'élimination appropriés des substances dangereuses",
        ar: "إدارة صحائف بيانات السلامة الكيميائية وضمان التعامل والتخزين والتخلص السليم من المواد الخطرة"
      },
      dataObjects: {
        en: "Safety data sheets, chemical inventory, handling procedures, storage requirements, disposal records",
        fr: "Fiches de données de sécurité, inventaire chimique, procédures de manipulation, exigences de stockage, dossiers d'élimination",
        ar: "صحائف بيانات السلامة، جرد المواد الكيميائية، إجراءات التعامل، متطلبات التخزين، سجلات التخلص"
      },
      siteRelationship: {
        en: "Chemical inventories are site-specific. Local safety coordinators manage chemical handling procedures.",
        fr: "Les inventaires chimiques sont spécifiques au site. Les coordinateurs de sécurité locaux gèrent les procédures de manipulation chimique.",
        ar: "جرد المواد الكيميائية خاص بالموقع. منسقو السلامة المحليون يديرون إجراءات التعامل مع المواد الكيميائية."
      },
      multilingualNeeds: {
        en: "Chemical names, hazard warnings, safety procedures, emergency instructions",
        fr: "Noms chimiques, avertissements de danger, procédures de sécurité, instructions d'urgence",
        ar: "أسماء المواد الكيميائية، تحذيرات المخاطر، إجراءات السلامة، تعليمات الطوارئ"
      }
    },
    {
      key: "safety_policies",
      icon: "FileText",
      color: "from-gray-500 to-gray-600",
      purpose: {
        en: "Develop, maintain, and communicate safety policies and procedures to ensure consistent safety standards across operations",
        fr: "Développer, maintenir et communiquer les politiques et procédures de sécurité pour assurer des normes de sécurité cohérentes dans toutes les opérations",
        ar: "تطوير والحفاظ على وتوصيل سياسات وإجراءات السلامة لضمان معايير سلامة متسقة عبر العمليات"
      },
      dataObjects: {
        en: "Policy documents, procedures, version control, approval workflows, distribution tracking",
        fr: "Documents de politique, procédures, contrôle de version, flux d'approbation, suivi de distribution",
        ar: "وثائق السياسات، الإجراءات، تحكم النسخ، تدفقات الموافقة، تتبع التوزيع"
      },
      siteRelationship: {
        en: "Policies apply across all sites with site-specific adaptations. Local managers ensure policy implementation.",
        fr: "Les politiques s'appliquent à tous les sites avec des adaptations spécifiques au site. Les gestionnaires locaux assurent la mise en œuvre des politiques.",
        ar: "السياسات تطبق عبر جميع المواقع مع تكييفات خاصة بالموقع. المديرون المحليون يضمنون تطبيق السياسات."
      },
      multilingualNeeds: {
        en: "Policy content, procedures, compliance requirements, training materials",
        fr: "Contenu des politiques, procédures, exigences de conformité, matériels de formation",
        ar: "محتوى السياسات، الإجراءات، متطلبات الامتثال، مواد التدريب"
      }
    },
    {
      key: "task_manager",
      icon: "CheckCircle",
      color: "from-emerald-500 to-emerald-600",
      purpose: {
        en: "Assign, track, and manage safety-related tasks, corrective actions, and improvement initiatives across the organization",
        fr: "Attribuer, suivre et gérer les tâches liées à la sécurité, les actions correctives et les initiatives d'amélioration dans l'organisation",
        ar: "تخصيص وتتبع وإدارة المهام المتعلقة بالسلامة والإجراءات التصحيحية ومبادرات التحسين عبر المنظمة"
      },
      dataObjects: {
        en: "Task assignments, deadlines, progress tracking, completion status, responsible parties",
        fr: "Attributions de tâches, délais, suivi des progrès, statut d'achèvement, parties responsables",
        ar: "تخصيصات المهام، المواعيد النهائية، تتبع التقدم، حالة الإنجاز، الأطراف المسؤولة"
      },
      siteRelationship: {
        en: "Tasks can be site-specific or organization-wide. Site managers assign local tasks while corporate managers handle cross-site initiatives.",
        fr: "Les tâches peuvent être spécifiques au site ou à l'échelle de l'organisation. Les gestionnaires de site attribuent les tâches locales tandis que les gestionnaires corporatifs gèrent les initiatives inter-sites.",
        ar: "المهام يمكن أن تكون خاصة بالموقع أو على مستوى المنظمة. مديرو المواقع يخصصون المهام المحلية بينما المديرون المؤسسيون يتعاملون مع المبادرات عبر المواقع."
      },
      multilingualNeeds: {
        en: "Task descriptions, status updates, priority levels, assignment notifications",
        fr: "Descriptions de tâches, mises à jour de statut, niveaux de priorité, notifications d'attribution",
        ar: "أوصاف المهام، تحديثات الحالة، مستويات الأولوية، إشعارات التخصيص"
      }
    },
    {
      key: "document_centre",
      icon: "FolderOpen",
      color: "from-blue-500 to-cyan-500",
      purpose: {
        en: "Centralized repository for all safety, compliance, and operational documents with version control and access management",
        fr: "Référentiel centralisé pour tous les documents de sécurité, de conformité et opérationnels avec contrôle de version et gestion d'accès",
        ar: "مستودع مركزي لجميع وثائق السلامة والامتثال والتشغيل مع التحكم في النسخ وإدارة الوصول"
      },
      dataObjects: {
        en: "Document files, categories, tags, version history, access permissions, approval status",
        fr: "Fichiers de documents, catégories, étiquettes, historique des versions, autorisations d'accès, statut d'approbation",
        ar: "ملفات الوثائق، الفئات، العلامات، تاريخ النسخ، أذونات الوصول، حالة الموافقة"
      },
      siteRelationship: {
        en: "Documents can be global, company-specific, or site-specific. Access rights vary by user role and site assignment.",
        fr: "Les documents peuvent être globaux, spécifiques à l'entreprise ou spécifiques au site. Les droits d'accès varient selon le rôle de l'utilisateur et l'affectation du site.",
        ar: "الوثائق يمكن أن تكون عالمية أو خاصة بالشركة أو خاصة بالموقع. حقوق الوصول تختلف حسب دور المستخدم وتخصيص الموقع."
      },
      multilingualNeeds: {
        en: "Document titles, categories, descriptions, search terms, metadata",
        fr: "Titres de documents, catégories, descriptions, termes de recherche, métadonnées",
        ar: "عناوين الوثائق، الفئات، الأوصاف، مصطلحات البحث، البيانات الوصفية"
      }
    },
    {
      key: "supplier_contractor",
      icon: "Truck",
      color: "from-orange-500 to-red-500",
      purpose: {
        en: "Manage supplier and contractor information, certifications, performance evaluations, and compliance verification",
        fr: "Gérer les informations des fournisseurs et contractants, certifications, évaluations de performance et vérification de conformité",
        ar: "إدارة معلومات الموردين والمقاولين والشهادات وتقييمات الأداء والتحقق من الامتثال"
      },
      dataObjects: {
        en: "Supplier profiles, contracts, certifications, performance ratings, compliance documents, contact details",
        fr: "Profils de fournisseurs, contrats, certifications, évaluations de performance, documents de conformité, coordonnées",
        ar: "ملفات الموردين، العقود، الشهادات، تقييمات الأداء، وثائق الامتثال، تفاصيل الاتصال"
      },
      siteRelationship: {
        en: "Suppliers can serve multiple sites. Site managers evaluate supplier performance and manage local supplier relationships.",
        fr: "Les fournisseurs peuvent desservir plusieurs sites. Les gestionnaires de site évaluent la performance des fournisseurs et gèrent les relations locales avec les fournisseurs.",
        ar: "الموردون يمكن أن يخدموا مواقع متعددة. مديرو المواقع يقيمون أداء الموردين ويديرون علاقات الموردين المحلية."
      },
      multilingualNeeds: {
        en: "Supplier categories, service descriptions, contract terms, evaluation criteria",
        fr: "Catégories de fournisseurs, descriptions de services, termes de contrat, critères d'évaluation",
        ar: "فئات الموردين، أوصاف الخدمات، شروط العقود، معايير التقييم"
      }
    },
    {
      key: "training_dashboard",
      icon: "GraduationCap",
      color: "from-violet-500 to-purple-600",
      purpose: {
        en: "Track training requirements, progress, and certifications for staff safety and compliance education",
        fr: "Suivre les exigences de formation, les progrès et les certifications pour l'éducation à la sécurité et à la conformité du personnel",
        ar: "تتبع متطلبات التدريب والتقدم والشهادات لتعليم الموظفين حول السلامة والامتثال"
      },
      dataObjects: {
        en: "Training programs, course materials, completion records, certifications, training schedules, competency assessments",
        fr: "Programmes de formation, matériels de cours, dossiers d'achèvement, certifications, calendriers de formation, évaluations de compétence",
        ar: "برامج التدريب، مواد الدورات، سجلات الإنجاز، الشهادات، جداول التدريب، تقييمات الكفاءة"
      },
      siteRelationship: {
        en: "Training can be site-specific or company-wide. Site managers ensure staff complete required training for their location.",
        fr: "La formation peut être spécifique au site ou à l'échelle de l'entreprise. Les gestionnaires de site s'assurent que le personnel termine la formation requise pour leur emplacement.",
        ar: "التدريب يمكن أن يكون خاصًا بالموقع أو على مستوى الشركة. مديرو المواقع يضمنون إكمال الموظفين للتدريب المطلوب لموقعهم."
      },
      multilingualNeeds: {
        en: "Course titles, training content, certification names, progress messages",
        fr: "Titres de cours, contenu de formation, noms de certification, messages de progrès",
        ar: "عناوين الدورات، محتوى التدريب، أسماء الشهادات، رسائل التقدم"
      }
    },
    {
      key: "supply_chain_complaints",
      icon: "AlertTriangle",
      color: "from-red-500 to-pink-500",
      purpose: {
        en: "Track and resolve complaints related to supply chain partners, delivery issues, and product quality concerns",
        fr: "Suivre et résoudre les plaintes liées aux partenaires de la chaîne d'approvisionnement, aux problèmes de livraison et aux préoccupations de qualité des produits",
        ar: "تتبع وحل الشكاوى المتعلقة بشركاء سلسلة التوريد ومشاكل التسليم ومخاوف جودة المنتجات"
      },
      dataObjects: {
        en: "Complaint records, supplier details, delivery issues, quality problems, resolution actions, follow-up tracking",
        fr: "Dossiers de plaintes, détails du fournisseur, problèmes de livraison, problèmes de qualité, actions de résolution, suivi de suivi",
        ar: "سجلات الشكاوى، تفاصيل الموردين، مشاكل التسليم، مشاكل الجودة، إجراءات الحل، تتبع المتابعة"
      },
      siteRelationship: {
        en: "Complaints can originate from any site. Site managers report issues while supply chain managers coordinate resolution.",
        fr: "Les plaintes peuvent provenir de n'importe quel site. Les gestionnaires de site signalent les problèmes tandis que les gestionnaires de chaîne d'approvisionnement coordonnent la résolution.",
        ar: "الشكاوى يمكن أن تنشأ من أي موقع. مديرو المواقع يبلغون عن المشاكل بينما مديرو سلسلة التوريد ينسقون الحل."
      },
      multilingualNeeds: {
        en: "Complaint types, supplier communications, resolution status, quality standards",
        fr: "Types de plaintes, communications avec les fournisseurs, statut de résolution, normes de qualité",
        ar: "أنواع الشكاوى، التواصل مع الموردين، حالة الحل، معايير الجودة"
      }
    },
    {
      key: "resources_centre",
      icon: "BookOpen",
      color: "from-green-500 to-teal-500",
      purpose: {
        en: "Provide access to educational materials, best practices, regulatory guidelines, and reference information for safety and compliance",
        fr: "Fournir l'accès aux matériels éducatifs, aux meilleures pratiques, aux directives réglementaires et aux informations de référence pour la sécurité et la conformité",
        ar: "توفير الوصول للمواد التعليمية وأفضل الممارسات والمبادئ التوجيهية التنظيمية والمعلومات المرجعية للسلامة والامتثال"
      },
      dataObjects: {
        en: "Resource articles, guidelines, best practices, regulatory updates, reference materials, learning paths",
        fr: "Articles de ressources, directives, meilleures pratiques, mises à jour réglementaires, matériels de référence, parcours d'apprentissage",
        ar: "مقالات الموارد، المبادئ التوجيهية، أفضل الممارسات، التحديثات التنظيمية، المواد المرجعية، مسارات التعلم"
      },
      siteRelationship: {
        en: "Resources are available organization-wide. Content can be tailored for specific site types or operational contexts.",
        fr: "Les ressources sont disponibles à l'échelle de l'organisation. Le contenu peut être adapté pour des types de sites spécifiques ou des contextes opérationnels.",
        ar: "الموارد متاحة على مستوى المنظمة. المحتوى يمكن تخصيصه لأنواع مواقع محددة أو سياقات تشغيلية."
      },
      multilingualNeeds: {
        en: "Content articles, categories, search terms, regulatory terminology, educational materials",
        fr: "Articles de contenu, catégories, termes de recherche, terminologie réglementaire, matériels éducatifs",
        ar: "مقالات المحتوى، الفئات، مصطلحات البحث، المصطلحات التنظيمية، المواد التعليمية"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-sky-500 rounded-2xl mb-6">
            <ApperIcon name="Layers" className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent mb-4">
            {t("features.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {featureAreas.map((feature) => (
            <Card
              key={feature.key}
              className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
              gradient={true}
            >
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                    feature.color
                  )}>
                    <ApperIcon name={feature.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">
                      {t(`feature.${feature.key}.name`)}
                    </h3>
                  </div>
                </div>

                {/* Content sections */}
                <div className="flex-1 space-y-6">
                  {/* Purpose */}
                  <div>
                    <h4 className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-2">
                      {t("feature.purpose")}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.purpose[isRTL ? 'ar' : 'en']}
                    </p>
                  </div>

                  {/* Data Objects */}
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                      {t("feature.data_objects")}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.dataObjects[isRTL ? 'ar' : 'en']}
                    </p>
                  </div>

                  {/* Site & User Relationship */}
                  <div>
                    <h4 className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-2">
                      {t("feature.site_user_relationship")}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.siteRelationship[isRTL ? 'ar' : 'en']}
                    </p>
                  </div>

                  {/* Multilingual Needs */}
                  <div>
                    <h4 className="text-sm font-semibold text-violet-600 uppercase tracking-wide mb-2">
                      {t("feature.multilingual_needs")}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.multilingualNeeds[isRTL ? 'ar' : 'en']}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
            <ApperIcon name="Info" className="w-5 h-5 text-primary-600 mr-3" />
            <p className="text-sm text-slate-600">
              <span className="font-medium">Next Steps:</span> This overview provides the conceptual foundation for detailed workflow design and UI implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;