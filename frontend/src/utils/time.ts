export function parseTimeRange(range: string): { start: number; end: number } {
  const end = Math.floor(Date.now() / 1000);
  let start = end - 3600; // default 1h

  const match = range.match(/^(\d+)([shd])$/);
  if (match) {
    const val = parseInt(match[1], 10);
    const unit = match[2];
    let seconds = 0;
    
    switch (unit) {
      case 's': seconds = val; break;
      case 'h': seconds = val * 3600; break;
      case 'd': seconds = val * 86400; break;
    }
    
    start = end - seconds;
  }
  
  return { start, end };
}

export function calculateStep(start: number, end: number, maxPoints: number = 500): string {
  const duration = end - start;
  const step = Math.max(1, Math.floor(duration / maxPoints));
  return `${step}s`;
}

export function formatTimestamp(ts: number): string {
  const date = new Date(ts * 1000);
  return date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
}
