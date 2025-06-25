# Use official Node.js 24.2.0 image as base (includes Node and npm)
FROM node:24.2.0

# Replace default /bin/sh with bash for better scripting compatibility
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set environment variables for Rust and Cargo to function properly
ENV CARGO_HOME="/root/.cargo"
ENV RUSTUP_HOME="/root/.rustup"
ENV PATH="${CARGO_HOME}/bin:${PATH}"

# Install system dependencies needed for Rust, Solana, and Anchor builds
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

# Copy the Rust toolchain file to pin Rust version and targets
COPY .rust-toolchain.toml ./

# Install Rust via rustup using the version pinned in .rust-toolchain.toml
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y

# Debug: Show installed Rust version and toolchain info
RUN rustup show

# Install Solana CLI version 2.2.17 (compatible with Anchor 0.31.x)
RUN curl -sSfL https://release.solana.com/v2.2.17/install | bash

# Add Solana CLI to PATH environment variable
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install global Node.js tools for testing (mocha and ts-node)
RUN npm install -g mocha ts-node

# Install Anchor CLI at version 0.31.1 (locked to this git tag)
RUN cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.31.1 --locked

# Set working directory inside the container where the project files will live
WORKDIR /solana

# Copy entire project contents into the container's working directory
COPY . .

# Make the Docker entrypoint script executable (if it exists)
RUN chmod +x ./docker-entrypoint.sh || true

# Build the Solana Anchor program inside the container
RUN anchor build

# Default command to run when container starts (runs entrypoint script)
CMD ["./docker-entrypoint.sh"]
