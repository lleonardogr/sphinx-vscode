import java.util.*;

public class Main {
    static char[][] grid;
    static long[][] memo;

    // TODO: return how many paths go from (row, col) to the bottom-right cell, moving only right or down
    static long paths(int row, int col) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int rows = scanner.nextInt();
        int cols = scanner.nextInt();
        grid = new char[rows][];
        memo = new long[rows][cols];
        for (int r = 0; r < rows; r++) {
            grid[r] = scanner.next().toCharArray();
            Arrays.fill(memo[r], -1);
        }
        System.out.println("Paths: " + paths(0, 0));
    }
}
