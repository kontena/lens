import { LensProtocolRouterRenderer } from "../protocol-handler";
import { navigate } from "./helpers";

export function bindProtocolHandlers() {
  const lprr = LensProtocolRouterRenderer.getInstance<LensProtocolRouterRenderer>();

  lprr.addInternalHandler("/preferences", () => {
    navigate("/preferences");
  });
}
