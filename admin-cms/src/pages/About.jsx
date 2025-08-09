import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Edit, Eye, FileText, Users, Target, Award } from 'lucide-react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const About = () => {
  const [aboutData, setAboutData] = useState({
    story: {
      title: '',
      content: '',
      image: ''
    },
    mission: {
      title: '',
      content: '',
      image: ''
    },
    vision: {
      title: '',
      content: '',
      image: ''
    },
    values: [],
    team: [],
    achievements: []
  });
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await api.get('/api/admin/about');
      setAboutData(response.data);
    } catch (error) {
      console.error('Error fetching about data:', error);
      toast.error('Failed to load about data');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.put('/api/admin/about', data);
      toast.success('About page updated successfully');
      setEditingSection(null);
      fetchAboutData();
    } catch (error) {
      toast.error('Failed to update about page');
    }
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    reset(aboutData[section]);
  };

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
        <h1 className="text-2xl font-bold text-gray-900">About Page Management</h1>
        <p className="text-gray-600">Manage your company information and story</p>
      </div>

      {/* Story Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText size={20} className="mr-2" />
            Our Story
          </h3>
          <button
            onClick={() => handleEditSection('story')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
        </div>
        
        {editingSection === 'story' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="input-field"
                defaultValue={aboutData.story.title}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                {...register('content', { required: 'Content is required' })}
                rows={6}
                className="input-field"
                defaultValue={aboutData.story.content}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                {...register('image')}
                className="input-field"
                defaultValue={aboutData.story.image}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center space-x-2">
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900">{aboutData.story.title}</h4>
            <p className="text-gray-600 leading-relaxed">{aboutData.story.content}</p>
            {aboutData.story.image && (
              <img src={aboutData.story.image} alt="Our Story" className="w-full h-48 object-cover rounded-lg" />
            )}
          </div>
        )}
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mission */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target size={20} className="mr-2" />
              Our Mission
            </h3>
            <button
              onClick={() => handleEditSection('mission')}
              className="btn-secondary flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
          </div>
          
          {editingSection === 'mission' ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="input-field"
                  defaultValue={aboutData.mission.title}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  {...register('content', { required: 'Content is required' })}
                  rows={4}
                  className="input-field"
                  defaultValue={aboutData.mission.content}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">{aboutData.mission.title}</h4>
              <p className="text-gray-600">{aboutData.mission.content}</p>
            </div>
          )}
        </div>

        {/* Vision */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Eye size={20} className="mr-2" />
              Our Vision
            </h3>
            <button
              onClick={() => handleEditSection('vision')}
              className="btn-secondary flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
          </div>
          
          {editingSection === 'vision' ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="input-field"
                  defaultValue={aboutData.vision.title}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  {...register('content', { required: 'Content is required' })}
                  rows={4}
                  className="input-field"
                  defaultValue={aboutData.vision.content}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">{aboutData.vision.title}</h4>
              <p className="text-gray-600">{aboutData.vision.content}</p>
            </div>
          )}
        </div>
      </div>

      {/* Core Values */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Award size={20} className="mr-2" />
            Core Values
          </h3>
          <button
            onClick={() => handleEditSection('values')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
        </div>
        
        {editingSection === 'values' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {aboutData.values.map((value, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      {...register(`values.${index}.title`, { required: 'Title is required' })}
                      className="input-field"
                      defaultValue={value.title}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      {...register(`values.${index}.description`, { required: 'Description is required' })}
                      rows={3}
                      className="input-field"
                      defaultValue={value.description}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.values.map((value, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award size={24} className="text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users size={20} className="mr-2" />
            Our Team
          </h3>
          <button
            onClick={() => handleEditSection('team')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
        </div>
        
        {editingSection === 'team' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {aboutData.team.map((member, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      {...register(`team.${index}.name`, { required: 'Name is required' })}
                      className="input-field"
                      defaultValue={member.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <input
                      type="text"
                      {...register(`team.${index}.position`, { required: 'Position is required' })}
                      className="input-field"
                      defaultValue={member.position}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      {...register(`team.${index}.image`)}
                      className="input-field"
                      defaultValue={member.image}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <Users size={32} className="text-gray-400" />
                  )}
                </div>
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.position}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default About; 