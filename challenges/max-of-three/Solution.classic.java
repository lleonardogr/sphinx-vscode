import java.util.Scanner;

public class Main {

    static int max(int a, int b, int c) {
        if (a >= b && a >= c) return a;
        return b >= c ? b : c;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int t = scanner.nextInt();
        for (int i = 0; i < t; i++) {
            System.out.println("Max: " + max(scanner.nextInt(), scanner.nextInt(), scanner.nextInt()));
        }
    }
}
