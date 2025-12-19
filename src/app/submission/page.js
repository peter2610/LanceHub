"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMockAuth } from "@/context/MockAuthContext";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

const STATUS_META = {
  CREATED: {
    label: "Pending",
    color: "bg-blue-100 text-blue-800",
    message: "In queue. Writer will pick it shortly.",
  },
  ON_PROGRESS: {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800",
    message: "Writer is working on your assignment.",
  },
  DONE: {
    label: "Ready for Payment",
    color: "bg-orange-100 text-orange-800",
    message: "Complete. Pay to unlock downloads.",
  },
  PAYMENT_PENDING: {
    label: "Payment Pending",
    color: "bg-purple-100 text-purple-800",
    message: "Payment received. Finance review in progress.",
  },
  PAID: {
    label: "Payment Approved",
    color: "bg-green-100 text-green-800",
    message: "Payment approved. Final checks in progress.",
  },
  READY: {
    label: "Ready",
    color: "bg-green-100 text-green-800",
    message: "Downloads unlocked. Proofs available.",
  },
};

const PAYMENT_METHOD_ICON = {
  paypal: "",
  card: "",
  bank: "",
  mpesa: "",
};

const ACTION_STATUSES = ["DONE", "PAYMENT_PENDING"];
const IN_PROGRESS_STATUSES = ["CREATED", "ON_PROGRESS"];
const COMPLETED_STATUSES = ["PAID", "READY"];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function Submission() {
  const { isAuthenticated } = useMockAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      const callbackUrl = searchParams.get('callbackUrl') || '/submission';
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router, searchParams]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const assignments = useMemo(
    () => [
      {
        id: "LH-2025-001",
        title: "Research Paper on Machine Learning in Healthcare",
        status: "ON_PROGRESS",
        amount: 85,
        dueDate: "2025-01-17",
        updatedAt: "2025-12-16",
        paymentMethod: "paypal",
        pages: 5,
        deadline: "48 hours",
        subject: "Computer Science",
      },
      {
        id: "LH-2025-002",
        title: "Business Plan for Startup",
        status: "DONE",
        amount: 120,
        dueDate: "2025-01-11",
        updatedAt: "2025-12-14",
        paymentMethod: "card",
        pages: 8,
        deadline: "3 days",
        subject: "Business",
      },
      {
        id: "LH-2025-003",
        title: "Marketing Strategy Analysis",
        status: "READY",
        amount: 68,
        dueDate: "2025-01-03",
        updatedAt: "2025-12-12",
        paymentMethod: "mpesa",
        downloadUrl: "#",
        proofUrl: "#",
        pages: 4,
        deadline: "24 hours",
        subject: "Marketing",
      },
    ],
    []
  );

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch =
        assignment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTION" && ACTION_STATUSES.includes(assignment.status)) ||
        (statusFilter === "IN_PROGRESS" && IN_PROGRESS_STATUSES.includes(assignment.status)) ||
        (statusFilter === "COMPLETED" && COMPLETED_STATUSES.includes(assignment.status));

      return matchesSearch && matchesStatus;
    });
  }, [assignments, searchQuery, statusFilter]);

  const handleDownload = useCallback((id, type) => {
    setToast({
      type: "success",
      message: `Preparing ${type} download for ${id}...`,
    });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handlePayment = useCallback((id) => {
    setToast({
      type: "info",
      message: `Processing payment for ${id}...`,
    });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <div className="submission-container">
      <header className="submission-header">
        <h1 className="submission-title">My Assignments</h1>
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search assignments by ID, title, or subject..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTION">Action Required</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </header>

      {filteredAssignments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="text-lg font-medium mb-2">No assignments found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="assignments-grid">
          {filteredAssignments.map((assignment) => {
            const meta = STATUS_META[assignment.status] || STATUS_META.CREATED;
            const canPay = assignment.status === "DONE";
            const isReady = assignment.status === "READY";

            return (
              <div key={assignment.id} className="assignment-card">
                <div className="card-header">
                  <div className="flex items-start justify-between">
                    <h3 className="card-title">{assignment.title}</h3>
                    <span className={`status-badge ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="card-meta">
                    <span>ID: {assignment.id}</span>
                    <span>•</span>
                    <span>{assignment.subject}</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="detail-row">
                    <span className="detail-label">Amount</span>
                    <span className="detail-value font-semibold text-blue-600">
                      {formatCurrency(assignment.amount)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Deadline</span>
                    <span className="detail-value">{assignment.deadline}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Pages</span>
                    <span className="detail-value">{assignment.pages}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Payment Method</span>
                    <span className="detail-value">
                      {PAYMENT_METHOD_ICON[assignment.paymentMethod] ||
                        assignment.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  {canPay ? (
                    <button
                      onClick={() => handlePayment(assignment.id)}
                      className="btn btn-primary"
                    >
                      Pay Now
                    </button>
                  ) : isReady ? (
                    <>
                      <button
                        onClick={() => handleDownload(assignment.id, "document")}
                        className="btn btn-primary"
                      >
                        Download
                      </button>
                      {assignment.proofUrl && (
                        <button
                          onClick={() => handleDownload(assignment.id, "proof")}
                          className="btn btn-outline"
                        >
                          Get Proof
                        </button>
                      )}
                    </>
                  ) : (
                    <button className="btn btn-disabled" disabled>
                      {meta.label}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type === "success" ? "bg-green-500" : "bg-blue-500"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
