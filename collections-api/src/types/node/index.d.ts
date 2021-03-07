export const enum NodeEnv {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: NodeEnv
    }
  }
}
