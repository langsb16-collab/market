module.exports = {
  apps: [
    {
      name: 'webapp-static',
      script: 'npx',
      args: 'http-server -p 3000 -c-1',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10
    }
  ]
}
