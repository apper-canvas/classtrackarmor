import React, { Suspense } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { getRouteConfig, verifyRouteAccess } from "@/router/route.utils";
import Loading from "@/components/ui/Loading";
import Layout from "@/components/organisms/Layout";
import PromptPassword from "@/components/pages/PromptPassword";
import ResourcesCentre from "@/components/pages/ResourcesCentre";
import Features from "@/components/pages/Features";
import Analytics from "@/components/pages/Analytics";
import Callback from "@/components/pages/Callback";
import AuditChecklists from "@/components/pages/AuditChecklists";
import TemperatureRecords from "@/components/pages/TemperatureRecords";
import SupplyChainComplaints from "@/components/pages/SupplyChainComplaints";
import PropertyInspections from "@/components/pages/PropertyInspections";
import Workflows from "@/components/pages/Workflows";
import Dashboard from "@/components/pages/Dashboard";
import Audits from "@/components/pages/Audits";
import HACCPAnalytics from "@/components/pages/HACCPAnalytics";
import AccidentsIncidents from "@/components/pages/AccidentsIncidents";
import Companies from "@/components/pages/Companies";
import RegulatoryAlignment from "@/components/pages/RegulatoryAlignment";
import ONSSACompliance from "@/components/pages/ONSSACompliance";
import SafetyPolicies from "@/components/pages/SafetyPolicies";
import ErrorPage from "@/components/pages/ErrorPage";
import NotFound from "@/components/pages/NotFound";
import RiskAssessments from "@/components/pages/RiskAssessments";
import Users from "@/components/pages/Users";
import Settings from "@/components/pages/Settings";
import Login from "@/components/pages/Login";
import ChemicalSafety from "@/components/pages/ChemicalSafety";
import Checklists from "@/components/pages/Checklists";
import MultiSiteComparison from "@/components/pages/MultiSiteComparison";
import HACCPManagement from "@/components/pages/HACCPManagement";
import ResetPassword from "@/components/pages/ResetPassword";
import DocumentCentre from "@/components/pages/DocumentCentre";
import Signup from "@/components/pages/Signup";
import SuppliersContractors from "@/components/pages/SuppliersContractors";
import WorkflowDetail from "@/components/pages/WorkflowDetail";
import FoodComplaints from "@/components/pages/FoodComplaints";
import Sites from "@/components/pages/Sites";
import FeatureAreas from "@/components/pages/FeatureAreas";
import Root from "@/layouts/Root";
import TaskManager from "@/components/pages/TaskManager";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-lg font-semibold text-slate-700">Loading SafetyHub...</p>
    </div>
  </div>
);

// createRoute helper function
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  const configPath = index ? "/" : (path.startsWith('/') ? path : `/${path}`);
  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;
  
  return {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<Loading />}>{element}</Suspense> : element,
    handle: { access: finalAccess, ...meta },
    ...(children && { children })
  };
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<LoadingSpinner />}><Root /></Suspense>,
    errorElement: <Suspense fallback={<LoadingSpinner />}><ErrorPage /></Suspense>,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <Dashboard />,
            title: 'Dashboard'
          }),
          createRoute({
            path: "analytics",
            element: <Analytics />,
            title: 'Analytics'
          }),
          createRoute({
path: "analytics/haccp",
            element: <HACCPAnalytics />,
            title: 'HACCP Analytics'
          }),
          createRoute({
            path: "analytics/onssa",
            element: <ONSSACompliance />,
            title: 'ONSSA Compliance'
          }),
          createRoute({
            path: "audits",
            element: <Audits />,
            title: 'Audits'
          }),
          createRoute({
            path: "audits/checklists",
            element: <AuditChecklists />,
            title: 'Audit Checklists'
          }),
          createRoute({
            path: "checklists",
            element: <Checklists />,
            title: 'Checklists'
          }),
          createRoute({
            path: "temperature-records",
            element: <TemperatureRecords />,
            title: 'Temperature Records'
          }),
          createRoute({
            path: "haccp",
            element: <HACCPManagement />,
            title: 'HACCP Management'
          }),
          createRoute({
            path: "accidents-incidents",
            element: <AccidentsIncidents />,
            title: 'Accidents & Incidents'
          }),
          createRoute({
            path: "risk-assessments",
            element: <RiskAssessments />,
            title: 'Risk Assessments'
          }),
          createRoute({
            path: "chemical-safety",
            element: <ChemicalSafety />,
            title: 'Chemical Safety'
          }),
createRoute({
            path: "property-inspections",
            element: <PropertyInspections />,
            title: 'Property Inspections'
          }),
          createRoute({
            path: "food-complaints",
            element: <FoodComplaints />,
            title: 'Food Complaints'
          }),
          createRoute({
            path: "supply-chain-complaints",
            element: <SupplyChainComplaints />,
            title: 'Supply Chain Complaints'
          }),
          createRoute({
            path: "task-manager",
            element: <TaskManager />,
            title: 'Task Manager'
          }),
          createRoute({
path: "suppliers-contractors",
            element: <SuppliersContractors />,
            title: 'Suppliers & Contractors'
          }),
          createRoute({
            path: "documents",
            element: <DocumentCentre />,
            title: 'Document Centre'
          }),
          createRoute({
            path: "safety-policies",
            element: <SafetyPolicies />,
            title: 'Safety Policies'
          }),
          createRoute({
            path: "resources",
            element: <ResourcesCentre />,
            title: 'Resources Centre'
          }),
          createRoute({
            path: "analytics/comparison",
            element: <MultiSiteComparison />,
            title: 'Multi-Site Comparison'
          }),
          createRoute({
            path: "features",
            element: <Features />,
            title: 'Features'
          }),
          createRoute({
            path: "feature-areas",
            element: <FeatureAreas />,
            title: 'Feature Areas'
          }),
          createRoute({
path: "regulatory-alignment",
            element: <RegulatoryAlignment />,
            title: 'Regulatory Alignment'
          }),
          createRoute({
            path: "workflows",
            element: <Workflows />,
            title: 'Workflows'
          }),
          createRoute({
            path: "workflows/:id",
            element: <WorkflowDetail />,
            title: 'Workflow Details'
          }),
          createRoute({
            path: "companies",
            element: <Companies />,
            title: 'Companies'
          }),
          createRoute({
            path: "sites",
            element: <Sites />,
            title: 'Sites'
          }),
          createRoute({
            path: "users",
            element: <Users />,
            title: 'Users'
          }),
          createRoute({
            path: "settings",
            element: <Settings />,
            title: 'Settings'
          }),
createRoute({
            path: "*",
            element: <NotFound />,
            title: 'Not Found'
          })
        ]
      },
      createRoute({
        path: "login",
        element: <Login />,
        title: 'Login'
      }),
      createRoute({
        path: "signup",
        element: <Signup />,
        title: 'Sign Up'
      }),
      createRoute({
        path: "callback",
        element: <Callback />,
        title: 'Authentication Callback'
      }),
      createRoute({
        path: "error",
        element: <ErrorPage />,
        title: 'Error'
      }),
      createRoute({
path: "reset-password/:appId/:fields",
        element: <ResetPassword />,
        title: 'Reset Password'
      }),
      createRoute({
        path: "prompt-password/:appId/:emailAddress/:provider",
        element: <PromptPassword />,
        title: 'Prompt Password'
      })
    ]
  }
]);

export { router };