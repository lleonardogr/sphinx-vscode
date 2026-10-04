import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];

        // TODO: leia os n números para dentro do array
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }

        // TODO: encontre o maior e o menor número e imprima os dois
    }
}
