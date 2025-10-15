module.exports = {
  apps: [{
    name: 'anfibius-marketing',
    script: 'app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 42069,
      HOST: 'localhost',
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      SSL_KEY: '/etc/ssl/private/anfibiusrecursos.key',
      SSL_CERT: '/etc/ssl/certs/anfibiusrecursos.crt'
    }
}] 
};
