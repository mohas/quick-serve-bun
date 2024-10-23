# quick-serve-bun

Ever wanted to quickly share some files on your server with you non technical friends and family?

## Usage

for now:

1. compile:

```bash
# build the tailwind css file
bun run build-css

# linux
bun build --compile --minify-whitespace --minify-syntax --target=bun-linux-x64 --outfile server ./src/index.ts
bun build --compile --minify-whitespace --minify-syntax --target=bun-linux-x64-baseline --outfile server ./src/index.ts
bun build --compile --minify-whitespace --minify-syntax --target=bun-linux-x64-modern --outfile server ./src/index.ts

# windows
bun build --compile --minify-whitespace --minify-syntax --target=bun-windows-x64 --outfile server ./src/index.ts 
bun build --compile --minify-whitespace --minify-syntax --target=bun-windows-x64-baseline --outfile server ./src/index.ts 
bun build --compile --minify-whitespace --minify-syntax --target=bun-windows-x64-modern --outfile server ./src/index.ts 
```

sometimes you are using a vps or os that is not compatible with bun, you have to use bundling in this case:

```bash
bun build --build --minify-whitespace --minify-syntax --target=bun  ./src/index.ts --outdir buid
```

in this case an `index.js` file is produced that you have to move to your server and run with bun

2. move `server` or `server.exe` to the folder you need to serve contents from
3. `bun install sharp`, sharp needs to be installed in the folder for now
4. if you dont want to install bun `npm install sharp` also works
5. in linux give appropriate permissions `chmod +x ./server`
6. run `./server` or `./server.exe`

## TODO

- [ ] preventing directory traversing
- [ ] compiling and releasing to npm so it can be used like `bunx quick-serve-bun`
- [ ] parsing arguments for port host and folder that contains the files
- [ ] somehow embedding the sharp binary
- [ ] adding dialog to previews images on the webpage
- [ ] selecting, zipping and downloading multiple selected files
- [ ] showing and downloading of other file types
- [ ] adding security http headers
- [ ] build scripts in the package.json
- [ ] minifying assets for smaller and faster pageload
- [ ] storing thumbs on disk for better performance with cli argument
- [ ] translations
