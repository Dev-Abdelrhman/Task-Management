import { useEffect } from "react";
import { useAuth } from "../../../hooks/auth/useAuth";

const GoogleCallback = () => {
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      await handleGoogleCallback();
    };

    processCallback();
  }, []);

  return <div>Signing in...</div>;
};

export default GoogleCallback;
