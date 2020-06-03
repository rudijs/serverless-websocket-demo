#!/usr/bin/env bash

aws dynamodb list-tables

aws dynamodb create-table \
--table-name WSConnections \
--attribute-definitions \
AttributeName=ConnectionID,AttributeType=S \
--key-schema AttributeName=ConnectionID,KeyType=HASH \
--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

# aws dynamodb --endpoint-url http://localhost:8000 list-tables

# aws dynamodb --endpoint-url http://localhost:8000 create-table \
#  --table-name Music \
#  --attribute-definitions \
#  AttributeName=Artist,AttributeType=S \
#  AttributeName=SongTitle,AttributeType=S \
#  --key-schema AttributeName=Artist,KeyType=HASH AttributeName=SongTitle,KeyType=RANGE \
#  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
