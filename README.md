# Zuna Simple Decor - MERN Stack Website

Một trang web công ty đa ngôn ngữ sử dụng MERN stack (MongoDB, Express.js, React.js, Node.js) với hỗ trợ 5 ngôn ngữ: Anh, Việt, Hàn, Trung, Nhật.

## 🚀 Tính Năng

### Frontend (React + Vite)

- **Đa ngôn ngữ**: Hỗ trợ 5 ngôn ngữ (Anh, Việt, Hàn, Trung, Nhật)
- **Responsive Design**: Tương thích với mọi thiết bị
- **Modern UI**: Sử dụng Tailwind CSS với thiết kế hiện đại
- **Routing**: React Router DOM cho navigation
- **Form Handling**: React Hook Form với validation
- **Notifications**: React Hot Toast cho thông báo
- **Icons**: Lucide React cho icons

### Backend (Express + MongoDB)

- **RESTful API**: Đầy đủ CRUD operations
- **Validation**: Express Validator cho input validation
- **Security**: Helmet, CORS, Rate Limiting
- **Database**: MongoDB với Mongoose ODM
- **Error Handling**: Comprehensive error handling

### Tính Năng Chính

1. **Trang Chủ**: Hero section, tầm nhìn & sứ mệnh, dịch vụ
2. **Sản Phẩm**: Danh mục sản phẩm với chi tiết kỹ thuật
3. **Dịch Vụ**: 6 dịch vụ chính của công ty
4. **Đối Tác**: Thông tin đối tác và mạng lưới toàn cầu
5. **Liên Hệ**: Form liên hệ với validation
6. **Blog**: Tin tức, xu hướng, kiến thức
7. **Modal Báo Giá**: Popup sau 6 giây vào web
8. **Bản Đồ**: Tích hợp bản đồ (placeholder)

## 📁 Cấu Trúc Dự Án

```
Zuna-simpledecor/
├── client/                 # Frontend React App
│   ├── public/
│   │   └── locales/       # Translation files
│   │       ├── en/
│   │       ├── vi/
│   │       ├── ko/
│   │       ├── zh/
│   │       └── ja/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   ├── i18n.js       # i18n configuration
│   │   └── index.css     # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                # Backend Express App
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   └── package.json
└── README.md
```

## 🛠️ Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js (v16 trở lên)
- MongoDB (local hoặc cloud)
- npm hoặc yarn

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd Zuna-simpledecor
```

### Bước 2: Cài Đặt Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

### Bước 3: Cấu Hình Environment

Tạo file `.env` trong thư mục `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zuna-simpledecor
NODE_ENV=development
```

### Bước 4: Chạy Ứng Dụng

#### Development Mode

Terminal 1 (Backend):

```bash
cd server
npm run dev
```

Terminal 2 (Frontend):

```bash
cd client
npm run dev
```

#### Production Mode

Build frontend:

```bash
cd client
npm run build
```

Start server:

```bash
cd server
npm start
```

## 🌐 Truy Cập

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📚 API Endpoints

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin)
- `PUT /api/contact/:id` - Update contact status

### Quote Requests

- `POST /api/quote-requests` - Submit quote request
- `GET /api/quote-requests` - Get all quote requests
- `PUT /api/quote-requests/:id` - Update quote request
- `GET /api/quote-requests/stats` - Get statistics

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get categories

### Blog

- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:id` - Get single blog post
- `GET /api/blog/categories` - Get blog categories
- `GET /api/blog/featured` - Get featured posts

## 🎨 Tính Năng UI/UX

### Header

- Logo công ty với tagline
- Navigation menu responsive
- Language switcher (5 ngôn ngữ)
- Enquiry cart button
- Social media links

### Footer

- Thông tin công ty
- Quick links
- Dịch vụ
- Thông tin liên hệ
- Bản đồ (placeholder)

### Modal Báo Giá

- Xuất hiện sau 6 giây
- Form validation
- File upload support
- Responsive design

### Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly interface
- Optimized images

## 🌍 Đa Ngôn Ngữ

### Hỗ Trợ Ngôn Ngữ

1. **English (en)** - Tiếng Anh
2. **Tiếng Việt (vi)** - Vietnamese
3. **한국어 (ko)** - Korean
4. **中文 (zh)** - Chinese
5. **日本語 (ja)** - Japanese

### Cấu Trúc Translation

```
locales/
├── en/common.json
├── vi/common.json
├── ko/common.json
├── zh/common.json
└── ja/common.json
```

## 🔧 Công Nghệ Sử Dụng

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **React i18next** - Internationalization
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Framer Motion** - Animations

### Backend

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Express Validator** - Validation
- **Helmet** - Security
- **CORS** - Cross-origin requests
- **Rate Limiting** - API protection
- **Compression** - Response compression

## 📊 Database Schema

### Contact Model

```javascript
{
  name: String,
  email: String,
  whatsapp: String,
  country: String,
  interestedProduct: String,
  message: String,
  status: String,
  ipAddress: String,
  userAgent: String,
  timestamps
}
```

### QuoteRequest Model

```javascript
{
  name: String,
  email: String,
  phone: String,
  product: String,
  notes: String,
  status: String,
  quoteAmount: Number,
  currency: String,
  ipAddress: String,
  userAgent: String,
  timestamps
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)

```bash
cd server
# Set environment variables
# Deploy to platform
```

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 📞 Liên Hệ

- **Email**: info@simpledecor.vn
- **Phone**: (+84) 24-66820188
- **Address**: Van Boi Village, Nhat Tuu Commune, Kim Bang District, Ha Nam Province, Vietnam

---

**Simple decor - The Green Path Forward** 🌿
