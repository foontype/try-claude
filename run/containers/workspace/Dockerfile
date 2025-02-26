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
