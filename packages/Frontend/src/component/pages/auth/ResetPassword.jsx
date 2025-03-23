import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { assets, cursors } from '../../../assets/assets';
import bg from '../../../assets/bg_img.png';
import PasswordStrengthMeter from './PasswordMeter';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setpasswordConfirmation] = useState('');
  const { resetPassword } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await resetPassword({ token, password , passwordConfirmation });
      navigate('/login');
    } catch (error) {
      toast.error(error.message || "Password reset failed");
    }
  };

  return (
    <div className="d-md-flex align-items-center justify-content-center flex-column" style={{ background: `url(${bg})`, height: "100vh" }}>
      <a href="/"><img src={assets.logo} className="position-absolute" alt="logo" style={{ top: "10px", left: "10px" }} /></a>
      <div className="text-center bg-dark-subtle p-5 rounded-3" style={{ width: "600px" }}>
        <h2 className="fs-2 fw-semibold py-2">Reset Password</h2>
        <section className="form-signin w-100 m-auto">
          <form onSubmit={handleSubmit} className="grid gap-4 needs-validation" noValidate>
            <div className="form-floating mb-2">
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="newPassword"><img src={assets.lock_icon} className="mb-1" /> New Password</label>
            </div>
            <div className="form-floating mb-2">
              <input
                type="password"
                className="form-control"
                id="passwordConfirmation"
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setpasswordConfirmation(e.target.value)}
                required
              />
              <label htmlFor="passwordConfirmation"><img src={assets.lock_icon} className="mb-1" /> Confirm Password</label>
            </div>
            <button className="btn btn-primary w-100 py-2 my-2" type="submit">
              Reset Password
            </button>
            <PasswordStrengthMeter password={password} />
            <a onClick={() => navigate('/login')} style={cursors} className="text-left border-0 text-black text-decoration-none py-2">
              <img src={assets.left_Arrow} width="15px" /> Return to login
            </a>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ResetPassword;