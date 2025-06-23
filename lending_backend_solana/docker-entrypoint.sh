#!/bin/bash
solana config set --url localhost
solana config get
solana airdrop 1000

solana-test-validator --quiet