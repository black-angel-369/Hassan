"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Read on the client only, so the static prerender never bakes in a stale year. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year ?? ""}</span>;
}
