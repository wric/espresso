const apps = [
  {
    name: 'marax',
    script: './backend/marax.mjs',
    node_args: '--no-expose-wasm',
    env: {
      DEBUG: true,
      PORT: 8086,
      PIN: 24,
      SERIAL: '/dev/serial0'
    },
    env_production: {
      DEBUG: false,
      PORT: 8086,
      PIN: 24,
      SERIAL: '/dev/serial0'
    }
  },
  {
    name: 'wilfa',
    script: './backend/wilfa.mjs',
    node_args: '--no-expose-wasm',
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

module.exports = { apps }
