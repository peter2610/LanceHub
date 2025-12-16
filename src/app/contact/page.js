export default function Contact() {
  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with our team</p>
        </div>
      </section>

      <section className="services-section">
        <div className="container" style={{maxWidth: '600px'}}>
          <form style={{background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Name</label>
              <input type="text" placeholder="Your name" required />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Email</label>
              <input type="email" placeholder="your@email.com" required />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Subject</label>
              <input type="text" placeholder="Message subject" required />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Message</label>
              <textarea placeholder="Your message..." rows="5" required></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
}
