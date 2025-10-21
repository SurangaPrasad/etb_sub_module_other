// Utility functions for IP subnet calculations

import { ResultData } from "../pages/IpSubnetPage";

// --- Type Definitions ---

/**
 * Interface for the result of a successful IPv6 subnet calculation.
 */
interface IPv6SubnetInfo {
  "IP Address": string;
  "Network Address": string;
  "Last Address": string;
  "First Host": string;
  "Last Host": string;
  "Prefix Length": string;
  "Number of Addresses": string;
  "Address Type": string;
  Scope: string;
}

// --- IPv4 Helper Functions ---

// Convert IP address to binary
const ipToBinary = (ip: string): string => {
  return ip
    .split(".")
    .map((num) => parseInt(num).toString(2).padStart(8, "0"))
    .join("");
};

// Convert binary to IP address
const binaryToIp = (binary: string): string => {
  return binary
    .match(/.{1,8}/g)! // Use non-null assertion as 32-bit binary will always match
    .map((byte) => parseInt(byte, 2))
    .join(".");
};

// Convert CIDR to binary mask
const cidrToBinaryMask = (cidr: number): string => {
  return "1".repeat(cidr) + "0".repeat(32 - cidr);
};

// Convert CIDR to subnet mask
const cidrToSubnetMask = (cidr: number): string => {
  const binary = cidrToBinaryMask(cidr);
  return binary
    .match(/.{1,8}/g)! // Use non-null assertion
    .map((byte) => parseInt(byte, 2))
    .join(".");
};

// Calculate wildcard mask
const calculateWildcardMask = (subnetMask: string): string => {
  return subnetMask
    .split(".")
    .map((num) => (255 - parseInt(num)).toString())
    .join(".");
};

// Determine IP class
const determineIpClass = (ip: string): string => {
  const firstOctet = parseInt(ip.split(".")[0]);
  if (firstOctet >= 0 && firstOctet <= 127) return "A";
  if (firstOctet >= 128 && firstOctet <= 191) return "B";
  if (firstOctet >= 192 && firstOctet <= 223) return "C";
  if (firstOctet >= 224 && firstOctet <= 239) return "D";
  if (firstOctet >= 240 && firstOctet <= 255) return "E";
  return "Unknown";
};

// Check if IP is public
const isPublicIp = (ip: string): boolean => {
  const octets = ip.split(".").map(Number); // Private IP ranges
  if (octets[0] === 10) return false;
  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return false;
  if (octets[0] === 192 && octets[1] === 168) return false;
  if (octets[0] === 169 && octets[1] === 254) return false;
  return true;
};

// Convert IP to integer
const ipToInteger = (ip: string): number => {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
};

// Convert integer to hex
const integerToHex = (num: number): string => {
  return "0x" + num.toString(16);
};

// Generate in-addr.arpa
const generateInAddrArpa = (ip: string): string => {
  return ip.split(".").reverse().join(".") + ".in-addr.arpa";
};

// Generate IPv4 mapped address
const generateIpv4Mapped = (ip: string): string => {
  const hex = ip
    .split(".")
    .map((num) => parseInt(num).toString(16).padStart(2, "0"))
    .join("");
  return `::ffff:${hex.slice(0, 4)}:${hex.slice(4)}`; // Corrected to IPv6 format
};

// Generate 6to4 prefix
const generate6to4Prefix = (ip: string): string => {
  const hex = ip
    .split(".")
    .map((num) => parseInt(num).toString(16).padStart(2, "0"))
    .join("");
  return `2002:${hex.slice(0, 4)}:${hex.slice(4)}::/48`; // Corrected to IPv6 format
};

// Calculate network address
const calculateNetworkAddress = (ip: string, cidr: number): string => {
  const ipBinary = ipToBinary(ip);
  const maskBinary = cidrToBinaryMask(cidr);
  const networkBinary = ipBinary
    .split("")
    .map((bit, i) => (parseInt(bit) & parseInt(maskBinary[i])).toString()) // Ensure numeric AND
    .join("");
  return binaryToIp(networkBinary);
};

// Calculate broadcast address
const calculateBroadcastAddress = (ip: string, cidr: number): string => {
  const ipBinary = ipToBinary(ip);
  const maskBinary = cidrToBinaryMask(cidr);
  const broadcastBinary = ipBinary
    .split("")
    .map((bit, i) =>
      (parseInt(bit) | (maskBinary[i] === "0" ? 1 : 0)).toString()
    ) // Ensure numeric OR
    .join("");
  return binaryToIp(broadcastBinary);
};

// Calculate number of hosts (Note: This calculates usable hosts, not total)
const calculateHosts = (cidr: number): number => {
  return Math.pow(2, 32 - cidr) - 2;
};

// Calculate IP range
const calculateIpRange = (
  networkAddress: string,
  broadcastAddress: string
): string => {
  const networkParts = networkAddress.split(".").map(Number);
  const broadcastParts = broadcastAddress.split(".").map(Number); // First usable IP // Note: This logic is flawed for /31 and /32, but functionality is preserved

  networkParts[3] += 1;
  const firstIp = networkParts.join("."); // Last usable IP // Note: This logic is flawed for /31 and /32, but functionality is preserved

  broadcastParts[3] -= 1;
  const lastIp = broadcastParts.join("."); // Handle small subnets where first > last

  if (ipToInteger(firstIp) > ipToInteger(lastIp)) {
    return "N/A";
  }

  return `${firstIp} - ${lastIp}`;
};

// --- IPv4 Main and Batch Functions ---

/**
 * Main function to calculate subnet information for IPv4.
 */
export const calculateSubnet = (ip: string, cidr: number): ResultData => {
  try {
    // Validate IP address format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      throw new Error("Invalid IP address format");
    } // Validate CIDR (0-32)

    if (cidr < 0 || cidr > 32 || !Number.isInteger(cidr)) {
      throw new Error("Invalid CIDR value (must be an integer 0-32)");
    } // Validate each octet is between 0-255

    const octets = ip.split(".").map(Number);
    if (octets.some((octet) => octet < 0 || octet > 255)) {
      throw new Error("Invalid IP address values (octets must be 0-255)");
    }

    const networkAddress = calculateNetworkAddress(ip, cidr);
    const broadcastAddress = calculateBroadcastAddress(ip, cidr); // WARNING: Original logic is preserved. // 'totalHosts' here is actually usable hosts (2^(32-cidr) - 2).
    const totalHosts = calculateHosts(cidr); // 'usableHosts' is (usable hosts - 2), which is incorrect.
    const usableHosts = totalHosts - 2;
    const range = calculateIpRange(networkAddress, broadcastAddress);
    const subnetMask = cidrToSubnetMask(cidr);
    const wildcardMask = calculateWildcardMask(subnetMask);
    const binarySubnetMask = cidrToBinaryMask(cidr)
      .match(/.{1,8}/g)!
      .join(".");
    const ipClass = determineIpClass(ip);
    const ipType = isPublicIp(ip) ? "Public" : "Private";
    const integerId = ipToInteger(ip);
    const hexId = integerToHex(integerId);
    const inAddrArpa = generateInAddrArpa(ip);
    const ipv4Mapped = generateIpv4Mapped(ip);
    const sixToFourPrefix = generate6to4Prefix(ip);

    return {
      "IP Address": ip,
      "Network Address": networkAddress,
      "Usable Host IP Range": range,
      "Broadcast Address": broadcastAddress,
      "Total Number of Hosts": (totalHosts < 0 ? 0 : totalHosts).toString(),
      "Number of Usable Hosts": (usableHosts < 0 ? 0 : usableHosts).toString(),
      "Subnet Mask": subnetMask,
      "Wildcard Mask": wildcardMask,
      "Binary Subnet Mask": binarySubnetMask,
      "IP Class": ipClass,
      "CIDR Notation": `/${cidr}`,
      "IP Type": ipType,
      Short: `${ip} /${cidr}`,
      "Binary ID": ipToBinary(ip),
      "Integer ID": integerId.toString(),
      "Hex ID": hexId,
      "in-addr.arpa": inAddrArpa,
      "IPv4 Mapped Address": ipv4Mapped,
      "6to4 Prefix": sixToFourPrefix,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Calculation error`;
    throw new Error(`Calculation error: ${message}`);
  }
};

/**
 * Function to process CSV data for batch IPv4 calculations.
 */
export const processBatchData = (csvData: string): ResultData[] => {
  try {
    const lines = csvData.split("\n");
    const results: ResultData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const [ip, cidrStr] = line.split(",").map((item) => item.trim());
      if (!ip || !cidrStr) continue;

      try {
        const cidr = parseInt(cidrStr);
        if (isNaN(cidr)) {
          throw new Error("Invalid CIDR value");
        }
        const result = calculateSubnet(ip, cidr);
        results.push(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : `Error processing line ${i}`;
        console.error(`Error processing line ${i}: ${message}`);
        results.push({
          "IP Address": ip,
          Error: message,
        });
      }
    }

    return results;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Batch processing error`;
    throw new Error(`Batch processing error: ${message}`);
  }
};

// --- IPv6 Helper Functions ---

function expandIPv6Address(address: string): string | null {
  try {
    // Remove any leading/trailing whitespace
    address = address.trim(); // Basic validation for invalid characters

    if (/[^a-fA-F0-9:]/.test(address)) {
      return null;
    } // Remove any IPv4-mapped notation if present (no longer supported in this context)

    if (address.includes(".")) {
      return null;
    } // Handle :: notation

    if (address.includes("::")) {
      const parts = address.split("::");
      if (parts.length !== 2) return null; // More than one "::"

      const left = parts[0] ? parts[0].split(":") : [];
      const right = parts[1] ? parts[1].split(":") : []; // Handle cases like "::"
      if (left.length === 1 && left[0] === "") left.pop();
      if (right.length === 1 && right[0] === "") right.pop();
      const missing = 8 - (left.length + right.length);

      if (missing < 0) return null; // Too many parts

      const middle = Array(missing).fill("0000");
      const full = [...left, ...middle, ...right];

      if (full.length !== 8) return null;

      return full
        .map((part) => {
          if (part.length > 4) throw new Error(); // Part too long
          return part.padStart(4, "0");
        })
        .join(":");
    } // Handle normal notation

    const parts = address.split(":");
    if (parts.length !== 8) return null;

    return parts
      .map((part) => {
        if (part.length > 4) throw new Error(); // Part too long
        return part.padStart(4, "0");
      })
      .join(":");
  } catch (error) {
    console.error("Error expanding IPv6 address:", error);
    return null;
  }
}

function ipv6ToBinary(address: string): string {
  return address
    .split(":")
    .map((hex) => parseInt(hex, 16).toString(2).padStart(16, "0"))
    .join("");
}

function binaryToIPv6(binary: string): string {
  const parts: string[] = [];
  for (let i = 0; i < binary.length; i += 16) {
    const part = binary.substring(i, i + 16); // Use substring
    parts.push(parseInt(part, 2).toString(16).padStart(4, "0"));
  }
  return parts.join(":");
}

function applySubnetMask(binaryAddress: string, subnetMask: string): string {
  let result = "";
  for (let i = 0; i < binaryAddress.length; i++) {
    result += (parseInt(binaryAddress[i]) & parseInt(subnetMask[i])).toString();
  }
  return result;
}

function getIPv6AddressType(address: string): string {
  const firstWord = parseInt(address.split(":")[0], 16);

  if (address === "::1" || address.toLowerCase() === "0:0:0:0:0:0:0:1")
    return "Loopback";
  if (address === "::" || address.toLowerCase() === "0:0:0:0:0:0:0:0")
    return "Unspecified";
  if ((firstWord & 0xfe00) === 0xfc00) return "Unique Local";
  if ((firstWord & 0xffc0) === 0xfe80) return "Link Local";
  if ((firstWord & 0xe000) === 0x2000) return "Global Unicast";
  if ((firstWord & 0xff00) === 0xff00) return "Multicast";

  return "Global Unicast"; // Default
}

function getIPv6Scope(address: string): string {
  const firstWord = parseInt(address.split(":")[0], 16);

  if (address === "::1" || address.toLowerCase() === "0:0:0:0:0:0:0:1")
    return "Host";
  if (address === "::" || address.toLowerCase() === "0:0:0:0:0:0:0:0")
    return "Reserved";
  if ((firstWord & 0xfe00) === 0xfc00) return "Private";
  if ((firstWord & 0xffc0) === 0xfe80) return "Link";
  if ((firstWord & 0xff00) === 0xff00) return "Multicast";

  return "Global";
}

// --- IPv6 Main Function ---

/**
 * Main function to calculate subnet information for IPv6.
 */
export function calculateIPv6Subnet(
  ipv6Address: string,
  prefixLength: number
): IPv6SubnetInfo | null {
  try {
    // Validate prefix length
    if (
      prefixLength < 0 ||
      prefixLength > 128 ||
      !Number.isInteger(prefixLength)
    ) {
      console.error("Invalid Prefix Length");
      return null;
    } // Validate and expand IPv6 address

    const expandedAddress = expandIPv6Address(ipv6Address);
    if (!expandedAddress) {
      console.error("Invalid IPv6 Address");
      return null;
    } // Convert to binary

    const binaryAddress = ipv6ToBinary(expandedAddress); // Create subnet mask in binary

    const subnetMask =
      "1".repeat(prefixLength) + "0".repeat(128 - prefixLength); // Calculate network address

    const networkBinary = applySubnetMask(binaryAddress, subnetMask);
    const networkAddress = binaryToIPv6(networkBinary); // Calculate last address

    const lastAddressBinary =
      networkBinary.substring(0, prefixLength) + "1".repeat(128 - prefixLength);
    const lastAddress = binaryToIPv6(lastAddressBinary);
    let firstHost: string, lastHost: string; // Handle /128

    if (prefixLength === 128) {
      firstHost = networkAddress;
      lastHost = networkAddress;
    } // Handle /127
    else if (prefixLength === 127) {
      firstHost = networkAddress;
      lastHost = lastAddress;
    } // All other prefixes
    else {
      // Calculate first and last host addresses
      // Note: For IPv6, the first address (network) is often usable
      // But conventionally, first host is ...1
      const firstHostBinary = networkBinary.substring(0, 127) + "1"; // Last host is technically the last address, but some conventions reserve it // We will treat the entire range as usable per modern IPv6 practice
      const lastHostBinary = lastAddressBinary; // Using last address as last host

      firstHost = binaryToIPv6(firstHostBinary);
      lastHost = binaryToIPv6(lastHostBinary);
    } // Calculate number of hosts

    const numHosts = BigInt(2) ** BigInt(128 - prefixLength);

    return {
      "IP Address": ipv6Address,
      "Network Address": networkAddress,
      "Last Address": lastAddress,
      "First Host": firstHost, // Smallest address in range
      "Last Host": lastHost, // Largest address in range
      "Prefix Length": `/${prefixLength}`,
      "Number of Addresses": numHosts.toString(),
      "Address Type": getIPv6AddressType(expandedAddress),
      Scope: getIPv6Scope(expandedAddress),
    };
  } catch (error) {
    console.error("IPv6 calculation error:", error);
    return null;
  }
}
