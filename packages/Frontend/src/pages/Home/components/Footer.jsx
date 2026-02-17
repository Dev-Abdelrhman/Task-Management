import { ListTodo } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t bg-white py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-[#3D53DB]" />
              <span className="text-xl font-bold text-[#3D53DB]">TaskFlow</span>
            </div>
            <p className="mt-2 text-sm text-blue-700/80 max-w-xs">
              Streamline your workflow, collaborate seamlessly, and accomplish
              more with our intuitive task management platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Product</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-sm text-blue-700/80 hover:text-[#3D53DB]"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-blue-900">Support</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-700/80 hover:text-[#3D53DB]"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-700/80 hover:text-[#3D53DB]"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-700/80 hover:text-[#3D53DB]"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-blue-100 pt-6">
          <p className="text-center text-sm text-blue-700/80">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
