import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, MapPin, Clock, DollarSign, Briefcase, Heart, Zap } from 'lucide-react';

const Careers = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const jobCategories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'design', name: 'Thiết kế' },
    { id: 'engineering', name: 'Kỹ thuật' },
    { id: 'sales', name: 'Kinh doanh' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'operations', name: 'Vận hành' }
  ];

  const jobs = [
    {
      id: 1,
      title: 'Senior Product Designer',
      category: 'design',
      location: 'Hà Nội, Việt Nam',
      type: 'Full-time',
      salary: '25,000,000 - 35,000,000 VND',
      experience: '3-5 năm',
      description: 'Thiết kế sản phẩm nội thất từ vật liệu tự nhiên, tạo ra những sản phẩm độc đáo và bền vững.',
      requirements: [
        'Có kinh nghiệm thiết kế sản phẩm nội thất',
        'Thành thạo các phần mềm thiết kế 3D',
        'Hiểu biết về vật liệu tự nhiên',
        'Có khả năng làm việc nhóm'
      ]
    },
    {
      id: 2,
      title: 'Production Engineer',
      category: 'engineering',
      location: 'Hồ Chí Minh, Việt Nam',
      type: 'Full-time',
      salary: '20,000,000 - 30,000,000 VND',
      experience: '2-4 năm',
      description: 'Quản lý quy trình sản xuất, tối ưu hóa hiệu suất và đảm bảo chất lượng sản phẩm.',
      requirements: [
        'Tốt nghiệp kỹ thuật cơ khí hoặc liên quan',
        'Có kinh nghiệm trong lĩnh vực sản xuất',
        'Hiểu biết về quy trình sản xuất',
        'Có khả năng lãnh đạo nhóm'
      ]
    },
    {
      id: 3,
      title: 'Sales Manager',
      category: 'sales',
      location: 'Hà Nội, Việt Nam',
      type: 'Full-time',
      salary: '30,000,000 - 45,000,000 VND',
      experience: '5-7 năm',
      description: 'Phát triển thị trường và quản lý đội ngũ bán hàng, đạt mục tiêu doanh số.',
      requirements: [
        'Có kinh nghiệm bán hàng B2B',
        'Thành thạo tiếng Anh',
        'Có khả năng thương lượng',
        'Có kinh nghiệm quản lý đội ngũ'
      ]
    },
    {
      id: 4,
      title: 'Marketing Specialist',
      category: 'marketing',
      location: 'Hồ Chí Minh, Việt Nam',
      type: 'Full-time',
      salary: '15,000,000 - 25,000,000 VND',
      experience: '2-4 năm',
      description: 'Phát triển chiến lược marketing và quản lý các kênh truyền thông.',
      requirements: [
        'Có kinh nghiệm digital marketing',
        'Thành thạo các công cụ marketing',
        'Có khả năng sáng tạo nội dung',
        'Hiểu biết về thị trường'
      ]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Môi trường làm việc',
      description: 'Môi trường trẻ trung, năng động và thân thiện'
    },
    {
      icon: Zap,
      title: 'Phát triển nghề nghiệp',
      description: 'Cơ hội học hỏi và thăng tiến rõ ràng'
    },
    {
      icon: DollarSign,
      title: 'Lương thưởng hấp dẫn',
      description: 'Mức lương cạnh tranh và chế độ thưởng tốt'
    },
    {
      icon: Users,
      title: 'Đồng nghiệp',
      description: 'Làm việc với đội ngũ chuyên nghiệp'
    }
  ];

  const filteredJobs = selectedCategory === 'all' 
    ? jobs 
    : jobs.filter(job => job.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary-50 text-primary-600 py-20 mt-32">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Careers
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Tham gia cùng chúng tôi để tạo ra những sản phẩm tuyệt vời từ vật liệu tự nhiên
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Tại sao chọn Simple Decor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Cơ hội nghề nghiệp
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {jobCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-primary-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                  <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {job.type}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{job.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{job.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Yêu cầu:</h4>
                  <ul className="space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Ứng tuyển ngay
                </button>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không có vị trí phù hợp
              </h3>
              <p className="text-gray-600">
                Hiện tại không có vị trí nào trong danh mục này. Vui lòng thử lại sau hoặc gửi CV để chúng tôi liên hệ khi có cơ hội.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Quy trình ứng tuyển
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nộp đơn</h3>
              <p className="text-gray-600">Gửi CV và thư xin việc</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sàng lọc</h3>
              <p className="text-gray-600">Đánh giá hồ sơ ứng viên</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phỏng vấn</h3>
              <p className="text-gray-600">Phỏng vấn trực tiếp</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nhận việc</h3>
              <p className="text-gray-600">Ký hợp đồng và onboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            Không tìm thấy vị trí phù hợp?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Gửi CV của bạn để chúng tôi liên hệ khi có cơ hội phù hợp
          </p>
          <button className="bg-white text-primary-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Gửi CV ngay
          </button>
        </div>
      </section>
    </div>
  );
};

export default Careers; 