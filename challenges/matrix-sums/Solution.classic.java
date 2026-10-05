import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int rows = scanner.nextInt();
        int cols = scanner.nextInt();
        int[][] grid = new int[rows][cols];
        int[] rowSum = new int[rows];
        int[] colSum = new int[cols];
        int total = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                grid[r][c] = scanner.nextInt();
                rowSum[r] += grid[r][c];
                colSum[c] += grid[r][c];
                total += grid[r][c];
            }
        }
        StringJoiner rs = new StringJoiner(" ", "Row sums: ", "");
        for (int s : rowSum) rs.add(String.valueOf(s));
        StringJoiner cs = new StringJoiner(" ", "Column sums: ", "");
        for (int s : colSum) cs.add(String.valueOf(s));
        System.out.println(rs);
        System.out.println(cs);
        System.out.println("Total: " + total);
    }
}
