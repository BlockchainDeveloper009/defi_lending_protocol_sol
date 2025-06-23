FROM rust:1.82

ENV DEBIAN_FRONTEND=noninteractive

# Install required packages as root
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    build-essential \
    libudev-dev \
    curl \
    git \
    clang \
    llvm \
    libclang-dev \
    protobuf-compiler \
    nodejs \
    npm \
    python3 \
    python3-pip \
    sudo

# Create user and allow passwordless sudo
RUN useradd -ms /bin/bash devuser && \
    echo 'devuser ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Switch to devuser
USER devuser
WORKDIR /home/devuser

# Install Solana CLI v1.18.11 as devuser
ENV SOLANA_VERSION=v1.18.11
RUN curl -sSfL https://release.solana.com/$SOLANA_VERSION/install | bash -s - -b /home/devuser/.local/bin && \
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

ENV PATH="/home/devuser/.local/bin:$PATH"

# # Install Solana CLI v1.18.11 as devuser
# RUN curl -sSfL https://release.solana.com/v1.18.11/install | bash && \
#     echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

# # Update PATH for this layer
# ENV PATH="/home/devuser/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor CLI v0.29.0
RUN cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.29.0

WORKDIR /home/devuser/project

CMD ["bash"]
