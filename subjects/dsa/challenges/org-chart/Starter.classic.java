import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] manager = new int[n + 1]; // manager[i] for employees 2..n; employee 1 is the CEO
        for (int i = 2; i <= n; i++) {
            manager[i] = scanner.nextInt();
        }

        // TODO: compute every employee's level, then print the four lines
    }
}
