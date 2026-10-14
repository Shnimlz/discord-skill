import type { PackageBaseline, DiffResult } from '../core/types.js';

export function compareBaselines(previous: PackageBaseline, current: PackageBaseline): DiffResult {
  const addedRoutes = current.routes.filter((r) => !previous.routes.includes(r));
  const removedRoutes = previous.routes.filter((r) => !current.routes.includes(r));

  const addedEvents = current.gatewayEvents.filter((e) => !previous.gatewayEvents.includes(e));
  const removedEvents = previous.gatewayEvents.filter((e) => !current.gatewayEvents.includes(e));

  const addedBuilders = current.builders.filter((b) => !previous.builders.includes(b));
  const removedBuilders = previous.builders.filter((b) => !current.builders.includes(b));

  const packageVersionChanges: Record<string, { from: string; to: string }> = {};

  for (const [pkg, currVer] of Object.entries(current.packages)) {
    const prevVer = previous.packages[pkg];

    if (prevVer && prevVer !== currVer) {
      packageVersionChanges[pkg] = { from: prevVer, to: currVer };
    }
  }

  return {
    addedRoutes,
    removedRoutes,
    addedEvents,
    removedEvents,
    addedBuilders,
    removedBuilders,
    packageVersionChanges,
  };
}
