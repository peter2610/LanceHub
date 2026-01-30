export default function ServicesSection() {
  return (
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
  );
}
