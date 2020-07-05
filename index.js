// Tiled uses top-down y-coords by default, but my target application uses bottom-up
const INVERT_Y = true;

tiled.assetSaved.connect((asset) => {
  if (!asset.isTileMap) return;

  // Create an array of booleans dictating whether a given tile is blocked
  const { width, height } = asset;
  const floor = asset.layerAt(0);
  const blocked = Array.from(Array(height), () => new Array(width));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      blocked[INVERT_Y ? height - 1 - y : y][x] = floor.cellAt(x, y).empty;
    }
  }

  // Grab some basic path info
  const filename = FileInfo.baseName(asset.fileName);
  const dirname = FileInfo.path(asset.fileName);
  const filepath = `${dirname}/${filename}.json`;

  console.log();
  console.log(`Saving to ${filepath}`);

  // Serialize and save the file in the same directory
  const data = { id: filename, blocked };
  const file = new TextFile(filepath, TextFile.WriteOnly);
  file.write(JSON.stringify(data));
  file.commit();
});
