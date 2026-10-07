import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        long[] stack = new long[n];
        int top = 0; // quantos valores estão na pilha
        for (int line = 1; line <= n; line++) {
            String[] parts = scanner.nextLine().trim().split(" "); // por exemplo ["PUSH", "3"]

            // TODO: execute a instrução; pare com uma mensagem de erro quando algo estiver errado
        }
        // TODO: imprima o que sobrou na pilha
    }
}
