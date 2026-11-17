#!/usr/bin/env python3
"""Stamp a new version before pushing: python3 release.py
Writes the version (Vancouver date + content hash) into index.html, sw.js and version.json,
so installed phones see "Update ready - Refresh" next time they open the app."""
import hashlib, json, re, datetime, zoneinfo, pathlib
root = pathlib.Path(__file__).parent
files = ["index.html", "sw.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"]
def strip(b):  # hash without the stamped version so re-running doesn't change it
    return re.sub(rb'(APP_VERSION=")[^"]*(")|(handrail-)[\w.\-]+(\')', rb'\1\2\3\4', b)
h = hashlib.sha1(b"".join(strip((root / f).read_bytes()) for f in files)).hexdigest()[:6]
v = datetime.datetime.now(zoneinfo.ZoneInfo("America/Vancouver")).strftime("%Y.%m.%d") + "-" + h
for f, pat, rep in [("index.html", r'APP_VERSION="[^"]*"', f'APP_VERSION="{v}"'),
                    ("sw.js", r"const CACHE = 'handrail-[^']*';", f"const CACHE = 'handrail-{v}';")]:
    p = root / f; t = p.read_text(); t2 = re.sub(pat, rep, t); assert t2 != t or v in t, f; p.write_text(t2)
(root / "version.json").write_text(json.dumps({"v": v}))
print(v)
