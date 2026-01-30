'use client';

import RoleBasedRoute from '@/modules/shared/components/RoleBasedRoute';
import WriterDashboard from '@/modules/features/writer/WriterDashboard';

export default function WriterDashboardPage() {
  return (
    <RoleBasedRoute requiredRole="WRITER">
      <WriterDashboard />
    </RoleBasedRoute>
  );
}
