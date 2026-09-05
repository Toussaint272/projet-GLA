module.exports = {
  apps: [
    {
      name: 'backend-api',
      script: './server.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'frontend-app',
      script: 'cmd.exe',
      args: '/c serve -s dist -l 3000',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};