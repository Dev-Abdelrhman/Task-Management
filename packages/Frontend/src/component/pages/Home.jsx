import { useState, useEffect } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-[#3D53DB]" />
              <span className="text-2xl font-bold text-[#3D53DB]">
                TaskFlow
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-medium text-blue-900 hover:text-[#3D53DB]"
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

          <div className="md:flex items-center gap-2 hidden">
            <button
              onClick={() => handleNavigate("/login")}
              className="border border-[#3D53DB] text-[#546FFF] hover:bg-blue-50 px-5 py-2 rounded-full"
            >
              Sign In
            </button>
            <button
              className="bg-[#546FFF] text-white hover:shadow-lg hover:shadow-[#98ABFF] px-7 py-2 rounded-full"
              onClick={() => handleNavigate("/sign-up")}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-900">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white p-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-sm font-medium text-blue-900 hover:text-[#3D53DB]"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-blue-900 hover:text-[#3D53DB]"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => handleNavigate("/login")}
                  className="border border-[#3D53DB] text-[#546FFF] hover:bg-blue-50 px-4 py-2 rounded-full w-full"
                >
                  Sign In
                </button>
                <button
                  className="bg-[#546FFF] text-white hover:shadow-lg px-4 py-2 rounded-full w-full"
                  onClick={() => handleNavigate("/sign-up")}
                >
                  Sign Up
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 lg:py-32">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div
            className="flex flex-col gap-4 opacity-100"
            style={{
              opacity: 1,
              transform: 'translateY(0px)',
              transition: 'opacity 0.5s, transform 0.5s'
            }}
          >
            <div className="inline-flex items-center px-3 py-1 text-sm text-[#3D53DB] bg-blue-50 rounded-full">
              <span className="font-medium">New Features Available</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-blue-900">
              Manage tasks with <span className="text-[#3D53DB]">ease</span> and{" "}
              <span className="text-[#3D53DB]">efficiency</span>
            </h1>
            <p className="text-base md:text-lg text-blue-700/80">
              Streamline your workflow, collaborate seamlessly, and accomplish
              more with our intuitive task management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => handleNavigate("/sign-up")}
                className="bg-[#546FFF] text-white hover:shadow-lg hover:shadow-[#98ABFF] px-5 py-3 rounded-lg"
              >
                Get Started Free
              </button>
              <button
                className="border border-[#3D53DB] text-[#3D53DB] px-5 py-3 rounded-lg"
              >
                Watch Demo
              </button>
            </div>
          </div>
          <div
            className="relative opacity-100"
            style={{
              opacity: 1,
              transform: 'scale(1)',
              transition: 'opacity 0.5s, transform 0.5s'
            }}
          >
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-xl border border-blue-200 bg-white shadow-xl">
              <div
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-400/20"
                style={{
                  transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.02}deg)`,
                }}
              />
              <div
                className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-[#3D53DB]/20"
                style={{
                  transform: `translateY(${scrollY * -0.1}px) rotate(${scrollY * -0.02}deg)`,
                }}
              />

              {/* Task Cards Animation */}
              <div className="relative h-full w-full p-6">
                <div
                  className="absolute top-8 left-4 w-64 rounded-lg border border-blue-100 bg-white p-4 shadow-md opacity-100"
                  style={{
                    transform: 'translateY(0px)',
                    transition: 'opacity 0.5s, transform 0.5s',
                    opacity: 1
                  }}
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
                </div>

                <div
                  className="absolute top-40 left-12 w-64 rounded-lg border border-green-100 bg-white p-4 shadow-md opacity-100"
                  style={{
                    transform: 'translateY(0px)',
                    transition: 'opacity 0.5s, transform 0.5s',
                    opacity: 1
                  }}
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
                </div>

                <div
                  className="absolute top-72 left-6 w-64 rounded-lg border border-blue-100 bg-white p-4 shadow-md opacity-100"
                  style={{
                    transform: 'translateY(0px)',
                    transition: 'opacity 0.5s, transform 0.5s',
                    opacity: 1
                  }}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#3D53DB] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            <div
              className="flex flex-col items-center opacity-100"
              style={{
                opacity: 1,
                transform: 'translateY(0px)',
                transition: 'opacity 0.5s, transform 0.5s'
              }}
            >
              <span className="text-2xl md:text-3xl font-bold">10k+</span>
              <span className="text-blue-100 text-sm md:text-base text-center">Active Users</span>
            </div>
            <div
              className="flex flex-col items-center opacity-100"
              style={{
                opacity: 1,
                transform: 'translateY(0px)',
                transition: 'opacity 0.5s, transform 0.5s'
              }}
            >
              <span className="text-2xl md:text-3xl font-bold">1M+</span>
              <span className="text-blue-100 text-sm md:text-base text-center">Tasks Completed</span>
            </div>
            <div
              className="flex flex-col items-center opacity-100"
              style={{
                opacity: 1,
                transform: 'translateY(0px)',
                transition: 'opacity 0.5s, transform 0.5s'
              }}
            >
              <span className="text-2xl md:text-3xl font-bold">99.9%</span>
              <span className="text-blue-100 text-sm md:text-base text-center">Uptime</span>
            </div>
            <div
              className="flex flex-col items-center opacity-100"
              style={{
                opacity: 1,
                transform: 'translateY(0px)',
                transition: 'opacity 0.5s, transform 0.5s'
              }}
            >
              <span className="text-2xl md:text-3xl font-bold">24/7</span>
              <span className="text-blue-100 text-sm md:text-base text-center">Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-20">
        <div
          className="text-center mb-12 opacity-100"
          style={{
            opacity: 1,
            transform: 'translateY(0px)',
            transition: 'opacity 0.5s, transform 0.5s'
          }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900">
            Powerful Features
          </h2>
          <p className="mt-4 text-base md:text-lg text-blue-700/80 max-w-2xl mx-auto">
            Everything you need to manage your tasks efficiently and boost
            productivity
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow opacity-100"
            style={{
              opacity: 1,
              transform: 'translateY(0px)',
              transition: 'opacity 0.5s, transform 0.5s'
            }}
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
          </div>

          <div
            className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow opacity-100"
            style={{
              opacity: 1,
              transform: 'translateY(0px)',
              transition: 'opacity 0.5s, transform 0.5s'
            }}
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
          </div>

          <div
            className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow opacity-100"
            style={{
              opacity: 1,
              transform: 'translateY(0px)',
              transition: 'opacity 0.5s, transform 0.5s'
            }}
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
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-blue-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-12 opacity-100"
            style={{
              opacity: 1,
              transform: 'translateY(0px)',
              transition: 'opacity 0.5s, transform 0.5s'
            }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900">
              What Our Users Say
            </h2>
            <p className="mt-4 text-base md:text-lg text-blue-700/80 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their
              productivity
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              className="rounded-xl bg-white p-6 shadow-sm opacity-100"
              style={{
                opacity: 1,
                transform: 'translateY(0px)',
                transition: 'opacity 0.5s, transform 0.5s'
              }}
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
            </div>

            <div
              className="rounded-xl bg-white p-6 shadow-sm opacity-100"
              style={{
                opacity: 1,
                transform: 'translateY(0px)',
                transition: 'opacity 0.5s, transform 0.5s'
              }}
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
            </div>

            <div
              className="rounded-xl bg-white p-6 shadow-sm opacity-100"
              style={{
                opacity: 1,
                transform: 'translateY(0px)',
                transition: 'opacity 0.5s, transform 0.5s'
              }}
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
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div
          className="rounded-2xl bg-[#3D53DB] p-6 md:p-12 text-center text-white opacity-100"
          style={{
            opacity: 1,
            transform: 'scale(1)',
            transition: 'opacity 0.5s, transform 0.5s'
          }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Ready to boost your productivity?
          </h2>
          <p className="mt-4 text-base md:text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of users who have transformed their task management
            experience
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNavigate("/sign-up")}
              className="bg-white text-[#3D53DB] hover:bg-blue-50 px-5 py-3 rounded-lg"
            >
              Get Started Free
            </button>
            <button
              className="border border-white text-white py-3 px-5 rounded-lg"
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
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