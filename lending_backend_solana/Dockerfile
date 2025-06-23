FROM node:16
#Below to make source work
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt update

RUN apt update && apt install -y ca-certificates
RUN apt install libssl-dev libudev-dev pkg-config zlib1g-dev llvm clang make curl nano git -y
RUN curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | bash -s -- -y
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.10.38/install)"
RUN npm install -g mocha && npm install -g ts-node
RUN /root/.cargo/bin/cargo install --git https://github.com/project-serum/anchor anchor-cli --locked

ENV PATH="/root/.local/share/solana/install/active_release/bin:/root/.cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ENV HOME="/root/"

WORKDIR /solana/
COPY ./ ./

RUN cargo build-bpf --manifest-path=/solana/Cargo.toml
CMD ["./docker-entrypoint.sh"]