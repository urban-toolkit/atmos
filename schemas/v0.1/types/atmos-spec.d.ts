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
      | ({
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read coordinate axes (lat/lon/time/level/member) from this dataset.
           */
          dimensions: {
            latitude: AdditionalProperties;
            longitude: AdditionalProperties;
            /**
             * Time dimension definition.
             */
            time:
              | AdditionalProperties
              | {
                  /**
                   * Name of the NetCDF dimension (e.g., 'Time')
                   */
                  dim?: string;
                  description?: string;
                  /**
                   * Timezone of the dataset time coordinate.
                   */
                  timezone?: string | string | 'Z';
                  /**
                   * Key/name of the variable storing time values (e.g., 'Times' or 'XTIME').
                   */
                  key: string;
                  /**
                   * How to interpret time coordinate values.
                   */
                  type?: 'datetime' | 'numeric';
                  /**
                   * Optional datetime format hint for parsing non-standard time strings.
                   */
                  format?: string;
                };
            /**
             * Vertical dimension definition. Omit entirely for surface-only datasets. (null allowed for backward compatibility.)
             */
            vertical?: {
              /**
               * Name of the vertical dimension (e.g., 'bottom_top', 'level', 'isobaric').
               */
              dim: string;
              /**
               * Optional variable holding vertical coordinate values (if available).
               */
              coordinate?: string | null;
              title?: string;
              description?: string;
              /**
               * How vertical levels should be interpreted/decoded.
               */
              encoding:
                | {
                    type: 'model_level_index';
                  }
                | {
                    type: 'pressure';
                    units: 'Pa' | 'hPa' | 'mb';
                    positive?: 'up' | 'down';
                  }
                | {
                    type: 'geometric_height';
                    units: 'm' | 'km';
                    positive?: 'up' | 'down';
                  }
                | {
                    type: 'hybrid_sigma';
                    formula?: string;
                    coefficients: {
                      a: string;
                      b: string;
                    };
                    reference_pressure: {
                      p0: number | string;
                    };
                    surface_pressure: string;
                    units: 'Pa' | 'hPa' | 'mb';
                    positive?: 'up' | 'down';
                  };
            } | null;
            site?: AdditionalProperties1;
          };
          /**
           * Missing/invalid-data rules for this dataset (optional).
           */
          missing?: {
            nan?: boolean;
            /**
             * Exact values that should be treated as missing (e.g., 9999, -9999).
             *
             * @minItems 1
             */
            sentinels?: [number | string, ...(number | string)[]];
            /**
             * Numeric ranges to treat as missing (e.g., lt=-1e20).
             *
             * @minItems 1
             */
            ranges?: [
              {
                lt?: number;
                lte?: number;
                gt?: number;
                gte?: number;
              },
              ...{
                lt?: number;
                lte?: number;
                gt?: number;
                gte?: number;
              }[]
            ];
          };
          /**
           * Variables available in the dataset.
           */
          variables: {
            [k: string]: unknown;
          }[];
          description?: string;
          [k: string]: unknown;
        } & {
          /**
           * Defaults to 'dataset' if omitted.
           */
          kind?: 'dataset';
          /**
           * How to access the dataset bytes (path/url/etc).
           */
          source: {
            [k: string]: unknown;
          } & {
            [k: string]: unknown;
          } & {
            type: 'netcdf' | 'zarr' | 'csv' | 'json' | 'url' | 'geojson';
            /**
             * Path to a local file/folder (for file-based sources).
             */
            path?: string;
            /**
             * URL (for url-based sources).
             */
            url?: string;
          };
          [k: string]: unknown;
        })
      | ({
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read coordinate axes (lat/lon/time/level/member) from this dataset.
           */
          dimensions: {
            latitude: AdditionalProperties;
            longitude: AdditionalProperties;
            /**
             * Time dimension definition.
             */
            time:
              | AdditionalProperties
              | {
                  /**
                   * Name of the NetCDF dimension (e.g., 'Time')
                   */
                  dim?: string;
                  description?: string;
                  /**
                   * Timezone of the dataset time coordinate.
                   */
                  timezone?: string | string | 'Z';
                  /**
                   * Key/name of the variable storing time values (e.g., 'Times' or 'XTIME').
                   */
                  key: string;
                  /**
                   * How to interpret time coordinate values.
                   */
                  type?: 'datetime' | 'numeric';
                  /**
                   * Optional datetime format hint for parsing non-standard time strings.
                   */
                  format?: string;
                };
            /**
             * Vertical dimension definition. Omit entirely for surface-only datasets. (null allowed for backward compatibility.)
             */
            vertical?: {
              /**
               * Name of the vertical dimension (e.g., 'bottom_top', 'level', 'isobaric').
               */
              dim: string;
              /**
               * Optional variable holding vertical coordinate values (if available).
               */
              coordinate?: string | null;
              title?: string;
              description?: string;
              /**
               * How vertical levels should be interpreted/decoded.
               */
              encoding:
                | {
                    type: 'model_level_index';
                  }
                | {
                    type: 'pressure';
                    units: 'Pa' | 'hPa' | 'mb';
                    positive?: 'up' | 'down';
                  }
                | {
                    type: 'geometric_height';
                    units: 'm' | 'km';
                    positive?: 'up' | 'down';
                  }
                | {
                    type: 'hybrid_sigma';
                    formula?: string;
                    coefficients: {
                      a: string;
                      b: string;
                    };
                    reference_pressure: {
                      p0: number | string;
                    };
                    surface_pressure: string;
                    units: 'Pa' | 'hPa' | 'mb';
                    positive?: 'up' | 'down';
                  };
            } | null;
            site?: AdditionalProperties1;
          };
          /**
           * Missing/invalid-data rules for this dataset (optional).
           */
          missing?: {
            nan?: boolean;
            /**
             * Exact values that should be treated as missing (e.g., 9999, -9999).
             *
             * @minItems 1
             */
            sentinels?: [number | string, ...(number | string)[]];
            /**
             * Numeric ranges to treat as missing (e.g., lt=-1e20).
             *
             * @minItems 1
             */
            ranges?: [
              {
                lt?: number;
                lte?: number;
                gt?: number;
                gte?: number;
              },
              ...{
                lt?: number;
                lte?: number;
                gt?: number;
                gte?: number;
              }[]
            ];
          };
          /**
           * Variables available in the dataset.
           */
          variables: {
            [k: string]: unknown;
          }[];
          description?: string;
          [k: string]: unknown;
        } & {
          kind: 'collection';
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
            [k: string]: unknown;
          } & {
            [k: string]: unknown;
          };
          /**
           * Logical dimension name to use for the collection axis (for transforms/encodings).
           */
          memberDimension?: string;
          [k: string]: unknown;
        })
      | {
          /**
           * Optional discriminator for GeoJSON datasets.
           */
          kind?: 'geojson';
          /**
           * Unique identifier for this data item.
           */
          id: string;
          description?: string;
          source: ({
            [k: string]: unknown;
          } & {
            [k: string]: unknown;
          }) & {
            type: 'geojson';
            [k: string]: unknown;
          };
          /**
           * Named attribute fields exposed from the GeoJSON properties object (used for joins/filters).
           */
          properties?: {
            [k: string]: AdditionalProperties;
          };
        }
    ),
    ...(
      | ({
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read coordinate axes (lat/lon/time/level/member) from this dataset.
           */
          dimensions: {
            latitude: AdditionalProperties;
            longitude: AdditionalProperties;
            /**
             * Time dimension definition.
             */
            time:
              | AdditionalProperties
              | {
                  /**
                   * Name of the NetCDF dimension (e.g., 'Time')
                   */
                  dim?: string;
                  description?: string;
                  /**
                   * Timezone of the dataset time coordinate.
                   */
                  timezone?: string | string | 'Z';
                  /**
                   * Key/name of the variable storing time values (e.g., 'Times' or 'XTIME').
                   */
                  key: string;
                  /**
                   * How to interpret time coordinate values.
                   */
                  type?: 'datetime' | 'numeric';
                  /**
                   * Optional datetime format hint for parsing non-standard time strings.
                   */
                  format?: string;
                };
            /**
             * Vertical dimension definition. Omit entirely for surface-only datasets. (null allowed for backward compatibility.)
             */
            vertical?: {
              /**
               * Name of the vertical dimension (e.g., 'bottom_top', 'level', 'isobaric').
               */
              dim: string;
              /**
               * Optional variable holding vertical coordinate values (if available).
               */
              coordinate?: string | null;
              title?: string;
              description?: string;
              /**
               * How vertical levels should be interpreted/decoded.
               */
              encoding:
                | {
                    type: 'model_level_index';
                  }
                | {
                    type: 'pressure';
                    units: 'Pa' | 'hPa' | 'mb';
                    positive?: 'up' | 'down';
                  }
                | {
                    type: 'geometric_height';
                    units: 'm' | 'km';
                    positive?: 'up' | 'down';
                  }
                | {
                    type: 'hybrid_sigma';
                    formula?: string;
                    coefficients: {
                      a: string;
                      b: string;
                    };
                    reference_pressure: {
                      p0: number | string;
                    };
                    surface_pressure: string;
                    units: 'Pa' | 'hPa' | 'mb';
                    positive?: 'up' | 'down';
                  };
            } | null;
            site?: AdditionalProperties1;
          };
          /**
           * Missing/invalid-data rules for this dataset (optional).
           */
          missing?: {
            nan?: boolean;
            /**
             * Exact values that should be treated as missing (e.g., 9999, -9999).
             *
             * @minItems 1
             */
            sentinels?: [number | string, ...(number | string)[]];
            /**
             * Numeric ranges to treat as missing (e.g., lt=-1e20).
             *
             * @minItems 1
             */
            ranges?: [
              {
                lt?: number;
                lte?: number;
                gt?: number;
                gte?: number;
              },
              ...{
                lt?: number;
                lte?: number;
                gt?: number;
                gte?: number;
              }[]
            ];
          };
          /**
           * Variables available in the dataset.
           */
          variables: {
            [k: string]: unknown;
          }[];
          description?: string;
          [k: string]: unknown;
        } & {
          /**
           * Defaults to 'dataset' if omitted.
           */
          kind?: 'dataset';
          /**
           * How to access the dataset bytes (path/url/etc).
           */
          source: {
            [k: string]: unknown;
          } & {
            [k: string]: unknown;
          } & {
            type: 'netcdf' | 'zarr' | 'csv' | 'json' | 'url' | 'geojson';
            /**
             * Path to a local file/folder (for file-based sources).
             */
            path?: string;
            /**
             * URL (for url-based sources).
             */
            url?: string;
          };
          [k: string]: unknown;
        })
      | ({
          /**
           * Unique identifier for this data item.
           */
          id: string;
          /**
           * How to read coordinate axes (lat/lon/time/level/member) from this dataset.
           */
          dimensions: {
            latitude: AdditionalProperties;
            longitude: AdditionalProperties;
            /**
             * Time dimension definition.
             */
            time:
              | AdditionalProperties
              | {
                  /**
                   * Name of the NetCDF dimension (e.g., 'Time')
                   */
                  dim?: string;
                  description?: string;
                  /**
                   * Timezone of the dataset time coordinate.
                   */
                  timezone?: string | string | 'Z';
                  /**
                   * Key/name of the variable storing time values (e.g., 'Times' or 'XTIME').
                   */
                  key: string;
                  /**
                   * How to interpret time coordinate values.
                   */
                  type?: 'datetime' | 'numeric';
                  /**
                   * Optional datetime format hint for parsing non-standard time strings.
                   */
                  format?: string;
                };
            /**
             * Vertical dimension definition. Omit entirely for surface-only datasets. (null allowed for backward compatibility.)
             */
            vertical?: {
              /**
               * Name of the vertical dimension (e.g., 'bottom_top', 'level', 'isobaric').
               */
              dim: string;
              /**
               * Optional variable holding vertical coordinate values (if available).
               */
              coordinate?: string | null;
              title?: string;
              description?: string;
              /**
               * How vertical levels should be interpreted/decoded.
               */
              encoding:
                | {
                    type: 'model_level_index';
                  }
                | {
                    type: 'pressure';
                    units: 'Pa' | 'hPa' | 'mb';
                    positive?: 'up' | 'down';
                  }
                | {
                    type: 'geometric_height';
                    units: 'm' | 'km';
                    positive?: 'up' | 'down';
                  }
                | {
                    type: 'hybrid_sigma';
                    formula?: string;
                    coefficients: {
                      a: string;
                      b: string;
                    };
                    reference_pressure: {
                      p0: number | string;
                    };
                    surface_pressure: string;
                    units: 'Pa' | 'hPa' | 'mb';
                    positive?: 'up' | 'down';
                  };
            } | null;
            site?: AdditionalProperties1;
          };
          /**
           * Missing/invalid-data rules for this dataset (optional).
           */
          missing?: {
            nan?: boolean;
            /**
             * Exact values that should be treated as missing (e.g., 9999, -9999).
             *
             * @minItems 1
             */
            sentinels?: [number | string, ...(number | string)[]];
            /**
             * Numeric ranges to treat as missing (e.g., lt=-1e20).
             *
             * @minItems 1
             */
            ranges?: [
              {
                lt?: number;
                lte?: number;
                gt?: number;
                gte?: number;
              },
              ...{
                lt?: number;
                lte?: number;
                gt?: number;
                gte?: number;
              }[]
            ];
          };
          /**
           * Variables available in the dataset.
           */
          variables: {
            [k: string]: unknown;
          }[];
          description?: string;
          [k: string]: unknown;
        } & {
          kind: 'collection';
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
            [k: string]: unknown;
          } & {
            [k: string]: unknown;
          };
          /**
           * Logical dimension name to use for the collection axis (for transforms/encodings).
           */
          memberDimension?: string;
          [k: string]: unknown;
        })
      | {
          /**
           * Optional discriminator for GeoJSON datasets.
           */
          kind?: 'geojson';
          /**
           * Unique identifier for this data item.
           */
          id: string;
          description?: string;
          source: ({
            [k: string]: unknown;
          } & {
            [k: string]: unknown;
          }) & {
            type: 'geojson';
            [k: string]: unknown;
          };
          /**
           * Named attribute fields exposed from the GeoJSON properties object (used for joins/filters).
           */
          properties?: {
            [k: string]: AdditionalProperties;
          };
        }
    )[]
  ];
  transform?: (
    | ({
        /**
         * Default dataset scope for variable references used by this transform. If omitted, the runtime must raise an error when a referenced variable id is ambiguous across root.data items.
         */
        data?: string;
        description?: string;
        [k: string]: unknown;
      } & {
        type: 'derive';
        /**
         * Output variable definition
         */
        as:
          | string
          | {
              /**
               * Identifier for the derived variable
               */
              id: string;
              /**
               * Human-readable name
               */
              title?: string;
              /**
               * Units of the derived variable
               */
              units?: string;
              description?: string;
              /**
               * High-level data form to inform geometry and downstream validation.
               */
              kind?: 'grid' | 'point' | 'table' | 'unknown';
            };
        /**
         * Expression AST node. Either an operator, a variable reference, or a constant.
         */
        expression:
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
              variable: string;
            }
          | {
              /**
               * Constant literal
               */
              const: number | string | boolean;
            }
          | {
              const_ref: string;
            };
      })
    | ({
        /**
         * Default dataset scope for variable references used by this transform. If omitted, the runtime must raise an error when a referenced variable id is ambiguous across root.data items.
         */
        data?: string;
        description?: string;
        [k: string]: unknown;
      } & {
        type: 'derive_wind_speed';
        /**
         * Output variable definition
         */
        as:
          | string
          | {
              /**
               * Identifier for the derived variable
               */
              id: string;
              /**
               * Human-readable name
               */
              title?: string;
              /**
               * Units of the derived variable
               */
              units?: string;
              description?: string;
              /**
               * High-level data form to inform geometry and downstream validation.
               */
              kind?: 'grid' | 'point' | 'table' | 'unknown';
            };
        u: string;
        v: string;
      })
    | ({
        /**
         * Default dataset scope for variable references used by this transform. If omitted, the runtime must raise an error when a referenced variable id is ambiguous across root.data items.
         */
        data?: string;
        description?: string;
        [k: string]: unknown;
      } & {
        type: 'derive_wind_direction';
        /**
         * Output variable definition
         */
        as:
          | string
          | {
              /**
               * Identifier for the derived variable
               */
              id: string;
              /**
               * Human-readable name
               */
              title?: string;
              /**
               * Units of the derived variable
               */
              units?: string;
              description?: string;
              /**
               * High-level data form to inform geometry and downstream validation.
               */
              kind?: 'grid' | 'point' | 'table' | 'unknown';
            };
        /**
         * Variable id of zonal (east-west) wind component.
         */
        u: string;
        /**
         * Variable id of meridional (north-south) wind component.
         */
        v: string;
        /**
         * Wind direction convention. 'from' follows meteorological standard.
         */
        convention?: 'from' | 'to';
        /**
         * Output angular units.
         */
        units?: 'deg' | 'rad';
      })
    | ({
        /**
         * Default dataset scope for variable references used by this transform. If omitted, the runtime must raise an error when a referenced variable id is ambiguous across root.data items.
         */
        data?: string;
        description?: string;
        [k: string]: unknown;
      } & {
        [k: string]: unknown;
      })
    | ({
        /**
         * Default dataset scope for variable references used by this transform. If omitted, the runtime must raise an error when a referenced variable id is ambiguous across root.data items.
         */
        data?: string;
        description?: string;
        [k: string]: unknown;
      } & {
        type: 'merge';
        /**
         * Output dataset id produced by this merge.
         */
        id: string;
        /**
         * Input dataset ids to merge (typically outputs of prior transforms).
         *
         * @minItems 2
         */
        input: [string, string, ...string[]];
        /**
         * How to handle missing values when reducing.
         */
        missing?: 'skip' | 'propagate';
      })
    | ({
        /**
         * Default dataset scope for variable references used by this transform. If omitted, the runtime must raise an error when a referenced variable id is ambiguous across root.data items.
         */
        data?: string;
        description?: string;
        [k: string]: unknown;
      } & {
        type: 'match';
        id: string;
        forecast: Obs;
        obs: Obs;
        space: {
          /**
           * Spatial matching method (v0 supports nearest neighbor).
           */
          method: 'nearest';
          /**
           * Which dataset's locations define the matched rows.
           */
          anchor: 'forecast' | 'obs';
          /**
           * Variable ids from the anchor dataset to carry through to the output rows.
           */
          preserve?: string[];
        };
        time: {
          [k: string]: unknown;
        };
        /**
         * How to handle missing values when reducing.
         */
        missing?: 'skip' | 'propagate';
        as: {
          /**
           * Map from semantic role (e.g., 'forecast', 'obs') to output variable id in the matched dataset.
           */
          variables: {
            [k: string]: string;
          };
        };
      })
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
            time?: Time;
            context?: Context;
            /**
             * @minItems 1
             */
            interactions?: [
              {
                on: 'click' | 'hover';
                source: {
                  [k: string]: unknown;
                };
                /**
                 * @minItems 1
                 */
                do: [
                  (
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  ),
                  ...(
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  )[]
                ];
              } & {
                source: {
                  layerId?: string;
                };
                [k: string]: unknown;
              },
              ...({
                on: 'click' | 'hover';
                source: {
                  [k: string]: unknown;
                };
                /**
                 * @minItems 1
                 */
                do: [
                  (
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  ),
                  ...(
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  )[]
                ];
              } & {
                source: {
                  layerId?: string;
                };
                [k: string]: unknown;
              })[]
            ];
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
                id?: string;
                /**
                 * Geometry layer id (string) or a full GeometrySpec object.
                 */
                geometry:
                  | ({
                      type: 'isoline';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'isoband';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'point';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'mesh';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                       * Vector field inputs. Either components (u/v[/w]) or polar (speed/direction[/w]).
                       */
                      input:
                        | {
                            /**
                             * Zonal/x component variable id.
                             */
                            u: string;
                            /**
                             * Meridional/y component variable id.
                             */
                            v: string;
                            /**
                             * Vertical/z component variable id (optional).
                             */
                            w?: string;
                          }
                        | {
                            /**
                             * Speed magnitude variable id.
                             */
                            speed: string;
                            /**
                             * Direction variable id (degrees or radians — interpretation is renderer-defined unless you add metadata).
                             */
                            direction: string;
                            /**
                             * Units of the direction field.
                             */
                            directionUnits?: 'deg' | 'rad';
                            /**
                             * Meteorological convention. 'from' means wind direction indicates where it comes from; 'to' means where it goes to.
                             */
                            directionConvention?: 'from' | 'to';
                            /**
                             * Angle reference. Most meteorology uses degrees clockwise from north.
                             */
                            directionReference?: 'north_clockwise' | 'east_counterclockwise';
                            /**
                             * Vertical/z component variable id (optional).
                             */
                            w?: string;
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
                          glyph?: 'arrow' | 'barb';
                          /**
                           * Global multiplier for glyph size (not data-driven).
                           */
                          glyphScale?: number;
                          pivot?: 'tail' | 'middle' | 'tip';
                          skip?: number;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'trajectory';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                            variables: {
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'polygon';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'particle';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                            variables: {
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
                id?: string;
                /**
                 * Geometry layer id (string) or a full GeometrySpec object.
                 */
                geometry:
                  | ({
                      type: 'isoline';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'isoband';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'point';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'mesh';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                       * Vector field inputs. Either components (u/v[/w]) or polar (speed/direction[/w]).
                       */
                      input:
                        | {
                            /**
                             * Zonal/x component variable id.
                             */
                            u: string;
                            /**
                             * Meridional/y component variable id.
                             */
                            v: string;
                            /**
                             * Vertical/z component variable id (optional).
                             */
                            w?: string;
                          }
                        | {
                            /**
                             * Speed magnitude variable id.
                             */
                            speed: string;
                            /**
                             * Direction variable id (degrees or radians — interpretation is renderer-defined unless you add metadata).
                             */
                            direction: string;
                            /**
                             * Units of the direction field.
                             */
                            directionUnits?: 'deg' | 'rad';
                            /**
                             * Meteorological convention. 'from' means wind direction indicates where it comes from; 'to' means where it goes to.
                             */
                            directionConvention?: 'from' | 'to';
                            /**
                             * Angle reference. Most meteorology uses degrees clockwise from north.
                             */
                            directionReference?: 'north_clockwise' | 'east_counterclockwise';
                            /**
                             * Vertical/z component variable id (optional).
                             */
                            w?: string;
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
                          glyph?: 'arrow' | 'barb';
                          /**
                           * Global multiplier for glyph size (not data-driven).
                           */
                          glyphScale?: number;
                          pivot?: 'tail' | 'middle' | 'tip';
                          skip?: number;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'trajectory';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                            variables: {
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'polygon';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'particle';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                            variables: {
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
            time?: Time;
            context?: Context;
            /**
             * @minItems 1
             */
            interactions?: [
              {
                on: 'click' | 'hover';
                source: {
                  [k: string]: unknown;
                };
                /**
                 * @minItems 1
                 */
                do: [
                  (
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  ),
                  ...(
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  )[]
                ];
              } & {
                source: {
                  layerId?: string;
                };
                [k: string]: unknown;
              },
              ...({
                on: 'click' | 'hover';
                source: {
                  [k: string]: unknown;
                };
                /**
                 * @minItems 1
                 */
                do: [
                  (
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  ),
                  ...(
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  )[]
                ];
              } & {
                source: {
                  layerId?: string;
                };
                [k: string]: unknown;
              })[]
            ];
            [k: string]: unknown;
          } & {
            frame: {
              type: 'chart';
            };
            /**
             * Dataset id used as the default data source for the Vega-Lite spec.
             */
            data: string;
            /**
             * Raw Vega-Lite specification object.
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
            time?: Time;
            context?: Context;
            /**
             * @minItems 1
             */
            interactions?: [
              {
                on: 'click' | 'hover';
                source: {
                  [k: string]: unknown;
                };
                /**
                 * @minItems 1
                 */
                do: [
                  (
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  ),
                  ...(
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  )[]
                ];
              } & {
                source: {
                  layerId?: string;
                };
                [k: string]: unknown;
              },
              ...({
                on: 'click' | 'hover';
                source: {
                  [k: string]: unknown;
                };
                /**
                 * @minItems 1
                 */
                do: [
                  (
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  ),
                  ...(
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  )[]
                ];
              } & {
                source: {
                  layerId?: string;
                };
                [k: string]: unknown;
              })[]
            ];
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
                id?: string;
                /**
                 * Geometry layer id (string) or a full GeometrySpec object.
                 */
                geometry:
                  | ({
                      type: 'isoline';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'isoband';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'point';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'mesh';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                       * Vector field inputs. Either components (u/v[/w]) or polar (speed/direction[/w]).
                       */
                      input:
                        | {
                            /**
                             * Zonal/x component variable id.
                             */
                            u: string;
                            /**
                             * Meridional/y component variable id.
                             */
                            v: string;
                            /**
                             * Vertical/z component variable id (optional).
                             */
                            w?: string;
                          }
                        | {
                            /**
                             * Speed magnitude variable id.
                             */
                            speed: string;
                            /**
                             * Direction variable id (degrees or radians — interpretation is renderer-defined unless you add metadata).
                             */
                            direction: string;
                            /**
                             * Units of the direction field.
                             */
                            directionUnits?: 'deg' | 'rad';
                            /**
                             * Meteorological convention. 'from' means wind direction indicates where it comes from; 'to' means where it goes to.
                             */
                            directionConvention?: 'from' | 'to';
                            /**
                             * Angle reference. Most meteorology uses degrees clockwise from north.
                             */
                            directionReference?: 'north_clockwise' | 'east_counterclockwise';
                            /**
                             * Vertical/z component variable id (optional).
                             */
                            w?: string;
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
                          glyph?: 'arrow' | 'barb';
                          /**
                           * Global multiplier for glyph size (not data-driven).
                           */
                          glyphScale?: number;
                          pivot?: 'tail' | 'middle' | 'tip';
                          skip?: number;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'trajectory';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                            variables: {
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'polygon';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'particle';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                            variables: {
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
                id?: string;
                /**
                 * Geometry layer id (string) or a full GeometrySpec object.
                 */
                geometry:
                  | ({
                      type: 'isoline';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'isoband';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                          /**
                           * Treat this value as missing (mask it out) before contouring.
                           */
                          mask_value?: number | null;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'point';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'mesh';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                       * Vector field inputs. Either components (u/v[/w]) or polar (speed/direction[/w]).
                       */
                      input:
                        | {
                            /**
                             * Zonal/x component variable id.
                             */
                            u: string;
                            /**
                             * Meridional/y component variable id.
                             */
                            v: string;
                            /**
                             * Vertical/z component variable id (optional).
                             */
                            w?: string;
                          }
                        | {
                            /**
                             * Speed magnitude variable id.
                             */
                            speed: string;
                            /**
                             * Direction variable id (degrees or radians — interpretation is renderer-defined unless you add metadata).
                             */
                            direction: string;
                            /**
                             * Units of the direction field.
                             */
                            directionUnits?: 'deg' | 'rad';
                            /**
                             * Meteorological convention. 'from' means wind direction indicates where it comes from; 'to' means where it goes to.
                             */
                            directionConvention?: 'from' | 'to';
                            /**
                             * Angle reference. Most meteorology uses degrees clockwise from north.
                             */
                            directionReference?: 'north_clockwise' | 'east_counterclockwise';
                            /**
                             * Vertical/z component variable id (optional).
                             */
                            w?: string;
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
                          glyph?: 'arrow' | 'barb';
                          /**
                           * Global multiplier for glyph size (not data-driven).
                           */
                          glyphScale?: number;
                          pivot?: 'tail' | 'middle' | 'tip';
                          skip?: number;
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'trajectory';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                            variables: {
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'polygon';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                        };
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    })
                  | ({
                      type: 'particle';
                      [k: string]: unknown;
                    } & {
                      /**
                       * Unique identifier for the geometry layer.
                       */
                      id?: string;
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
                            variables: {
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
            time?: Time;
            context?: Context;
            /**
             * @minItems 1
             */
            interactions?: [
              {
                on: 'click' | 'hover';
                source: {
                  [k: string]: unknown;
                };
                /**
                 * @minItems 1
                 */
                do: [
                  (
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  ),
                  ...(
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  )[]
                ];
              } & {
                source: {
                  layerId?: string;
                };
                [k: string]: unknown;
              },
              ...({
                on: 'click' | 'hover';
                source: {
                  [k: string]: unknown;
                };
                /**
                 * @minItems 1
                 */
                do: [
                  (
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  ),
                  ...(
                    | {
                        type: 'openView';
                        viewId: string;
                      }
                    | {
                        type: 'setFilter';
                        target: {
                          viewId: string;
                        };
                        filter: Filter;
                      }
                    | {
                        type: 'showTooltip';
                        title: string;
                        /**
                         * @minItems 1
                         */
                        items: [
                          {
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          },
                          ...{
                            label: string;
                            value: {
                              data: string;
                              variable: string;
                              filter?: Filter;
                            };
                          }[]
                        ];
                      }
                  )[]
                ];
              } & {
                source: {
                  layerId?: string;
                };
                [k: string]: unknown;
              })[]
            ];
            [k: string]: unknown;
          } & {
            frame: {
              type: 'chart';
            };
            /**
             * Dataset id used as the default data source for the Vega-Lite spec.
             */
            data: string;
            /**
             * Raw Vega-Lite specification object.
             */
            vegaLite: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          })
      )[]
    ];
    /**
     * Optional shared time state/control for views that bind to it.
     */
    time?: {
      /**
       * Time selection mode. v0 supports discrete timestep selection by index only.
       */
      type: 'index';
      /**
       * Selected timestep index. If omitted, defaults to 0.
       */
      value?: number;
    };
    /**
     * Composition-level context: global titles, legends, and controls (e.g., a shared time slider).
     */
    context?: {
      title?: {
        text: string;
        subtitle?: string;
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
           * Encoding id this legend refers to.
           */
          encoding: string;
          /**
           * Optional legend title override.
           */
          title?: string;
          /**
           * Legend type. 'auto' lets the renderer infer from encoding channels.
           */
          type?: 'auto' | 'color' | 'size' | 'opacity';
        },
        ...{
          /**
           * Encoding id this legend refers to.
           */
          encoding: string;
          /**
           * Optional legend title override.
           */
          title?: string;
          /**
           * Legend type. 'auto' lets the renderer infer from encoding channels.
           */
          type?: 'auto' | 'color' | 'size' | 'opacity';
        }[]
      ];
    };
    /**
     * @minItems 1
     */
    interactions?: [
      {
        on: 'click' | 'hover';
        source: {
          [k: string]: unknown;
        };
        /**
         * @minItems 1
         */
        do: [
          (
            | {
                type: 'openView';
                viewId: string;
              }
            | {
                type: 'setFilter';
                target: {
                  viewId: string;
                };
                filter: Filter;
              }
            | {
                type: 'showTooltip';
                title: string;
                /**
                 * @minItems 1
                 */
                items: [
                  {
                    label: string;
                    value: {
                      data: string;
                      variable: string;
                      filter?: Filter;
                    };
                  },
                  ...{
                    label: string;
                    value: {
                      data: string;
                      variable: string;
                      filter?: Filter;
                    };
                  }[]
                ];
              }
          ),
          ...(
            | {
                type: 'openView';
                viewId: string;
              }
            | {
                type: 'setFilter';
                target: {
                  viewId: string;
                };
                filter: Filter;
              }
            | {
                type: 'showTooltip';
                title: string;
                /**
                 * @minItems 1
                 */
                items: [
                  {
                    label: string;
                    value: {
                      data: string;
                      variable: string;
                      filter?: Filter;
                    };
                  },
                  ...{
                    label: string;
                    value: {
                      data: string;
                      variable: string;
                      filter?: Filter;
                    };
                  }[]
                ];
              }
          )[]
        ];
      } & {
        source: {
          viewId: string;
          layerId?: string;
        };
        [k: string]: unknown;
      },
      ...({
        on: 'click' | 'hover';
        source: {
          [k: string]: unknown;
        };
        /**
         * @minItems 1
         */
        do: [
          (
            | {
                type: 'openView';
                viewId: string;
              }
            | {
                type: 'setFilter';
                target: {
                  viewId: string;
                };
                filter: Filter;
              }
            | {
                type: 'showTooltip';
                title: string;
                /**
                 * @minItems 1
                 */
                items: [
                  {
                    label: string;
                    value: {
                      data: string;
                      variable: string;
                      filter?: Filter;
                    };
                  },
                  ...{
                    label: string;
                    value: {
                      data: string;
                      variable: string;
                      filter?: Filter;
                    };
                  }[]
                ];
              }
          ),
          ...(
            | {
                type: 'openView';
                viewId: string;
              }
            | {
                type: 'setFilter';
                target: {
                  viewId: string;
                };
                filter: Filter;
              }
            | {
                type: 'showTooltip';
                title: string;
                /**
                 * @minItems 1
                 */
                items: [
                  {
                    label: string;
                    value: {
                      data: string;
                      variable: string;
                      filter?: Filter;
                    };
                  },
                  ...{
                    label: string;
                    value: {
                      data: string;
                      variable: string;
                      filter?: Filter;
                    };
                  }[]
                ];
              }
          )[]
        ];
      } & {
        source: {
          viewId: string;
          layerId?: string;
        };
        [k: string]: unknown;
      })[]
    ];
  };
}
/**
 * Basic dimension definition.
 */
export interface AdditionalProperties {
  /**
   * Key to access a coordinate variable in the data source
   */
  key: string;
  description?: string;
}
/**
 * Basic dimension definition.
 */
export interface AdditionalProperties1 {
  /**
   * Key to access a coordinate variable in the data source
   */
  key: string;
  description?: string;
}
/**
 * Reference to a variable within a named dataset (or transform output dataset).
 */
export interface Obs {
  data: string;
  variable: string;
}
/**
 * Optional view-local time selection. If omitted, view may inherit composition time.
 */
export interface Time {
  /**
   * Time selection mode. v0 supports discrete timestep selection by index only.
   */
  type: 'index';
  /**
   * Selected timestep index. If omitted, defaults to 0.
   */
  value?: number;
}
/**
 * Optional view-local context (titles, legends, controls).
 */
export interface Context {
  title?: {
    text: string;
    subtitle?: string;
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
       * Encoding id this legend refers to.
       */
      encoding: string;
      /**
       * Optional legend title override.
       */
      title?: string;
      /**
       * Legend type. 'auto' lets the renderer infer from encoding channels.
       */
      type?: 'auto' | 'color' | 'size' | 'opacity';
    },
    ...{
      /**
       * Encoding id this legend refers to.
       */
      encoding: string;
      /**
       * Optional legend title override.
       */
      title?: string;
      /**
       * Legend type. 'auto' lets the renderer infer from encoding channels.
       */
      type?: 'auto' | 'color' | 'size' | 'opacity';
    }[]
  ];
}
export interface Filter {
  dimension: string;
  value: {
    field: string;
  };
}
export interface Input {
  data: string;
  variable: string;
  /**
   * Optional vertical level selection (for 3D variables).
   */
  level?: {
    /**
     * Select a vertical level by integer index.
     */
    type: 'index';
    /**
     * Zero-based level index.
     */
    value: number;
  };
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
