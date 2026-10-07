import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        long[] stack = new long[n];
        int top = 0; // how many values are on the stack
        for (int line = 1; line <= n; line++) {
            String[] parts = scanner.nextLine().trim().split(" "); // for example ["PUSH", "3"]

            // TODO: run the instruction; stop with an error message when something is wrong
        }
        // TODO: print what is left on the stack
    }
}
