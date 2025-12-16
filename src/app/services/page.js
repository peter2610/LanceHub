export default function Services() {
  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <h1>Our Services</h1>
          <p>Professional writing solutions tailored to your needs</p>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="services-grid">
            {[
              { title: 'Academic Writing', description: 'Essays, research papers, dissertations, and thesis writing by subject experts.', icon: '📚' },
              { title: 'Content Creation', description: 'Engaging blog posts, articles, web copy, and marketing content.', icon: '✍️' },
              { title: 'Business Documents', description: 'Professional reports, proposals, business plans, and communications.', icon: '💼' },
              { title: 'Editing & Proofreading', description: 'Comprehensive editing, proofreading, and formatting services.', icon: '✏️' },
              { title: 'Copywriting', description: 'Persuasive copy for ads, emails, landing pages, and more.', icon: '📝' },
              { title: 'Technical Writing', description: 'User manuals, documentation, guides, and technical specifications.', icon: '⚙️' }
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
    </div>
  );
}
