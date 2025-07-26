#!/bin/bash
solana-test-validator --reset --quiet &
VALIDATOR_PID=$!
sleep 3
anchor build
npx mocha -r ts-node/register tests/mock_pyth_oracle.ts --timeout 10000
kill $VALIDATOR_PID

#
#chmod +x run_oracle_test.sh
#./run_oracle_test.sh
