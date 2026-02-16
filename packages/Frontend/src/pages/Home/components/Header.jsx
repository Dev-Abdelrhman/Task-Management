import { Button } from "@mui/material";
import { ListTodo } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 !items-center justify-between">
        <div className="flex !items-center gap-5">
          <div className="flex !items-center gap-2">
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
            className="border-[#3D53DB] max-sm:!text-[13px] max-sm:!px-3 text-[#546FFF] hover:bg-blue-50 !px-5 !py-3 !rounded-full"
          >
            Sign In
          </Button>
          <Button
            className="!bg-[#546FFF] !text-white max-sm:!text-sm max-sm:!px-3  hover:!shadow-lg hover:!shadow-[#98ABFF] !px-7 !py-3 !rounded-full"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
