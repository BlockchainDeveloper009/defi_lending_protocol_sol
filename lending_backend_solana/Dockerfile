# Use Node.js 24.2.0 as the base image
FROM node:24.2.0

# Use bash shell for consistency
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set environment variables for Rust and Cargo
ENV CARGO_HOME="/root/.cargo"
ENV RUSTUP_HOME="/root/.rustup"
ENV PATH="${CARGO_HOME}/bin:${PATH}"

# Install system dependencies
RUN apt update && apt install -y --no-install-recommends \
    ca-certificates \
    libssl-dev \
    libudev-dev \
    pkg-config \
    zlib1g-dev \
    llvm \
    clang \
    make \
    curl \
    nano \
    git \
    procps \
    && apt clean && rm -rf /var/lib/apt/lists/*

# Install Rust (stable, will default to latest stable version)
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y

# Install Solana CLI v2.2.17 (required for Anchor 0.31+)
RUN curl -sSfL https://release.solana.com/v2.2.17/install | bash

# Add Solana CLI to PATH
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Node.js test tools
RUN npm install -g mocha ts-node

# Install latest Anchor CLI (0.31.1 is on main branch)
RUN cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.31.1 --locked

# Add Solana BPF target (required for program builds)
RUN rustup target add bpfel-unknown-unknown

# Set working directory
WORKDIR /solana/

# Copy project files into container
COPY ./ ./

# Make the entrypoint executable
RUN chmod +x ./docker-entrypoint.sh

# Build Solana program using Anchor
RUN anchor build

# Default command when container starts
CMD ["./docker-entrypoint.sh"]
