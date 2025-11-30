import Sidebar from "../../../shared/Sidebar";
import { motion } from "framer-motion";
import RightSidebar from "./RightSidebar";
import ActivityChart from "./ActivityChart";
import DashboardProjectSection from "./DashboardProjectSection";
import RunningTask from "./RunningTask";
import DashboardNav from "./DashboardNav";
import { useUserMenu } from "../../../hooks/ui/useUserMenu";

export default function TaskordDashboard() {
  const { user } = useUserMenu();
  return (
    <>
      <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-[#080808]">
        <Sidebar />
        {/* Main Content */}
        <div className="md:ml-[16rem] flex-1 h-full w-full sm:p-8 p-7 2xl:pr-[490px]">
          <DashboardNav />
          <div className="sm:hidden mb-6 ml-2">
            <h1 className="text-3xl dark:text-white truncate">
              Hi, {user.name}
            </h1>
            <p className="text-[#54577A] text-[19px] dark:text-[#a0a0a0]">
              Let's finish your task today!
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 "
          >
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 mb-8">
              <RunningTask />
              <ActivityChart />
            </div>
          </motion.div>
          <DashboardProjectSection />
        </div>
        <RightSidebar />
      </div>
    </>
  );
}
