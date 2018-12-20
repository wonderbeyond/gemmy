mkdir -p dist

cp gemmy-index.yaml dist/
yaml2json gemmy-index.yaml > dist/gemmy-index.json

cp -r gems dist/
