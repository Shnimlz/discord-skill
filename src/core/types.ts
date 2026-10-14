export interface DiscordPackageMetadata {
  name: string;
  version: string;
  role: 'facade' | 'types' | 'network' | 'gateway' | 'ui' | 'audio' | 'broker' | 'infra' | 'utility';
  description: string;
}

export interface RouteEntry {
  name: string;
  pathPattern?: string;
  method?: string;
}

export interface GatewayEventEntry {
  name: string;
  opcode?: number;
  description?: string;
}

export interface BuilderComponentEntry {
  name: string;
  kind: 'command' | 'component' | 'embed' | 'modal';
}

export interface PackageBaseline {
  timestamp: string;
  packages: Record<string, string>;
  routes: string[];
  gatewayEvents: string[];
  builders: string[];
}

export interface DiffResult {
  addedRoutes: string[];
  removedRoutes: string[];
  addedEvents: string[];
  removedEvents: string[];
  addedBuilders: string[];
  removedBuilders: string[];
  packageVersionChanges: Record<string, { from: string; to: string }>;
}
