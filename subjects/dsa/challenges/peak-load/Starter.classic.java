import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int k = scanner.nextInt();
        int[] load = new int[n];
        for (int i = 0; i < n; i++) {
            load[i] = scanner.nextInt();
        }

        // TODO: keep each window's peak with a deque, and find the window with the smallest peak
    }
}
