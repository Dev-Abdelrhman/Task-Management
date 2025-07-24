import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

const AuthForm = ({
  title,
  subtitle,
  children,
  onSubmit,
  submitText,
  isLoading,
  googleButtonText,
  onGoogleClick,
  footerText,
  footerLinkText,
  onFooterLinkClick,
  showGoogleButton = true,
}) => {
  return (
    <Card className="w-full max-w-md border-0 !shadow-xl">
      <h2 className="text-3xl font-bold text-center text-[#3D53DB] pt-6">
        {title}
      </h2>
      {subtitle && <p className="text-center text-gray-500">{subtitle}</p>}
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {children}

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            borderRadius="40px"
            className="!bg-[#546FFF] hover:!shadow-lg hover:!shadow-[#98ABFF] text-white w-full !py-3 !rounded-xl"
          >
            {isLoading ? `${submitText}...` : submitText}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-500">{footerText} </span>
            <a
              onClick={onFooterLinkClick}
              className="text-[#3D53DB] hover:underline font-medium cursor-pointer hover: !no-underline"
            >
              {footerLinkText}
            </a>
          </div>

          {showGoogleButton && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-50 px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outlined"
                onClick={onGoogleClick}
                type="button"
                sx={{
                  color: "black",
                }}
                className="w-full !py-3 !border !border-gray-300 !hover:bg-gray-50 flex items-center justify-center gap-2 !rounded-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                {googleButtonText}
              </Button>
            </>
          )}
        </CardContent>
      </form>
    </Card>
  );
};

export default AuthForm;
