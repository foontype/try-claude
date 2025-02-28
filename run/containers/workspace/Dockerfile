FROM ubuntu

ARG CONTAINER_UID
ARG CONTAINER_GID

RUN apt-get update \
 && apt-get install -y \
        sudo \
        git \
        curl \
        jq \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# npm
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*
RUN node -v && npm -v

# claude code
ENV CLAUDE_CONFIG_DIR=/workspace/.claude
RUN npm config set os linux
RUN npm install -g @anthropic-ai/claude-code

# uv
ENV UV_INSTALL_DIR="/workspace/.uv"
ENV PATH="/workspace/.uv:${PATH}"

# init resources
ADD /run/containers/workspace/init-container.sh /init-container.sh
ADD /run/containers/workspace/init-resources /init-resources

# container user
RUN if [ ! "${CONTAINER_UID}:${CONTAINER_GID}" = "0:0" ]; then \
        deluser ubuntu \
        && addgroup --gid ${CONTAINER_GID} nonroot \
        && adduser --uid ${CONTAINER_UID} --gid ${CONTAINER_GID} --disabled-password nonroot \
        && echo 'nonroot ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers; \
    fi

USER ${CONTAINER_UID}:${CONTAINER_GID}
