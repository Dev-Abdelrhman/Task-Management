import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
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
            className="!bg-white !text-[#3D53DB] !hover:bg-blue-50 !px-5 !py-3"
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
  );
}
