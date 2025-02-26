#!/usr/bin/env bash
set -e
cd $(dirname "${0}")

source ../supports/bask/src/bask.sh

bask_default_task="usage"

task_usage() {
    bask_list_tasks
}

task_setup() {
    # FIXME: write setup code here.
    echo "there is nothing that needs to be set up in the workspace."
    echo "see run/on-workspace/run.sh for more information."
}
