rm -rf dist/gems
mkdir -p dist
cat gems/gems*.txt | node gemman.js index
yaml2json dist/gems/gemmy-index.yaml > dist/gems/gemmy-index.json
