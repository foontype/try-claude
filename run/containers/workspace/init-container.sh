#!/usr/bin/env bash
cd $(dirname "${0}")

local files=(./init-resources/*)

for f in "${files[@]}"; do
  if [[ -f "$f" ]]; then
      echo "${f}: start."
      bash "$f"
      echo "${f}: done."
  fi
done
