const express = require('express');
const router = express.Router();

// Mock blog posts data (in real app, this would come from database)
let blogPosts = [
  {
    _id: 1,
    title: 'Xu hướng thiết kế tối giản 2024',
    category: 'market-trends',
    author: 'Marketing Team',
    content: 'Nội dung chi tiết về xu hướng thiết kế tối giản...',
    excerpt: 'Khám phá những xu hướng thiết kế tối giản mới nhất trong năm 2024 và cách áp dụng vào sản phẩm của chúng tôi.',
    image: '📊',
    tags: ['Xu hướng', 'Thiết kế', '2024'],
    status: 'published',
    featured: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    _id: 2,
    title: 'Cách chọn vật liệu tự nhiên phù hợp',
    category: 'knowledge',
    author: 'Product Team',
    content: 'Nội dung chi tiết về cách chọn vật liệu...',
    excerpt: 'Hướng dẫn chi tiết về cách chọn vật liệu tự nhiên phù hợp cho từng loại sản phẩm và môi trường sử dụng.',
    image: '🌿',
    tags: ['Vật liệu', 'Tự nhiên', 'Hướng dẫn'],
    status: 'published',
    featured: false,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    _id: 3,
    title: 'Khách hàng chia sẻ: Trải nghiệm sử dụng sản phẩm',
    category: 'customer-stories',
    author: 'Customer Success',
    content: 'Nội dung chi tiết về trải nghiệm khách hàng...',
    excerpt: 'Những chia sẻ chân thực từ khách hàng về trải nghiệm sử dụng sản phẩm của Simple decor.',
    image: '💬',
    tags: ['Khách hàng', 'Trải nghiệm', 'Đánh giá'],
    status: 'published',
    featured: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  },
  {
    _id: 4,
    title: 'Cập nhật quy trình sản xuất mới',
    category: 'internal-news',
    author: 'Production Team',
    content: 'Nội dung chi tiết về quy trình sản xuất...',
    excerpt: 'Thông báo về những cải tiến trong quy trình sản xuất để đảm bảo chất lượng tốt hơn.',
    image: '🏭',
    tags: ['Sản xuất', 'Cải tiến', 'Chất lượng'],
    status: 'draft',
    featured: false,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  },
  {
    _id: 5,
    title: 'Thị trường xuất khẩu châu Âu 2024',
    category: 'market-trends',
    author: 'Sales Team',
    content: 'Nội dung chi tiết về thị trường châu Âu...',
    excerpt: 'Phân tích thị trường xuất khẩu châu Âu và cơ hội kinh doanh trong năm 2024.',
    image: '🌍',
    tags: ['Thị trường', 'Châu Âu', 'Xuất khẩu'],
    status: 'published',
    featured: true,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03'
  },
  {
    _id: 6,
    title: 'Lễ kỷ niệm 10 năm thành lập',
    category: 'internal-news',
    author: 'HR Team',
    content: 'Nội dung chi tiết về lễ kỷ niệm...',
    excerpt: 'Chia sẻ về lễ kỷ niệm 10 năm thành lập công ty và những thành tựu đã đạt được.',
    image: '🎉',
    tags: ['Kỷ niệm', '10 năm', 'Thành tựu'],
    status: 'published',
    featured: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// GET /api/blog - Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10, featured, status } = req.query;
    
    let filteredPosts = blogPosts;
    
    // Filter by category if provided
    if (category && category !== 'all') {
      filteredPosts = blogPosts.filter(post => post.category === category);
    }

    // Filter by featured if provided
    if (featured === 'true') {
      filteredPosts = blogPosts.filter(post => post.featured);
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      filteredPosts = blogPosts.filter(post => post.status === status);
    }

    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    res.json({
      posts: paginatedPosts,
      total: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      message: 'Failed to fetch blog posts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/blog - Create a new blog post
router.post('/', async (req, res) => {
  try {
    const { title, content, category, author, status, tags } = req.body;

    // Validation
    if (!title || !content || !category || !author) {
      return res.status(400).json({ message: 'Title, content, category, and author are required' });
    }

    const newPost = {
      _id: blogPosts.length + 1,
      title,
      content,
      category,
      author,
      status: status || 'draft',
      tags: tags || [],
      featured: false,
      excerpt: content.substring(0, 150) + '...',
      image: '📝',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    blogPosts.push(newPost);

    res.status(201).json({
      message: 'Blog post created successfully',
      post: newPost
    });

  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      message: 'Failed to create blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/blog/:id - Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const postIndex = blogPosts.findIndex(p => p._id === parseInt(id));

    if (postIndex === -1) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Update the post
    blogPosts[postIndex] = {
      ...blogPosts[postIndex],
      ...updateData,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    res.json({
      message: 'Blog post updated successfully',
      post: blogPosts[postIndex]
    });

  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({
      message: 'Failed to update blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/blog/:id - Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const postIndex = blogPosts.findIndex(p => p._id === parseInt(id));

    if (postIndex === -1) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const deletedPost = blogPosts.splice(postIndex, 1)[0];

    res.json({
      message: 'Blog post deleted successfully',
      postId: id
    });

  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      message: 'Failed to delete blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/blog/:id - Get single blog post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = blogPosts.find(p => p._id === parseInt(id));

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ post });

  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      message: 'Failed to fetch blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/blog/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'all', name: 'Tất cả', count: blogPosts.length },
      { id: 'internal-news', name: 'Tin nội bộ', count: blogPosts.filter(p => p.category === 'internal-news').length },
      { id: 'market-trends', name: 'Xu hướng thị trường', count: blogPosts.filter(p => p.category === 'market-trends').length },
      { id: 'knowledge', name: 'Bài viết kiến thức', count: blogPosts.filter(p => p.category === 'knowledge').length },
      { id: 'customer-stories', name: 'Chia sẻ khách hàng', count: blogPosts.filter(p => p.category === 'customer-stories').length }
    ];

    res.json({ categories });

  } catch (error) {
    console.error('Get blog categories error:', error);
    res.status(500).json({
      message: 'Failed to fetch blog categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/blog/featured - Get featured posts
router.get('/featured', async (req, res) => {
  try {
    const featuredPosts = blogPosts.filter(post => post.featured);
    
    res.json({ posts: featuredPosts });

  } catch (error) {
    console.error('Get featured posts error:', error);
    res.status(500).json({
      message: 'Failed to fetch featured posts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 