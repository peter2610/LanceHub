'use client';

import React, { useState, useEffect } from 'react';
import { useMockAuth } from '@/modules/shared/providers/MockAuthContext';
import Button from '@/modules/shared/components/Button';
import Card from '@/modules/shared/components/Card';
import Modal from '@/modules/shared/components/Modal';
import Badge from '@/modules/shared/components/Badge';
import ProgressBar from '@/modules/shared/components/ProgressBar';
import { useToast } from '@/modules/shared/components/Toast';
import EnhancedTable, { writerTableColumns } from '@/modules/shared/components/EnhancedTable';
import { useAssignments } from '@/modules/shared/providers/AssignmentContext';


export default function WriterDashboard() {
  const { user } = useMockAuth();
  const { getWriterAssignments, writerUploadAssignment, writerUpholdAssignment } = useAssignments();
  const assignments = getWriterAssignments();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [upholdAssignment, setUpholdAssignment] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const { addToast, ToastContainer } = useToast();

  const handleDownloadAssignment = (assignmentId) => {
    setSelectedAssignment(null);
    setUpholdAssignment(null);
    
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      const link = document.createElement('a');
      link.href = assignment.downloadUrl;
      link.download = `${assignment.id}_requirements.pdf`;
      link.click();
      addToast('Download started', 'success');
    }
  };

  const handleUploadAssignment = (assignmentId) => {
    writerUploadAssignment(assignmentId);
    setUploadFile(null);
    setSelectedAssignment(null);
    addToast('Assignment uploaded successfully!', 'success');
  };

  const handleUpholdAssignment = (assignmentId) => {
    setSelectedAssignment(null);
    setUpholdAssignment(assignments.find(a => a.id === assignmentId));
    setUploadFile(null);
  };

  const handleUpholdSubmit = () => {
    if (upholdAssignment && uploadFile) {
      writerUpholdAssignment(upholdAssignment.id);
      setUpholdAssignment(null);
      setUploadFile(null);
      addToast('Assignment upheld successfully!', 'success');
    } else {
      addToast('Please select a file to upload', 'warning');
    }
  };

  const getStatusColor = (status) => {
    return 'bg-white text-black border border-black';
  };

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <h1>Writer Dashboard</h1>
          <p>Manage your assignments and track your progress</p>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          {/* Recent Assignments Cards - Show only 3 most recent */}
          <h2 className="text-2xl font-bold mb-6">Recent Assignments</h2>
          {assignments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No Assignments Yet</h3>
              <p className="text-gray-600">You haven't been assigned any assignments yet. Check back later!</p>
            </div>
          ) : (
            <div className="services-grid">
              {assignments.slice(0, 3).map((assignment) => (
                <Card key={assignment.id} hover={true} className="relative">
                  <div className="service-icon">📝</div>
                  <h3 className="text-black">{assignment.id}</h3>
                  <p className="text-black">
                    <strong>{assignment.title}</strong><br/>
                    {assignment.client_name || assignment.clientName} - ${assignment.amount}
                  </p>
                  <div className="mt-4">
                    <Badge variant="outline" size="sm">
                      {assignment.status}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    {assignment.status === 'ASSIGNED' && (
                      <>
                        <Button
                          onClick={() => handleDownloadAssignment(assignment.id)}
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          📥 Download
                        </Button>
                        <Button
                          onClick={() => handleUpholdAssignment(assignment.id)}
                          variant="primary"
                          size="sm"
                          className="w-full"
                        >
                          ✅ Uphold
                        </Button>
                      </>
                    )}
                    {assignment.status === 'IN_PROGRESS' && (
                      <Button
                        onClick={() => {
                          setUpholdAssignment(null);
                          setSelectedAssignment(assignments.find(a => a.id === assignment.id));
                        }}
                        variant="primary"
                        size="sm"
                        className="w-full"
                      >
                        📤 Upload
                      </Button>
                    )}
                    {assignment.status === 'COMPLETED' && (
                      <div className="w-full text-center">
                        <Badge variant="success" className="w-full">
                          ✅ Completed
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
          {/* All Assignments Table */}
          {assignments.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">All Assignments</h2>
              <EnhancedTable 
                data={assignments}
                columns={writerTableColumns}
                striped={true}
                hover={true}
                compact={true}
              />
            </div>
          )}
        </div>
      </section>

      {/* Upload Modal */}
      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title="Upload Completed Assignment"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-black mb-2">
              Assignment: <span className="font-medium">{selectedAssignment?.id}</span>
            </p>
            <p className="text-sm text-black mb-2">
              Client: <span className="font-medium">{selectedAssignment?.clientName}</span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Upload File
            </label>
            <input
              type="file"
              className="w-full px-4 py-3 border border-black rounded-lg bg-white text-black"
              accept=".pdf,.doc,.docx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Notes (optional)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-black rounded-lg bg-white text-black"
              rows={3}
              placeholder="Any notes about the completed assignment..."
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={() => setSelectedAssignment(null)}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleUploadAssignment(selectedAssignment.id);
              setSelectedAssignment(null);
            }}
            variant="primary"
          >
            Submit
          </Button>
        </div>
      </Modal>

      {/* Uphold Modal */}
      <Modal
        isOpen={!!upholdAssignment}
        onClose={() => {
          setUpholdAssignment(null);
          setUploadFile(null);
        }}
        title="Uphold Assignment"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-black mb-2">
              Assignment: <span className="font-medium">{upholdAssignment?.id}</span>
            </p>
            <p className="text-sm text-black mb-2">
              Client: <span className="font-medium">{upholdAssignment?.clientName}</span>
            </p>
            <p className="text-sm text-black mb-2">
              Title: <span className="font-medium">{upholdAssignment?.title}</span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Upload Your Work Sample or Initial Draft
            </label>
            <input
              type="file"
              className="w-full px-4 py-3 border border-black rounded-lg bg-white text-black"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Message to Client (optional)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-black rounded-lg bg-white text-black"
              rows={3}
              placeholder="Let the client know about your approach and timeline..."
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={() => {
              setUpholdAssignment(null);
              setUploadFile(null);
            }}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpholdSubmit}
            disabled={!uploadFile}
            variant="primary"
          >
            Uphold Assignment
          </Button>
        </div>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
