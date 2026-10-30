// frontend/src/components/SocialLogin.jsx
import Button from "./ui/Button";

// Your Google and Facebook icons, moved here from Login.jsx and Register.jsx
// so both pages share one copy instead of two.

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.805 12.23c0-.79-.065-1.56-.205-2.3H12v4.35h5.5a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.045-4.4 3.045-7.69Z"
      fill="#4285F4"
    />

    <path
      d="M12 22c2.76 0 5.08-.91 6.77-2.47l-3.3-2.56c-.92.62-2.1.99-3.47.99-2.67 0-4.94-1.8-5.75-4.23H2.84v2.64A10.22 10.22 0 0 0 12 22Z"
      fill="#34A853"
    />

    <path
      d="M6.25 13.73A6.14 6.14 0 0 1 5.93 12c0-.6.11-1.18.32-1.73V7.63H2.84A10.02 10.02 0 0 0 1.75 12c0 1.58.38 3.07 1.09 4.37l3.41-2.64Z"
      fill="#FBBC05"
    />

    <path
      d="M12 6.04c1.5 0 2.84.52 3.9 1.54l2.92-2.92C17.08 2.95 14.76 2 12 2a10.22 10.22 0 0 0-9.16 5.63l3.41 2.64C7.06 7.84 9.33 6.04 12 6.04Z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 12C24 5.37 18.63 0 12 0S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85v-8.39H7.08V12h3.05V9.41c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3.46h-2.8v8.39C19.61 22.95 24 17.99 24 12Z"
      fill="#1877F2"
    />
  </svg>
);

// The "Or continue with" divider and the Google and Facebook buttons.
// They only log to the console for now; social login isn't connected yet.
const SocialLogin = () => (
  <>
    <div className="my-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-line" />
      <span className="text-xs font-medium text-slate-500">Or continue with</span>
      <div className="h-px flex-1 bg-line" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Button variant="secondary" onClick={() => console.log("Google login")} aria-label="Login with Google">
        <GoogleIcon /> Google
      </Button>
      <Button variant="secondary" onClick={() => console.log("Facebook login")} aria-label="Login with Facebook">
        <FacebookIcon /> Facebook
      </Button>
    </div>
  </>
);

export default SocialLogin;
