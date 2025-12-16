"use client";

import { useState } from "react";
import Link from "next/link";

export default function Submission() {
  const [searchId, setSearchId] = useState("");

  // MOCK DATA (later comes from backend)
  const assignments = [
    {
      id: "LH-2025-001",
      title: "React Research Paper",
      status: "onProgress",
    },
    {
      id: "LH-2025-002",
      title: "Business Proposal",
      status: "done",
    },
    {
      id: "LH-2025-003",
      title: "Marketing Essay",
      status: "approved",
    },
    {
      id: "LH-2025-004",
      title: "AI Case Study",
      status: "pending",
    },
  ];

  const filteredAssignments = assignments.filter((a) =>
    a.id.toLowerCase().includes(searchId.toLowerCase())
  );

  const statusColor = (status) => {
    if (status === "approved") return "green";
    if (status === "done") return "orange";
    if (status === "pending") return "gray";
    return "blue";
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero-section">
        <div className="container">
          <h1>Your Submissions</h1>
          <p>Track, pay, and download your assignments</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="services-section">
        <div className="container">

          {/* SEARCH */}
          <div style={{ maxWidth: "400px", margin: "0 auto 2rem" }}>
            <input
              type="text"
              placeholder="Search by Assignment ID (e.g. LH-2025-001)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>

          {/* ASSIGNMENT LIST */}
          <div className="services-grid">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="service-card">

                <h3>{assignment.title}</h3>
                <p><strong>ID:</strong> {assignment.id}</p>

                <p style={{ marginTop: "0.5rem" }}>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: statusColor(assignment.status) }}>
                    {assignment.status}
                  </span>
                </p>

                {/* ACTIONS */}
                <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>

                  {/* DOWNLOAD */}
                  {assignment.status === "approved" && (
                    <>
                      <Link
                        href={`/downloads/${assignment.id}.pdf`}
                        className="btn btn-primary"
                      >
                        Download Assignment
                      </Link>

                      <Link
                        href={`/proofs/${assignment.id}-receipt.pdf`}
                        className="btn btn-secondary"
                      >
                        Get Proof (PDF)
                      </Link>
                    </>
                  )}

                  {/* PAY */}
                  {assignment.status === "done" && (
                    <Link
                      href={`/payment/${assignment.id}`}
                      className="btn btn-primary"
                    >
                      Make Payment
                    </Link>
                  )}

                  {/* INFO */}
                  {assignment.status === "pending" && (
                    <span style={{ fontWeight: "600" }}>
                      Payment Pending Approval
                    </span>
                  )}

                  {assignment.status === "onProgress" && (
                    <span style={{ fontWeight: "600" }}>
                      Work in Progress
                    </span>
                  )}

                </div>
              </div>
            ))}

            {filteredAssignments.length === 0 && (
              <p style={{ textAlign: "center" }}>
                No assignment found with that ID.
              </p>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
