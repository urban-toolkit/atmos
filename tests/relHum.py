import json
from shapely.geometry import shape
from shapely.validation import explain_validity

with open("v1-l1.geojson") as f:
    gj = json.load(f)

for i, feat in enumerate(gj["features"]):
    geom = shape(feat["geometry"])
    if not geom.is_valid:
        print(i, feat["properties"], explain_validity(geom))
    if geom.is_empty:
        print(i, "EMPTY")
    if geom.area == 0:
        print(i, "ZERO AREA")

for i, feat in enumerate(gj["features"][:10]):
    print("FEATURE", i)
    print("type:", feat["geometry"]["type"])
    print("properties:", feat["properties"])
    print()