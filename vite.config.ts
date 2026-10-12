import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Só transforma imports com largura pedida; o import simples (?url) mantém o ficheiro original.
    imagetools({ include: /\?(.*&)?w=/ }),
  ],
})
