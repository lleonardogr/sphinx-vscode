import java.util.*;

public class Main {
    static char[][] grid;
    static Map<Integer, Long> memo = new HashMap<>();

    static long paths(int row, int col) {
        int rows = grid.length, cols = grid[0].length;
        if (row == rows || col == cols || grid[row][col] == '#') return 0;
        if (row == rows - 1 && col == cols - 1) return 1;
        int key = row * cols + col;
        if (!memo.containsKey(key)) memo.put(key, paths(row + 1, col) + paths(row, col + 1));
        return memo.get(key);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int rows = scanner.nextInt();
        scanner.nextInt();
        grid = new char[rows][];
        for (int r = 0; r < rows; r++) grid[r] = scanner.next().toCharArray();
        System.out.println("Paths: " + paths(0, 0));
    }
}
