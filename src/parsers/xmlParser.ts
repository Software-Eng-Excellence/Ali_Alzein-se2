import { parseStringPromise } from "xml2js";
import {promises as fs} from "fs";

// xml2js
/**
 * Reads a Xml file and returns a Object.
 * @returns Promise resolving to a 2D array of strings.
 * @param filePath Path to the Xml file.
 */

export async function readXMLFile(filePath: string): Promise<string[][]> {
    try{
        const fileContent= await fs.readFile(filePath, 'utf8');
        const result = await parseStringPromise(fileContent, {trim: true});
        return result;
    }
    catch(error){
        throw new Error(`Error reading file: ${error}`);
    }
}

export function logXmlObject(obj: unknown): string[][] {
  // Extract first textual content from node (handles strings, arrays, { _: "text" })
  function firstString(node: unknown): string | undefined {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) {
      for (const el of node) {
        const s = firstString(el);
        if (s !== undefined) return s;
      }
      return undefined;
    }
    if (typeof node === "object" && node !== null) {
      const rec = node as Record<string, unknown>;
      if (typeof rec._ === "string") return rec._;
      // try any child
      for (const v of Object.values(rec)) {
        const s = firstString(v);
        if (s !== undefined) return s;
      }
    }
    return undefined;
  }

  const globalKeys: string[] = []; // column order (first-seen)
  const rowRecords: Array<Record<string, string>> = [];

  // Collect fields from an object into record; basePath is dotted path used as column key
  function collectFields(node: unknown, basePath: string, record: Record<string, string>) {
    if (node == null) return;
    if (typeof node === "string" || typeof node === "number") {
      const key = basePath || "_";
      const val = String(node);
      if (!(key in record)) record[key] = val;
      if (!globalKeys.includes(key)) globalKeys.push(key);
      return;
    }
    if (Array.isArray(node)) {
      // prefer first stringy item; otherwise flatten by index-join
      const val = firstString(node) ?? "";
      const key = basePath || "_";
      if (!(key in record)) record[key] = val;
      if (!globalKeys.includes(key)) globalKeys.push(key);
      return;
    }
    if (typeof node === "object") {
      const recNode = node as Record<string, unknown>;
      // handle attributes object inserted by xml2js as $
      if (recNode.$ && typeof recNode.$ === "object") {
        for (const [ak, av] of Object.entries(recNode.$ as Record<string, unknown>)) {
          const key = basePath ? `${basePath}.@${ak}` : `@${ak}`;
          const val = firstString(av) ?? "";
          record[key] = val;
          if (!globalKeys.includes(key)) globalKeys.push(key);
        }
      }
      // if the node has a text node `_`, use it as base value
      if (typeof recNode._ === "string") {
        const key = basePath || "_";
        const val = recNode._;
        record[key] = val;
        if (!globalKeys.includes(key)) globalKeys.push(key);
      }
      // iterate child keys and recurse / collect leaves
      for (const [k, v] of Object.entries(recNode)) {
        if (k === "$" || k === "_") continue;
        const newPath = basePath ? `${basePath}.${k}` : k;
        // If v is a primitive or array-of-primitives, extract firstString as leaf
        if (typeof v === "string" || typeof v === "number" || Array.isArray(v)) {
          const val = firstString(v) ?? "";
          if (val !== "") {
            record[newPath] = val;
            if (!globalKeys.includes(newPath)) globalKeys.push(newPath);
          } else {
            // If array of objects or nested object arrays, still recurse so nested fields are discovered
            if (Array.isArray(v)) {
              // check if it's array of objects -> recurse into first object to collect nested keys
              if (v.some((el) => typeof el === "object" && el !== null)) {
                for (const el of v) {
                  if (typeof el === "object" && el !== null) collectFields(el, newPath, record);
                }
              }
            }
          }
        } else if (typeof v === "object" && v !== null) {
          // nested object -> recurse and collect its fields with the newPath
          collectFields(v, newPath, record);
        }
      }
    }
  }

  // Traverse the parsed xml object and treat arrays of objects as row containers
  function traverse(node: unknown, path: string) {
    if (node == null) return;

    if (Array.isArray(node)) {
      // If array contains objects, treat each element as a record candidate
      if (node.length > 0 && node.every((el) => typeof el === "object" && el !== null)) {
        for (const el of node) {
          const record: Record<string, string> = {};
          collectFields(el, "", record); // collect flattened fields for this element
          if (Object.keys(record).length > 0) rowRecords.push(record);
          else {
            // fallback: try collect with the provided path (if empty previous failed)
            const fallback: Record<string, string> = {};
            collectFields(el, path, fallback);
            if (Object.keys(fallback).length > 0) rowRecords.push(fallback);
          }
        }
      } else {
        // else traverse items
        for (const el of node) traverse(el, path);
      }
    } else if (typeof node === "object") {
      const rec = node as Record<string, unknown>;
      for (const [k, v] of Object.entries(rec)) {
        traverse(v, path ? `${path}.${k}` : k);
      }
    }
  }

  // Start traversal from top
  traverse(obj, "");

  // If no rowRecords discovered (unusual XML), try top-level object as single record
  if (rowRecords.length === 0 && typeof obj === "object" && obj !== null) {
    const fallback: Record<string, string> = {};
    collectFields(obj, "", fallback);
    if (Object.keys(fallback).length > 0) rowRecords.push(fallback);
  }

  // Build final rows using globalKeys order (missing fields => "")
  const rows: string[][] = rowRecords.map((rec) => {
    return globalKeys.map((k) => (k in rec ? rec[k] : ""));
  });

  return rows;
}