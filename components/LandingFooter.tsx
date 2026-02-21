import { BookOpen } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-red-600" />
              </div>
              <span className="text-2xl font-bold">StudyMate</span>
            </div>
            <p className="text-red-100 text-lg leading-relaxed">
              AI-powered study organization for students everywhere.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-xl">Product</h3>
            <ul className="space-y-3 text-red-100">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-xl">Support</h3>
            <ul className="space-y-3 text-red-100">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-xl">Legal</h3>
            <ul className="space-y-3 text-red-100">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-red-500 mt-12 pt-8 text-center text-red-100">
          <p className="text-lg">&copy; 2024 StudyMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
