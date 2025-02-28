#!/usr/bin/env bash

SUDO=""
if [ ! "$(id -u):$(id -g)" = "0:0" ]; then
    SUDO="sudo"
fi

# Local terminal
if [ -n "${LOCAL_TERMINAL}" ]; then
    IFS="|" read -r LOCAL_COMMAND_PATH REMOTE_COMMAND_PATH LOCAL_TERMINAL_REST <<< "${LOCAL_TERMINAL}"
    IFS="|" read -r LOCAL_TERMINAL_ARGS <<< "${LOCAL_TERMINAL_REST}"

    REMOTE_COMMAND=$(basename "${REMOTE_COMMAND_PATH}")
    LOCAL_COMMAND_DIR=$(dirname "${LOCAL_COMMAND_PATH}")

    for a in ${LOCAL_TERMINAL_ARGS[@]}; do
        LOCAL_COMMAND_ARGS="${LOCAL_COMMAND_ARGS:-}${LOCAL_COMMAND_ARGS:+", "}\"${a}\""
    done

    # NOTE: Ensure that paths are consistent between local shell and remote shell.
    #       Remote shell ignores shell arguments.
    if [ ! -f "${LOCAL_COMMAND_PATH}" ]; then
        ${SUDO} mkdir -p "${LOCAL_COMMAND_DIR}"
        ${SUDO} bash -c "echo \"${REMOTE_COMMAND_PATH}\" > \"${LOCAL_COMMAND_PATH}\""
        ${SUDO} chmod 755 "${LOCAL_COMMAND_PATH}"
    fi

    mkdir -p /workspace/.vscode
    touch /workspace/.vscode/settings.json

    jq -n "{
        \"terminal.integrated.defaultProfile.linux\": \"${REMOTE_COMMAND}\",
        \"terminal.integrated.profiles.linux\": {
            \"${REMOTE_COMMAND}\": {
                \"path\": \"${LOCAL_COMMAND_PATH}\",
                \"args\": [${LOCAL_COMMAND_ARGS}]
            }
        }
    }" | jq -s add /workspace/.vscode/settings.json - > /workspace/.vscode/settings.json.tmp

    mv /workspace/.vscode/settings.json.tmp /workspace/.vscode/settings.json

    echo ""
    echo "Local terminal is set to \"$(basename ${LOCAL_COMMAND_PATH})\"."
    echo "Reopen workspace to apply changes."
    echo ""
    echo "After reopen, \"Terminal: Create New Integrated Terminal (Local)\" in VSCode to open local terminal."
    echo ""

else
    if [ -f "/workspace/.vscode/settings.json" ]; then
        jq "del (.\"terminal.integrated.defaultProfile.linux\", \"terminal.integrated.profiles.linux\")" \
            /workspace/.vscode/settings.json > /workspace/.vscode/settings.json.tmp

        mv /workspace/.vscode/settings.json.tmp /workspace/.vscode/settings.json
    fi
fi
