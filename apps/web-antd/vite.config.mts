import { Agent } from 'node:https';

import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            // 忽略证书错误
            agent: new Agent({ rejectUnauthorized: false }),
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'https://43.143.11.15:9885',
            ws: true,
          },
        },
      },
    },
  };
});
