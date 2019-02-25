rm -rf dist/gemmy-app

cd gemmy-app
npm run build
cp -r build ../dist/gemmy-app
