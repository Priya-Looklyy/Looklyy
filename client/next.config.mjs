/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://looklyy.onrender.com'
  },
  images: {
    domains: ['picsum.photos', 'images.unsplash.com'],
    unoptimized: true
  }
};

export default nextConfig;
