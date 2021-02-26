// Navigation (renderer)

export * from "./history";
export * from "./helpers";

export async function bindNavigationHandlers() {
  const { bindEvents } = await import("./events");
  const { bindProtocolHandlers } = await import("./protocol-handlers");

  bindEvents();
  bindProtocolHandlers();
}
