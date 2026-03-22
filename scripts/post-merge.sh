#!/bin/bash

# Post-merge setup script for Infinite Wealth Command Center
# Runs after task agent merges code into main

set -e

echo "=== Post-Merge Setup ==="

# Navigate to react app directory
cd Leonard-Victoria-webpage-dashboard--feat-build-react-webpage-8929662002850160816/react-app

echo "Installing dependencies..."
npm install --legacy-peer-deps 2>&1 | tail -5

echo "Running build..."
npm run build 2>&1 | tail -5

echo "=== Setup Complete ==="
exit 0
