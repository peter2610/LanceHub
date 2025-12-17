"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PayPalButtons } from "@paypal/react-paypal-js";

const STATUS_META = {
  CREATED: {
    label: "Pending",
    textColor: "#2F2F45",
    pill: "rgba(47,47,69,0.1)",
    message: "Your assignment is in queue. A writer will pick it shortly.",
  },
  ON_PROGRESS: {
    label: "In Progress",
    textColor: "#0E79FF",
    pill: "rgba(14,121,255,0.15)",
    message: "Your assignment is currently being worked on.",
  },
  DONE: {
    label: "Ready for Payment",
    textColor: "#FF922B",
    pill: "rgba(255,146,43,0.18)",
    message: "Your assignment is ready. Please complete payment to unlock downloads.",
  },
  PAYMENT_PENDING: {
    label: "Payment Pending",
    textColor: "#6B6B7A",
    pill: "rgba(107,107,122,0.15)",
    message: "Payment received. Waiting for finance approval.",
  },
  PAID: {
    label: "Payment Approved",
    textColor: "#1F8A70",
    pill: "rgba(31,138,112,0.16)",
    message: "Payment approved. Final checks before download unlock.",
  },
  READY: {
    label: "Ready for Download",
    textColor: "#0EAD69",
    pill: "rgba(14,173,105,0.18)",
    message: "Assignment ready for download. Proofs available below.",
  },
};

const PAYMENT_METHOD_ICON = {
  paypal: "🅿️",
  card: "💳",
  mpesa: "📱",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value
  );

export default function Submission() {
  const [searchId, setSearchId] = useState("");
  const [paymentNotice, setPaymentNotice] = useState(null);
  const [paypalLoadingId, setPaypalLoadingId] = useState(null);

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

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.id.toLowerCase().includes(searchId.toLowerCase())
  );

  const exactMatch = assignments.find(
    (assignment) =>
      searchId &&
      assignment.id.toLowerCase() === searchId.trim().toLowerCase()
  );

  const payPalClientConfigured = Boolean(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  );

  const handlePaymentSuccess = (orderId, assignmentId) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, status: "PAYMENT_PENDING", orderId }
          : assignment
      )
    );
    setPaymentNotice({
      assignmentId,
      orderId,
      text: "Payment captured. Finance will approve shortly.",
    });
    setPaypalLoadingId(null);
  };

  const handlePaymentError = (assignmentId) => {
    setPaymentNotice({
      assignmentId,
      text: "Payment failed or was cancelled. Please try again.",
    });
    setPaypalLoadingId(null);
  };

  const handleDownload = (assignmentId, type) => {
    alert(`${type} download unlocked for ${assignmentId} (mock action).`);
  };

  return (
    <div className="submission-shell">
      {/* HERO */}
      <section className="hero-section submission-hero">
        <div className="container">
          <p className="eyebrow">Submit → Track → Pay → Download → Proof</p>
          <h1>Your Submission Dashboard</h1>
          <p>
            Real-time assignment tracking, secured payments, and proof-of-work
            downloads once your order is READY.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="submission-page">
        <div className="container">
          <div className="submission-layout">
            {/* SEARCH + STATUS LEGEND */}
            <div className="search-panel">
              <label htmlFor="assignment-search">Assignment ID search</label>
              <input
                id="assignment-search"
                type="text"
                placeholder="Search by Assignment ID (e.g. LH-2025-001)"
                value={searchId}
                onChange={(event) => setSearchId(event.target.value)}
              />
              <p className="search-hint">
                Search always requires login + assignment ownership. Results only
                show status, never files.
              </p>
              {exactMatch && (
                <div className="search-result-card">
                  <div>
                    <p className="assignment-id">{exactMatch.id}</p>
                    <p className="result-title">{exactMatch.title}</p>
                  </div>
                  <div className="result-meta">
                    <span
                      className="status-badge"
                      style={{
                        color: STATUS_META[exactMatch.status]?.textColor,
                        background:
                          STATUS_META[exactMatch.status]?.pill ||
                          "rgba(0,0,0,0.08)",
                      }}
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

            {/* ASSIGNMENT LIST */}
            <div className="assignments-grid">
              {filteredAssignments.map((assignment) => {
                const meta =
                  STATUS_META[assignment.status] ??
                  STATUS_META.CREATED;
                const canDownload = assignment.status === "READY";
                const canPay = assignment.status === "DONE";
                const canShowProof = assignment.status === "READY";
                const noticeForAssignment =
                  paymentNotice?.assignmentId === assignment.id
                    ? paymentNotice
                    : null;

                return (
                  <article key={assignment.id} className="assignment-card">
                    <header className="card-header">
                      <div>
                        <p className="assignment-id">{assignment.id}</p>
                        <h3>{assignment.title}</h3>
                      </div>
                      <span
                        className="status-badge"
                        style={{
                          color: meta.textColor,
                          background: meta.pill,
                        }}
                      >
                        {meta.label}
                      </span>
                    </header>

                    <div className="card-body">
                      <div className="card-meta">
                        <div>
                          <p className="meta-label">Amount Due</p>
                          <p className="meta-value">
                            {formatCurrency(assignment.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="meta-label">Due</p>
                          <p className="meta-value">{assignment.dueDate}</p>
                        </div>
                        <div>
                          <p className="meta-label">Last update</p>
                          <p className="meta-value">{assignment.updatedAt}</p>
                        </div>
                        <div>
                          <p className="meta-label">Payment method</p>
                          <p className="meta-value">
                            {PAYMENT_METHOD_ICON[assignment.paymentMethod] ??
                              "💼"}{" "}
                            {assignment.paymentMethod?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <p className="status-message">{meta.message}</p>
                      {assignment.status === "PAYMENT_PENDING" && (
                        <p className="subtle-note">
                          Finance review SLA: &lt; 20 minutes. You will get an
                          email once READY.
                        </p>
                      )}
                    </div>

                    <div className="action-row">
                      <div className="download-stack">
                        <p>Download Center</p>
                        <div className="download-buttons">
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={!canDownload}
                            onClick={() =>
                              canDownload &&
                              handleDownload(assignment.id, "Assignment file")
                            }
                          >
                            {canDownload
                              ? "Download Assignment"
                              : "Download locked"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            disabled={!canShowProof}
                            onClick={() =>
                              canShowProof &&
                              handleDownload(assignment.id, "Proof of payment")
                            }
                          >
                            {canShowProof
                              ? "Download Proof (PDF)"
                              : "Proof available after approval"}
                          </button>
                        </div>
                      </div>

                      {canPay && (
                        <div className="payment-stack">
                          <p>Secure payment</p>
                          <p className="subtle-note">
                            PayPal sandbox enabled for MVP. Amount auto-fills
                            from the assignment card.
                          </p>
                          {payPalClientConfigured ? (
                            <PayPalButtons
                              style={{ layout: "horizontal", color: "gold" }}
                              disabled={paypalLoadingId === assignment.id}
                              createOrder={(data, actions) => {
                                setPaypalLoadingId(assignment.id);
                                return actions.order.create({
                                  purchase_units: [
                                    {
                                      amount: {
                                        value: assignment.amount.toFixed(2),
                                      },
                                      description: assignment.title,
                                      custom_id: assignment.id,
                                    },
                                  ],
                                });
                              }}
                              onApprove={async (data, actions) => {
                                const order = await actions.order.capture();
                                handlePaymentSuccess(order.id, assignment.id);
                              }}
                              onCancel={() => handlePaymentError(assignment.id)}
                              onError={() => handlePaymentError(assignment.id)}
                            />
                          ) : (
                            <div className="notice warning">
                              Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to enable
                              checkout.
                            </div>
                          )}
                        </div>
                      )}

                      {!canPay && !canDownload && (
                        <div className="info-stack">
                          <p className="subtle-note">
                            Payments unlock automatically once the writer marks
                            the assignment as DONE.
                          </p>
                        </div>
                      )}

                      {noticeForAssignment && (
                        <div className="notice success">
                          {noticeForAssignment.text}
                          {noticeForAssignment.orderId && (
                            <span> Ref: {noticeForAssignment.orderId}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}

              {filteredAssignments.length === 0 && (
                <p className="empty-state">
                  No assignment found with that ID. Verify the code from your
                  email receipt.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
