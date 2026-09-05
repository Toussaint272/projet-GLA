module.exports = {
  apps: [
    {
      name: 'backend-api',
      script: 'server.js', // Changez par 'server.js' ou 'app.js' selon le point d'entrée de votre backend
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'frontend-app',
      script: 'npx',
      args: 'serve -s dist -l 3000',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};