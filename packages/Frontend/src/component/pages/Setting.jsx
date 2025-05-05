import React, { useState } from "react";
import { Settings, Bell, Save } from "lucide-react";
import { Button } from "@mui/material";
import { useEffect } from "react";

export default function Setting() {
  const [activeTab, setActiveTab] = useState("general");
  const [timeFormat, setTimeFormat] = useState("24hours");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <div>
      <div className="flex border-b mb-6 ">
        <button
          className={`px-4 py-3 text-sm font-medium relative ${
            activeTab === "general"
              ? "text-indigo-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium relative ${
            activeTab === "notifications"
              ? "text-indigo-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notification
        </button>
      </div>

      {activeTab === "general" && (
        <div className="bg-white dark:bg-[#121212] dark:text-[#a0a0a0] rounded-lg shadow p-6 space-y-8 ">
          <div className="flex gap-8">
            <section class="w-full lg:w-1/2">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-400 mb-4">
                🛠️ Account Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
                  >
                    Change name
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue="John Doe"
                    className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-500 rounded border-gray-300  text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
                  >
                    Change email
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue="john.doe@example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
                  >
                    Change password
                  </label>
                  <input
                    type="password"
                    id="password"
                    defaultValue="********"
                    className="w-full px-3 py-2 border  border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 dark:focus:border-red-500 rounded text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    id="password"
                    defaultValue="********"
                    className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">
                    Update profile picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src="https://i.pinimg.com/736x/dc/ad/ef/dcadef86f8c41981f097080463089bb9.jpg"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full lg:w-1/2">
              <h3 className="text-lg font-medium text-gray-800 mb-4 dark:text-gray-400">
                Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm text-gray-600 dark:text-[#a0a0a0] mb-1"
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    defaultValue="en"
                    className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
                  >
                    <option value="en">English (Default)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="timezone"
                    className="block  text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
                  >
                    Time zone
                  </label>
                  <select
                    id="timezone"
                    defaultValue="utc"
                    className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
                  >
                    <option value="utc">UTC (Default)</option>
                    <option value="est">Eastern Time (EST)</option>
                    <option value="cst">Central Time (CST)</option>
                    <option value="pst">Pacific Time (PST)</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="dateFormat"
                    className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
                  >
                    Date format
                  </label>
                  <select
                    id="dateFormat"
                    defaultValue="ymd"
                    className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
                  >
                    <option value="ymd">YYYY/MM/DD (2025/05/03)</option>
                    <option value="dmy">DD/MM/YYYY (03/05/2025)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">
                    Theme
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600  dark:text-[#a0a0a0]">
                      Light
                    </span>
                    <label className="relative inline-block w-11 h-6">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={theme === "dark"}
                        onChange={() =>
                          setTheme(theme === "light" ? "dark" : "light")
                        }
                      />
                      <div className="peer-checked:bg-indigo-600 bg-gray-300 rounded-full w-11 h-6 transition-all"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                    <span className="text-sm text-gray-600  dark:text-[#a0a0a0]">
                      Dark
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="flex justify-end ">
            <Button className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white dark:bg-[#121212] rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-400 mb-2">
            Notification Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-[#a0a0a0]">
            Configure your notification preferences here.
          </p>
        </div>
      )}
    </div>
  );
}
// import React, { useState } from "react";
// import { Button } from "@mui/material";
// import { useEffect } from "react";

// export default function Setting() {
//     const [theme, setTheme] = useState("light");

//     useEffect(() => {
//         const savedTheme = localStorage.getItem("theme") || "light";
//         setTheme(savedTheme);
//     }, []);

//     useEffect(() => {
//         if (theme === "dark") {
//             document.documentElement.classList.add("dark");
//         } else {
//             document.documentElement.classList.remove("dark");
//         }
//         localStorage.setItem("theme", theme);
//     }, [theme]);
//     return (
//         <div >
//             <div className="bg-white dark:bg-[#121212] dark:text-[#a0a0a0] rounded-lg shadow p-6 space-y-8 ">
//                 <div className="flex gap-8">
//                     <section class="w-full lg:w-1/2">
//                         <h3 className="text-lg font-medium text-gray-800 dark:text-gray-400 mb-4">🛠️ Account Settings</h3>
//                         <div className="space-y-4">
//                             <div>
//                                 <label htmlFor="name" className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">
//                                     Change name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="name"
//                                     defaultValue="John Doe"
//                                     className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-500 rounded border-gray-300  text-sm"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="email" className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">
//                                     Change email
//                                 </label>
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     defaultValue="john.doe@example.com"
//                                     className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="password" className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">
//                                     Change password
//                                 </label>
//                                 <input
//                                     type="password"
//                                     id="password"
//                                     defaultValue="********"
//                                     className="w-full px-3 py-2 border  border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 dark:focus:border-red-500 rounded text-sm"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="password" className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">
//                                     Confirm password
//                                 </label>
//                                 <input
//                                     type="password"
//                                     id="password"
//                                     defaultValue="********"
//                                     className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">Update profile picture</label>
//                                 <div className="flex items-center gap-4">
//                                     <div className="w-16 h-16 rounded-full overflow-hidden">
//                                         <img
//                                             src="https://i.pinimg.com/736x/dc/ad/ef/dcadef86f8c41981f097080463089bb9.jpg"
//                                             alt="Profile"
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </div>
//                                     <button className="px-4 py-2 border border-gray-300 rounded-md text-sm">
//                                         Upload
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     <section className="w-full lg:w-1/2">
//                         <h3 className="text-lg font-medium text-gray-800 mb-4 dark:text-gray-400">Preferences</h3>
//                         <div className="space-y-4">
//                             <div>
//                                 <label htmlFor="language" className="block text-sm text-gray-600 dark:text-[#a0a0a0] mb-1">
//                                     Language
//                                 </label>
//                                 <select
//                                     id="language"
//                                     defaultValue="en"
//                                     className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
//                                 >
//                                     <option value="en">English (Default)</option>
//                                     <option value="es">Spanish</option>
//                                     <option value="fr">French</option>
//                                     <option value="de">German</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label htmlFor="timezone" className="block  text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">
//                                     Time zone
//                                 </label>
//                                 <select
//                                     id="timezone"
//                                     defaultValue="utc"
//                                     className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
//                                 >
//                                     <option value="utc">UTC (Default)</option>
//                                     <option value="est">Eastern Time (EST)</option>
//                                     <option value="cst">Central Time (CST)</option>
//                                     <option value="pst">Pacific Time (PST)</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label htmlFor="dateFormat" className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">
//                                     Date format
//                                 </label>
//                                 <select
//                                     id="dateFormat"
//                                     defaultValue="ymd"
//                                     className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
//                                 >
//                                     <option value="ymd">YYYY/MM/DD (2025/05/03)</option>
//                                     <option value="dmy">DD/MM/YYYY (03/05/2025)</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">Theme</label>
//                                 <div className="flex items-center gap-3">
//                                     <span className="text-sm text-gray-600  dark:text-[#a0a0a0]">Light</span>
//                                     <label className="relative inline-block w-11 h-6">
//                                         <input
//                                             type="checkbox"
//                                             className="sr-only peer"
//                                             checked={theme === "dark"}
//                                             onChange={() =>
//                                                 setTheme(theme === "light" ? "dark" : "light")
//                                             }
//                                         />
//                                         <div className="peer-checked:bg-indigo-600 bg-gray-300 rounded-full w-11 h-6 transition-all"></div>
//                                         <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
//                                     </label>
//                                     <span className="text-sm text-gray-600  dark:text-[#a0a0a0]">Dark</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>
//                 </div>
//                 <div className="flex justify-end ">
//                     <Button
//                         className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl">
//                         Save Changes
//                     </Button>
//                 </div>
//             </div>

//         </div>
//     );
// }
