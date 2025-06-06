$anchor init program_name.

$npm init -y
$npm install --save-dev mocha chai ts-mocha @types/mocha @types/chai typescript


###### step3: docker image - TO AVOID DOCKER, SKIP TO STEP 8

docker-compose build



#### step4: from project directory to start the docker.
docker-compose up -d


to connect to the staretd docker node
docker exec -it <image name>> bash
docker exec -it anchor-dev-2025may30 bash


docker-compose down



STEP 8: WITHOUT DOCKER


run testing locally:


https://www.youtube.com/watch?v=amAq-WHAFs8&t=25342s

1: 3:30 minutes.. -- testing localnet

2: video: 3.39: solana keypair creation

        $solana config set --keypair bosxxxx.json

7a: v:4:27 -> swap program init
7b: v:5:45 -> speaks about slowing test, mocha command
8: v:5:48 -> Vesting 

9: v9.30  -> Token lottery test, 
    9.34 -> CUSTOM error code analysis, skipPreflight:treu for a.web3.sendAndConfirmTransaction, throw transaction id with error, 
    9.35    - go to explorer.solana.com and use txnd id to search for the error
            - how to load solana program from mainnet - refer solana cookbook
            - metadata.json, uri for NFT, metaplex
-  9.40 -> 
- 10:00 -> testing:
- 10:09 -> **`Randomness_acct *~'**: Switchboard smart contract, UncheckedAccount<'info>; .sh setup script
- 10.23 -> good technic ; read program and convert to.json file to avoid loadingagain and again in test files
- provider= anchor.AnchorProvider.env()
- anchor.setProvider(pprovider)
- 