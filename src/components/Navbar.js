import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">LanceHub</Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Services</Link>
          <Link href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</Link>
          <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
          <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu (Hidden by default) */}
      <div className="md:hidden bg-white px-4 py-2 border-t">
        <Link href="/" className="block py-2 text-gray-700 hover:bg-gray-100 px-2 rounded">Home</Link>
        <Link href="#services" className="block py-2 text-gray-700 hover:bg-gray-100 px-2 rounded">Services</Link>
        <Link href="#pricing" className="block py-2 text-gray-700 hover:bg-gray-100 px-2 rounded">Pricing</Link>
        <Link href="#contact" className="block py-2 text-gray-700 hover:bg-gray-100 px-2 rounded">Contact</Link>
      </div>
    </nav>
  );
}
