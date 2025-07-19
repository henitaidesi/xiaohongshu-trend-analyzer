import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@services': resolve(__dirname, 'src/services'),
      '@store': resolve(__dirname, 'src/store'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  
  // 构建配置
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方库分离
          vendor: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd'],
          charts: ['echarts', 'echarts-for-react'],
          utils: ['lodash-es', 'dayjs', 'axios'],
        },
        // 文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // 压缩配置
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // 资源内联阈值
    assetsInlineLimit: 4096,
  },
  
  // CSS 配置
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // Ant Design 主题定制
          '@primary-color': '#ff2442',
          '@link-color': '#ff2442',
          '@success-color': '#52c41a',
          '@warning-color': '#faad14',
          '@error-color': '#ff4d4f',
          '@font-size-base': '14px',
          '@heading-color': '#262626',
          '@text-color': '#262626',
          '@text-color-secondary': '#8c8c8c',
          '@disabled-color': '#bfbfbf',
          '@border-radius-base': '6px',
          '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
  
  // 环境变量
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    // 确保process.env在浏览器中可用
    'process.env': {},
  },

  // 环境变量前缀
  envPrefix: ['VITE_', 'REACT_APP_'],
  
  // 优化配置
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      'echarts',
      'echarts-for-react',
      'lodash-es',
      'dayjs',
      'axios',
      'zustand',
      'styled-components',
    ],
  },
});
