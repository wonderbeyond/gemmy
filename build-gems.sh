mkdir -p dist

# cp gemmy-index.yaml dist/
cp -r gems dist/
yaml2json gems/gemmy-index.yaml > dist/gems/gemmy-index.json
