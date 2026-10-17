import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] ids = new int[n];
        for (int i = 0; i < n; i++) {
            ids[i] = scanner.nextInt();
        }

        // TODO: count how many different ids appear more than once, fast enough for 200,000 tickets
    }
}
