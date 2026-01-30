'use client';

import RoleBasedRoute from '@/modules/shared/components/RoleBasedRoute';
import AdminDashboard from '@/modules/features/admin/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <RoleBasedRoute requiredRole="ADMIN">
      <AdminDashboard />
    </RoleBasedRoute>
  );
}
