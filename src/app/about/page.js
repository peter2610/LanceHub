export default function About() {
  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <h1>About LanceHub</h1>
          <p>Your trusted partner for professional writing services</p>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <h2>Who We Are</h2>
          <p style={{maxWidth: '800px', margin: '2rem auto', fontSize: '1.1rem', lineHeight: '1.8'}}>
            LanceHub is a leading platform connecting clients with professional writers and content creators. 
            We specialize in delivering high-quality written content across various industries and niches. 
            Our team of experienced writers is dedicated to meeting your deadlines and exceeding your expectations.
          </p>
          
          <h2 style={{marginTop: '3rem'}}>Why Choose Us?</h2>
          <div className="services-grid" style={{marginTop: '2rem'}}>
            {[
              { title: 'Expert Writers', description: 'Vetted professionals with years of experience', icon: '⭐' },
              { title: 'Fast Turnaround', description: 'Quick delivery without compromising quality', icon: '⚡' },
              { title: '100% Original', description: 'Plagiarism-free content guaranteed', icon: '✓' },
              { title: '24/7 Support', description: 'Always available to assist you', icon: '💬' }
            ].map((item, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
