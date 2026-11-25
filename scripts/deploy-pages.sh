#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

npm run build

WORKTREE="$(mktemp -d "${TMPDIR:-/tmp}/mathcosmos-pages.XXXXXX")"
BRANCH="pages-deploy-$$"

cleanup() {
  cd "$ROOT"
  git worktree remove --force "$WORKTREE" >/dev/null 2>&1 || rm -rf "$WORKTREE"
  git branch -D "$BRANCH" >/dev/null 2>&1 || true
}
trap cleanup EXIT

git worktree add --detach "$WORKTREE"
cd "$WORKTREE"
git checkout --orphan "$BRANCH"
git rm -rf . >/dev/null 2>&1 || true
cp -R "$ROOT/dist/." .
git add -A
git commit -m "deploy: 发布 GitHub Pages"
git push -f origin "HEAD:gh-pages"

echo "published gh-pages from $ROOT/dist"
