#!/usr/bin/env bats

@test ".env.example.*" {
    local expected_string="COMPOSE_PROJECT_NAME=try-claude"
    
    run grep "${expected_string}" $(find . -type f -name .env.example.*)

    [ "$status" -eq 0 ]
}
