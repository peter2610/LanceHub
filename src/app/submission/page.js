"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

const STATUS_META = {
  CREATED: {
    label: "Pending",
    textColor: "#2F2F45",
    pill: "rgba(47,47,69,0.1)",
    message: "In queue. Writer will pick it shortly.",
  },
  ON_PROGRESS: {
    label: "In Progress",
    textColor: "#0E79FF",
    pill: "rgba(14,121,255,0.15)",
    message: "Writer is working on your assignment.",
  },
  DONE: {
    label: "Ready for Payment",
    textColor: "#FF922B",
    pill: "rgba(255,146,43,0.18)",
    message: "Complete. Pay to unlock downloads.",
  },
  PAYMENT_PENDING: {
    label: "Payment Pending",
    textColor: "#7D3BFF",
    pill: "rgba(125,59,255,0.15)",
    message: "Payment received. Finance review in progress.",
  },
  PAID: {
    label: "Payment Approved",
    textColor: "#1F8A70",
    pill: "rgba(31,138,112,0.16)",
    message: "Payment approved. Final checks in progress.",
  },
  READY: {
    label: "Ready for Download",
    textColor: "#0EAD69",
    pill: "rgba(14,173,105,0.18)",
    message: "Downloads unlocked. Proofs available.",
  },
};

const PAYMENT_METHOD_ICON = {
  paypal: "🅿️",
  card: "💳",
  bank: "🏦",
  mpesa: "📱",
};

const PAYMENT_OPTIONS = [
  { id: "paypal", label: "PayPal", enabled: true },
  { id: "card", label: "Card", enabled: false },
  { id: "bank", label: "Bank", enabled: false },
  { id: "mpesa", label: "M-Pesa", enabled: false },
];

const STEP_FLOW = [
  { id: "submit", label: "Submit" },
  { id: "track", label: "Track" },
  { id: "pay", label: "Pay" },
  { id: "download", label: "Download" },
  { id: "proof", label: "Proof" },
];

const FILTER_OPTIONS = [
  { id: "ALL", label: "All" },
  { id: "ACTION", label: "Needs Action" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "COMPLETED", label: "Completed" },
];

const ACTION_STATUSES = ["DONE", "PAYMENT_PENDING"];
const IN_PROGRESS_STATUSES = ["CREATED", "ON_PROGRESS"];
const COMPLETED_STATUSES = ["PAID", "READY"];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value
  );

export default function Submission() {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toast, setToast] = useState(null);

  const initialAssignments = useMemo(
    () => [
      {
        id: "LH-2025-001",
        title: "React State Management Paper",
        status: "ON_PROGRESS",
        amount: 85,
        dueDate: "Jan 17, 2025",
        updatedAt: "Dec 16, 2025",
        paymentMethod: "paypal",
      },
      {
        id: "LH-2025-002",
        title: "Business Proposal",
        status: "DONE",
        amount: 120,
        dueDate: "Jan 11, 2025",
        updatedAt: "Dec 14, 2025",
        paymentMethod: "paypal",
      },
      {
        id: "LH-2025-003",
        title: "Marketing Essay",
        status: "READY",
        amount: 68,
        dueDate: "Jan 03, 2025",
        updatedAt: "Dec 12, 2025",
        paymentMethod: "mpesa",
        downloadUrl: "/downloads/LH-2025-003.pdf",
        proofUrl: "/proofs/LH-2025-003-receipt.pdf",
      },
      {
        id: "LH-2025-004",
        title: "AI Case Study",
        status: "CREATED",
        amount: 150,
        dueDate: "Jan 25, 2025",
        updatedAt: "Dec 17, 2025",
        paymentMethod: "card",
      },
      {
        id: "LH-2025-005",
        title: "UX Research Brief",
        status: "PAID",
        amount: 95,
        dueDate: "Jan 05, 2025",
        updatedAt: "Dec 16, 2025",
        paymentMethod: "paypal",
      },
      {
        id: "LH-2025-006",
        title: "Data Privacy Whitepaper",
        status: "PAYMENT_PENDING",
        amount: 180,
        dueDate: "Jan 30, 2025",
        updatedAt: "Dec 15, 2025",
        paymentMethod: "paypal",
      },
    ],
    []
  );

  const [assignments, setAssignments] = useState(initialAssignments);

  const actionableAssignments = assignments.filter((assignment) =>
    ACTION_STATUSES.includes(assignment.status)
  );
  const nextActionAssignment = actionableAssignments[0];
  const totalActionDue = actionableAssignments.reduce(
    (sum, assignment) => sum + assignment.amount,
    0
  );

  const currentStepId = actionableAssignments.length
    ? "pay"
    : assignments.some((assignment) => assignment.status === "READY")
    ? "download"
    : assignments.some((assignment) =>
        ["ON_PROGRESS", "CREATED"].includes(assignment.status)
      )
    ? "track"
    : "submit";
  const currentStepIndex = STEP_FLOW.findIndex(
    (step) => step.id === currentStepId
  );

  const statusFilteredAssignments = assignments.filter((assignment) => {
    if (statusFilter === "ACTION") {
      return ACTION_STATUSES.includes(assignment.status);
    }
    if (statusFilter === "IN_PROGRESS") {
      return IN_PROGRESS_STATUSES.includes(assignment.status);
    }
    if (statusFilter === "COMPLETED") {
      return COMPLETED_STATUSES.includes(assignment.status);
    }
    return true;
  });

  const filteredAssignments = statusFilteredAssignments.filter((assignment) =>
    assignment.id.toLowerCase().includes(searchId.toLowerCase())
  );

  const exactMatch = statusFilteredAssignments.find(
    (assignment) =>
      searchId &&
      assignment.id.toLowerCase() === searchId.trim().toLowerCase()
  );

  const handleScrollToAssignment = useCallback((assignmentId) => {
    const el = document.getElementById(`assignment-${assignmentId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleDownload = (assignmentId, type) => {
    alert(`${type} download unlocked for ${assignmentId} (mock action).`);
  };

  return (
    <div className="submission-shell">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <p>{toast.text}</p>
        </div>
      )}
      {/* HERO */}
      <section className="hero-section submission-hero">
        <div className="container">
          <p className="eyebrow">Assignment lifecycle</p>
          <h1>Your Submission Dashboard</h1>
          <p>
            Track progress, settle payments, and download proofs without leaving
            LanceHub.
          </p>
          <div className="stepper">
            {STEP_FLOW.map((step, index) => {
              const state =
                index < currentStepIndex
                  ? "complete"
                  : index === currentStepIndex
                  ? "active"
                  : "upcoming";
              return (
                <div key={step.id} className={`step ${state}`}>
                  <span className="step-dot" />
                  <p>{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="submission-page">
        <div className="container">
          <div className="submission-layout">
            <div className="sidebar">
              <div className="summary-card">
                {nextActionAssignment ? (
                  <>
                    <p className="summary-eyebrow">⚡ Next action required</p>
                    <h3>
                      {actionableAssignments.length} assignment
                      {actionableAssignments.length > 1 ? "s" : ""} need payment
                    </h3>
                    <p className="summary-total">
                      Total due: {formatCurrency(totalActionDue)}
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        handleScrollToAssignment(nextActionAssignment.id)
                      }
                    >
                      Pay now
                    </button>
                  </>
                ) : (
                  <>
                    <p className="summary-eyebrow">✅ All clear</p>
                    <h3>All assignments are on track</h3>
                    <p className="subtle-note">
                      We’ll notify you as soon as a payment or download is
                      required.
                    </p>
                  </>
                )}
              </div>

              <div className="search-panel sticky">
                <label htmlFor="assignment-search">Assignment ID search</label>
                <input
                  id="assignment-search"
                  type="text"
                  placeholder="Search by Assignment ID (e.g. LH-2025-001)"
                  value={searchId}
                  onChange={(event) => setSearchId(event.target.value)}
                />
                <p className="search-hint">
                  Search requires login + assignment ownership. Results only show
                  status, never files.
                </p>
                {exactMatch && (
                  <div className="search-result-card">
                    <div>
                      <p className="assignment-id">{exactMatch.id}</p>
                      <p className="result-title">{exactMatch.title}</p>
                    </div>
                    <div className="result-meta">
                      <span
                        className={`status-pill status-${exactMatch.status.toLowerCase()}`}
                      >
                        {STATUS_META[exactMatch.status]?.label ?? "Unknown"}
                      </span>
                      <p>
                        {STATUS_META[exactMatch.status]?.message ??
                          "Status unavailable"}
                      </p>
                    </div>
                  </div>
                )}
                <div className="status-legend">
                  {Object.entries(STATUS_META).map(([status, meta]) => (
                    <div key={status} className="legend-item">
                      <span
                        className="status-dot"
                        style={{ backgroundColor: meta.textColor }}
                      />
                      <div>
                        <p>{meta.label}</p>
                        <small>{meta.message}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="support-banner">
                  Need help?{" "}
                  <Link href="/contact" className="text-link">
                    Talk to our support desk →
                  </Link>
                </div>
              </div>
            </div>

            {/* ASSIGNMENT LIST */}
            <div className="assignments-column">
              <div className="filter-bar">
                <p>Filter:</p>
                <div className="filter-buttons">
                  {FILTER_OPTIONS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      className={`filter-chip${
                        statusFilter === filter.id ? " active" : ""
                      }`}
                      onClick={() => setStatusFilter(filter.id)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="assignments-grid">
                {filteredAssignments.map((assignment) => {
                  const meta =
                    STATUS_META[assignment.status] ?? STATUS_META.CREATED;
                  const canDownload = assignment.status === "READY";
                  const canPay = assignment.status === "DONE";

                  return (
                    <article
                      key={assignment.id}
                      id={`assignment-${assignment.id}`}
                      className="assignment-card"
                    >
                      <header className="card-header">
                        <div>
                          <p className="assignment-id">
                            🆔 {assignment.id}
                          </p>
                          <h3>{assignment.title}</h3>
                        </div>
                        <span
                          className={`status-pill status-${assignment.status.toLowerCase()}`}
                        >
                          {meta.label}
                        </span>
                      </header>

                      <div className="card-body">
                        <ul className="meta-list">
                          <li>
                            <span>💰 Amount</span>
                            <strong>
                              {formatCurrency(assignment.amount)}
                            </strong>
                          </li>
                          <li>
                            <span>📅 Due</span>
                            <strong>{assignment.dueDate}</strong>
                          </li>
                          <li>
                            <span>🕒 Last update</span>
                            <strong>{assignment.updatedAt}</strong>
                          </li>
                          <li>
                            <span>💳 Payment</span>
                            <strong>
                              {PAYMENT_METHOD_ICON[assignment.paymentMethod] ??
                                "💼"}{" "}
                              {assignment.paymentMethod?.toUpperCase()}
                            </strong>
                          </li>
                        </ul>
                        <p className="status-message">{meta.message}</p>
                        {assignment.status === "PAYMENT_PENDING" && (
                          <div className="info-stack neutral">
                            <p className="info-title">
                              ⏳ Finance review in progress
                            </p>
                            <p className="subtle-note">
                              Average approval time: under 20 minutes. We’ll
                              email you once downloads unlock.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="cta-row">
                        {canPay && (
                          <div className="payment-stack">
                            <div className="payment-select-wrapper">
                              <label htmlFor={`quick-select-${assignment.id}`}>
                                Select payment method
                              </label>
                              <div className="select-wrapper">
                                <span className="select-icon">
                                  {PAYMENT_METHOD_ICON[currentMethod] ?? "💼"}
                                </span>
                                <select
                                  id={`quick-select-${assignment.id}`}
                                  value={currentMethod}
                                  onChange={(event) =>
                                    handlePaymentMethodChange(
                                      assignment.id,
                                      event.target.value
                                    )
                                  }
                                >
                                  {PAYMENT_OPTIONS.map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.label}
                                      {!option.enabled ? " — contact support" : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {currentMethod && (
                              <div className="payment-notice">
                                <p className="notice-text">Payment processing will be available once the assignment is ready for payment.</p>
                              </div>
                            )}
                          </div>
                        )}

                        {canDownload ? (
                          <div className="download-stack ready">
                            <p className="stack-title">Download center</p>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() =>
                                handleDownload(
                                  assignment.id,
                                  "Assignment file"
                                )
                              }
                            >
                              ⬇ Download assignment
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() =>
                                handleDownload(
                                  assignment.id,
                                  "Proof of payment"
                                )
                              }
                            >
                              ⬇ Download proof (PDF)
                            </button>
                          </div>
                        ) : (
                          <div className="info-stack locked">
                            <p className="info-title">
                              🔒 Downloads locked
                            </p>
                            <p className="subtle-note">
                              Downloads unlock automatically once payment is
                              approved and status becomes READY.
                            </p>
                          </div>
                        )}
                      </div>

                    </article>
                  );
                })}

                {filteredAssignments.length === 0 && (
                  <div className="empty-state">
                    <p>No assignment found with that criteria.</p>
                    <p className="subtle-note">
                      Double-check the ID from your confirmation email or reset
                      the filters above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
