import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Professional Writing Services at Your Fingertips</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Submit your writing assignments and get high-quality content delivered on time, every time.</p>
          <div className="space-x-4">
            <Link href="/submit" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              Submit Assignment
            </Link>
            <Link href="#services" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Academic Writing',
                description: 'Essays, research papers, and dissertations written by experts in your field.',
                icon: '📚'
              },
              {
                title: 'Content Creation',
                description: 'Engaging blog posts, articles, and web content that captivates your audience.',
                icon: '✍️'
              },
              {
                title: 'Business Documents',
                description: 'Professional reports, proposals, and business communications.',
                icon: '💼'
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Submit your assignment today and receive high-quality work from our expert writers.</p>
          <Link href="/submit" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block">
            Get Started Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
