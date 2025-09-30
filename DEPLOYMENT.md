# 🚀 Deployment Guide

## Environment Configuration

### 1. Create Environment Files

**For Local Development:**
```bash
# Copy the example file
cp env.example .env.local

# Edit .env.local with your local settings
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For Production Deployment:**
```bash
# Create production environment file
cp env.example .env.production

# Edit .env.production with your production URLs
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

### 2. Update Backend URL

Replace `your-backend-domain.com` with your actual deployed backend URL:

```bash
# Example for Vercel deployment
NEXT_PUBLIC_API_URL=https://marketbot-backend.vercel.app

# Example for custom domain
NEXT_PUBLIC_API_URL=https://api.marketbot.com

# Example for Railway deployment
NEXT_PUBLIC_API_URL=https://marketbot-backend-production.up.railway.app
```

## Deployment Platforms

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard:**
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-domain.com`
   - `NEXT_PUBLIC_APP_URL` = `https://your-frontend-domain.com`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Netlify

1. **Build command:**
   ```bash
   npm run build
   ```

2. **Publish directory:**
   ```
   .next
   ```

3. **Environment variables:**
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-domain.com`

### Railway

1. **Connect your repository**
2. **Set environment variables:**
   ```bash
   railway variables set NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   ```

3. **Deploy:**
   ```bash
   railway up
   ```

## Docker Deployment

### Build Docker Image

```bash
# Build the image
docker build -t marketbot-frontend .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-backend-domain.com \
  marketbot-frontend
```

### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://your-backend-domain.com
      - NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.marketbot.com` |
| `NEXT_PUBLIC_APP_URL` | Frontend App URL | `https://app.marketbot.com` |

## Troubleshooting

### CORS Issues
If you encounter CORS issues, ensure your backend allows requests from your frontend domain.

### WebSocket Issues
Make sure your backend WebSocket server is accessible from your frontend domain.

**WebSocket Configuration:**
- The frontend automatically uses the same URL as your API for WebSocket connections
- For HTTPS deployments, WebSocket will automatically use WSS (secure WebSocket)
- WebSocket includes automatic reconnection with 5 retry attempts
- Connection timeout is set to 20 seconds

**Production WebSocket Requirements:**
- Your backend must support WebSocket connections on the same domain as your API
- Ensure your hosting provider supports WebSocket connections
- For load balancers, ensure WebSocket sticky sessions are configured

### API Proxy Issues
The Next.js rewrites in `next.config.js` will proxy `/api/*` requests to your backend. Ensure the backend URL is correct.

## Testing Deployment

1. **Check environment variables:**
   ```bash
   echo $NEXT_PUBLIC_API_URL
   ```

2. **Test API connection:**
   ```bash
   curl https://your-backend-domain.com/api/health
   ```

3. **Verify frontend loads:**
   Open your deployed frontend URL and check the browser console for any errors.

4. **Test WebSocket connection:**
   ```bash
   # Test WebSocket connection (replace with your domain)
   wscat -c wss://your-backend-domain.com/socket.io/?EIO=4&transport=websocket
   ```

5. **Check browser console for WebSocket logs:**
   - Look for "🔗 Connected to operations WebSocket" message
   - Ensure no WebSocket connection errors
