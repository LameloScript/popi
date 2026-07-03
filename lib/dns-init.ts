import dns from "dns";
import { getSetting } from "./db";

let customDnsServer: string | null = null;
let resolverInstance: dns.Resolver | null = null;

export async function reloadDnsConfig() {
  try {
    const dnsIp = await getSetting("custom_dns");
    customDnsServer = dnsIp && dnsIp.trim() !== "" ? dnsIp.trim() : null;
    if (customDnsServer) {
      resolverInstance = new dns.Resolver();
      resolverInstance.setServers([customDnsServer]);
      console.log(`[DNS] Custom DNS configured: ${customDnsServer}`);
    } else {
      resolverInstance = null;
      console.log("[DNS] Custom DNS disabled (using system default)");
    }
  } catch (err) {
    console.error("[DNS] Failed to load DNS config:", err);
  }
}

// Initialize on load
await reloadDnsConfig();

const originalLookup = dns.lookup;

(dns as any).lookup = function (hostname: string, options: any, callback: any) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  if (resolverInstance && !hostname.includes("localhost") && hostname !== "127.0.0.1" && !hostname.endsWith(".local")) {
    resolverInstance.resolve4(hostname, (err, addresses) => {
      if (err || addresses.length === 0) {
        originalLookup(hostname, options, callback);
      } else {
        if (options.all) {
          const results = addresses.map((addr) => ({ address: addr, family: 4 }));
          callback(null, results);
        } else {
          callback(null, addresses[0], 4);
        }
      }
    });
  } else {
    originalLookup(hostname, options, callback);
  }
};
