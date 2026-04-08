export interface AtmosSpec {
  constants?: {
    /**
     * Allowed literal types for constants.
     *
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^[A-Z][A-Z0-9_]*$".
     */
    [k: string]: number | string | boolean;
  }[];
  /**
   * @minItems 1
   */
  data: [
    (
      | (({
          [k: string]: unknown;
        } & {
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read dataset dimensions.
           */
          dims:
            | {
                lat: Id;
                lon: Id;
                time: {
                  key: string;
                  dim?: string;
                  type?: string;
                  format?: string;
                  timezone?: string;
                };
                level?: Id;
                member?: Id;
                id?: Id;
              }
            | {
                id: Id;
              };
          /**
           * Topology information for datasets organized over atmospheric coordinates. Omit for generic/reference datasets such as boundaries.
           */
          grid?: {
            type: 'rectilinear' | 'curvilinear' | 'scattered';
          };
          /**
           * Variables/attributes available in the dataset.
           */
          vars?: {
            /**
             * Unique variable identifier (used for referencing in expressions).
             */
            id: string;
            /**
             * Key to access the variable in the data source.
             */
            key: string;
          }[];
          [k: string]: unknown;
        } & {
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read dataset dimensions.
           */
          dims:
            | {
                lat: Id;
                lon: Id;
                time: {
                  key: string;
                  dim?: string;
                  type?: string;
                  format?: string;
                  timezone?: string;
                };
                level?: Id;
                member?: Id;
                id?: Id;
              }
            | {
                id: Id;
              };
          /**
           * Topology information for datasets organized over atmospheric coordinates. Omit for generic/reference datasets such as boundaries.
           */
          grid?: {
            type: 'rectilinear' | 'curvilinear' | 'scattered';
          };
          /**
           * Variables/attributes available in the dataset.
           */
          vars?: {
            /**
             * Unique variable identifier (used for referencing in expressions).
             */
            id: string;
            /**
             * Key to access the variable in the data source.
             */
            key: string;
          }[];
          [k: string]: unknown;
        }) & {
          /**
           * Defaults to 'dataset' if omitted.
           */
          type?: 'dataset';
          /**
           * How to access the dataset bytes (path/url/etc).
           */
          source: {
            type: 'netcdf' | 'zarr' | 'csv' | 'json' | 'url' | 'geojson';
            /**
             * Path to a local file/folder (for file-based sources).
             */
            path: string;
          };
          [k: string]: unknown;
        })
      | (({
          [k: string]: unknown;
        } & {
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read dataset dimensions.
           */
          dims:
            | {
                lat: Id;
                lon: Id;
                time: {
                  key: string;
                  dim?: string;
                  type?: string;
                  format?: string;
                  timezone?: string;
                };
                level?: Id;
                member?: Id;
                id?: Id;
              }
            | {
                id: Id;
              };
          /**
           * Topology information for datasets organized over atmospheric coordinates. Omit for generic/reference datasets such as boundaries.
           */
          grid?: {
            type: 'rectilinear' | 'curvilinear' | 'scattered';
          };
          /**
           * Variables/attributes available in the dataset.
           */
          vars?: {
            /**
             * Unique variable identifier (used for referencing in expressions).
             */
            id: string;
            /**
             * Key to access the variable in the data source.
             */
            key: string;
          }[];
          [k: string]: unknown;
        } & {
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read dataset dimensions.
           */
          dims:
            | {
                lat: Id;
                lon: Id;
                time: {
                  key: string;
                  dim?: string;
                  type?: string;
                  format?: string;
                  timezone?: string;
                };
                level?: Id;
                member?: Id;
                id?: Id;
              }
            | {
                id: Id;
              };
          /**
           * Topology information for datasets organized over atmospheric coordinates. Omit for generic/reference datasets such as boundaries.
           */
          grid?: {
            type: 'rectilinear' | 'curvilinear' | 'scattered';
          };
          /**
           * Variables/attributes available in the dataset.
           */
          vars?: {
            /**
             * Unique variable identifier (used for referencing in expressions).
             */
            id: string;
            /**
             * Key to access the variable in the data source.
             */
            key: string;
          }[];
          [k: string]: unknown;
        }) & {
          type: 'collection';
          /**
           * Defines the set of members in the collection.
           */
          members:
            | {
                count: number;
                indexStart?: number;
                /**
                 * Template for member ids, e.g., 'm{index}'.
                 */
                idPattern: string;
              }
            | {
                /**
                 * @minItems 1
                 */
                ids: [string, ...string[]];
              };
          /**
           * How to access each member asset, using templates like {index} or {id}.
           */
          sourceTemplate: {
            type: 'netcdf' | 'zarr' | 'csv' | 'json' | 'url' | 'geojson';
            /**
             * Template for local paths, e.g., '/ens/member_{index}/wrfout.nc' or '/ens/{id}/wrfout.nc'.
             */
            pathTemplate: string;
          };
          [k: string]: unknown;
        })
    ),
    ...(
      | (({
          [k: string]: unknown;
        } & {
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read dataset dimensions.
           */
          dims:
            | {
                lat: Id;
                lon: Id;
                time: {
                  key: string;
                  dim?: string;
                  type?: string;
                  format?: string;
                  timezone?: string;
                };
                level?: Id;
                member?: Id;
                id?: Id;
              }
            | {
                id: Id;
              };
          /**
           * Topology information for datasets organized over atmospheric coordinates. Omit for generic/reference datasets such as boundaries.
           */
          grid?: {
            type: 'rectilinear' | 'curvilinear' | 'scattered';
          };
          /**
           * Variables/attributes available in the dataset.
           */
          vars?: {
            /**
             * Unique variable identifier (used for referencing in expressions).
             */
            id: string;
            /**
             * Key to access the variable in the data source.
             */
            key: string;
          }[];
          [k: string]: unknown;
        } & {
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read dataset dimensions.
           */
          dims:
            | {
                lat: Id;
                lon: Id;
                time: {
                  key: string;
                  dim?: string;
                  type?: string;
                  format?: string;
                  timezone?: string;
                };
                level?: Id;
                member?: Id;
                id?: Id;
              }
            | {
                id: Id;
              };
          /**
           * Topology information for datasets organized over atmospheric coordinates. Omit for generic/reference datasets such as boundaries.
           */
          grid?: {
            type: 'rectilinear' | 'curvilinear' | 'scattered';
          };
          /**
           * Variables/attributes available in the dataset.
           */
          vars?: {
            /**
             * Unique variable identifier (used for referencing in expressions).
             */
            id: string;
            /**
             * Key to access the variable in the data source.
             */
            key: string;
          }[];
          [k: string]: unknown;
        }) & {
          /**
           * Defaults to 'dataset' if omitted.
           */
          type?: 'dataset';
          /**
           * How to access the dataset bytes (path/url/etc).
           */
          source: {
            type: 'netcdf' | 'zarr' | 'csv' | 'json' | 'url' | 'geojson';
            /**
             * Path to a local file/folder (for file-based sources).
             */
            path: string;
          };
          [k: string]: unknown;
        })
      | (({
          [k: string]: unknown;
        } & {
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read dataset dimensions.
           */
          dims:
            | {
                lat: Id;
                lon: Id;
                time: {
                  key: string;
                  dim?: string;
                  type?: string;
                  format?: string;
                  timezone?: string;
                };
                level?: Id;
                member?: Id;
                id?: Id;
              }
            | {
                id: Id;
              };
          /**
           * Topology information for datasets organized over atmospheric coordinates. Omit for generic/reference datasets such as boundaries.
           */
          grid?: {
            type: 'rectilinear' | 'curvilinear' | 'scattered';
          };
          /**
           * Variables/attributes available in the dataset.
           */
          vars?: {
            /**
             * Unique variable identifier (used for referencing in expressions).
             */
            id: string;
            /**
             * Key to access the variable in the data source.
             */
            key: string;
          }[];
          [k: string]: unknown;
        } & {
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read dataset dimensions.
           */
          dims:
            | {
                lat: Id;
                lon: Id;
                time: {
                  key: string;
                  dim?: string;
                  type?: string;
                  format?: string;
                  timezone?: string;
                };
                level?: Id;
                member?: Id;
                id?: Id;
              }
            | {
                id: Id;
              };
          /**
           * Topology information for datasets organized over atmospheric coordinates. Omit for generic/reference datasets such as boundaries.
           */
          grid?: {
            type: 'rectilinear' | 'curvilinear' | 'scattered';
          };
          /**
           * Variables/attributes available in the dataset.
           */
          vars?: {
            /**
             * Unique variable identifier (used for referencing in expressions).
             */
            id: string;
            /**
             * Key to access the variable in the data source.
             */
            key: string;
          }[];
          [k: string]: unknown;
        }) & {
          type: 'collection';
          /**
           * Defines the set of members in the collection.
           */
          members:
            | {
                count: number;
                indexStart?: number;
                /**
                 * Template for member ids, e.g., 'm{index}'.
                 */
                idPattern: string;
              }
            | {
                /**
                 * @minItems 1
                 */
                ids: [string, ...string[]];
              };
          /**
           * How to access each member asset, using templates like {index} or {id}.
           */
          sourceTemplate: {
            type: 'netcdf' | 'zarr' | 'csv' | 'json' | 'url' | 'geojson';
            /**
             * Template for local paths, e.g., '/ens/member_{index}/wrfout.nc' or '/ens/{id}/wrfout.nc'.
             */
            pathTemplate: string;
          };
          [k: string]: unknown;
        })
    )[]
  ];
  transform?: (
    | (
        | {
            type: 'derive';
            /**
             * Expression AST node. Either an operator, a variable reference, or a constant.
             */
            expr:
              | {
                  [k: string]: unknown;
                }
              | {
                  /**
                   * Optional dataset id (root.data[i].id) used to disambiguate variable references.
                   */
                  data?: string;
                  /**
                   * Reference to a variable id
                   */
                  var: string;
                }
              | {
                  /**
                   * Constant literal
                   */
                  const: number | string | boolean;
                };
            out: Out;
          }
        | {
            type: 'derive';
            expr: {
              op: 'diagnostic.slp';
              /**
               * @minItems 4
               * @maxItems 4
               */
              args: {
                [k: string]: unknown;
              } & [
                {
                  data: string;
                  var: string;
                  role: 'sp' | 'at2m' | 'wvmr2m' | 'hgt';
                },
                {
                  data: string;
                  var: string;
                  role: 'sp' | 'at2m' | 'wvmr2m' | 'hgt';
                },
                {
                  data: string;
                  var: string;
                  role: 'sp' | 'at2m' | 'wvmr2m' | 'hgt';
                },
                {
                  data: string;
                  var: string;
                  role: 'sp' | 'at2m' | 'wvmr2m' | 'hgt';
                }
              ];
            };
            out: Out;
          }
        | {
            type: 'derive';
            expr: {
              op: 'diagnostic.wind.cartesian' | 'diagnostic.wind.polar';
              /**
               * @minItems 2
               * @maxItems 2
               */
              args: {
                [k: string]: unknown;
              } & [
                {
                  data: string;
                  var: string;
                  role: 'u' | 'v';
                },
                {
                  data: string;
                  var: string;
                  role: 'u' | 'v';
                }
              ];
            };
            out: Out;
          }
      )
    | {
        [k: string]: unknown;
      }
    | {
        type: 'relate';
        by: string | string[];
        /**
         * Relational expression over multiple inputs (match/join/lookup/regrid).
         */
        expr:
          | {
              op: 'match';
              /**
               * @minItems 2
               * @maxItems 2
               */
              args: [Items, Items];
              params?: {
                space?: {
                  method: 'nearest' | 'bilinear' | 'idw' | 'within' | 'exact';
                  maxDistance?: number;
                  k?: number;
                  power?: number;
                  crs?: string;
                };
                time?: {
                  [k: string]: unknown;
                };
                rename?: Rename;
                suffix?: Suffix;
                keep?: {
                  unmatched: 'drop' | 'keep_left' | 'keep_right' | 'keep_both';
                };
              };
            }
          | {
              op: 'join';
              /**
               * @minItems 2
               * @maxItems 2
               */
              args: [Items, Items];
              params?: {
                how?: 'inner' | 'left' | 'right' | 'outer';
                rename?: Rename;
                suffix?: Suffix;
              };
            };
        out: Out;
      }
    | {
        type: 'reduce';
        /**
         * Semantic axis. The compiler maps it to dataset-specific dims/columns (e.g., WRF bottom_top -> level).
         */
        across: 'member' | 'time' | 'space' | 'level';
        /**
         * Reduce expression AST node (numeric reducers and probability reducers).
         */
        expr:
          | {
              op: 'mean' | 'sum' | 'min' | 'max' | 'median' | 'std' | 'var' | 'count' | 'first' | 'last' | 'quantile';
              /**
               * @minItems 1
               * @maxItems 1
               */
              args: [Items1];
              /**
               * Optional reducer parameters (future-proof).
               */
              params?: {
                [k: string]: unknown;
              };
            }
          | {
              op: 'prob';
              /**
               * @minItems 1
               * @maxItems 1
               */
              args: [unknown];
              /**
               * Optional probability params (e.g., missing policy).
               */
              params?: {
                [k: string]: unknown;
              };
            };
        out: Out;
      }
  )[];
  /**
   * A composition arranges multiple views and optionally defines shared time control and cross-view actions.
   */
  composition: {
    /**
     * Optional layout. If omitted and multiple views are provided, the renderer defaults to a single row with one column per view (side-by-side).
     */
    layout?: {
      [k: string]: unknown;
    };
    /**
     * Views in display order. Repeat a view by including multiple ViewSpec objects with different ids (and optionally different time.value).
     *
     * @minItems 1
     */
    views: [
      (
        | ({
            id: string;
            floating?: boolean;
            context?: Context;
            [k: string]: unknown;
          } & {
            frame: {
              type: 'map';
              /**
               * Map projection identifier (kept explicit for future non-Mapbox projections).
               */
              projection?: string;
              /**
               * Optional spatial domain (if omitted, treat as auto).
               */
              domain?: {
                bounds: {
                  west: number;
                  south: number;
                  east: number;
                  north: number;
                };
              };
              /**
               * Optional map camera/navigation state (if omitted, derive from domain or use a default).
               */
              state?: {
                longitude: number;
                latitude: number;
                zoom: number;
                bearing?: number;
                pitch?: number;
              };
            };
            /**
             * @minItems 1
             */
            layers: [
              {
                id: string;
                /**
                 * Geometry layer id (string) or a full GeometrySpec object.
                 */
                geometry:
                  | ({
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      type: 'isoline';
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build: [
                        {
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        },
                        ...{
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          smooth?: boolean;
                          /**
                           * @minItems 2
                           */
                          dash?: [number, number, ...number[]];
                          strokeWidth?: number;
                          label?: {
                            enabled?: boolean;
                            format?: string;
                          };
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'isoband';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build: [
                        {
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        },
                        ...{
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          bandOpacity?: number;
                          edgeStroke?: boolean;
                          strokeWidth?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'point';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          /**
                           * Outline width for point glyphs (px).
                           */
                          strokeWidth?: number;
                          shape?: 'circle' | 'square' | 'triangle' | 'diamond' | 'cross' | 'x';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'mesh';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build?: [
                        {
                          interpolate?: 'nearest' | 'bilinear' | 'bicubic';
                          /**
                           * Fraction of each grid cell area to fill. 1 = full cell (no gaps).
                           */
                          cellFootprint?: number;
                          /**
                           * Soft cap on number of generated cells (used for auto stride).
                           */
                          targetCells?: number;
                        },
                        ...{
                          interpolate?: 'nearest' | 'bilinear' | 'bicubic';
                          /**
                           * Fraction of each grid cell area to fill. 1 = full cell (no gaps).
                           */
                          cellFootprint?: number;
                          /**
                           * Soft cap on number of generated cells (used for auto stride).
                           */
                          targetCells?: number;
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'vector';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Vector field inputs. Either a vector variable reference, components (u/v[/w]), or polar (speed/direction[/w]).
                       */
                      input:
                        | {
                            data: string;
                            var: string;
                            dims?: Dims;
                          }
                        | {
                            data: string;
                            u: string;
                            v: string;
                            w?: string;
                            dims?: Dims;
                          }
                        | {
                            data: string;
                            speed: string;
                            direction: string;
                            directionUnits?: 'deg' | 'rad';
                            directionConvention?: 'from' | 'to';
                            directionReference?: 'north_clockwise' | 'east_counterclockwise';
                            w?: string;
                            dims?: Dims;
                          };
                      sampling?: {
                        skip?: number;
                      };
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          glyph?: {
                            type: 'arrow' | 'barb';
                            /**
                             * Global multiplier for glyph size (not data-driven).
                             */
                            scale?: number;
                          };
                          pivot?: 'tail' | 'middle' | 'tip';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'trajectory';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Input reference for particles/trajectories. Either a single scalar field or multiple named fields, scoped to a dataset.
                       */
                      input:
                        | Input
                        | {
                            data: string;
                            /**
                             * Map of named variable ids (e.g., u/v/w, speed/direction).
                             */
                            vars: {
                              [k: string]: string;
                            };
                          };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          tailLength?: number;
                          headMarker?: boolean;
                          stepSize?: number;
                          maxSteps?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'polygon';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: {
                        data: string;
                      };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          strokeWidth?: number;
                          /**
                           * Optional simplification tolerance (implementation-defined units).
                           */
                          simplify?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'particle';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Input reference for particles/trajectories. Either a single scalar field or multiple named fields, scoped to a dataset.
                       */
                      input:
                        | Input
                        | {
                            data: string;
                            /**
                             * Map of named variable ids (e.g., u/v/w, speed/direction).
                             */
                            vars: {
                              [k: string]: string;
                            };
                          };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          count?: number;
                          lifetime?: number;
                          speedFactor?: number;
                          fade?: number;
                          blendMode?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    });
                /**
                 * Optional rendering mask/clip (static shape or interactive selection-driven).
                 */
                mask?:
                  | {
                      type: 'circle';
                      center: {
                        lon: number;
                        lat: number;
                      };
                      radius: number;
                      radiusUnits?: 'px' | 'm' | 'km';
                      interaction?: {
                        /**
                         * @minItems 1
                         */
                        on: ['move' | 'drag' | 'resize', ...('move' | 'drag' | 'resize')[]];
                        /**
                         * Optional radius limits (for circle masks).
                         */
                        radiusLimits?: {
                          min: number;
                          max: number;
                        };
                        boundsLimits?: Bounds;
                      } & {
                        [k: string]: unknown;
                      };
                    }
                  | {
                      type: 'bbox';
                      bounds: {
                        west: number;
                        south: number;
                        east: number;
                        north: number;
                      };
                      interaction?: {
                        /**
                         * @minItems 1
                         */
                        on: ['move' | 'drag' | 'resize', ...('move' | 'drag' | 'resize')[]];
                        /**
                         * Optional radius limits (for circle masks).
                         */
                        radiusLimits?: {
                          min: number;
                          max: number;
                        };
                        boundsLimits?: Bounds;
                      } & {
                        [k: string]: unknown;
                      };
                    };
                /**
                 * Layer-local interactions (e.g., brush/pick). Mask manipulation lives in mask.interaction.
                 *
                 * @minItems 1
                 */
                interactions?: [
                  (
                    | {
                        type: 'brush';
                        /**
                         * Selection id produced by this brush (local to the view unless routed by composition).
                         */
                        as: string;
                        mode: 'rect' | 'x' | 'y' | 'lasso';
                        on?: 'drag';
                        empty?: 'none' | 'all';
                      }
                    | {
                        type: 'pick';
                        on: 'click' | 'hover';
                        as: string;
                      }
                  ),
                  ...(
                    | {
                        type: 'brush';
                        /**
                         * Selection id produced by this brush (local to the view unless routed by composition).
                         */
                        as: string;
                        mode: 'rect' | 'x' | 'y' | 'lasso';
                        on?: 'drag';
                        empty?: 'none' | 'all';
                      }
                    | {
                        type: 'pick';
                        on: 'click' | 'hover';
                        as: string;
                      }
                  )[]
                ];
              },
              ...{
                id: string;
                /**
                 * Geometry layer id (string) or a full GeometrySpec object.
                 */
                geometry:
                  | ({
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      type: 'isoline';
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build: [
                        {
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        },
                        ...{
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          smooth?: boolean;
                          /**
                           * @minItems 2
                           */
                          dash?: [number, number, ...number[]];
                          strokeWidth?: number;
                          label?: {
                            enabled?: boolean;
                            format?: string;
                          };
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'isoband';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build: [
                        {
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        },
                        ...{
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          bandOpacity?: number;
                          edgeStroke?: boolean;
                          strokeWidth?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'point';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          /**
                           * Outline width for point glyphs (px).
                           */
                          strokeWidth?: number;
                          shape?: 'circle' | 'square' | 'triangle' | 'diamond' | 'cross' | 'x';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'mesh';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build?: [
                        {
                          interpolate?: 'nearest' | 'bilinear' | 'bicubic';
                          /**
                           * Fraction of each grid cell area to fill. 1 = full cell (no gaps).
                           */
                          cellFootprint?: number;
                          /**
                           * Soft cap on number of generated cells (used for auto stride).
                           */
                          targetCells?: number;
                        },
                        ...{
                          interpolate?: 'nearest' | 'bilinear' | 'bicubic';
                          /**
                           * Fraction of each grid cell area to fill. 1 = full cell (no gaps).
                           */
                          cellFootprint?: number;
                          /**
                           * Soft cap on number of generated cells (used for auto stride).
                           */
                          targetCells?: number;
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'vector';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Vector field inputs. Either a vector variable reference, components (u/v[/w]), or polar (speed/direction[/w]).
                       */
                      input:
                        | {
                            data: string;
                            var: string;
                            dims?: Dims;
                          }
                        | {
                            data: string;
                            u: string;
                            v: string;
                            w?: string;
                            dims?: Dims;
                          }
                        | {
                            data: string;
                            speed: string;
                            direction: string;
                            directionUnits?: 'deg' | 'rad';
                            directionConvention?: 'from' | 'to';
                            directionReference?: 'north_clockwise' | 'east_counterclockwise';
                            w?: string;
                            dims?: Dims;
                          };
                      sampling?: {
                        skip?: number;
                      };
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          glyph?: {
                            type: 'arrow' | 'barb';
                            /**
                             * Global multiplier for glyph size (not data-driven).
                             */
                            scale?: number;
                          };
                          pivot?: 'tail' | 'middle' | 'tip';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'trajectory';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Input reference for particles/trajectories. Either a single scalar field or multiple named fields, scoped to a dataset.
                       */
                      input:
                        | Input
                        | {
                            data: string;
                            /**
                             * Map of named variable ids (e.g., u/v/w, speed/direction).
                             */
                            vars: {
                              [k: string]: string;
                            };
                          };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          tailLength?: number;
                          headMarker?: boolean;
                          stepSize?: number;
                          maxSteps?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'polygon';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: {
                        data: string;
                      };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          strokeWidth?: number;
                          /**
                           * Optional simplification tolerance (implementation-defined units).
                           */
                          simplify?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'particle';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Input reference for particles/trajectories. Either a single scalar field or multiple named fields, scoped to a dataset.
                       */
                      input:
                        | Input
                        | {
                            data: string;
                            /**
                             * Map of named variable ids (e.g., u/v/w, speed/direction).
                             */
                            vars: {
                              [k: string]: string;
                            };
                          };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          count?: number;
                          lifetime?: number;
                          speedFactor?: number;
                          fade?: number;
                          blendMode?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    });
                /**
                 * Optional rendering mask/clip (static shape or interactive selection-driven).
                 */
                mask?:
                  | {
                      type: 'circle';
                      center: {
                        lon: number;
                        lat: number;
                      };
                      radius: number;
                      radiusUnits?: 'px' | 'm' | 'km';
                      interaction?: {
                        /**
                         * @minItems 1
                         */
                        on: ['move' | 'drag' | 'resize', ...('move' | 'drag' | 'resize')[]];
                        /**
                         * Optional radius limits (for circle masks).
                         */
                        radiusLimits?: {
                          min: number;
                          max: number;
                        };
                        boundsLimits?: Bounds;
                      } & {
                        [k: string]: unknown;
                      };
                    }
                  | {
                      type: 'bbox';
                      bounds: {
                        west: number;
                        south: number;
                        east: number;
                        north: number;
                      };
                      interaction?: {
                        /**
                         * @minItems 1
                         */
                        on: ['move' | 'drag' | 'resize', ...('move' | 'drag' | 'resize')[]];
                        /**
                         * Optional radius limits (for circle masks).
                         */
                        radiusLimits?: {
                          min: number;
                          max: number;
                        };
                        boundsLimits?: Bounds;
                      } & {
                        [k: string]: unknown;
                      };
                    };
                /**
                 * Layer-local interactions (e.g., brush/pick). Mask manipulation lives in mask.interaction.
                 *
                 * @minItems 1
                 */
                interactions?: [
                  (
                    | {
                        type: 'brush';
                        /**
                         * Selection id produced by this brush (local to the view unless routed by composition).
                         */
                        as: string;
                        mode: 'rect' | 'x' | 'y' | 'lasso';
                        on?: 'drag';
                        empty?: 'none' | 'all';
                      }
                    | {
                        type: 'pick';
                        on: 'click' | 'hover';
                        as: string;
                      }
                  ),
                  ...(
                    | {
                        type: 'brush';
                        /**
                         * Selection id produced by this brush (local to the view unless routed by composition).
                         */
                        as: string;
                        mode: 'rect' | 'x' | 'y' | 'lasso';
                        on?: 'drag';
                        empty?: 'none' | 'all';
                      }
                    | {
                        type: 'pick';
                        on: 'click' | 'hover';
                        as: string;
                      }
                  )[]
                ];
              }[]
            ];
            [k: string]: unknown;
          })
        | ({
            id: string;
            floating?: boolean;
            context?: Context;
            [k: string]: unknown;
          } & {
            frame: {
              type: 'chart';
            };
            /**
             * Dataset id used as the default data source for the Vega-Lite spec.
             */
            input: {
              data?: string;
              [k: string]: unknown;
            };
            /**
             * Raw Vega-Lite specification object, except for the data.
             */
            vegaLite: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          })
      ),
      ...(
        | ({
            id: string;
            floating?: boolean;
            context?: Context;
            [k: string]: unknown;
          } & {
            frame: {
              type: 'map';
              /**
               * Map projection identifier (kept explicit for future non-Mapbox projections).
               */
              projection?: string;
              /**
               * Optional spatial domain (if omitted, treat as auto).
               */
              domain?: {
                bounds: {
                  west: number;
                  south: number;
                  east: number;
                  north: number;
                };
              };
              /**
               * Optional map camera/navigation state (if omitted, derive from domain or use a default).
               */
              state?: {
                longitude: number;
                latitude: number;
                zoom: number;
                bearing?: number;
                pitch?: number;
              };
            };
            /**
             * @minItems 1
             */
            layers: [
              {
                id: string;
                /**
                 * Geometry layer id (string) or a full GeometrySpec object.
                 */
                geometry:
                  | ({
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      type: 'isoline';
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build: [
                        {
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        },
                        ...{
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          smooth?: boolean;
                          /**
                           * @minItems 2
                           */
                          dash?: [number, number, ...number[]];
                          strokeWidth?: number;
                          label?: {
                            enabled?: boolean;
                            format?: string;
                          };
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'isoband';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build: [
                        {
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        },
                        ...{
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          bandOpacity?: number;
                          edgeStroke?: boolean;
                          strokeWidth?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'point';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          /**
                           * Outline width for point glyphs (px).
                           */
                          strokeWidth?: number;
                          shape?: 'circle' | 'square' | 'triangle' | 'diamond' | 'cross' | 'x';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'mesh';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build?: [
                        {
                          interpolate?: 'nearest' | 'bilinear' | 'bicubic';
                          /**
                           * Fraction of each grid cell area to fill. 1 = full cell (no gaps).
                           */
                          cellFootprint?: number;
                          /**
                           * Soft cap on number of generated cells (used for auto stride).
                           */
                          targetCells?: number;
                        },
                        ...{
                          interpolate?: 'nearest' | 'bilinear' | 'bicubic';
                          /**
                           * Fraction of each grid cell area to fill. 1 = full cell (no gaps).
                           */
                          cellFootprint?: number;
                          /**
                           * Soft cap on number of generated cells (used for auto stride).
                           */
                          targetCells?: number;
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'vector';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Vector field inputs. Either a vector variable reference, components (u/v[/w]), or polar (speed/direction[/w]).
                       */
                      input:
                        | {
                            data: string;
                            var: string;
                            dims?: Dims;
                          }
                        | {
                            data: string;
                            u: string;
                            v: string;
                            w?: string;
                            dims?: Dims;
                          }
                        | {
                            data: string;
                            speed: string;
                            direction: string;
                            directionUnits?: 'deg' | 'rad';
                            directionConvention?: 'from' | 'to';
                            directionReference?: 'north_clockwise' | 'east_counterclockwise';
                            w?: string;
                            dims?: Dims;
                          };
                      sampling?: {
                        skip?: number;
                      };
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          glyph?: {
                            type: 'arrow' | 'barb';
                            /**
                             * Global multiplier for glyph size (not data-driven).
                             */
                            scale?: number;
                          };
                          pivot?: 'tail' | 'middle' | 'tip';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'trajectory';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Input reference for particles/trajectories. Either a single scalar field or multiple named fields, scoped to a dataset.
                       */
                      input:
                        | Input
                        | {
                            data: string;
                            /**
                             * Map of named variable ids (e.g., u/v/w, speed/direction).
                             */
                            vars: {
                              [k: string]: string;
                            };
                          };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          tailLength?: number;
                          headMarker?: boolean;
                          stepSize?: number;
                          maxSteps?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'polygon';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: {
                        data: string;
                      };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          strokeWidth?: number;
                          /**
                           * Optional simplification tolerance (implementation-defined units).
                           */
                          simplify?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'particle';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Input reference for particles/trajectories. Either a single scalar field or multiple named fields, scoped to a dataset.
                       */
                      input:
                        | Input
                        | {
                            data: string;
                            /**
                             * Map of named variable ids (e.g., u/v/w, speed/direction).
                             */
                            vars: {
                              [k: string]: string;
                            };
                          };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          count?: number;
                          lifetime?: number;
                          speedFactor?: number;
                          fade?: number;
                          blendMode?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    });
                /**
                 * Optional rendering mask/clip (static shape or interactive selection-driven).
                 */
                mask?:
                  | {
                      type: 'circle';
                      center: {
                        lon: number;
                        lat: number;
                      };
                      radius: number;
                      radiusUnits?: 'px' | 'm' | 'km';
                      interaction?: {
                        /**
                         * @minItems 1
                         */
                        on: ['move' | 'drag' | 'resize', ...('move' | 'drag' | 'resize')[]];
                        /**
                         * Optional radius limits (for circle masks).
                         */
                        radiusLimits?: {
                          min: number;
                          max: number;
                        };
                        boundsLimits?: Bounds;
                      } & {
                        [k: string]: unknown;
                      };
                    }
                  | {
                      type: 'bbox';
                      bounds: {
                        west: number;
                        south: number;
                        east: number;
                        north: number;
                      };
                      interaction?: {
                        /**
                         * @minItems 1
                         */
                        on: ['move' | 'drag' | 'resize', ...('move' | 'drag' | 'resize')[]];
                        /**
                         * Optional radius limits (for circle masks).
                         */
                        radiusLimits?: {
                          min: number;
                          max: number;
                        };
                        boundsLimits?: Bounds;
                      } & {
                        [k: string]: unknown;
                      };
                    };
                /**
                 * Layer-local interactions (e.g., brush/pick). Mask manipulation lives in mask.interaction.
                 *
                 * @minItems 1
                 */
                interactions?: [
                  (
                    | {
                        type: 'brush';
                        /**
                         * Selection id produced by this brush (local to the view unless routed by composition).
                         */
                        as: string;
                        mode: 'rect' | 'x' | 'y' | 'lasso';
                        on?: 'drag';
                        empty?: 'none' | 'all';
                      }
                    | {
                        type: 'pick';
                        on: 'click' | 'hover';
                        as: string;
                      }
                  ),
                  ...(
                    | {
                        type: 'brush';
                        /**
                         * Selection id produced by this brush (local to the view unless routed by composition).
                         */
                        as: string;
                        mode: 'rect' | 'x' | 'y' | 'lasso';
                        on?: 'drag';
                        empty?: 'none' | 'all';
                      }
                    | {
                        type: 'pick';
                        on: 'click' | 'hover';
                        as: string;
                      }
                  )[]
                ];
              },
              ...{
                id: string;
                /**
                 * Geometry layer id (string) or a full GeometrySpec object.
                 */
                geometry:
                  | ({
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      type: 'isoline';
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build: [
                        {
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        },
                        ...{
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          smooth?: boolean;
                          /**
                           * @minItems 2
                           */
                          dash?: [number, number, ...number[]];
                          strokeWidth?: number;
                          label?: {
                            enabled?: boolean;
                            format?: string;
                          };
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'isoband';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build: [
                        {
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        },
                        ...{
                          /**
                           * How to choose contour levels.
                           */
                          levels:
                            | {
                                type: 'explicit';
                                /**
                                 * @minItems 1
                                 */
                                values: [number, ...number[]];
                              }
                            | {
                                type: 'step';
                                start: number;
                                stop: number;
                                step: number;
                              };
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          bandOpacity?: number;
                          edgeStroke?: boolean;
                          strokeWidth?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'point';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          /**
                           * Outline width for point glyphs (px).
                           */
                          strokeWidth?: number;
                          shape?: 'circle' | 'square' | 'triangle' | 'diamond' | 'cross' | 'x';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'mesh';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: Input;
                      /**
                       * @minItems 1
                       */
                      build?: [
                        {
                          interpolate?: 'nearest' | 'bilinear' | 'bicubic';
                          /**
                           * Fraction of each grid cell area to fill. 1 = full cell (no gaps).
                           */
                          cellFootprint?: number;
                          /**
                           * Soft cap on number of generated cells (used for auto stride).
                           */
                          targetCells?: number;
                        },
                        ...{
                          interpolate?: 'nearest' | 'bilinear' | 'bicubic';
                          /**
                           * Fraction of each grid cell area to fill. 1 = full cell (no gaps).
                           */
                          cellFootprint?: number;
                          /**
                           * Soft cap on number of generated cells (used for auto stride).
                           */
                          targetCells?: number;
                        }[]
                      ];
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'vector';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Vector field inputs. Either a vector variable reference, components (u/v[/w]), or polar (speed/direction[/w]).
                       */
                      input:
                        | {
                            data: string;
                            var: string;
                            dims?: Dims;
                          }
                        | {
                            data: string;
                            u: string;
                            v: string;
                            w?: string;
                            dims?: Dims;
                          }
                        | {
                            data: string;
                            speed: string;
                            direction: string;
                            directionUnits?: 'deg' | 'rad';
                            directionConvention?: 'from' | 'to';
                            directionReference?: 'north_clockwise' | 'east_counterclockwise';
                            w?: string;
                            dims?: Dims;
                          };
                      sampling?: {
                        skip?: number;
                      };
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          glyph?: {
                            type: 'arrow' | 'barb';
                            /**
                             * Global multiplier for glyph size (not data-driven).
                             */
                            scale?: number;
                          };
                          pivot?: 'tail' | 'middle' | 'tip';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'trajectory';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Input reference for particles/trajectories. Either a single scalar field or multiple named fields, scoped to a dataset.
                       */
                      input:
                        | Input
                        | {
                            data: string;
                            /**
                             * Map of named variable ids (e.g., u/v/w, speed/direction).
                             */
                            vars: {
                              [k: string]: string;
                            };
                          };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          tailLength?: number;
                          headMarker?: boolean;
                          stepSize?: number;
                          maxSteps?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'polygon';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      input: {
                        data: string;
                      };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          strokeWidth?: number;
                          /**
                           * Optional simplification tolerance (implementation-defined units).
                           */
                          simplify?: number;
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'particle';
                      [k: string]: unknown;
                    } & {
                      type: string;
                      /**
                       * Optional geometry build pipeline. Its allowed items depend on the layer type.
                       *
                       * @minItems 1
                       */
                      build?: [unknown, ...unknown[]];
                      /**
                       * Visual encoding for this geometry.
                       */
                      encoding: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    } & {
                      /**
                       * Input reference for particles/trajectories. Either a single scalar field or multiple named fields, scoped to a dataset.
                       */
                      input:
                        | Input
                        | {
                            data: string;
                            /**
                             * Map of named variable ids (e.g., u/v/w, speed/direction).
                             */
                            vars: {
                              [k: string]: string;
                            };
                          };
                      encoding?: {
                        /**
                         * Channel mappings (e.g., fill, stroke, opacity).
                         */
                        channels: {
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          fill?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is a color (e.g., fill/stroke).
                           */
                          stroke?:
                            | {
                                /**
                                 * Constant color string (e.g., '#ff0000', 'rgba(0,0,0,0.5)').
                                 */
                                value: string;
                              }
                            | {
                                field: string;
                                /**
                                 * Color scale definition. Supports either scheme-based scales (recommended) or explicit domain/range stops.
                                 */
                                scale?:
                                  | {
                                      /**
                                       * Named color scheme/palette (e.g., 'RdYlBu', 'Viridis').
                                       */
                                      scheme: string;
                                      /**
                                       * Optional hint for the scheme family. Renderer may ignore.
                                       */
                                      type?: 'sequential' | 'diverging' | 'categorical';
                                      /**
                                       * If true, reverse the scheme order.
                                       */
                                      reverse?: boolean;
                                      /**
                                       * Optional numeric domain override (e.g., [min, max]). If omitted, renderer infers from data.
                                       *
                                       * @minItems 2
                                       */
                                      domain?: [number, number, ...number[]];
                                      /**
                                       * Clamp values outside the domain.
                                       */
                                      clamp?: boolean;
                                    }
                                  | {
                                      [k: string]: unknown;
                                    };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          opacity?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          width?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * A channel whose visual output is numeric (e.g., size/opacity/width/rotation).
                           */
                          size?:
                            | {
                                value: number;
                              }
                            | {
                                field: string;
                                scale?: {
                                  type:
                                    | 'linear'
                                    | 'log'
                                    | 'symlog'
                                    | 'sqrt'
                                    | 'pow'
                                    | 'quantize'
                                    | 'quantile'
                                    | 'threshold'
                                    | 'ordinal';
                                  domain:
                                    | {
                                        type: 'explicit';
                                        /**
                                         * @minItems 2
                                         */
                                        values: [number, number, ...number[]];
                                      }
                                    | {
                                        type: 'extent';
                                      };
                                  clamp?: boolean;
                                  [k: string]: unknown;
                                } & {
                                  range: {
                                    /**
                                     * @minItems 2
                                     */
                                    values: [number, number, ...number[]];
                                  };
                                  [k: string]: unknown;
                                };
                              };
                          /**
                           * Dash pattern for strokes. Kept constant-only for simplicity and broad renderer compatibility.
                           */
                          dash?: {
                            /**
                             * Dash pattern array, e.g., [4,2].
                             *
                             * @minItems 2
                             */
                            value: [number, number, ...number[]];
                          };
                        };
                        /**
                         * Geometry-scoped style. The geometry layer schema constrains its shape.
                         */
                        style?: {
                          [k: string]: unknown;
                        };
                        [k: string]: unknown;
                      } & {
                        style?: {
                          count?: number;
                          lifetime?: number;
                          speedFactor?: number;
                          fade?: number;
                          blendMode?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay';
                          /**
                           * CSS color or hex.
                           */
                          nodataColor?: string;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    });
                /**
                 * Optional rendering mask/clip (static shape or interactive selection-driven).
                 */
                mask?:
                  | {
                      type: 'circle';
                      center: {
                        lon: number;
                        lat: number;
                      };
                      radius: number;
                      radiusUnits?: 'px' | 'm' | 'km';
                      interaction?: {
                        /**
                         * @minItems 1
                         */
                        on: ['move' | 'drag' | 'resize', ...('move' | 'drag' | 'resize')[]];
                        /**
                         * Optional radius limits (for circle masks).
                         */
                        radiusLimits?: {
                          min: number;
                          max: number;
                        };
                        boundsLimits?: Bounds;
                      } & {
                        [k: string]: unknown;
                      };
                    }
                  | {
                      type: 'bbox';
                      bounds: {
                        west: number;
                        south: number;
                        east: number;
                        north: number;
                      };
                      interaction?: {
                        /**
                         * @minItems 1
                         */
                        on: ['move' | 'drag' | 'resize', ...('move' | 'drag' | 'resize')[]];
                        /**
                         * Optional radius limits (for circle masks).
                         */
                        radiusLimits?: {
                          min: number;
                          max: number;
                        };
                        boundsLimits?: Bounds;
                      } & {
                        [k: string]: unknown;
                      };
                    };
                /**
                 * Layer-local interactions (e.g., brush/pick). Mask manipulation lives in mask.interaction.
                 *
                 * @minItems 1
                 */
                interactions?: [
                  (
                    | {
                        type: 'brush';
                        /**
                         * Selection id produced by this brush (local to the view unless routed by composition).
                         */
                        as: string;
                        mode: 'rect' | 'x' | 'y' | 'lasso';
                        on?: 'drag';
                        empty?: 'none' | 'all';
                      }
                    | {
                        type: 'pick';
                        on: 'click' | 'hover';
                        as: string;
                      }
                  ),
                  ...(
                    | {
                        type: 'brush';
                        /**
                         * Selection id produced by this brush (local to the view unless routed by composition).
                         */
                        as: string;
                        mode: 'rect' | 'x' | 'y' | 'lasso';
                        on?: 'drag';
                        empty?: 'none' | 'all';
                      }
                    | {
                        type: 'pick';
                        on: 'click' | 'hover';
                        as: string;
                      }
                  )[]
                ];
              }[]
            ];
            [k: string]: unknown;
          })
        | ({
            id: string;
            floating?: boolean;
            context?: Context;
            [k: string]: unknown;
          } & {
            frame: {
              type: 'chart';
            };
            /**
             * Dataset id used as the default data source for the Vega-Lite spec.
             */
            input: {
              data?: string;
              [k: string]: unknown;
            };
            /**
             * Raw Vega-Lite specification object, except for the data.
             */
            vegaLite: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          })
      )[]
    ];
    /**
     * Composition-level context: global titles, legends, and controls (e.g., a shared time slider).
     */
    context?: {
      title?: {
        [k: string]: unknown;
      };
      /**
       * Interactive UI controls bound to view parameters (e.g., time).
       *
       * @minItems 1
       */
      controls?: [
        (
          | {
              type: 'slider';
              bind: 'time';
              /**
               * UI label.
               */
              label?: string;
              /**
               * Whether to display the current value.
               */
              showValue?: boolean;
            }
          | {
              type: 'buttons';
              bind: 'time';
              /**
               * Which buttons to show.
               *
               * @minItems 1
               */
              buttons: ['prev' | 'next' | 'play' | 'pause', ...('prev' | 'next' | 'play' | 'pause')[]];
              /**
               * Step size (in timesteps) for prev/next.
               */
              step?: number;
              /**
               * Playback interval in milliseconds (for play/pause).
               */
              intervalMs?: number;
            }
        ),
        ...(
          | {
              type: 'slider';
              bind: 'time';
              /**
               * UI label.
               */
              label?: string;
              /**
               * Whether to display the current value.
               */
              showValue?: boolean;
            }
          | {
              type: 'buttons';
              bind: 'time';
              /**
               * Which buttons to show.
               *
               * @minItems 1
               */
              buttons: ['prev' | 'next' | 'play' | 'pause', ...('prev' | 'next' | 'play' | 'pause')[]];
              /**
               * Step size (in timesteps) for prev/next.
               */
              step?: number;
              /**
               * Playback interval in milliseconds (for play/pause).
               */
              intervalMs?: number;
            }
        )[]
      ];
      /**
       * Legend specifications for encodings used in this view.
       *
       * @minItems 1
       */
      legends?: [
        {
          /**
           * Optional legend title override.
           */
          title?: string;
          type?: 'auto' | 'color' | 'size' | 'opacity';
          /**
           * @minItems 1
           */
          source: [
            {
              view: string;
              layers: string[];
              channel: 'fill' | 'stroke' | 'size' | 'opacity';
            },
            ...{
              view: string;
              layers: string[];
              channel: 'fill' | 'stroke' | 'size' | 'opacity';
            }[]
          ];
        },
        ...{
          /**
           * Optional legend title override.
           */
          title?: string;
          type?: 'auto' | 'color' | 'size' | 'opacity';
          /**
           * @minItems 1
           */
          source: [
            {
              view: string;
              layers: string[];
              channel: 'fill' | 'stroke' | 'size' | 'opacity';
            },
            ...{
              view: string;
              layers: string[];
              channel: 'fill' | 'stroke' | 'size' | 'opacity';
            }[]
          ];
        }[]
      ];
    };
    /**
     * @minItems 1
     */
    interactions?: [
      (
        | ({
            type: 'slider' | 'buttons' | 'click';
            /**
             * Optional explicit interaction source. Usually needed for event-based interactions like click.
             *
             * @minItems 1
             */
            source?: [Items2, ...Items2[]];
            action: {
              select: {
                /**
                 * Dimension selected by the interaction, e.g. time, member, id.
                 */
                dim: string;
                /**
                 * @minItems 1
                 */
                target: [Items2, ...Items2[]];
              };
            };
          } & {
            type?: 'slider';
            [k: string]: unknown;
          })
        | ({
            type: 'slider' | 'buttons' | 'click';
            /**
             * Optional explicit interaction source. Usually needed for event-based interactions like click.
             *
             * @minItems 1
             */
            source?: [Items2, ...Items2[]];
            action: {
              select: {
                /**
                 * Dimension selected by the interaction, e.g. time, member, id.
                 */
                dim: string;
                /**
                 * @minItems 1
                 */
                target: [Items2, ...Items2[]];
              };
            };
          } & {
            type?: 'buttons';
            [k: string]: unknown;
          })
        | ({
            type: 'slider' | 'buttons' | 'click';
            /**
             * Optional explicit interaction source. Usually needed for event-based interactions like click.
             *
             * @minItems 1
             */
            source?: [Items2, ...Items2[]];
            action: {
              select: {
                /**
                 * Dimension selected by the interaction, e.g. time, member, id.
                 */
                dim: string;
                /**
                 * @minItems 1
                 */
                target: [Items2, ...Items2[]];
              };
            };
          } & {
            type?: 'click';
            [k: string]: unknown;
          })
      ),
      ...(
        | ({
            type: 'slider' | 'buttons' | 'click';
            /**
             * Optional explicit interaction source. Usually needed for event-based interactions like click.
             *
             * @minItems 1
             */
            source?: [Items2, ...Items2[]];
            action: {
              select: {
                /**
                 * Dimension selected by the interaction, e.g. time, member, id.
                 */
                dim: string;
                /**
                 * @minItems 1
                 */
                target: [Items2, ...Items2[]];
              };
            };
          } & {
            type?: 'slider';
            [k: string]: unknown;
          })
        | ({
            type: 'slider' | 'buttons' | 'click';
            /**
             * Optional explicit interaction source. Usually needed for event-based interactions like click.
             *
             * @minItems 1
             */
            source?: [Items2, ...Items2[]];
            action: {
              select: {
                /**
                 * Dimension selected by the interaction, e.g. time, member, id.
                 */
                dim: string;
                /**
                 * @minItems 1
                 */
                target: [Items2, ...Items2[]];
              };
            };
          } & {
            type?: 'buttons';
            [k: string]: unknown;
          })
        | ({
            type: 'slider' | 'buttons' | 'click';
            /**
             * Optional explicit interaction source. Usually needed for event-based interactions like click.
             *
             * @minItems 1
             */
            source?: [Items2, ...Items2[]];
            action: {
              select: {
                /**
                 * Dimension selected by the interaction, e.g. time, member, id.
                 */
                dim: string;
                /**
                 * @minItems 1
                 */
                target: [Items2, ...Items2[]];
              };
            };
          } & {
            type?: 'click';
            [k: string]: unknown;
          })
      )[]
    ];
  };
}
export interface Id {
  key: string;
  dim?: string;
}
export interface Out {
  /**
   * Id of the derived dataset produced by this transform.
   */
  data: string;
  /**
   * Id of the derived variable produced by this transform.
   */
  var?: string;
}
export interface Items {
  data: string;
  var: string;
}
/**
 * Rename outputs by arg index: '0', '1', ...
 */
export interface Rename {
  /**
   * This interface was referenced by `Rename`'s JSON-Schema definition
   * via the `patternProperty` "^[0-9]+$".
   */
  [k: string]: string;
}
export interface Suffix {
  left: string;
  right: string;
}
export interface Items1 {
  data: string;
  var: string;
}
/**
 * Optional view-local context (titles, legends, controls).
 */
export interface Context {
  title?: {
    [k: string]: unknown;
  };
  /**
   * Interactive UI controls bound to view parameters (e.g., time).
   *
   * @minItems 1
   */
  controls?: [
    (
      | {
          type: 'slider';
          bind: 'time';
          /**
           * UI label.
           */
          label?: string;
          /**
           * Whether to display the current value.
           */
          showValue?: boolean;
        }
      | {
          type: 'buttons';
          bind: 'time';
          /**
           * Which buttons to show.
           *
           * @minItems 1
           */
          buttons: ['prev' | 'next' | 'play' | 'pause', ...('prev' | 'next' | 'play' | 'pause')[]];
          /**
           * Step size (in timesteps) for prev/next.
           */
          step?: number;
          /**
           * Playback interval in milliseconds (for play/pause).
           */
          intervalMs?: number;
        }
    ),
    ...(
      | {
          type: 'slider';
          bind: 'time';
          /**
           * UI label.
           */
          label?: string;
          /**
           * Whether to display the current value.
           */
          showValue?: boolean;
        }
      | {
          type: 'buttons';
          bind: 'time';
          /**
           * Which buttons to show.
           *
           * @minItems 1
           */
          buttons: ['prev' | 'next' | 'play' | 'pause', ...('prev' | 'next' | 'play' | 'pause')[]];
          /**
           * Step size (in timesteps) for prev/next.
           */
          step?: number;
          /**
           * Playback interval in milliseconds (for play/pause).
           */
          intervalMs?: number;
        }
    )[]
  ];
  /**
   * Legend specifications for encodings used in this view.
   *
   * @minItems 1
   */
  legends?: [
    {
      /**
       * Optional legend title override.
       */
      title?: string;
      type?: 'auto' | 'color' | 'size' | 'opacity';
      /**
       * @minItems 1
       */
      source: [
        {
          view: string;
          layers: string[];
          channel: 'fill' | 'stroke' | 'size' | 'opacity';
        },
        ...{
          view: string;
          layers: string[];
          channel: 'fill' | 'stroke' | 'size' | 'opacity';
        }[]
      ];
    },
    ...{
      /**
       * Optional legend title override.
       */
      title?: string;
      type?: 'auto' | 'color' | 'size' | 'opacity';
      /**
       * @minItems 1
       */
      source: [
        {
          view: string;
          layers: string[];
          channel: 'fill' | 'stroke' | 'size' | 'opacity';
        },
        ...{
          view: string;
          layers: string[];
          channel: 'fill' | 'stroke' | 'size' | 'opacity';
        }[]
      ];
    }[]
  ];
}
export interface Input {
  data: string;
  var: string;
  /**
   * Optional dimension selection. If omitted, all indices are used.
   */
  dims?: {
    /**
     * Select one or more indices of a dimension.
     */
    time?: number | [number, ...number[]];
    /**
     * Select one or more indices of a dimension.
     */
    member?: number | [number, ...number[]];
    /**
     * Select one or more indices of a dimension.
     */
    level?: number | [number, ...number[]];
  };
}
export interface Dims {
  /**
   * Select one or more indices of a dimension.
   */
  time?: number | [number, ...number[]];
  /**
   * Select one or more indices of a dimension.
   */
  member?: number | [number, ...number[]];
  /**
   * Select one or more indices of a dimension.
   */
  level?: number | [number, ...number[]];
}
/**
 * Optional spatial limits within which the bbox mask may move or resize.
 */
export interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}
export interface Items2 {
  view: string;
  /**
   * @minItems 1
   */
  layers?: [string, ...string[]];
}
