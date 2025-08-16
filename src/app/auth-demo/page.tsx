import Link from "next/link";

export default function AuthDemo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Email Verification Demo</h1>
          <p className="text-gray-600 mb-8">
            Test the complete email verification flow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Registration Flow</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
              <li>Fill registration form</li>
              <li>Submit form to create account</li>
              <li>Automatically redirected to verification page</li>
              <li>Check email for 6-digit code</li>
              <li>Enter code to verify email</li>
              <li>Login automatically and redirect to dashboard</li>
            </ol>
            <Link 
              href="/register"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Start Registration
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Login Flow</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
              <li>Enter email and password</li>
              <li>If email not verified, get prompt to verify</li>
              <li>Option to go to verification page</li>
              <li>Complete verification to enable login</li>
            </ol>
            <Link 
              href="/login"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Login
            </Link>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">API Endpoints Used</h2>
          <div className="space-y-2 text-sm">
            <div><code className="bg-white px-2 py-1 rounded">POST /api/auth/register</code> - Create new account</div>
            <div><code className="bg-white px-2 py-1 rounded">POST /api/auth/verify-email</code> - Verify email with code</div>
            <div><code className="bg-white px-2 py-1 rounded">POST /api/auth/resend-verification</code> - Resend verification code</div>
            <div><code className="bg-white px-2 py-1 rounded">POST /api/auth/login</code> - Login user</div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-yellow-50">
          <h2 className="text-xl font-semibold mb-4">Features Implemented</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Form validation and error handling</li>
            <li>Loading states for better UX</li>
            <li>Auto-submit when 6 digits entered</li>
            <li>Resend verification code functionality</li>
            <li>Automatic redirect after successful verification</li>
            <li>LocalStorage management for pending verifications</li>
            <li>TypeScript interfaces for API responses</li>
            <li>Responsive design with Tailwind CSS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
