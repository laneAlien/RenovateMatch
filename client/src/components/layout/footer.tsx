import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">For Homeowners</h3>
            <ul className="space-y-2">
              <li><Link href="/post-project" className="text-gray-300 hover:text-white">Post a Project</Link></li>
              <li><Link href="/browse-contractors" className="text-gray-300 hover:text-white">Find Contractors</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">How It Works</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Success Stories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Contractors</h3>
            <ul className="space-y-2">
              <li><Link href="/auth?mode=register&type=contractor" className="text-gray-300 hover:text-white">Join as Contractor</Link></li>
              <li><Link href="/dashboard" className="text-gray-300 hover:text-white">Find Projects</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Pricing</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Safety</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Trust & Safety</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">About</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 BuildConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
