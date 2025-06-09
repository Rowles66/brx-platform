"use client";

import { useState } from 'react';

export default function DashboardReplicaPage() {
  const [selectedItem, setSelectedItem] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'plans', label: 'Plans' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'groups', label: 'Groups' },
    { id: 'clients', label: 'Clients' },
    { id: 'messages', label: 'Message A Coach' },
    { id: 'automations', label: 'Automations' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'account', label: 'Account' }
  ];

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    },
    sidebar: {
      width: '280px',
      flexShrink: 0
    },
    sidebarCard: {
      backgroundColor: 'white',
      margin: '16px',
      height: 'calc(100vh - 32px)',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column'
    },
    logo: {
      height: '40px',
      objectFit: 'contain',
      marginBottom: '16px'
    },
    navList: {
      flex: 1,
      overflowY: 'auto',
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    navItem: (isSelected) => ({
      padding: '12px 16px',
      marginBottom: '4px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: isSelected ? 600 : 400,
      backgroundColor: isSelected ? '#3b82f6' : 'transparent',
      color: isSelected ? 'white' : '#374151',
      transition: 'all 0.2s'
    }),
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    contentArea: {
      flex: 1,
      backgroundColor: '#f8fafc',
      padding: '24px',
      overflowY: 'auto'
    },
    loadingContainer: {
      textAlign: 'center'
    },
    spinner: {
      width: '64px',
      height: '64px',
      border: '6px solid #e5e7eb',
      borderTop: '6px solid #3b82f6',
      borderRadius: '50%',
      margin: '0 auto 16px',
      animation: 'spin 1s linear infinite'
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            {/* Logo */}
            <img 
              src="https://cdn.exercise.com/images/1154147/6f7da32581c89ca25d665dc3aae533e4f14fe3ef_original.svg"
              alt="BRX Logo"
              style={styles.logo}
            />
            
            {/* Navigation */}
            <ul style={styles.navList}>
              {navigationItems.map((item) => (
                <li 
                  key={item.id}
                  style={styles.navItem(selectedItem === item.id)}
                  onClick={() => setSelectedItem(item.id)}
                  onMouseEnter={(e) => {
                    if (selectedItem !== item.id) {
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedItem !== item.id) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </li>
              ))}
            </ul>
            
            {/* Edit Navigation Button */}
            <button style={{
              width: '100%',
              marginTop: '16px',
              padding: '8px',
              fontSize: '14px',
              color: '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}>
              Edit Navigation
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Header */}
          <div style={styles.header}>
            <button style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              ☰
            </button>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>🕐</button>
              <button style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>⚡</button>
              <button style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>⊞</button>
              <button style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>🔔</button>
              <img 
                src="https://s3.amazonaws.com/weighttraining.com/profile_images/226676/profile.jpeg?1618081963"
                alt="Profile"
                style={{ width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}
              />
            </div>
          </div>
          
          {/* Content Area */}
          <div style={styles.contentArea}>
            <div style={{ width: '100%', maxWidth: '1200px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
                {selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1)}
              </h1>
              
              {selectedItem === 'dashboard' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                  {/* Welcome Card */}
                  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '24px' }}>Welcome back, Josh!</h2>
                        <p style={{ color: '#6b7280', margin: '0' }}>Here's what's happening with your training business today.</p>
                      </div>
                      <div style={{ backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <h3 style={{ margin: '0', color: '#1f2937', fontSize: '16px' }}>Active Clients</h3>
                      <div style={{ backgroundColor: '#dbeafe', padding: '4px 8px', borderRadius: '20px' }}>
                        <span style={{ color: '#1d4ed8', fontSize: '12px', fontWeight: '600' }}>+12%</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>47</div>
                    <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>3 new this week</p>
                  </div>

                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <h3 style={{ margin: '0', color: '#1f2937', fontSize: '16px' }}>Sessions This Week</h3>
                      <div style={{ backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '20px' }}>
                        <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: '600' }}>+8%</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>23</div>
                    <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>5 remaining today</p>
                  </div>

                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <h3 style={{ margin: '0', color: '#1f2937', fontSize: '16px' }}>Revenue MTD</h3>
                      <div style={{ backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '20px' }}>
                        <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: '600' }}>+15%</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>$8,750</div>
                    <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>vs $7,600 last month</p>
                  </div>

                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <h3 style={{ margin: '0', color: '#1f2937', fontSize: '16px' }}>Workout Plans</h3>
                      <div style={{ backgroundColor: '#fef3c7', padding: '4px 8px', borderRadius: '20px' }}>
                        <span style={{ color: '#d97706', fontSize: '12px', fontWeight: '600' }}>+2 new</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>12</div>
                    <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>8 active programs</p>
                  </div>

                  {/* Recent Activity */}
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', gridColumn: 'span 2' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '18px' }}>Recent Activity</h3>
                    <div style={{ space: '12px' }}>
                      {[
                        { name: 'Sarah Johnson', action: 'completed workout "Upper Body Strength"', time: '2 hours ago', type: 'workout' },
                        { name: 'Mike Chen', action: 'started new program "Athletic Performance"', time: '4 hours ago', type: 'program' },
                        { name: 'Emma Davis', action: 'logged nutrition data', time: '6 hours ago', type: 'nutrition' },
                        { name: 'Alex Rodriguez', action: 'scheduled session for tomorrow', time: '1 day ago', type: 'schedule' }
                      ].map((activity, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: index < 3 ? '1px solid #f3f4f6' : 'none' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            backgroundColor: activity.type === 'workout' ? '#dbeafe' : activity.type === 'program' ? '#dcfce7' : activity.type === 'nutrition' ? '#fef3c7' : '#e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px'
                          }}>
                            <span style={{ fontSize: '16px' }}>
                              {activity.type === 'workout' ? '💪' : activity.type === 'program' ? '📋' : activity.type === 'nutrition' ? '🥗' : '📅'}
                            </span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 4px 0', color: '#1f2937', fontWeight: '500' }}>{activity.name}</p>
                            <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>{activity.action}</p>
                          </div>
                          <span style={{ color: '#9ca3af', fontSize: '12px' }}>{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Sessions */}
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '18px' }}>Today's Schedule</h3>
                    <div style={{ space: '8px' }}>
                      {[
                        { time: '9:00 AM', client: 'Jessica Park', type: 'Personal Training' },
                        { time: '11:00 AM', client: 'David Kim', type: 'Nutrition Consult' },
                        { time: '2:00 PM', client: 'Lisa Wong', type: 'Assessment' },
                        { time: '4:00 PM', client: 'Team Meeting', type: 'Internal' }
                      ].map((session, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: index < 3 ? '1px solid #f3f4f6' : 'none' }}>
                          <div style={{ width: '60px', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{session.time}</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 2px 0', color: '#1f2937', fontSize: '14px', fontWeight: '500' }}>{session.client}</p>
                            <p style={{ margin: '0', color: '#6b7280', fontSize: '12px' }}>{session.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '18px' }}>Quick Actions</h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {[
                        { label: 'Create Workout Plan', icon: '📋', color: '#3b82f6' },
                        { label: 'Schedule Session', icon: '📅', color: '#10b981' },
                        { label: 'Add New Client', icon: '👥', color: '#f59e0b' },
                        { label: 'Send Message', icon: '💬', color: '#8b5cf6' }
                      ].map((action, index) => (
                        <button key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: action.color + '10',
                          border: `1px solid ${action.color}20`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}>
                          <span style={{ marginRight: '8px', fontSize: '16px' }}>{action.icon}</span>
                          <span style={{ color: action.color, fontSize: '14px', fontWeight: '500' }}>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedItem === 'exercises' && (
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#1f2937', marginBottom: '16px', fontSize: '20px' }}>Exercise Library</h2>
                    <button style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>+ Add Exercise</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {[
                      { name: 'Barbell Squat', category: 'Lower Body', sets: '3-4 sets', reps: '8-12 reps' },
                      { name: 'Bench Press', category: 'Upper Body', sets: '3-4 sets', reps: '6-10 reps' },
                      { name: 'Deadlift', category: 'Full Body', sets: '3-5 sets', reps: '5-8 reps' },
                      { name: 'Pull-ups', category: 'Upper Body', sets: '3-4 sets', reps: '5-12 reps' },
                      { name: 'Overhead Press', category: 'Upper Body', sets: '3-4 sets', reps: '6-10 reps' },
                      { name: 'Romanian Deadlift', category: 'Lower Body', sets: '3-4 sets', reps: '8-12 reps' }
                    ].map((exercise, index) => (
                      <div key={index} style={{
                        backgroundColor: '#f9fafb',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>{exercise.name}</h4>
                        <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>{exercise.category}</p>
                        <p style={{ margin: '0', color: '#9ca3af', fontSize: '12px' }}>{exercise.sets} • {exercise.reps}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedItem !== 'dashboard' && selectedItem !== 'exercises' && (
                <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                  <h2 style={{ color: '#1f2937', marginBottom: '16px' }}>{selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1)} Section</h2>
                  <p style={{ color: '#6b7280' }}>Content for the {selectedItem} section will be implemented here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 