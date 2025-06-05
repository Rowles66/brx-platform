'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SchedulePage() {
  // Mock data for schedule
  const currentMonth = 'May 2025';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const schedule: Record<number, { type: string; title: string; time: string; location?: string; trainer?: string }> = {
    7: { type: 'workout', title: 'Upper Body', time: '9:00 AM' },
    10: { type: 'class', title: 'HIIT Class', time: '6:30 PM', location: 'Studio A' },
    14: { type: 'workout', title: 'Lower Body', time: '9:00 AM' },
    15: { type: 'appointment', title: 'Trainer Session', time: '4:00 PM', trainer: 'Coach Mike' },
    21: { type: 'workout', title: 'Full Body', time: '10:00 AM' },
    24: { type: 'class', title: 'Yoga', time: '7:00 PM', location: 'Studio B' },
    28: { type: 'workout', title: 'Cardio', time: '8:00 AM' },
  };

  const upcomingEvents = [
    {
      date: 'Today',
      time: '9:00 AM',
      title: 'Upper Body Workout',
      type: 'workout',
      duration: '45 min',
    },
    {
      date: 'Tomorrow',
      time: '6:30 PM',
      title: 'HIIT Class',
      type: 'class',
      location: 'Studio A',
      instructor: 'Sarah Johnson',
    },
    {
      date: 'June 2',
      time: '4:00 PM',
      title: 'Personal Training Session',
      type: 'appointment',
      trainer: 'Coach Mike',
      duration: '60 min',
    },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'bg-orange-100 text-orange-800';
      case 'class':
        return 'bg-purple-100 text-purple-800';
      case 'appointment':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = 4; // May 2025 starts on Thursday
    const daysInMonth = 31;

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
              <p className="text-sm text-gray-600 mt-1">View and manage your training calendar</p>
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
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">{currentMonth}</h2>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square p-2 border rounded-lg ${
                      day ? 'border-gray-200 hover:bg-gray-50' : 'border-transparent'
                    } ${day === new Date().getDate() ? 'bg-orange-50 border-orange-300' : ''}`}
                  >
                    {day && (
                      <>
                        <div className="text-sm font-medium text-gray-900">{day}</div>
                        {schedule[day] && (
                          <div className={`mt-1 text-xs p-1 rounded ${getEventColor(schedule[day].type)}`}>
                            {schedule[day].title}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h2>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border-l-4 pl-4" style={{ borderLeftColor: '#fe3f00' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
                          <span>{event.date}</span>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                        {event.location && (
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <MapPin size={14} className="mr-1" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.trainer && (
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <Users size={14} className="mr-1" />
                            <span>{event.trainer}</span>
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getEventColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="w-full mt-6 px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#fe3f00' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#db3204'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fe3f00'}
              >
                Book New Session
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 