import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  MessageSquare,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contacts');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsRes, quotesRes] = await Promise.all([
        api.get('/api/contact'),
        api.get('/api/quote-requests')
      ]);
      setContacts(contactsRes.data.contacts || contactsRes.data);
      setQuoteRequests(quotesRes.data.quoteRequests || quotesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/${type}/${id}`);
        toast.success('Item deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleStatusChange = async (type, id, newStatus) => {
    try {
      await api.patch(`/api/${type}/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredQuotes = quoteRequests.filter(quote => {
    const matchesSearch = quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || quote.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statuses = [
    { value: 'new', label: 'New', color: 'badge-info' },
    { value: 'read', label: 'Read', color: 'badge-success' },
    { value: 'replied', label: 'Replied', color: 'badge-warning' },
    { value: 'archived', label: 'Archived', color: 'badge-danger' },
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
        <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
        <p className="text-gray-600">Manage contact messages and quote requests</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contacts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contact Messages ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quotes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quote Requests ({quoteRequests.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {activeTab === 'contacts' ? filteredContacts.length : filteredQuotes.length} items
            </span>
          </div>
        </div>
      </div>

      {/* Contact Messages */}
      {activeTab === 'contacts' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Contact</th>
                  <th className="table-header">Message</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <User size={14} className="text-gray-400" />
                          <span className="font-medium text-gray-900">{contact.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{contact.email}</span>
                        </div>
                        {contact.whatsapp && (
                          <div className="flex items-center space-x-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600">{contact.whatsapp}</span>
                          </div>
                        )}
                        {contact.country && (
                          <div className="flex items-center space-x-2">
                            <MapPin size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600">{contact.country}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 line-clamp-2">{contact.message}</p>
                        {contact.interestedProduct && (
                          <p className="text-xs text-gray-500 mt-1">
                            Interested in: {contact.interestedProduct}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <select
                        value={contact.status}
                        onChange={(e) => handleStatusChange('contact', contact._id, e.target.value)}
                        className={`badge ${statuses.find(s => s.value === contact.status)?.color} border-0`}
                      >
                        {statuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete('contact', contact._id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quote Requests */}
      {activeTab === 'quotes' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Product</th>
                  <th className="table-header">Quote Amount</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <User size={14} className="text-gray-400" />
                          <span className="font-medium text-gray-900">{quote.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{quote.email}</span>
                        </div>
                        {quote.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600">{quote.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900">{quote.product}</p>
                        {quote.notes && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{quote.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      {quote.quoteAmount ? (
                        <div className="text-sm font-medium text-gray-900">
                          ${quote.quoteAmount} {quote.currency}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Pending</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange('quote-requests', quote._id, e.target.value)}
                        className={`badge ${statuses.find(s => s.value === quote.status)?.color} border-0`}
                      >
                        {statuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete('quote-requests', quote._id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;