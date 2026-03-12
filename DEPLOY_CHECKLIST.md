# CNCLog 部署上線檢查清單

## Vercel 部署後必做

### 1. Google OAuth — 加正式網域
- 去 [Google Cloud Console](https://console.cloud.google.com) → 專案 `cnclog`
- 左邊選 **Google Auth Platform** → **用戶端**
- 點進 `CNCLog Web` 用戶端
- **已授權的 JavaScript 來源**，新增：
  - `https://你的正式網域.vercel.app`（或自訂域名）
- **已授權的重新導向 URI**，新增：
  - `https://你的正式網域.vercel.app/api/auth/callback/google`
- 按儲存

### 2. Vercel 環境變數
在 Vercel Dashboard → Settings → Environment Variables，加上所有 `.env.local` 中的變數：
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_PRICE_ID`
- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `NEXT_PUBLIC_APP_URL`（改成正式網址）

### 3. NEXT_PUBLIC_APP_URL
`.env.local` 裡的 `NEXT_PUBLIC_APP_URL` 要從 `http://localhost:3000` 改成正式網址。

### 4. Stripe Webhook
- 在 Stripe Dashboard 建立新的 Webhook endpoint
- URL: `https://你的正式網域/api/stripe/webhook`
- 事件：`customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- 拿到新的 `STRIPE_WEBHOOK_SECRET` 更新到 Vercel 環境變數

### 5. Vercel 方案
- Hobby 方案**不允許商業用途**
- 正式收費前必須升級到 Vercel Pro ($20/月)
