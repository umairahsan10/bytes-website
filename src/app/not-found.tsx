import Link from 'next/link';

export const dynamic = 'force-static';

function SimpleHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#010a14]">
          Bytes
        </Link>
        <nav className="flex gap-6">
          <Link href="/" className="text-gray-600 hover:text-[#010a14]">Home</Link>
          <Link href="/about" className="text-gray-600 hover:text-[#010a14]">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-[#010a14]">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

export default function NotFound() {
  return (
    <>
      <SimpleHeader />
      <main className="min-h-screen bg-white text-[#010a14] font-sans px-4 py-20 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-block bg-[#010a14] text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go Back Home
            </Link>
            
            <div className="mt-8">
              <p className="text-gray-500 mb-4">Or try these popular pages:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/about"
                  className="text-[#010a14] hover:underline"
                >
                  About Us
                </Link>
                <Link 
                  href="/services"
                  className="text-[#010a14] hover:underline"
                >
                  Services
                </Link>
                <Link 
                  href="/blogs"
                  className="text-[#010a14] hover:underline"
                >
                  Blog
                </Link>
                <Link 
                  href="/contact"
                  className="text-[#010a14] hover:underline"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 