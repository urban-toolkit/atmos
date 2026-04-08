// src/types/atmos.ts

/**
 * -----------------------------
 * Server Manifest (runtime)
 * -----------------------------
 * This is the *output* of atmos-server (run/compile).
 * Keep it small, stable, and tolerant of extra fields as the server evolves.
 */

export type ArtifactFormat =
  | "geojson"
  | "json"
  | "csv"
  | "png"
  | "jpeg"
  | "webp"
  | "bin"
  | string // allow new formats without breaking frontend builds

export type ArtifactRef = {
  /** stable artifact id in the manifest */
  id: string
  format: ArtifactFormat
  /** path relative to baseUrl, or absolute depending on server */
  path: string
  /** which producer step created it (compiler/executor step id) */
  producerStep: string
  /** optional metadata the renderer/interpreter can use */
  metadata?: Record<string, unknown>
}

export type ManifestUIState = {
  /**
   * For the global time slider: maximum valid time index.
   * (You already read this as (manifest as any)?.uiState?.timeMax)
   */
  timeMax?: number

  /**
   * Future UI/runtime knobs can live here:
   * timeMin?: number
   * selectedMember?: number
   * etc.
   */
  // [k: string]: unknown
}

export type Manifest = {
  kind: string
  schemaVersion: string

  artifacts: ArtifactRef[]

  /**
   * Optional runtime UI state computed by the server
   * (or later by the client).
   */
  uiState?: ManifestUIState

  /**
   * Allow forward-compatible expansion without constantly updating types.
   * (If you prefer stricter typing, remove this.)
   */
  [k: string]: unknown
}

/**
 * -----------------------------
 * View State (MapLibre)
 * -----------------------------
 * Keep here so both App + Map components share it.
 */
export type ViewState = {
  center: [number, number]
  zoom: number
  bearing: number
  pitch: number
}

/**
 * -----------------------------
 * Spec types (optional for now)
 * -----------------------------
 * Start minimal: you can gradually replace `any` with these.
 */

export type TimeIndexSpec = {
  type: "index"
  value: number
}

export type LayoutSpec = {
  columns?: number
  [k: string]: unknown
}

export type ViewSpec = {
  time?: TimeIndexSpec
  [k: string]: unknown
}

export type CompositionSpec = {
  views?: ViewSpec[]
  time?: TimeIndexSpec
  layout?: LayoutSpec
  [k: string]: unknown
}

export type AtmosSpecV01 = {
  composition?: CompositionSpec
  [k: string]: unknown
}

export type RenderMetadata = {
  renderer?: "maplibre" | "webgl" | string
  [k: string]: unknown
}

export type RunSpecResult = {
  manifest: Manifest
  baseUrl?: string
}