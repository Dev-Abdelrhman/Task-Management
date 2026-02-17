import { ListTodo, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  return (
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
            Visualize your progress with detailed charts and reports to stay on
            track with your goals.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
