module.exports = {
    apps: [
      {
        name: 'go out',
        script: 'dist/src/index.js',
        exec_mode: 'cluster',
        instances: 2,
        kill_timeout: 5000,
        autorestart: true,
        max_restarts: 10,
        watch: true,
      },
    ],
  };
  