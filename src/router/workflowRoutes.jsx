import React, { Suspense, lazy } from 'react';

// Lazy load workflow components
const Workflows = lazy(() => import('@/components/pages/Workflows'));
const WorkflowDetail = lazy(() => import('@/components/pages/WorkflowDetail'));

export const workflowRoutes = [
  {
    path: '/workflows',
    element: <Workflows />,
    index: false
  },
  {
    path: '/workflows/:id',
    element: <WorkflowDetail />,
    index: false
  }
];