import java.util.*;

public class Main {
    static char[][] grid;
    static long[][] memo;

    // TODO: devolva quantos caminhos vão de (row, col) até a casa de baixo à direita, andando só para a direita ou para baixo
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
