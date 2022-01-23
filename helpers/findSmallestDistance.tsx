export default function findSmallestDistance(distances: number[]) {
  function findDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x2 - x1) ^ (2 + (y2 - y1)) ^ 2);
  }

  distances.forEach(() => {}); //come back to this
}
