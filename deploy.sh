#!/bin/bash
set -e

echo "Building the application..."
npm run build

echo "Cleaning remote build directory..."
ssh ifmo 'cd public_html && rm -rf build'

echo "Deploying files..."
scp -r build ifmo:public_html/

echo "Deployment completed successfully!"
echo "Application available at: https://se.ifmo.ru/~s409449/build/"