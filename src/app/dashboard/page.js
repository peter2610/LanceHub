'use client';

import { useMockAuth } from '@/context/MockAuthContext';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useMockAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.name || 'User'}!</h2>
        <p className="text-gray-600 mb-6">
          You are logged in as <span className="font-medium">{user?.role}</span>.
        </p>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Your Profile</h3>
            <p className="text-blue-700">View and update your personal information</p>
            <div className="mt-4">
              <Link
                href="/dashboard/profile"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                View Profile →
              </Link>
            </div>
          </div>

          {(user?.role === 'WRITER' || user?.role === 'ADMIN') && (
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 mb-2">Writer Dashboard</h3>
              <p className="text-green-700">Manage your articles, drafts, and submissions</p>
              <div className="mt-4">
                <Link
                  href="/dashboard/writer"
                  className="text-green-600 hover:text-green-500 font-medium"
                >
                  Go to Writer Panel →
                </Link>
              </div>
            </div>
          )}

          {user?.role === 'ADMIN' && (
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800 mb-2">Admin Panel</h3>
              <p className="text-purple-700">Manage users, content, and site settings</p>
              <div className="mt-4">
                <Link
                  href="/dashboard/admin"
                  className="text-purple-600 hover:text-purple-500 font-medium"
                >
                  Go to Admin Panel →
                </Link>
              </div>
            </div>
          )}

          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-orange-800 mb-2">Submit Assignment</h3>
            <p className="text-orange-700">Submit a new assignment for our writers to work on</p>
            <div className="mt-4">
              <Link
                href="/submission"
                className="text-orange-600 hover:text-orange-500 font-medium"
              >
                Submit New Assignment →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
