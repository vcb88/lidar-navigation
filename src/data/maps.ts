import { MapData, CellType, Point } from '../types';

const rawMaps = [
`
####################
#S.................#
#...####.....####..#
#...#........#.....#
#...#...E....#.....#
#...####.....####..#
#..................#
####################
`,
`
####################
#S.................#
#.......#####......#
#.......#...#......#
#...#####...#####..#
#...#...........#..#
#...#.....E.....#..#
#...#############..#
#..................#
####################
`
];

export const parseMap = (ascii: string): MapData => {
  const lines = ascii.trim().split('\n');
  const height = lines.length;
  const width = lines[0].length;
  let start: Point = { x: 1, y: 1 };
  let end: Point = { x: width - 2, y: height - 2 };

  const grid: CellType[][] = [];

  for (let y = 0; y < height; y++) {
    const row: CellType[] = [];
    for (let x = 0; x < width; x++) {
      const char = lines[y][x];
      let type = CellType.Empty;
      if (char === '#') type = CellType.Wall;
      else if (char === 'S') { start = { x, y }; type = CellType.Start; }
      else if (char === 'E') { end = { x, y }; type = CellType.End; }
      row.push(type);
    }
    grid.push(row);
  }

  return { grid, width, height, start, end };
};

export const getLevel = (index: number) => parseMap(rawMaps[index % rawMaps.length]);
