/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  }
}

module.exports = nextConfig

// module.exports = {
//   trailingSlash: true,
//   reactStrictMode: true,
//   modularizeImports: {
//     '@mui/icons-material': {
//       transform: '@mui/icons-material/{{member}}',
//     },
//     '@mui/material': {
//       transform: '@mui/material/{{member}}',
//     },
//     '@mui/lab': {
//       transform: '@mui/lab/{{member}}',
//     },
//   },
//   webpack: (config, options) => {
//     // Apply the SVG rule
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ['@svgr/webpack'],
//     });

//     // Apply the fs fallback for non-server environments
//     if (!options.isServer) {
//       config.resolve.fallback = { ...config.resolve.fallback, fs: false };
//     }

//     return config;
//   },
// };
