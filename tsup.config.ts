import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: [
      'src/index.ts'
    ],
    dts: true,
    clean: true,
    outDir: 'dist',
    format: [
      'esm',
      'cjs'
    ]
  }
])