# SafetyHub Morocco - Complete UX Blueprint

## Platform Overview

SafetyHub Morocco is a comprehensive safety and compliance management platform designed specifically for Moroccan hospitality establishments. The platform ensures adherence to ONSSA, Labour Code, and other regulatory requirements through a multilingual, role-based system.

## Navigation Structure

### Primary Navigation Hierarchy

```
┌─ Company Level (CEO Access)
│  ├─ Dashboard (Analytics Overview)
│  ├─ Analytics & Reporting
│  │  ├─ HACCP Performance Analytics
│  │  ├─ ONSSA Compliance Tracking  
│  │  ├─ Multi-Site Comparison
│  │  └─ Incident Analysis
│  ├─ Core Operations
│  │  ├─ Audits
│  │  ├─ Checklists
│  │  ├─ Temperature Records
│  │  └─ HACCP Management
│  ├─ Risk & Safety Management
│  │  ├─ Accidents & Incidents
│  │  ├─ Risk Assessments
│  │  ├─ Chemical Safety
│  │  └─ Property Inspections
│  ├─ Compliance & Regulatory
│  │  ├─ Enforcement Visits
│  │  ├─ Regulatory Alignment
│  │  ├─ Food Complaints
│  │  └─ Supply Chain Complaints
│  ├─ Management & Administration
│  │  ├─ Companies
│  │  ├─ Sites
│  │  ├─ Users
│  │  ├─ Workflows
│  │  ├─ Task Manager
│  │  └─ Supplier/Contractor Management
│  ├─ Knowledge & Training
│  │  ├─ Training Dashboard
│  │  ├─ Document Centre
│  │  ├─ Safety Policies
│  │  └─ Resources Centre
│  └─ System
│     ├─ Settings
│     └─ Feature Areas
│
├─ Site Level (Manager Access)  
│  ├─ Dashboard (Site-Specific View)
│  ├─ Site Operations (Filtered to assigned site)
│  ├─ Local Compliance Tracking
│  ├─ Site-Specific Analytics
│  └─ Team Management
│
└─ User Level (Operational Access)
   ├─ My Dashboard
   ├─ Assigned Tasks
   ├─ My Checklists  
   ├─ Temperature Logging
   └─ Training Progress
```

### Access Control Matrix

| Role | Company Access | Site Access | User Management | Analytics | System Settings |
|------|---------------|-------------|-----------------|-----------|----------------|
| CEO | All Companies | All Sites | Full | Full | Full |
| Manager | Assigned Company | Assigned Sites | Site Users | Site Analytics | Limited |
| User | Read Only | Assigned Site | Personal | Personal | None |

## Main Dashboard Layout

### Dashboard Wireframe Structure

```
┌─────────────────────────────────────────────────────────┐
│ TopBar: Logo | Breadcrumb | Language Selector | Profile │
├─────────────────────────────────────────────────────────┤
│ │ Sidebar    │ Main Content Area                        │
│ │ Navigation │ ┌─────────────────────────────────────┐  │
│ │            │ │ Header: Welcome + Description       │  │
│ │ Analytics  │ └─────────────────────────────────────┘  │
│ │ Core Ops   │ ┌─────────────────────────────────────┐  │
│ │ Risk/Safety│ │ Analytics Overview (5 Cards)       │  │
│ │ Compliance │ │ HACCP│ONSSA│Areas│Score│Tasks      │  │
│ │ Management │ └─────────────────────────────────────┘  │
│ │ Knowledge  │ ┌─────────────────────────────────────┐  │
│ │ System     │ │ Foundation Stats (4 Cards)          │  │
│ │            │ │ Companies│Sites│Users│Invites       │  │
│ │            │ └─────────────────────────────────────┘  │
│ │            │ ┌─────────────────────────────────────┐  │
│ │            │ │ Analytics Quick Actions             │  │
│ │            │ │ [HACCP][ONSSA][Incident][Compare]  │  │
│ │            │ └─────────────────────────────────────┘  │
│ │            │ ┌─────────────────────────────────────┐  │
│ │            │ │ System Foundation (2 Columns)       │  │
│ │            │ │ Org Hierarchy │ Access Control      │  │
│ │            │ └─────────────────────────────────────┘  │
│ │            │ ┌─────────────────────────────────────┐  │
│ │            │ │ Multilingual Support (3 Languages) │  │
│ │            │ │     🇲🇦      │   🇫🇷   │   🇺🇸     │  │
│ │            │ └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Dashboard Component Breakdown

#### 1. Analytics Overview Section (Grid: 1-5 columns responsive)
```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ HACCP Perf   │ ONSSA Ready  │ Feature Areas│ Compliance   │ Task Complete│
│ 87% ▲3.2%    │ 92% ▲1.8%    │ 17 items ▲2 │ 89% ▲5%      │ 87.5% ▲2.3% │
│ 🛡️ Shield    │ ✅ CheckCircle│ 📄 FileText  │ 🏆 Award     │ ⏰ Clock     │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

#### 2. Foundation Stats Section (Grid: 1-4 columns responsive)  
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Companies    │ Sites        │ Users        │ Pending      │
│ Dynamic #    │ Dynamic #    │ Dynamic #    │ Dynamic #    │
│ 🏢 Building2 │ 📍 MapPin    │ 👥 Users     │ ➕ UserPlus  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

#### 3. Analytics Quick Actions (4 Interactive Cards)
```
┌─────────────────────────────────────────────────────────┐
│ Analytics & Reporting                    [View Full ▶] │
├─────────────────────────────────────────────────────────┤
│ ┌──────────┬──────────┬──────────┬──────────┐           │
│ │ 🛡️ HACCP │ ✅ ONSSA │ ⚠️ Incident│ 📊 Multi │           │
│ │ Report   │ Compliance│ Analysis │ Compare  │           │
│ └──────────┴──────────┴──────────┴──────────┘           │
└─────────────────────────────────────────────────────────┘
```

#### 4. System Foundation Info (2 Column Layout)
```
┌─────────────────────┬─────────────────────┐
│ Organizational      │ Access Control      │
│ Hierarchy           │ System              │
│ ─────────          │ ─────────          │
│ • Company Level     │ 🔵 CEO Role         │
│   └• Site Level     │ 🟣 Manager Role     │  
│     └• User Level   │ ⚫ User Role         │
└─────────────────────┴─────────────────────┘
```

## Feature Area Groupings & Organization

### 1. Core Operations (Primary Functions)
```
┌─────────────────────────────────────────────────────────┐
│ 🔵 Core Operations                                      │
├─────────────────────────────────────────────────────────┤
│ ┌─ Audits               ┌─ Checklists                   │
│ │ • Templates           │ • Daily Tasks                 │
│ │ • Records             │ • Completion Tracking        │
│ │ • Findings            │ • Staff Assignment           │
│ │ • Corrective Actions  │ • Status Monitoring          │
│ └─                      └─                             │
│ ┌─ Temperature Records  ┌─ HACCP Management            │
│ │ • Equipment Logs      │ • Critical Control Points    │
│ │ • Monitoring Schedule │ • Monitoring Procedures      │
│ │ • Alert Thresholds    │ • Verification Records       │
│ │ • Calibration Records │ • Corrective Actions         │
│ └─                      └─                             │
└─────────────────────────────────────────────────────────┘
```

### 2. Risk & Safety Management  
```
┌─────────────────────────────────────────────────────────┐
│ 🔴 Risk & Safety Management                             │
├─────────────────────────────────────────────────────────┤
│ ┌─ Accidents/Incidents  ┌─ Risk Assessments            │
│ │ • Incident Reports    │ • Risk Registers             │
│ │ • Investigation       │ • Assessment Forms           │
│ │ • Witness Statements  │ • Mitigation Plans           │
│ │ • Preventive Measures │ • Review Schedules           │
│ └─                      └─                             │
│ ┌─ Chemical Safety      ┌─ Property Inspections        │
│ │ • Safety Data Sheets  │ • Inspection Schedules       │
│ │ • Chemical Inventory  │ • Certificates               │
│ │ • Handling Procedures │ • Compliance Documents       │
│ │ • Disposal Records    │ • Renewal Tracking           │
│ └─                      └─                             │
└─────────────────────────────────────────────────────────┘
```

### 3. Compliance & Regulatory
```
┌─────────────────────────────────────────────────────────┐
│ ⚖️ Compliance & Regulatory                               │
├─────────────────────────────────────────────────────────┤
│ ┌─ Enforcement Visits   ┌─ Regulatory Alignment         │
│ │ • Visit Records       │ • ONSSA Requirements         │
│ │ • Inspector Details   │ • Labour Code Compliance     │
│ │ • Findings            │ • Municipal Regulations       │
│ │ • Corrective Actions  │ • Protection Civile          │
│ └─                      └─                             │
│ ┌─ Food Complaints      ┌─ Supply Chain Complaints     │
│ │ • Customer Details    │ • Supplier Issues           │
│ │ • Incident Reports    │ • Delivery Problems          │
│ │ • Investigation Notes │ • Quality Concerns           │
│ │ • Resolution Actions  │ • Resolution Tracking        │
│ └─                      └─                             │
└─────────────────────────────────────────────────────────┘
```

### 4. Management & Administration  
```
┌─────────────────────────────────────────────────────────┐
│ 🏢 Management & Administration                          │
├─────────────────────────────────────────────────────────┤
│ ┌─ Companies            ┌─ Sites                        │
│ │ • Company Profiles    │ • Site Details               │
│ │ • Multi-site Mgmt     │ • Location Management        │
│ │ • Corporate Settings  │ • Local Operations           │
│ │ • Organizational Data │ • Site-Specific Config       │
│ └─                      └─                             │
│ ┌─ Users                ┌─ Workflows                    │
│ │ • User Management     │ • Process Definition         │
│ │ • Role Assignment     │ • Approval Chains            │
│ │ • Access Control      │ • Task Automation            │
│ │ • Profile Management  │ • Progress Tracking          │
│ └─                      └─                             │
│ ┌─ Task Manager         ┌─ Suppliers/Contractors       │
│ │ • Task Assignment     │ • Supplier Profiles          │
│ │ • Progress Tracking   │ • Performance Evaluation     │
│ │ • Deadline Management │ • Contract Management        │
│ │ • Completion Status   │ • Compliance Verification    │
│ └─                      └─                             │
└─────────────────────────────────────────────────────────┘
```

### 5. Knowledge & Training
```
┌─────────────────────────────────────────────────────────┐
│ 🎓 Knowledge & Training                                 │
├─────────────────────────────────────────────────────────┤
│ ┌─ Training Dashboard   ┌─ Document Centre             │
│ │ • Training Programs   │ • Document Repository        │
│ │ • Progress Tracking   │ • Version Control            │
│ │ • Certification Mgmt  │ • Access Management          │
│ │ • Competency Assessment│ • Document Categories       │
│ └─                      └─                             │
│ ┌─ Safety Policies      ┌─ Resources Centre            │
│ │ • Policy Documents    │ • Educational Materials      │
│ │ • Version Control     │ • Best Practices             │
│ │ • Distribution Track  │ • Regulatory Guidelines      │
│ │ • Approval Workflows  │ • Reference Information      │
│ └─                      └─                             │
└─────────────────────────────────────────────────────────┘
```

## Responsive Design Specifications

### Desktop Layout (≥1024px)
```
┌─ Sidebar (256px) ─┬─────── Main Content Area ──────────┐
│ Navigation        │ ┌─ Header (64px)                   │
│ • Logo            │ ├─ Content Area                    │
│ • Menu Items      │ │ • Cards Grid                     │
│ • Role Badge      │ │ • Responsive Columns             │
│ • Quick Actions   │ │ • Interactive Elements           │
│                   │ └─                                 │
└───────────────────┴────────────────────────────────────┘
```

### Tablet Layout (768px-1023px)  
```
┌─ Overlay Sidebar ─┬─────── Main Content Area ──────────┐
│ (Hidden by default│ ┌─ Header (64px) [☰ Menu Toggle]  │
│ Slides in on tap) │ ├─ Content Area                    │
│                   │ │ • 2-3 Column Grids               │
│                   │ │ • Touch-Optimized Cards          │
│                   │ │ • Condensed Statistics           │
│                   │ └─                                 │
└───────────────────┴────────────────────────────────────┘
```

### Mobile Layout (≤767px)
```
┌──────────── Full Width Mobile Layout ────────────────┐
│ ┌─ Fixed Header (64px)                              │
│ │ ☰ | Logo | 🌐 | 👤                               │
│ ├─ Content Area (Single Column)                     │
│ │ • Stacked Cards                                   │
│ │ • Full-width Components                           │
│ │ • Touch-friendly Interactions                     │
│ │ • Bottom Navigation (if needed)                   │
│ └─                                                  │
└─────────────────────────────────────────────────────┘
```

## Page Structure Templates

### Standard Page Layout
```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Section > Current Page              │
├─────────────────────────────────────────────────────────┤
│ Page Header                                             │
│ • Title (H1)                                           │
│ • Description (Subtitle)                               │
│ • Primary Actions (Buttons/Filters)                   │
├─────────────────────────────────────────────────────────┤
│ Quick Stats/Summary (if applicable)                    │
│ • Key Metrics Cards                                     │
│ • Status Indicators                                     │
├─────────────────────────────────────────────────────────┤
│ Main Content Area                                       │
│ • Data Tables / Card Grids                            │
│ • Interactive Elements                                  │
│ • Filter/Search Controls                               │
├─────────────────────────────────────────────────────────┤
│ Secondary Actions                                       │
│ • Bulk Operations                                       │
│ • Export Options                                        │
│ • Additional Tools                                      │
└─────────────────────────────────────────────────────────┘
```

### Data Entry Form Layout
```
┌─────────────────────────────────────────────────────────┐
│ Form Header                                             │
│ • Form Title                                           │
│ • Progress Indicator (if multi-step)                  │
├─────────────────────────────────────────────────────────┤
│ Form Sections                                           │
│ ┌─ Section 1: Basic Information                        │
│ │ • Required Fields (*)                                │
│ │ • Input Validation                                   │
│ │ • Helper Text                                        │
│ ├─ Section 2: Additional Details                      │
│ │ • Optional Fields                                    │
│ │ • Advanced Options                                   │
│ └─ Section 3: Attachments/Notes                       │
│   • File Uploads                                       │
│   • Text Areas                                         │
├─────────────────────────────────────────────────────────┤
│ Form Actions                                            │
│ • [Cancel] [Save Draft] [Submit]                       │
│ • Keyboard Shortcuts Info                              │
└─────────────────────────────────────────────────────────┘
```

## Multilingual Considerations

### RTL (Arabic) Layout Adaptations
```
Direction: Right-to-Left
├─ Sidebar: Right side placement
├─ Icons: Mirrored navigation arrows  
├─ Text: Right-aligned by default
├─ Tables: RTL column progression
└─ Forms: Right-aligned labels
```

### Language-Specific Components
```
Language Selector:
┌─────────────────────┐
│ 🇲🇦 العربية (RTL)    │
│ 🇫🇷 Français         │  
│ 🇺🇸 English          │
└─────────────────────┘

Content Adaptation:
• Field Labels: Translated with proper context
• Error Messages: Culturally appropriate 
• Date Formats: Localized (DD/MM/YYYY for Arabic/French)
• Number Formats: Arabic-Indic numerals option
```

## Interaction Patterns

### Navigation Flow
```
Entry Point → Authentication → Role Detection → Dashboard Redirect
│
├─ CEO: Company-wide Dashboard
├─ Manager: Site-specific Dashboard  
└─ User: Personal Task Dashboard

Navigation Pattern:
Dashboard → Feature Selection → Detail View → Action → Confirmation → Result
```

### Data Operations Flow  
```
List View → [Filter/Search] → Select Item → Action Menu
│
├─ View: Detail Modal/Page
├─ Edit: Form Modal/Page → Validation → Confirmation
├─ Delete: Confirmation Dialog → Processing → Success Message
└─ Bulk: Selection → Bulk Action → Progress → Results Summary
```

### Notification System
```
Toast Notifications:
┌─────────────────────┐
│ ✅ Success Message   │ (3s auto-dismiss)
│ ❌ Error Message     │ (Manual dismiss)  
│ ⚠️ Warning Message   │ (5s auto-dismiss)
│ ℹ️ Info Message      │ (4s auto-dismiss)
└─────────────────────┘

In-App Notifications:
• Badge counts on navigation items
• Status indicators on data rows
• Progress bars for long operations
```

This comprehensive UX blueprint provides the foundation for a cohesive, accessible, and culturally appropriate safety management platform tailored specifically for Moroccan hospitality establishments.