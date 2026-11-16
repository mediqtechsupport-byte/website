"use client";

import { McpResourceList } from "@/components/ui/mcp-resource-list";
import type { McpResource } from "@/components/ui/mcp-resource-list";
import { useState } from "react";

const RESOURCES: McpResource[] = [
  {
    uri: "file:///Users/ada/work/astralyx/README.md",
    name: "README",
    mimeType: "text/markdown",
    size: 8420,
    server: "filesystem",
  },
  {
    uri: "file:///Users/ada/.ssh/id_rsa",
    name: "SSH key",
    mimeType: "text/plain",
    size: 2602,
    server: "filesystem",
  },
  {
    uri: "postgres://prod/public/customers",
    name: "customers",
    mimeType: "application/json",
    server: "postgres",
  },
  {
    uri: "https://mcp.linear.app/issues/ENG-4127",
    name: "ENG-4127 - retry storm",
    mimeType: "application/json",
    server: "linear",
  },
];

export default function ResourcePicker() {
  const [picked, setPicked] = useState([
    "file:///Users/ada/work/astralyx/README.md",
  ]);

  return (
    <div className="w-full max-w-2xl">
      <McpResourceList
        resources={RESOURCES}
        value={picked}
        onValueChange={setPicked}
      />
    </div>
  );
}
