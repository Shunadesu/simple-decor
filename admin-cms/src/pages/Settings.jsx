import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Settings as SettingsIcon, Globe, Mail, Shield, Database, Palette } from 'lucide-react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Zuna Simple Decor',
      siteDescription: 'The Green Path Forward',
      contactEmail: 'cs@simpledecor.vn',
      contactPhone: '+84-989809313',
      address: 'Ho Chi Minh City, Vietnam'
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    },
    appearance: {
      primaryColor: '#557f39',
      secondaryColor: '#0ea5e9',
      logo: '',
      favicon: ''
    },
    email: {
      smtpHost: '',
      smtpPort: '',
      smtpUser: '',
      smtpPass: '',
      fromEmail: 'noreply@zuna.com',
      fromName: 'Zuna Simple Decor'
    }
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [dbStats, setDbStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'database' && !dbStats) {
      fetchDatabaseStats();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/settings/admin');
      setSettings(response.data.data || response.data);
      reset(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await api.put('/api/settings/admin', data);
      toast.success(response.data.message || 'Settings updated successfully');
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    }
  };

  const fetchDatabaseStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.get('/api/settings/admin/stats');
      setDbStats(response.data.data);
    } catch (error) {
      console.error('Error fetching database stats:', error);
      toast.error('Failed to load database statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const testEmailConfiguration = async () => {
    try {
      const testEmail = prompt('Enter test email address:');
      if (!testEmail) return;

      await api.post('/api/settings/admin/test-email', { testEmail });
      toast.success('Test email sent successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send test email');
    }
  };

  const resetSettings = async (section) => {
    const confirmed = confirm(`Are you sure you want to reset ${section} settings to default?`);
    if (!confirmed) return;

    try {
      const response = await api.post('/api/settings/admin/reset', { section });
      toast.success(response.data.message || 'Settings reset successfully');
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset settings');
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'social', name: 'Social Media', icon: Globe },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'email', name: 'Email Settings', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'database', name: 'Database', icon: Database },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your website configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Site Name</label>
                      <input
                        type="text"
                        {...register('general.siteName', { required: 'Site name is required' })}
                        className="input-field"
                        defaultValue={settings.general.siteName}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Site Description</label>
                      <input
                        type="text"
                        {...register('general.siteDescription')}
                        className="input-field"
                        defaultValue={settings.general.siteDescription}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        {...register('general.contactEmail', { required: 'Contact email is required' })}
                        className="input-field"
                        defaultValue={settings.general.contactEmail}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                      <input
                        type="text"
                        {...register('general.contactPhone')}
                        className="input-field"
                        defaultValue={settings.general.contactPhone}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        {...register('general.address')}
                        rows={3}
                        className="input-field"
                        defaultValue={settings.general.address}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Settings */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Facebook</label>
                      <input
                        type="url"
                        {...register('social.facebook')}
                        className="input-field"
                        placeholder="https://facebook.com/yourpage"
                        defaultValue={settings.social.facebook}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Instagram</label>
                      <input
                        type="url"
                        {...register('social.instagram')}
                        className="input-field"
                        placeholder="https://instagram.com/yourpage"
                        defaultValue={settings.social.instagram}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Twitter</label>
                      <input
                        type="url"
                        {...register('social.twitter')}
                        className="input-field"
                        placeholder="https://twitter.com/yourpage"
                        defaultValue={settings.social.twitter}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                      <input
                        type="url"
                        {...register('social.linkedin')}
                        className="input-field"
                        placeholder="https://linkedin.com/company/yourcompany"
                        defaultValue={settings.social.linkedin}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">YouTube</label>
                      <input
                        type="url"
                        {...register('social.youtube')}
                        className="input-field"
                        placeholder="https://youtube.com/yourchannel"
                        defaultValue={settings.social.youtube}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          {...register('appearance.primaryColor')}
                          className="w-12 h-10 border border-gray-300 rounded"
                          defaultValue={settings.appearance.primaryColor}
                        />
                        <input
                          type="text"
                          {...register('appearance.primaryColor')}
                          className="input-field"
                          defaultValue={settings.appearance.primaryColor}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          {...register('appearance.secondaryColor')}
                          className="w-12 h-10 border border-gray-300 rounded"
                          defaultValue={settings.appearance.secondaryColor}
                        />
                        <input
                          type="text"
                          {...register('appearance.secondaryColor')}
                          className="input-field"
                          defaultValue={settings.appearance.secondaryColor}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                      <input
                        type="url"
                        {...register('appearance.logo')}
                        className="input-field"
                        placeholder="https://example.com/logo.png"
                        defaultValue={settings.appearance.logo}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Favicon URL</label>
                      <input
                        type="url"
                        {...register('appearance.favicon')}
                        className="input-field"
                        placeholder="https://example.com/favicon.ico"
                        defaultValue={settings.appearance.favicon}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Email Configuration</h3>
                    <button
                      type="button"
                      onClick={testEmailConfiguration}
                      className="btn-secondary text-sm"
                    >
                      Test Email
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SMTP Host</label>
                      <input
                        type="text"
                        {...register('email.smtpHost')}
                        className="input-field"
                        placeholder="smtp.gmail.com"
                        defaultValue={settings.email.smtpHost}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SMTP Port</label>
                      <input
                        type="number"
                        {...register('email.smtpPort')}
                        className="input-field"
                        placeholder="587"
                        defaultValue={settings.email.smtpPort}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SMTP Username</label>
                      <input
                        type="text"
                        {...register('email.smtpUser')}
                        className="input-field"
                        placeholder="your-email@gmail.com"
                        defaultValue={settings.email.smtpUser}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SMTP Password</label>
                      <input
                        type="password"
                        {...register('email.smtpPass')}
                        className="input-field"
                        placeholder="Your email password"
                        defaultValue={settings.email.smtpPass}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">From Email</label>
                      <input
                        type="email"
                        {...register('email.fromEmail')}
                        className="input-field"
                        defaultValue={settings.email.fromEmail}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">From Name</label>
                      <input
                        type="text"
                        {...register('email.fromName')}
                        className="input-field"
                        defaultValue={settings.email.fromName}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800">Password Policy</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Configure password requirements and security settings.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800">Session Management</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Manage user sessions and authentication settings.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800">Backup & Recovery</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Configure automatic backups and recovery options.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Database Settings */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Database Settings</h3>
                    <button
                      type="button"
                      onClick={fetchDatabaseStats}
                      disabled={statsLoading}
                      className="btn-secondary text-sm"
                    >
                      {statsLoading ? 'Loading...' : 'Refresh Stats'}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {dbStats && (
                      <>
                        <div className={`p-4 border rounded-lg ${
                          dbStats.connection.status === 'connected' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <h4 className={`font-medium ${
                            dbStats.connection.status === 'connected' 
                              ? 'text-green-800' 
                              : 'text-red-800'
                          }`}>
                            Database Connection
                          </h4>
                          <p className={`text-sm mt-1 ${
                            dbStats.connection.status === 'connected' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            Status: {dbStats.connection.status}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Host: {dbStats.connection.host}:{dbStats.connection.port}
                          </p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-800">Database Statistics</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                            {Object.entries(dbStats.collections).map(([collection, count]) => (
                              <div key={collection}>
                                <p className="text-sm text-blue-600 capitalize">
                                  {collection.replace(/s$/, '')}
                                </p>
                                <p className="text-lg font-semibold text-blue-800">{count}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-gray-800">Database Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-gray-600">Database Size</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {(dbStats.database.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Objects</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {dbStats.database.objects}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Index Size</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {(dbStats.database.indexSize / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {!dbStats && !statsLoading && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">Click "Refresh Stats" to load database statistics.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <div className="flex space-x-2">
                  {activeTab !== 'database' && (
                    <button
                      type="button"
                      onClick={() => resetSettings(activeTab)}
                      className="btn-secondary text-sm text-red-600 hover:text-red-700"
                    >
                      Reset {activeTab} Settings
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => resetSettings('all')}
                    className="btn-secondary text-sm text-red-600 hover:text-red-700"
                  >
                    Reset All Settings
                  </button>
                </div>
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <Save size={16} />
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 