// @ai: aggressive
// @ai: build a Next.js/React login page component using TypeScript and Tailwind CSS.
// @ai: This page will be part of the Next.js App Router, under an (auth) route group.
// @ai: Replicate the UI and functionality found in the scraped assets located in:
// @ai: - ../../../scraped_reference/auth_assets_from_auth_extract/html/login.html 
// @ai: - ../../../scraped_reference/auth_assets_from_frontend_extract/html/login.html
// @ai: (Prioritize elements from auth_assets_from_auth_extract if there are discrepancies).
// @ai: Ensure it includes fields for email and password, a 'Remember Me' checkbox (if present in scraped),
// @ai: a 'Forgot Password?' link, and a prominent submit button.
// @ai: Use shadcn/ui components if available in the project, otherwise use standard HTML elements styled with Tailwind.
// @ai: Integrate with a tRPC mutation from src/server/api/routers/auth.ts for form submission (assume a loginUser mutation exists or create a placeholder).
// @ai: Provide user feedback for loading states, success, and errors (e.g., using toasts or inline messages).
// @ai: Implement client-side form validation using Zod (define a schema for login credentials).
// @ai: Make the page responsive and visually clean, modern, and professional, reflecting a fitness/performance brand.

'use client'; // Required for client-side interactions like useState and form handling

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const signInMutation = api.auth.signIn.useMutation({
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    signInMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Gradient SVG Background - exact copy from scraped */}
      <div className="absolute inset-0 overflow-hidden opacity-80">
        <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="502" fill="none" viewBox="0 0 1920 502" className="w-full h-auto">
          <g clipPath="url(#clip0)" opacity="0.8">
            <g filter="url(#filter0)" opacity="0.3">
              <path fill="url(#paint0)" fillRule="evenodd" d="M1516.45 318.144l-62.1 98.231-386.64-457.292 62.1-98.232 386.64 457.293z" clipRule="evenodd"/>
            </g>
            <g filter="url(#filter1)" opacity="0.3">
              <path fill="url(#paint1)" fillRule="evenodd" d="M761.912 338.732l-38.048 78.051-386.152-457.7 38.048-78.052 386.152 457.701z" clipRule="evenodd"/>
            </g>
          </g>
          <defs>
            <filter id="filter0" width="648.737" height="755.524" x="967.712" y="-239.148" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur result="effect1" stdDeviation="50"/>
            </filter>
            <filter id="filter1" width="624.199" height="735.752" x="237.712" y="-218.969" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur result="effect1" stdDeviation="50"/>
            </filter>
            <linearGradient id="paint0" x1="1099.27" x2="1468.23" y1="-113.525" y2="326.183" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fe3f00"/>
              <stop offset="1" stopColor="#fe3f00" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="paint1" x1="353.882" x2="722.84" y1="-100.611" y2="339.096" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fe3f00"/>
              <stop offset="1" stopColor="#fe3f00" stopOpacity="0"/>
            </linearGradient>
            <clipPath id="clip0">
              <path fill="#fff" d="M0 0H1920V502H0z"/>
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with Logo */}
        <div className="pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <img 
                src="https://cdn.exercise.com/images/1154147/6f7da32581c89ca25d665dc3aae533e4f14fe3ef_original.svg" 
                alt="BRX Performance Logo" 
                className="h-20"
              />
            </div>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-sm w-full">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">Sign In</h1>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-transparent"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-orange-600"
                  >
                    Email
                  </label>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-transparent"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-orange-600"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 rounded-md border-gray-300 text-orange-600 focus:ring-orange-500"
                      style={{ accentColor: '#fe3f00' }}
                    />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-orange-600">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={signInMutation.isLoading || !email || !password}
                  className="w-full py-3 px-4 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: signInMutation.isLoading || !email || !password ? '#ccc' : '#fe3f00',
                  }}
                  onMouseEnter={(e) => {
                    if (!signInMutation.isLoading && email && password) {
                      e.currentTarget.style.backgroundColor = '#db3204';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!signInMutation.isLoading && email && password) {
                      e.currentTarget.style.backgroundColor = '#fe3f00';
                    }
                  }}
                >
                  {signInMutation.isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>

            {/* Sign Up Link */}
            <p className="mt-4 text-center text-gray-600">
              Don't have an account?<br />
              <Link href="/sign-up" className="text-orange-600 hover:text-orange-700 font-medium">
                Sign up
              </Link>
            </p>

            {/* Test credentials notice */}
            <div className="mt-4 p-3 bg-orange-50 rounded-lg text-center">
              <p className="text-sm text-gray-700">
                Test login: <code className="text-orange-700 font-mono">test@example.com</code> / <code className="text-orange-700 font-mono">password123</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">© 2025 BRX Performance All rights reserved.</p>
                <div className="flex items-center space-x-3 text-sm">
                  <Link href="/terms-of-service" className="text-gray-600 hover:text-orange-600">
                    Terms of Service
                  </Link>
                  <span className="text-gray-400">|</span>
                  <a href="https://Exercise.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-orange-600">
                    <img src="https://res.cloudinary.com/brandpad/image/upload/c_scale,dpr_auto,f_auto,w_1536/v1/13578/colorblack-fill" alt="Exercise.com" className="h-4 mr-1" />
                    Exercise.com
                  </a>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <a href="https://itunes.apple.com/us/app/brx-performance/id1308361552?mt=8" target="_blank" rel="noopener noreferrer">
                  <img src="https://cdn.exercise.com/assets/exercisecom/app-store-image.svg" alt="Download on App Store" className="h-10" />
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.brxperformance.online.store&hl=en" target="_blank" rel="noopener noreferrer">
                  <img src="https://cdn.exercise.com/assets/exercisecom/play_store.png" alt="Get it on Google Play" className="h-10" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 