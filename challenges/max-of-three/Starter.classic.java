import java.util.Scanner;

public class Main {

    // TODO: return the biggest of a, b and c
    static int max(int a, int b, int c) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int t = scanner.nextInt();
        for (int i = 0; i < t; i++) {
            System.out.println("Max: " + max(scanner.nextInt(), scanner.nextInt(), scanner.nextInt()));
        }
    }
}
