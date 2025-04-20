import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import {
  CheckCircle,
  Clock,
  ListTodo,
  PlusCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 !items-center justify-between">
          <div className="flex !items-center gap-5">
            <div className="flex !items-center  gap-2">
              <ListTodo className="h-6 w-6 text-[#3D53DB]" />
              <span className="!text-2xl !font-bold text-[#3D53DB]">
                TaskFlow
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="!text-sm !font-medium text-blue-900 hover:text-[#3D53DB]"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-blue-900 hover:text-[#3D53DB]"
              >
                Testimonials
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="border-[#3D53DB] text-[#546FFF] hover:bg-blue-50 !px-5 !py-3 !rounded-full "
            >
              Sign In
            </Button>
            <Button
              className="!bg-[#546FFF] !text-white hover:!shadow-lg hover:!shadow-[#98ABFF] !px-7 !py-3 !rounded-full"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className="!inline-flex !items-center !px-3 !py-1 text-sm text-[#3D53DB]">
              <span className="!font-medium">New Features Available</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-blue-900 md:text-5xl lg:text-6xl">
              Manage tasks with <span className="text-[#3D53DB]">ease</span> and{" "}
              <span className="text-[#3D53DB]">efficiency</span>
            </h1>
            <p className="text-lg text-blue-700/80">
              Streamline your workflow, collaborate seamlessly, and accomplish
              more with our intuitive task management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => navigate("/sign-up")}
                className="!bg-[#546FFF] !text-white hover:!shadow-lg hover:!shadow-[#98ABFF] !px-5 !py-3"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                sx={{ border: 1 }}
                className="!border !border-[#3D53DB] !text-[#3D53DB] !px-5 !py-2"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-blue-200 bg-white shadow-xl">
              <motion.div
                animate={{
                  y: scrollY * 0.1,
                  rotate: scrollY * 0.02,
                }}
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-400/20"
              />
              <motion.div
                animate={{
                  y: scrollY * -0.1,
                  rotate: scrollY * -0.02,
                }}
                className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-[#3D53DB]/20"
              />

              {/* Task Cards Animation */}
              <div className="relative h-full w-full p-6">
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute top-8 left-4 w-64 rounded-lg border border-blue-100 bg-white p-4 shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium text-blue-900">
                      Project Planning
                    </h3>
                    <Clock className="h-4 w-4 text-[#3D53DB]" />
                  </div>
                  <div className="h-2 w-full rounded-full bg-blue-100">
                    <div className="h-2 w-3/4 rounded-full bg-[#3D53DB]" />
                  </div>
                  <p className="mt-2 text-xs text-blue-700">Due in 2 days</p>
                </motion.div>

                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute top-40 left-12 w-64 rounded-lg border border-green-100 bg-white p-4 shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium text-blue-900">
                      Website Redesign
                    </h3>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="h-2 w-full rounded-full bg-green-100">
                    <div className="h-2 w-full rounded-full bg-green-600" />
                  </div>
                  <p className="mt-2 text-xs text-green-700">Completed</p>
                </motion.div>

                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute top-72 left-6 w-64 rounded-lg border border-blue-100 bg-white p-4 shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium text-blue-900">
                      Content Creation
                    </h3>
                    <PlusCircle className="h-4 w-4 text-[#3D53DB]" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                      Design
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700">
                      Marketing
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#3D53DB] py-12 text-white">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl font-bold">10k+</span>
              <span className="text-blue-100">Active Users</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl font-bold">1M+</span>
              <span className="text-blue-100">Tasks Completed</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl font-bold">99.9%</span>
              <span className="text-blue-100">Uptime</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl font-bold">24/7</span>
              <span className="text-blue-100">Support</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-blue-900 md:text-4xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-blue-700/80 max-w-2xl mx-auto">
            Everything you need to manage your tasks efficiently and boost
            productivity
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <ListTodo className="h-6 w-6 text-[#546FFF]" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-blue-900">
              Task Organization
            </h3>
            <p className="text-blue-700/80">
              Create, organize, and prioritize tasks with our intuitive
              drag-and-drop interface.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Clock className="h-6 w-6 text-[#546FFF]" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-blue-900">
              Time Tracking
            </h3>
            <p className="text-blue-700/80">
              Track time spent on tasks and analyze productivity patterns to
              optimize your workflow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <TrendingUp className="h-6 w-6 text-[#546FFF]" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-blue-900">
              Progress Analytics
            </h3>
            <p className="text-blue-700/80">
              Visualize your progress with detailed charts and reports to stay
              on track with your goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-blue-50 py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-900 md:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 text-lg text-blue-700/80 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their
              productivity
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-current text-yellow-500"
                  />
                ))}
              </div>
              <p className="mb-4 text-blue-700/80">
                "TaskFlow has completely transformed how our team manages
                projects. The interface is intuitive and the features are
                exactly what we needed."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="text-[#546FFF] font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium text-blue-900">John Doe</p>
                  <p className="text-sm text-blue-700/80">Product Manager</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-current text-yellow-500"
                  />
                ))}
              </div>
              <p className="mb-4 text-blue-700/80">
                "I've tried many task management tools, but TaskFlow stands out
                with its clean design and powerful features. It's helped me stay
                organized and focused."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="text-[#546FFF] font-medium">JS</span>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Jane Smith</p>
                  <p className="text-sm text-blue-700/80">Freelance Designer</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-current text-yellow-500"
                  />
                ))}
              </div>
              <p className="mb-4 text-blue-700/80">
                "The analytics feature has been a game-changer for our team. We
                can now track our progress and identify bottlenecks in our
                workflow."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="text-[#546FFF] font-medium">RJ</span>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Robert Johnson</p>
                  <p className="text-sm text-blue-700/80">Team Lead</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-[#3D53DB] p-8 md:p-12 text-center text-white"
        >
          <h2 className="!text-3xl !font-bold md:!text-4xl">
            Ready to boost your productivity?
          </h2>
          <p className="!mt-4 !text-lg !text-blue-100 !max-w-2xl mx-auto">
            Join thousands of users who have transformed their task management
            experience
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
                onClick={() => navigate("/sign-up")}
              size="lg"
              className="!bg-white !text-[#3D53DB] !hover:bg-blue-50 !px-5 !py-3 "
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              sx={{ border: 1 }}
              className="!border-white !text-white !py-3 !px-5"
            >
              Schedule a Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <ListTodo className="h-6 w-6 text-[#3D53DB]" />
                <span className="text-xl font-bold text-[#3D53DB]">
                  TaskFlow
                </span>
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
    </div>
  );
}
