import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        for (int row = 1; row <= n; row++) {
            String line = "1";
            for (int i = 2; i <= row; i++) line += " " + i;
            for (int i = row - 1; i >= 1; i--) line += " " + i;
            System.out.println(line);
        }
    }
}
