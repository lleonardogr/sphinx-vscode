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

        int target = scanner.nextInt();

        // TODO: conte quantas vezes target aparece no array e imprima
    }
}
