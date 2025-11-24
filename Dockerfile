# Dockerfile
FROM node:22-bullseye

# For SpecKit (Specify CLI) – uses uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

ENV PATH="/root/.local/bin:${PATH}"

# Install Codex CLI via npm (simplest in-container route)
RUN npm install -g @anthropic-ai/claude-code

WORKDIR /workspace
