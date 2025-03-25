import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { assets } from '../../../assets/assets';
import PasswordStrengthMeter from './PasswordMeter';
import { Button, TextField, Card, CardContent } from '@mui/material';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await resetPassword({ token, password, passwordConfirmation });
      navigate('/login');
    } catch (error) {
      toast.error(error.message || "Password reset failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${assets.bg})` }}>
      <a href="/" className="absolute top-3 left-3">
        <img src={assets.logo} alt="logo" className="h-12 w-auto" />
      </a>

      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-blue-700">Reset Password</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label={
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <span>New Password</span>
                </div>
              }
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
            />

            <TextField
              fullWidth
              label={
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <span>Confirm Password</span>
                </div>
              }
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="pl-10"
            />

            {password && <PasswordStrengthMeter password={password} />}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="!bg-blue-600 text-white !py-3 !rounded-xl hover:!bg-blue-700"
            >
              Reset Password
            </Button>

            <div className="text-center pt-4">
              <a 
                onClick={() => navigate('/login')} 
                className="!text-blue-600 hover:underline font-medium cursor-pointer flex items-center justify-center gap-1"
              >
                <img src={assets.left_Arrow} alt="back" className="h-4 w-auto" />
                Return to login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;