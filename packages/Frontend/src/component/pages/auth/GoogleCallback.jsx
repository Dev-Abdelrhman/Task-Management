import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      await handleGoogleCallback();
    };

    processCallback();
  }, []);

  return <div>Signing in...</div>;
};

export default GoogleCallback;
