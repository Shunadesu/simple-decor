import React, { useState, useEffect } from 'react';
import { 
  Package, 
  FileText, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Eye,
  ShoppingCart,
  Star,
  Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    blogPosts: 0,
    contacts: 0,
    quoteRequests: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products count
      const productsResponse = await api.get('/api/products');
      const productsCount = productsResponse.data.products?.length || productsResponse.data.length || 0;

      // Fetch contacts count
      const contactsResponse = await api.get('/api/contact');
      const contactsCount = contactsResponse.data.contacts?.length || contactsResponse.data.length || 0;

      // Fetch quote requests count
      const quotesResponse = await api.get('/api/quote-requests');
      const quotesCount = quotesResponse.data.quoteRequests?.length || quotesResponse.data.length || 0;

      // Fetch blog posts count
      const blogResponse = await api.get('/api/blog');
      const blogCount = blogResponse.data.posts?.length || blogResponse.data.length || 0;

      // Set stats
      setStats({
        products: productsCount,
        blogPosts: blogCount,
        contacts: contactsCount,
        quoteRequests: quotesCount
      });

      // Create recent activity from the data
      const activities = [];
      
      // Add recent products
      const recentProducts = productsResponse.data.products?.slice(0, 3) || productsResponse.data.slice(0, 3) || [];
      recentProducts.forEach(product => {
        activities.push({
          type: 'product',
          title: product.name?.en || product.name,
          description: `Product ${product.status || 'created'}`,
          timestamp: product.createdAt || new Date()
        });
      });

      // Add recent contacts
      const recentContacts = contactsResponse.data.contacts?.slice(0, 3) || contactsResponse.data.slice(0, 3) || [];
      recentContacts.forEach(contact => {
        activities.push({
          type: 'contact',
          title: contact.name || 'New Contact',
          description: contact.message?.substring(0, 50) + '...',
          timestamp: contact.createdAt || new Date()
        });
      });

      // Add recent blog posts
      const recentBlogPosts = blogResponse.data.posts?.slice(0, 3) || blogResponse.data.slice(0, 3) || [];
      recentBlogPosts.forEach(post => {
        activities.push({
          type: 'blog',
          title: post.title || 'New Blog Post',
          description: post.excerpt?.substring(0, 50) + '...',
          timestamp: post.createdAt || new Date()
        });
      });

      // Sort by timestamp
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Jan', products: 12, contacts: 8, quotes: 5 },
    { name: 'Feb', products: 15, contacts: 12, quotes: 8 },
    { name: 'Mar', products: 18, contacts: 15, quotes: 10 },
    { name: 'Apr', products: 22, contacts: 18, quotes: 12 },
    { name: 'May', products: 25, contacts: 22, quotes: 15 },
    { name: 'Jun', products: 28, contacts: 25, quotes: 18 },
  ];

  const pieData = [
    { name: 'Products', value: stats.products, color: '#3B82F6' },
    { name: 'Blog Posts', value: stats.blogPosts, color: '#10B981' },
    { name: 'Contacts', value: stats.contacts, color: '#F59E0B' },
    { name: 'Quote Requests', value: stats.quoteRequests, color: '#EF4444' },
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Zuna Simple Decor Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.products}
          icon={Package}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Blog Posts"
          value={stats.blogPosts}
          icon={FileText}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Contact Messages"
          value={stats.contacts}
          icon={MessageSquare}
          color="bg-yellow-500"
          change={-3}
        />
        <StatCard
          title="Quote Requests"
          value={stats.quoteRequests}
          icon={ShoppingCart}
          color="bg-red-500"
          change={15}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="products" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="contacts" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="quotes" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  {activity.type === 'product' && <Package size={16} className="text-primary-600" />}
                  {activity.type === 'blog' && <FileText size={16} className="text-primary-600" />}
                  {activity.type === 'contact' && <MessageSquare size={16} className="text-primary-600" />}
                  {activity.type === 'quote' && <ShoppingCart size={16} className="text-primary-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Eye size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Package size={24} className="text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900">Add Product</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <FileText size={24} className="text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-900">Create Post</p>
          </button>
          <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
            <MessageSquare size={24} className="text-yellow-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-yellow-900">View Messages</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Settings size={24} className="text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-900">Settings</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 