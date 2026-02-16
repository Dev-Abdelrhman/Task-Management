export default function Stats() {
  return (
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
  );
}
