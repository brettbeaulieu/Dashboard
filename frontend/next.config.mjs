/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',    // Change to 'https' if you're using HTTPS
          hostname: 'nginx',  // Your backend domain (or Nginx domain)
          pathname: '/media/**',     // Path to the media files, such as /media/*
        },
      ],
    },
  };

export default nextConfig;
