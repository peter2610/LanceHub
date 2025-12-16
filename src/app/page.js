import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <nav>
        <div className="container">
          <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#0066ff'}}>LanceHub</div>
          <div style={{display: 'flex', gap: '2rem'}}>
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/submit" className="btn btn-primary" style={{margin: 0}}>Submit</Link>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="container">
          <h1>Professional Writing Services</h1>
          <p>High-quality content delivered on time, every time</p>
          <div style={{marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <Link href="/submit" className="btn btn-primary">Submit Assignment</Link>
            <Link href="/services" className="btn btn-secondary">Our Services</Link>
          </div>
        </div>
      </section>

      <section id="services" className="services-section">
        <div className="container">
          <h2>What We Offer</h2>
          <div className="services-grid">
            {[
              {title: 'Academic Writing', description: 'Essays, research papers, and dissertations by subject experts.', icon: '📚'},
              {title: 'Content Creation', description: 'Engaging blog posts, articles, and web content.', icon: '✍️'},
              {title: 'Business Documents', description: 'Professional reports, proposals, and communications.', icon: '💼'}
            ].map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Submit your assignment today and receive high-quality work from our expert writers.</p>
          <Link href="/submit" className="btn btn-primary">Get Started Now</Link>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2024 LanceHub. All rights reserved.</p>
          <p>Professional Writing Services</p>
        </div>
      </footer>
    </div>
  );
}