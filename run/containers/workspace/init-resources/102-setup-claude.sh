#!/usr/bin/env bash

SUDO=""
if [ ! "$(id -u):$(id -g)" = "0:0" ]; then
    SUDO="sudo"
fi

if [ -n "${CLAUDE_CONFIG_DIR}" -a ! -d "${CLAUDE_CONFIG_DIR}" ]; then
    ${SUDO} mkdir -p "${CLAUDE_CONFIG_DIR}"
    ${SUDO} chmod 644 "${CLAUDE_CONFIG_DIR}"
fi
