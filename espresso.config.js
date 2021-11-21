module.exports = {
  apps: [
    {
      name: 'marax',
      namespace: 'espresso',
      script: 'src/marax.js',
      env: {
        DEBUG: true,
        PORT: 8086,
        PIN: 17,
        SERIAL: '/dev/serial0'
      },
      env_production: {
        DEBUG: false,
        PORT: 8086,
        PIN: 17,
        SERIAL: '/dev/serial0'
      }
    },
    {
      name: 'wilfa',
      namespace: 'espresso',
      script: 'src/wilfa.js',
      env: {
        DEBUG: true,
        PORT: 8085
      },
      env_production: {
        DEBUG: false,
        PORT: 8085
      }
    }
  ]
}
