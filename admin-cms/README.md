# Admin CMS - Zuna Simple Decor

Admin panel for managing Zuna Simple Decor website content and data.

## Features

- **Product Management**: Create, edit, delete, and manage product catalog
- **Blog Management**: Manage blog posts and articles
- **Contact Management**: View and manage contact form submissions
- **Quote Requests**: Handle customer quote requests
- **Settings**: Configure website settings and appearance
- **About Page**: Manage company information and story
- **Admin Management**: Create and manage admin accounts

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- Server API running on port 5000

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Running the Application

1. Start the server first (make sure it's running on port 5000):

```bash
cd ../server
npm start
```

2. Start the admin-cms:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Default Login Credentials

- **Username**: admin
- **Password**: password

## API Integration

The admin-cms is now configured to use the real API from the server. All API calls go through the configured axios instance in `src/utils/axios.js` which includes:

- Base URL configuration
- Authentication token handling
- Request/response interceptors
- Error handling

## Available Routes

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/status` - Update product status

### Blog

- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

### Contact

- `GET /api/contact` - Get all contacts
- `DELETE /api/contact/:id` - Delete contact
- `PATCH /api/contact/:id/status` - Update contact status

### Quote Requests

- `GET /api/quote-requests` - Get all quote requests
- `DELETE /api/quote-requests/:id` - Delete quote request
- `PATCH /api/quote-requests/:id/status` - Update quote request status

### Admin

- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile
- `POST /api/admin/create` - Create new admin
- `GET /api/admin/list` - Get all admins
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings
- `GET /api/admin/about` - Get about data
- `PUT /api/admin/about` - Update about data

## Development

### Project Structure

```
src/
├── components/          # Reusable components
├── contexts/           # React contexts (Auth)
├── pages/             # Page components
├── utils/             # Utilities (axios config)
└── App.jsx           # Main app component
```

### Adding New Features

1. Create new page components in `src/pages/`
2. Add routes in `src/App.jsx`
3. Create API endpoints in the server
4. Update the admin-cms to use the new API endpoints

### Styling

The project uses Tailwind CSS for styling. Custom styles can be added in `src/index.css`.

## Troubleshooting

### Common Issues

1. **API Connection Error**: Make sure the server is running on port 5000
2. **Authentication Error**: Check if the JWT token is valid
3. **CORS Error**: Ensure CORS is properly configured on the server

### Debug Mode

To enable debug mode, set `NODE_ENV=development` in your environment variables.

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Update the API base URL in production environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Zuna Simple Decor website.
