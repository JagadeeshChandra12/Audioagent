export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string | undefined,
  wsUrl: import.meta.env.VITE_WS_URL as string | undefined,
  vapiBaseUrl: import.meta.env.VITE_VAPI_BASE_URL as string | undefined,
  vapiPublicKey: import.meta.env.VITE_VAPI_PUBLIC_KEY as string | undefined,
}

export const hasRemoteApi = Boolean(env.apiBaseUrl)
export const hasRemoteWebSocket = Boolean(env.wsUrl)
export const hasVapiConfig = Boolean(env.vapiBaseUrl || env.vapiPublicKey)
