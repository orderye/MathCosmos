#!/usr/bin/env python3
"""比较 tests/visual-baseline 与当前截图；缺失或超阈值即失败。"""
import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


def changed_ratio(diff: Image.Image, threshold: int) -> float:
    mask = diff.convert("L").point(lambda v: 255 if v > threshold else 0)
    hist = mask.histogram()
    changed = sum(hist[1:])
    total = diff.width * diff.height
    return changed / max(total, 1)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--baseline", default="tests/visual-baseline")
    parser.add_argument("--current", default="tests/visual-current")
    parser.add_argument("--mean-threshold", type=float, default=20.0)
    parser.add_argument("--pixel-threshold", type=int, default=32)
    parser.add_argument("--changed-threshold", type=float, default=0.55)
    args = parser.parse_args()

    baseline = Path(args.baseline)
    current = Path(args.current)
    manifest_path = baseline / "manifest.json"
    if not manifest_path.exists():
        print(f"missing manifest: {manifest_path}", file=sys.stderr)
        return 1

    manifest = json.loads(manifest_path.read_text())
    failures = []
    for entry in manifest["entries"]:
        base_path = baseline / entry["file"]
        cur_path = current / entry["file"]
        if not cur_path.exists():
            failures.append((entry["code"], entry["type"], "missing current"))
            print(f"{entry['code']:>4} {entry['type']:<24} MISSING")
            continue

        base_img = Image.open(base_path).convert("RGB")
        cur_img = Image.open(cur_path).convert("RGB")
        if base_img.size != cur_img.size:
            failures.append((entry["code"], entry["type"], f"size {base_img.size} != {cur_img.size}"))
            print(f"{entry['code']:>4} {entry['type']:<24} SIZE {base_img.size} != {cur_img.size}")
            continue

        diff = ImageChops.difference(base_img, cur_img)
        mean = sum(ImageStat.Stat(diff).mean) / 3
        changed = changed_ratio(diff, args.pixel_threshold)
        ok = mean <= args.mean_threshold and changed <= args.changed_threshold
        print(
            f"{entry['code']:>4} {entry['type']:<24} "
            f"mean={mean:6.2f} changed={changed * 100:5.1f}% {'OK' if ok else 'FAIL'}"
        )
        if not ok:
            failures.append((entry["code"], entry["type"], f"mean={mean:.2f} changed={changed:.2%}"))

    print(f"\n{len(manifest['entries']) - len(failures)}/{len(manifest['entries'])} passed")
    if failures:
        print("failures:", failures, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
