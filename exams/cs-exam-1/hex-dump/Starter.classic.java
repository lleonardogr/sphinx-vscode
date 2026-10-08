import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] bytes = new int[n];
        for (int i = 0; i < n; i++) {
            bytes[i] = scanner.nextInt();
        }
        // TODO: print one line per 16 bytes: offset, hex bytes, text
    }
}
