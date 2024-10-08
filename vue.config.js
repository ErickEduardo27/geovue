const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig(
  {
    transpileDependencies: true
  },
  eslintOptions = {
    globals: {
      google: 'readonly', // Declara 'google' como una variable global de solo lectura
    },
  },
)
