declare global {
  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  interface ViteEnv {
    BASE_DIR: string
    VITE_BUILD_NAME: string
    VITE_PORT: number
    VITE_BASE_API: string
    VITE_PROXY: string
  }
}
