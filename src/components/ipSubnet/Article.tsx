import Image from "next/image";
import React from "react";
import triangularMap from "@apps/small-tools/public/triangles-triangular-low-poly.png";

const Article = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      <div className="prose prose-base max-w-none">
        <h1 className="text-4xl font-bold text-black mb-6">
          Understanding IP Subnet Calculation
        </h1>
        <div className="mb-6 relative w-full h-[250px] rounded-2xl overflow-hidden">
          <Image
            src="https://cdn.pixabay.com/photo/2020/10/15/10/22/network-5656534_1280.jpg"
            alt=""
            fill
          />
        </div>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-black mb-3">
              What is IP Subnetting?
            </h2>
            <p className="text-black leading-relaxed text-[18px] ml-3">
              IP subnetting is the process of dividing a larger IP network into
              smaller, more manageable subnetworks (subnets). This practice
              helps in efficient IP address allocation, network management, and
              security implementation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">
              Key Concepts
            </h2>

            <div className="grid gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-2">
                  1. IP Address Structure
                </h3>
                <p className="text-black text-[18px]">
                  An IPv4 address consists of 32 bits divided into four octets
                  (8 bits each), represented in decimal format (e.g.,
                  192.168.1.1). Each octet can have values from 0 to 255.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-2">
                  2. Subnet Mask
                </h3>
                <p className="text-black text-[18px]">
                  A subnet mask is a 32-bit number that helps identify which
                  part of an IP address is the network portion and which part is
                  the host portion. it&apos;s written in the same format as an
                  IP address (e.g., 255.255.255.0).
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-2">
                  3. CIDR Notation
                </h3>
                <p className="text-black text-[18px]">
                  CIDR (Classless Inter-Domain Routing) notation is a compact
                  way to represent a subnet mask. It shows the number of bits
                  used for the network portion (e.g., /24 means 24 bits are used
                  for the network portion).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">
              Important Components
            </h2>

            <div className="grid gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-2">
                  1. Network Address
                </h3>
                <p className="text-black text-[18px]">
                  The network address is the first address in a subnet. It
                  represents the subnet itself and cannot be assigned to any
                  host. it&apos;s calculated by performing a bitwise AND
                  operation between the IP address and subnet mask.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-2">
                  2. Broadcast Address
                </h3>
                <p className="text-black text-[18px]">
                  The broadcast address is the last address in a subnet.
                  it&apos;s used to send data to all hosts in the subnet.
                  it&apos;s calculated by setting all host bits to 1.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-2">
                  3. Usable Host Range
                </h3>
                <p className="text-black text-[18px]">
                  The usable host range includes all IP addresses between the
                  network address and broadcast address. These addresses can be
                  assigned to hosts in the subnet.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-2">
                  4. Number of Hosts
                </h3>
                <p className="text-black text-[18px]">
                  The total number of possible hosts in a subnet is calculated
                  as 2^(32 - CIDR) - 2. The -2 accounts for the network address
                  and broadcast address, which cannot be assigned to hosts.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">
              IPv4 Address Classes
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-black text-[18px] ">
                <li className="flex items-center gap-2">
                  <span className="font-medium">
                    <b>•</b> Class A:
                  </span>
                  <span>0.0.0.0 to 127.255.255.255</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium">
                    <b>•</b> Class B:
                  </span>
                  <span>128.0.0.0 to 191.255.255.255</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium">
                    <b>•</b> Class C:
                  </span>
                  <span>192.0.0.0 to 223.255.255.255</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium">
                    <b>•</b> Class D:
                  </span>
                  <span>224.0.0.0 to 239.255.255.255 (Multicast)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium">
                    <b>•</b> Class E:
                  </span>
                  <span>240.0.0.0 to 255.255.255.255 (Reserved)</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">
              Private IP Ranges
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-black text-[18px]">
                <li>
                  <b>•</b> 10.0.0.0/8
                </li>
                <li>
                  <b>•</b> 172.16.0.0/12
                </li>
                <li>
                  <b>•</b> 192.168.0.0/16
                </li>
                <li>
                  <b>•</b> 169.254.0.0/16 (Link-local)
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">
              Common Subnet Masks
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-black text-[18px]">
                <li>
                  <b>•</b> /8 (255.0.0.0) - Class A
                </li>
                <li>
                  <b>•</b> /16 (255.255.0.0) - Class B
                </li>
                <li>
                  <b>•</b> /24 (255.255.255.0) - Class C
                </li>
                <li>
                  <b>•</b> /32 (255.255.255.255) - Single host
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">
              IPv6 Overview
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">
                    1. IPv6 Address Structure
                  </h3>
                  <p className="text-black text-[18px]">
                    IPv6 addresses are 128 bits long, written as eight groups of
                    four hexadecimal digits, separated by colons (e.g.,
                    2001:0db8:85a3:0000:0000:8a2e:0370:7334).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black mb-2">
                    2. Key Differences from IPv4
                  </h3>
                  <ul className="space-y-2 text-black text-[18px] ml-6">
                    <li>
                      <b>•</b> 128-bit address space (vs 32-bit in IPv4)
                    </li>
                    <li>
                      <b>•</b> Hexadecimal notation (vs decimal in IPv4)
                    </li>
                    <li>
                      <b>•</b> Built-in security features
                    </li>
                    <li>
                      <b>•</b> No broadcast addresses (uses multicast instead)
                    </li>
                    <li>
                      <b>•</b> No need for NAT (larger address space)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black mb-2">
                    3. IPv6 Address Types
                  </h3>
                  <ul className="space-y-2 text-black text-[18px] ml-6">
                    <li>
                      <b>•</b> Unicast: Identifies a single interface
                    </li>
                    <li>
                      <b>•</b> Multicast: Identifies a group of interfaces
                    </li>
                    <li>
                      <b>•</b> Anycast: Identifies a set of interfaces
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black mb-2">
                    4. Special IPv6 Addresses
                  </h3>
                  <ul className="space-y-2 text-black text-[18px] ml-6">
                    <li>
                      <b>•</b> ::/128 - Unspecified address
                    </li>
                    <li>
                      <b>•</b> ::1/128 - Loopback address
                    </li>
                    <li>
                      <b>•</b> fe80::/10 - Link-local addresses
                    </li>
                    <li>
                      <b>•</b> fc00::/7 - Unique local addresses
                    </li>
                    <li>
                      <b>•</b> 2000::/3 - Global unicast addresses
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <Image
              className="mb-4 mt-4"
              src={triangularMap}
              alt="triangles-triangular-low-poly"
            />

            <h2 className="text-xl font-semibold text-black mb-3">
              Practical Example
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-black text-[18px] mb-3">
                Let&apos;s say we have an IP address 192.168.1.100 with a subnet
                mask of 255.255.255.0 (/24):
              </p>
              <ul className="space-y-2 text-black text-[18px] ml-6">
                <li>
                  <b>•</b> Network Address: 192.168.1.0
                </li>
                <li>
                  <b>•</b> Broadcast Address: 192.168.1.255
                </li>
                <li>
                  <b>•</b> Usable Host Range: 192.168.1.1 - 192.168.1.254
                </li>
                <li>
                  <b>•</b> Number of Usable Hosts: 254
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">
              Using Our Calculator
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-black text-[18px] mb-3">
                Our IP Subnet Calculator helps you quickly determine all these
                values for any IP address and subnet mask combination. You can:
              </p>
              <ul className="space-y-2 text-black text-[18px] ml-6">
                <li>
                  <b>•</b> Calculate subnet information for a single IP address
                </li>
                <li>
                  <b>•</b> Process multiple IP addresses in batch using CSV
                  files
                </li>
                <li>
                  <b>•</b> Get detailed information including binary
                  representations
                </li>
                <li>
                  <b>•</b> Determine IP class and type (public/private)
                </li>
                <li>
                  <b>•</b> Generate various IP representations (hex, integer,
                  etc.)
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Article;
