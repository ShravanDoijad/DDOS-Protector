import { RequestHandler } from 'express';

export interface ShieldConfig {
  redis?: { host?: string; port?: number; password?: string };
  rateLimit?: { [route: string]: [number, number] | undefined; default?: [number, number] };
  honeypot?: { enabled?: boolean; paths?: string[] };
  botDetection?: { enabled?: boolean };
  inputSanitizer?: { enabled?: boolean };
  geoFilter?: { enabled?: boolean; deny?: string[]; allow?: string[] };
  alertWebhook?: string | null;
  thresholds?: { block?: number; tempBlock?: number; slowDown?: number };
}

declare function shield(config?: ShieldConfig): RequestHandler;
export default shield;