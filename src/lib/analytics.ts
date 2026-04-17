// Simple event tracking system
// Can be extended with Vercel Analytics or Plausible later

interface AnalyticsEvent {
  name: string
  timestamp: number
  data?: Record<string, unknown>
}

class Analytics {
  private events: AnalyticsEvent[] = []

  track(eventName: string, data?: Record<string, unknown>) {
    const event: AnalyticsEvent = {
      name: eventName,
      timestamp: Date.now(),
      data,
    }
    
    this.events.push(event)
    console.log('[Analytics]', eventName, data)
    
    // TODO: Send to actual analytics service in production
  }

  getEvents() {
    return this.events
  }

  getEventCount(eventName: string) {
    return this.events.filter(e => e.name === eventName).length
  }
}

export const analytics = new Analytics()

// Convenience function
export function trackEvent(name: string, data?: Record<string, unknown>) {
  analytics.track(name, data)
}
