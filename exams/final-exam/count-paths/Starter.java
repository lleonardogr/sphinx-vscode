char[][] grid;
long[][] memo;

// TODO: return how many paths go from (row, col) to the bottom-right cell, moving only right or down
long paths(int row, int col) {
    return 0;
}

void main() {
    String[] size = IO.readln().trim().split(" ");
    int rows = Integer.parseInt(size[0]);
    int cols = Integer.parseInt(size[1]);
    grid = new char[rows][];
    memo = new long[rows][cols];
    for (int r = 0; r < rows; r++) {
        grid[r] = IO.readln().trim().toCharArray();
        Arrays.fill(memo[r], -1);
    }
    IO.println("Paths: " + paths(0, 0));
}
