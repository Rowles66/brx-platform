import React, { useState } from 'react';
import { 
  Home, 
  Dumbbell, 
  Users, 
  User, 
  Mail, 
  CheckSquare, 
  Calendar, 
  Settings, 
  Menu, 
  Clock, 
  Zap, 
  Grid3x3, 
  Bell, 
  List, 
  ChevronRight,
  Loader2
} from 'lucide-react';

const DashboardReplicaTailwind = () => {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState({});

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'plans', label: 'Plans', icon: CheckSquare },
    { id: 'exercises', label: 'Exercises', icon: Dumbbell },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'clients', label: 'Clients', icon: User },
    { id: 'messages', label: 'Message A Coach', icon: Mail },
    { id: 'automations', label: 'Automations', icon: CheckSquare },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      expandable: true,
      children: [
        'Calendar', 'Visits', 'Recurring Members', 'Services', 
        'Packages', 'Locations', 'Availability Schedules'
      ]
    },
    {
      id: 'account',
      label: 'Account',
      icon: Settings,
      expandable: true,
      children: [
        'Business Dashboard', 'Reports', 'Business Info', 'Customize Platform',
        'Connected Apps', 'Staff', 'Products', 'Assessments', 'Resources',
        'Tags', 'Measurement Reports', 'Links', 'Events', 'Support', 
        'Videos', 'Time Card', 'Lifecycle', 'Emails'
      ]
    }
  ];

  const handleItemClick = (itemId) => {
    setSelectedItem(itemId);
    if (navigationItems.find(item => item.id === itemId)?.expandable) {
      setExpandedItems(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-[280px] flex-shrink-0">
        <div className="bg-white m-4 h-[calc(100vh-32px)] rounded-lg shadow-sm">
          <div className="h-full p-4 flex flex-col">
            {/* Logo */}
            <img 
              src="https://cdn.exercise.com/images/1154147/6f7da32581c89ca25d665dc3aae533e4f14fe3ef_original.svg"
              alt="Logo"
              className="h-10 object-contain mb-4"
            />
            
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={`
                        w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${selectedItem === item.id 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <item.icon className={`
                        h-5 w-5 mr-3 flex-shrink-0
                        ${selectedItem === item.id ? 'text-white' : 'text-gray-500'}
                      `} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.expandable && (
                        <ChevronRight className={`
                          h-4 w-4 transition-transform
                          ${expandedItems[item.id] ? 'rotate-90' : ''}
                          ${selectedItem === item.id ? 'text-white' : 'text-gray-400'}
                        `} />
                      )}
                    </button>
                    
                    {/* Submenu */}
                    {item.expandable && expandedItems[item.id] && (
                      <ul className="mt-1 ml-9 space-y-1">
                        {item.children?.map((child, index) => (
                          <li key={index}>
                            <button className="w-full text-left px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100">
                              {child}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Edit Navigation Button */}
            <button className="w-full mt-4 flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <List className="h-4 w-4 mr-2" />
              Edit Navigation
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <Clock className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <Zap className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <Grid3x3 className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md relative">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <img 
                src="https://s3.amazonaws.com/weighttraining.com/profile_images/226676/profile.jpeg?1618081963"
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 bg-white flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Dashboard Content Loading...
            </h2>
            <p className="text-gray-600">
              Replace this area with your actual dashboard content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReplicaTailwind; 