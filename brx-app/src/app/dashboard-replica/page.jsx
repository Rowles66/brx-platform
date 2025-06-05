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
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
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
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                Dashboard Content Loading...
              </h2>
              <p style={{ color: '#6b7280' }}>
                {selectedItem === 'dashboard' ? 'Loading dashboard data...' : `Loading ${selectedItem} section...`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 