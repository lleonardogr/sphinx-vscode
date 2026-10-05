void main() {
    String[] size = IO.readln().trim().split(" ");
    int rows = Integer.parseInt(size[0]);
    int cols = Integer.parseInt(size[1]);
    int[][] grid = new int[rows][cols];
    for (int r = 0; r < rows; r++) {
        String[] p = IO.readln().trim().split(" +");
        for (int c = 0; c < cols; c++) {
            grid[r][c] = Integer.parseInt(p[c]);
        }
    }
    StringBuilder rowSums = new StringBuilder("Row sums:");
    int total = 0;
    for (int r = 0; r < rows; r++) {
        int sum = 0;
        for (int c = 0; c < cols; c++) sum += grid[r][c];
        rowSums.append(' ').append(sum);
        total += sum;
    }
    StringBuilder colSums = new StringBuilder("Column sums:");
    for (int c = 0; c < cols; c++) {
        int sum = 0;
        for (int r = 0; r < rows; r++) sum += grid[r][c];
        colSums.append(' ').append(sum);
    }
    IO.println(rowSums);
    IO.println(colSums);
    IO.println("Total: " + total);
}
