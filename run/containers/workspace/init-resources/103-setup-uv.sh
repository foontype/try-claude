#!/usr/bin/env bash

if [ -n "${UV_INSTALL_DIR}" -a ! -d "${UV_INSTALL_DIR}" ]; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi
