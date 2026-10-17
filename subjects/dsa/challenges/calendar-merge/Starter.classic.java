import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[][] meetings = new int[n][2];
        for (int i = 0; i < n; i++) {
            meetings[i][0] = scanner.nextInt();
            meetings[i][1] = meetings[i][0] + scanner.nextInt(); // the end
        }

        // TODO: sort the meetings by start, join overlapping ones into blocks, and print the three lines
    }
}
