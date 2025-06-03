'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield, Bell, CreditCard, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const [user] = useState({
    name: 'Test User',
    email: 'test@example.com',
    role: 'athlete'
  });

  const [formData, setFormData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA 12345',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '(555) 987-6543',
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const handleSignOut = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
            <Link href="/dashboard">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600">
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto flex items-center justify-center">
                  <User size={40} className="text-orange-600" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.role === 'athlete' ? 'Athlete' : 'Trainer'}</p>
                <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Member since May 2025</span>
                </div>
              </div>

              <nav className="mt-8 space-y-2">
                <button className="w-full text-left px-4 py-2 bg-orange-50 text-orange-700 rounded-lg font-medium">
                  <User size={16} className="inline mr-2" />
                  Personal Info
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Shield size={16} className="inline mr-2" />
                  Security
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Bell size={16} className="inline mr-2" />
                  Notifications
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <CreditCard size={16} className="inline mr-2" />
                  Billing
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut size={16} className="inline mr-2" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: isEditing ? '#22c55e' : '#fe3f00' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isEditing ? '#16a34a' : '#db3204'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isEditing ? '#22c55e' : '#fe3f00'}
                >
                  {isEditing ? 'Save Changes' : 'Edit'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="flex items-center">
                    <User size={16} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className={`flex-1 px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500' 
                          : 'border-transparent bg-gray-50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail size={16} className="text-gray-400 mr-2" />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="flex-1 px-3 py-2 border border-transparent bg-gray-50 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="flex items-center">
                    <Phone size={16} className="text-gray-400 mr-2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className={`flex-1 px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500' 
                          : 'border-transparent bg-gray-50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      className={`flex-1 px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500' 
                          : 'border-transparent bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Emergency Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isEditing 
                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500' 
                        : 'border-transparent bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isEditing 
                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500' 
                        : 'border-transparent bg-gray-50'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 