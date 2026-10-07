import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        String[] program = new String[n];
        for (int i = 0; i < n; i++) {
            program[i] = scanner.nextLine().trim(); // for example SET 3
        }
        int[] memory = new int[16];
        int acc = 0;
        int pc = 1;

        // TODO: fetch, decode and execute instructions until HALT, the end, 1000 steps or an error
    }
}
