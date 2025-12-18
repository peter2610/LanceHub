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
    <div className="submission-container">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <p>{toast.text}</p>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="checkout-progress">
        {['Order', 'Shipping', 'Payment', 'Review'].map((step, index) => (
          <div key={step} className={`progress-step ${index === 2 ? 'active' : index < 2 ? 'completed' : ''}`}>
            <div className="step-number">{index < 2 ? '✓' : index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>

      {/* Items Section */}
      <div className="items-section">
        <h2>Items</h2>
        {filteredAssignments.map((assignment) => {
          const meta = STATUS_META[assignment.status] ?? STATUS_META.CREATED;
          const canPay = assignment.status === "DONE";
          const isPaid = ["PAID", "READY"].includes(assignment.status);
          
          return (
            <div key={assignment.id} className="item-card">
              <div className="item-image">📄</div>
              <div className="item-details">
                <div className="item-title">{assignment.title}</div>
                <div className="item-description">{meta.message}</div>
                <div className="item-meta">
                  <span>ID: {assignment.id}</span>
                  <span>Due: {assignment.dueDate}</span>
                  <span>Payment: {assignment.paymentMethod?.toUpperCase()}</span>
                </div>
              </div>
              <div className="item-price">{formatCurrency(assignment.amount)}</div>
              <div className="item-actions">
                <div className="quantity-control">
                  <button className="quantity-btn">-</button>
                  <span className="quantity-value">1</span>
                  <button className="quantity-btn">+</button>
                </div>
                {canPay ? (
                  <button className="pay-item-btn">
                    Pay with PayPal
                  </button>
                ) : isPaid ? (
                  <button className="pay-item-btn" disabled>
                    Paid
                  </button>
                ) : (
                  <button className="pay-item-btn" disabled>
                    {meta.label}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div>
        <div className="order-summary">
          <h3>Order summary</h3>
          <div className="summary-row">
            <span className="summary-label">Subtotal</span>
            <span className="summary-value">{formatCurrency(
              filteredAssignments.reduce((sum, assignment) => sum + assignment.amount, 0)
            )}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Discount</span>
            <span className="summary-value">-$0.00</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Shipping</span>
            <span className="summary-value">Free</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Total</span>
            <span className="summary-value">{formatCurrency(
              filteredAssignments.reduce((sum, assignment) => sum + assignment.amount, 0)
            )}</span>
          </div>
        </div>

        {/* Checkout Section */}
        <div className="checkout-section">
          <h3>Checkout</h3>
          <div className="payment-methods">
            <div className="payment-method active">PayPal</div>
            <div className="payment-method disabled">Mastercard</div>
            <div className="payment-method disabled">Visa</div>
          </div>
          <button className="pay-now-btn">
            Pay now
          </button>
        </div>
      </div>
    </div>
  );
}
