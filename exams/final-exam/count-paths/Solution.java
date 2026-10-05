char[][] grid;
long[][] memo;

long paths(int row, int col) {
    if (row >= grid.length || col >= grid[0].length || grid[row][col] == '#') {
        return 0;
    }
    if (row == grid.length - 1 && col == grid[0].length - 1) {
        return 1;
    }
    if (memo[row][col] < 0) {
        memo[row][col] = paths(row + 1, col) + paths(row, col + 1);
    }
    return memo[row][col];
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
