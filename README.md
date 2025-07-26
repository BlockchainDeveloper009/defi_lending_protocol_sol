# defi_lending_protocol_sol
#Solana, #anchor, 

rewriter, playbook


$solana-test-validator

$solana-test-validator reset

$solana-test-validator ./my-ledger --url mainnet-beta --clone Lux8W2ibuWmhJ4Enp

$solana-test-validator ./my-ledger --url mainnet-beta --clone wallet

$solana balace <accno>

## preload

$solana-test-validator

$solana config get

solana-keygen pubkey account3.json

solana-test-validator --version

solana --install



harishgk@harishgk-HP-EliteBook-Folio-9480m:~/source/repos/defi_lending_protocol_sol/defi_lending_protocol_app$ docker build .
[+] Building 153.2s (12/12) FINISHED                                                              docker:default
 => [internal] load build definition from Dockerfile                                                        0.0s
 => => transferring dockerfile: 234B                                                                        0.0s
 => [internal] load metadata for docker.io/library/node:bullseye                                            0.4s
 => [internal] load .dockerignore                                                                           0.0s
 => => transferring context: 2B                                                                             0.0s
 => [internal] load build context                                                                           1.5s
 => => transferring context: 246.57kB                                                                       1.5s
 => [1/7] FROM docker.io/library/node:bullseye@sha256:45bf4486f6da5189387934bc21de701211a3ff46b9dd649126a7  0.0s
 => CACHED [2/7] WORKDIR /app                                                                               0.0s
 => [3/7] COPY package* ./                                                                                  0.3s
 => [4/7] RUN npm i --production-only                                                                      48.6s
 => [5/7] COPY ./src ./src                                                                                  0.1s 
 => [6/7] COPY ./public ./public                                                                            0.1s 
 => [7/7] RUN chown -R node /app/node_modules                                                              73.8s
 => exporting to image                                                                                     28.3s
 => => exporting layers                                                                                    28.3s
 => => writing image sha256:abcc631ca46c140717ec3f9938fcbb6dea1694318f19b24f794ddbcb675522db                0.0s
harishgk@harishgk-HP-EliteBook-Folio-9480m:~/source/repos/defi_lending_protocol

docker run -d -p 3000:3000 -p 8899:8899 --name solana-lending-app sha256:abcc631ca46c140717ec3f9938fcbb6dea1694318f19b24f794ddbcb675522db


with cache:
**********
docker build -t lending-backend-solana -f lending_backend_solana/Dockerfile .

without cache:

docker build --no-cache -t lending-backend-solana -f lending_backend_solana/Dockerfile .



agave-install init v2.1.7

docker image: successful - july1_2025

 => => exporting layers                                                   73.6s
 => => writing image sha256:895cf5f57beb807932b4fc06a99fc7ec5c8d1fd2316c7  0.0s
 => => naming to docker.io/library/lending-backend-solana                  0.0s
harishgk@harishgk-HP-EliteBook-Folio-9480m:~/source/repos/defi_lending_protocol_sol$ 

july2_2025:

 => exporting to image                                                    70.1s
 => => exporting layers                                                   70.0s
 => => writing image sha256:d0fc8fff22adc2a21da93d13c276f6f0462e7b55ed01e  0.0s
 => => naming to docker.io/library/lending-backend-solana                  0.0s
harishgk@harishgk-HP-EliteBook-Folio-9480m:~/source/repos/defi_lending_protocol_sol$ e



$ docker run -it --rm -p 8899:8899 -p 3000:3000 --name lending-backend-solana lending-backend-solana

$docker exec -it lending-backend-solana /bin/bash



[how to run tests](<ReadME_How to Run Test.md>)