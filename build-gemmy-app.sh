export PUBLIC_URL="https://wonderbeyond.github.io/gemmy/gemmy-app"

rm -r dist/gemmy-app

cd gemmy-app
npm run build
cp -r build ../dist/gemmy-app
