import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
    return (
        <>
        
            <div className="container-fluid ps-0">

                <div className="row">
                    <div className="col-lg-2">
                        <div className="sidebar text-center position-fixed top-0 start-0 bottom-0">
                            <Sidebar />
                        </div>
                    </div>
                    <div className="col-lg-10">
                        <Navbar />
                        <Outlet />

                    </div>
                </div>
            </div>


        </>
    );
}

export default Layout;
