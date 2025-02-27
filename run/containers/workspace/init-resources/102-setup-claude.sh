#!/usr/bin/env bash

if [ -n "${CLAUDE_CONFIG_DIR}" ]; then
    if [ ! "$(id -u):$(id -g)" = "0:0" ]; then
        SUDO="sudo"
    fi

    ${SUDO} mkdir -p "${CLAUDE_CONFIG_DIR}"
    ${SUDO} chmod 644 "${CLAUDE_CONFIG_DIR}"
fi
