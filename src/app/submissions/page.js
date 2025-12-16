"use client";
import { useState } from "react";
import Link from "next/link";

export default function Submission() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [assignmentUploaded, setAssignmentUploaded] = useState(false);

  // Simulated assignment
  const assignment = {
    title: "Research Paper on React",
    description: "Complete the research paper following instructions.",
    fileUrl: "/assignments/sample-assignment.pdf", // placeholder
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setAssignmentUploaded(true);
    alert("Assignment uploaded successfully!");
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    alert(`Redirecting to ${paymentMethod} payment gateway...`);
    // Integrate PayPal / Stripe here
  };

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <h1>Submission</h1>
          <p>View assignments, make payments, and download proofs</p>
        </div>
      </section>

      <section className="services-section">
        <div className="container" style={{ maxWidth: '600px' }}>
          {/* Assignment Info */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2>{assignment.title}</h2>
            <p>{assignment.description}</p>
            <Link href={assignment.fileUrl} target="_blank" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Download Assignment
            </Link>
          </div>

          {/* Payment Section */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2>Make Payment</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                <input type="radio" name="payment" value="PayPal" onChange={(e) => setPaymentMethod(e.target.value)} /> PayPal
              </label>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                <input type="radio" name="payment" value="Stripe" onChange={(e) => setPaymentMethod(e.target.value)} /> Stripe
              </label>
            </div>
            <button className="btn btn-primary" onClick={handlePayment} style={{ width: '100%' }}>Pay Now</button>
          </div>

          {/* Upload Completed Assignment */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2>Upload Completed Assignment</h2>
            <form onSubmit={handleUpload}>
              <input type="file" required style={{ marginBottom: '1rem', width: '100%' }} />
              <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Upload</button>
            </form>
            {assignmentUploaded && <p>Assignment uploaded successfully!</p>}
          </div>

          {/* Proof Section */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2>Download Proofs</h2>
            <Link href="/proofs/receipt.pdf" target="_blank" className="btn btn-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Get Payment Receipt
            </Link>
            <Link href="/assignments/completed-assignment.pdf" target="_blank" className="btn btn-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Download Completed Assignment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
