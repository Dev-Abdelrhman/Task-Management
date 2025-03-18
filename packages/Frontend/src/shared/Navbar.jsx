import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
    const { signOut, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/home");
        } catch (error) {
            toast.error("Logout failed:", error.message);
        }
    };
    return <>

        {/* <h1>NAvbar</h1> */}

        <div className='d-flex justify-content-between align-items-center pt-2 pb-2 '>
            <h4>Explore</h4>
            <div>
                <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                    disabled={isLoading}
                >
                    {isLoading ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    </>
}

export default Navbar;