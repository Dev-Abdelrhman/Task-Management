import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
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
  );
} 