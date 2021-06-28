import { UserConfig, defineConfig } from 'vite'

import fs from 'fs'
import prettier from 'prettier'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import svelteSVG from 'vite-plugin-svelte-svg'

const config = defineConfig(({ mode }) => {
  const production = mode === 'production'

  return {
    plugins: [
      svelteSVG({
        svgoConfig: {},
      }),
      svelte({
        emitCss: production,
        compilerOptions: {
          dev: !production,
        },
      }),
      createAssetManifest(production),
    ],
    server: {
      host: 'localhost',
      port: 5000,
    },
    build: {
      sourcemap: true,
    },
    optimizeDeps: {
      allowNodeBuiltins: ['pouchdb-browser', 'pouchdb-utils'],
    },
  } as UserConfig
})

export default config

function createAssetManifest() {
  return {
    name: 'create-asset-manifest',
    enforce: 'post',
    apply: 'build',
    writeBundle() {
      fs.readdir('dist/assets', (err, files) => {
        const paths = [...files.map((f) => `'/assets/${f}'`), '"/index.html"']
        const output = `const manifest = [
           ${paths.join(',\n')}
        ]`
        fs.writeFile(
          './public/asset-manifest.js',
          prettier.format(output, { parser: 'typescript' }),
          (err) => {
            if (err) console.error('failed to create asset manifest ', err)
            console.log('assets > /public/asset-manifest')
          }
        )
      })
    },
  }
}
