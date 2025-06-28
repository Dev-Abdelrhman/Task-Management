import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { CheckCircle, Clock, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Hero() {
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
          transition={{ duration: 4, delay: 0.2 }}
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
  );
}
