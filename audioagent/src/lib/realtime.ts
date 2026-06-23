type RealtimeHandler<T> = (payload: T) => void

export class RealtimeClient<T> {
  private socket: WebSocket | null = null
  private readonly url?: string

  constructor(url?: string) {
    this.url = url
  }

  connect(onMessage: RealtimeHandler<T>, onStatus?: (status: 'connected' | 'disconnected') => void) {
    if (!this.url) {
      onStatus?.('disconnected')
      return () => undefined
    }

    this.socket = new WebSocket(this.url)
    this.socket.onopen = () => onStatus?.('connected')
    this.socket.onclose = () => onStatus?.('disconnected')
    this.socket.onmessage = (event) => onMessage(JSON.parse(event.data) as T)

    return () => {
      this.socket?.close()
      this.socket = null
    }
  }
}
