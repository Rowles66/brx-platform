"use client";

export default function SimpleDashboard() {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', backgroundColor: 'white', padding: '20px', boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px' }}>BRX Dashboard</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '4px' }}>Dashboard</li>
          <li style={{ marginBottom: '10px', padding: '10px' }}>Plans</li>
          <li style={{ marginBottom: '10px', padding: '10px' }}>Exercises</li>
          <li style={{ marginBottom: '10px', padding: '10px' }}>Groups</li>
          <li style={{ marginBottom: '10px', padding: '10px' }}>Clients</li>
        </ul>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h1>Dashboard Content</h1>
          <p>If you can see this, the basic layout is working!</p>
          <p>The sidebar should be visible on the left.</p>
        </div>
      </div>
    </div>
  );
} 