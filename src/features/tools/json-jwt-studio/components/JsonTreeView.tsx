"use client";

import React, { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, Copy, Check, Search, Maximize2, Minimize2 } from "lucide-react";

interface JsonTreeViewProps {
  data: any;
}

export function JsonTreeView({ data }: JsonTreeViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set());
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const toggleCollapse = (path: string) => {
    setCollapsedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const expandAll = () => {
    setCollapsedPaths(new Set());
  };

  const collapseAll = () => {
    // Gather all object/array paths
    const paths = new Set<string>();
    function collectPaths(obj: any, currentPath: string) {
      if (typeof obj === "object" && obj !== null) {
        paths.add(currentPath);
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => collectPaths(item, `${currentPath}[${index}]`));
        } else {
          Object.keys(obj).forEach((key) =>
            collectPaths(obj[key], currentPath ? `${currentPath}.${key}` : key)
          );
        }
      }
    }
    collectPaths(data, "root");
    setCollapsedPaths(paths);
  };

  const handleCopy = (text: string, path: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1800);
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono text-xs">
      {/* Top search & collapse tools */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/50">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keys or values..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-muted/50 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={expandAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors text-xs font-sans cursor-pointer"
            title="Expand All"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Expand</span>
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors text-xs font-sans cursor-pointer"
            title="Collapse All"
          >
            <Minimize2 className="w-3 h-3" />
            <span>Collapse</span>
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="overflow-auto max-h-[550px] p-2 rounded-xl bg-card/60 border border-border/40 space-y-1">
        <TreeNode
          name="root"
          value={data}
          path="root"
          collapsedPaths={collapsedPaths}
          onToggle={toggleCollapse}
          onCopy={handleCopy}
          copiedPath={copiedPath}
          searchQuery={searchQuery.toLowerCase()}
        />
      </div>
    </div>
  );
}

interface TreeNodeProps {
  name: string;
  value: any;
  path: string;
  collapsedPaths: Set<string>;
  onToggle: (path: string) => void;
  onCopy: (text: string, path: string) => void;
  copiedPath: string | null;
  searchQuery: string;
  isLast?: boolean;
}

function TreeNode({
  name,
  value,
  path,
  collapsedPaths,
  onToggle,
  onCopy,
  copiedPath,
  searchQuery,
}: TreeNodeProps) {
  const isObject = typeof value === "object" && value !== null;
  const isArray = Array.isArray(value);
  const isCollapsed = collapsedPaths.has(path);

  // Check search query match
  const matchesSearch = useMemo(() => {
    if (!searchQuery) return true;
    if (name.toLowerCase().includes(searchQuery)) return true;
    if (!isObject && String(value).toLowerCase().includes(searchQuery)) return true;
    return false;
  }, [name, value, isObject, searchQuery]);

  if (isObject) {
    const keys = Object.keys(value);
    const count = keys.length;
    const bracketOpen = isArray ? "[" : "{";
    const bracketClose = isArray ? "]" : "}";
    const typeLabel = isArray ? `Array(${count})` : `Object(${count})`;

    return (
      <div className="pl-3 border-l border-border/30 my-0.5">
        <div className="flex items-center gap-1 group py-0.5 hover:bg-muted/40 rounded px-1 transition-colors">
          <button
            type="button"
            onClick={() => onToggle(path)}
            className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-primary" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-primary" />
            )}
          </button>

          {name !== "root" && (
            <span
              className={`font-semibold ${
                matchesSearch && searchQuery ? "bg-amber-500/20 text-amber-300 px-1 rounded" : "text-primary"
              }`}
            >
              {isArray ? `[${name}]` : `"${name}"`}:
            </span>
          )}

          <span
            onClick={() => onToggle(path)}
            className="cursor-pointer text-muted-foreground text-[11px] hover:underline"
          >
            {bracketOpen}
            {isCollapsed && (
              <span className="text-muted-foreground mx-1 italic">... {count} items</span>
            )}
            {isCollapsed && bracketClose}
          </span>

          <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted/60 text-muted-foreground">
            {typeLabel}
          </span>

          {/* Quick Copy Path button */}
          <button
            type="button"
            onClick={() => onCopy(JSON.stringify(value, null, 2), path)}
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
            title="Copy Subtree JSON"
          >
            {copiedPath === path ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="space-y-0.5">
            {keys.map((k) => (
              <TreeNode
                key={k}
                name={k}
                value={value[k]}
                path={isArray ? `${path}[${k}]` : `${path}.${k}`}
                collapsedPaths={collapsedPaths}
                onToggle={onToggle}
                onCopy={onCopy}
                copiedPath={copiedPath}
                searchQuery={searchQuery}
              />
            ))}
            <div className="text-muted-foreground py-0.5 pl-4">{bracketClose}</div>
          </div>
        )}
      </div>
    );
  }

  // Primitive value
  let valueColor = "text-foreground";
  let displayValue = String(value);

  if (typeof value === "string") {
    valueColor = "text-emerald-500 dark:text-emerald-400";
    displayValue = `"${value}"`;
  } else if (typeof value === "number") {
    valueColor = "text-sky-500 dark:text-sky-400";
  } else if (typeof value === "boolean") {
    valueColor = "text-purple-500 dark:text-purple-400";
  } else if (value === null) {
    valueColor = "text-rose-400 italic";
    displayValue = "null";
  }

  const isMatched = matchesSearch && searchQuery;

  return (
    <div className="flex items-center gap-1.5 pl-6 py-0.5 group hover:bg-muted/30 rounded px-1 transition-colors">
      <span
        className={`font-semibold ${
          isMatched && name.toLowerCase().includes(searchQuery)
            ? "bg-amber-500/20 text-amber-300 px-1 rounded"
            : "text-foreground/80"
        }`}
      >
        {name}:
      </span>

      <span
        className={`break-all ${valueColor} ${
          isMatched && displayValue.toLowerCase().includes(searchQuery)
            ? "bg-amber-500/20 font-bold px-1 rounded"
            : ""
        }`}
      >
        {displayValue}
      </span>

      <button
        type="button"
        onClick={() => onCopy(String(value), path)}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
        title="Copy Value"
      >
        {copiedPath === path ? (
          <Check className="w-3 h-3 text-emerald-500" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    </div>
  );
}
