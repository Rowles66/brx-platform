'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/utils/api';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    sport: ''
  });
  const [error, setError] = useState('');

  const signUpMutation = api.auth.signUp.useMutation({
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    signUpMutation.mutate({
      email: formData.email,
      password: formData.password,
      name: `${formData.firstName} ${formData.lastName}`,
      confirmPassword: formData.confirmPassword,
      sport: formData.sport
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col">
      {/* Orange gradient background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">BRX</h1>
            <p className="text-lg text-gray-600">PERFORMANCE</p>
          </div>

          {/* Sign Up Card */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary sport
                </label>
                <select
                  id="sport"
                  required
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="">Select a sport</option>
                  <option value="basketball">Basketball</option>
                  <option value="football">Football</option>
                  <option value="soccer">Soccer</option>
                  <option value="baseball">Baseball</option>
                  <option value="track">Track & Field</option>
                  <option value="swimming">Swimming</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={signUpMutation.isLoading}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                style={{ backgroundColor: '#fe3f00' }}
              >
                {signUpMutation.isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-orange-600 hover:text-orange-700">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} BRX Performance. All rights reserved.</p>
      </footer>
    </div>
  );
} 