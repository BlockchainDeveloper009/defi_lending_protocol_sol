
DEPLOYMENT TO LOCALNET:

solana program-v4 deploy ./target/deploy/lending_backend_solana.so --program-keypair ./target/deploy/lending_backend_solana-keypair.json
Program Id: 5aJ86bn7S7oQpgieB98yFWUg4D1h2zNm6Wz6Gtqd2TBE

DEPLOYMENT TO DEVNET:
solana config get
> change to devnet
> then deploy command


in case of error:

solana program-v4 deploy ./target/deploy/lending_backend_solana.so --program-keypair ./target/deploy/lending_backend_solana-keypair.json
Error: Failed to send message: RPC response error -32002: Transaction simulation failed: Attempt to load a program that does not exist;

C:\source\repos\defi_lending_protocol_sol\lending_backend_solana>

$anchor deploy --provider.cluster=devnet
$output

```
Deploying cluster: https://api.devnet.solana.com
Upgrade authority: C:\Users\krtzx\.config\solana\id.json
Deploying program "lending_backend_solana"...
Program path: C:\source\repos\defi_lending_protocol_sol\lending_backend_solana\target\deploy\lending_backend_solana.so...
Program Id: CHoptLtk8eyutQoj5PKaqcA73ALiAqPoAZV5HbFNqSUw

Signature: 2B9eo4YRJv3ouhekLY8eHsWq4ewq4te6tqRoZz1ySYsgFzP4brSGDQzBaNcGtpLagfUr622GMN7HTiHcZ9wTri6U

Deploy success

C:\source\repos\defi_lending_protocol_sol\lending_backend_solana>
```

