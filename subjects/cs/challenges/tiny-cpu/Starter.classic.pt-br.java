import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        String[] program = new String[n];
        for (int i = 0; i < n; i++) {
            program[i] = scanner.nextLine().trim(); // por exemplo SET 3
        }
        int[] memory = new int[16];
        int acc = 0;
        int pc = 1;

        // TODO: busque, decodifique e execute instruções até HALT, o fim, 1000 passos ou um erro
    }
}
