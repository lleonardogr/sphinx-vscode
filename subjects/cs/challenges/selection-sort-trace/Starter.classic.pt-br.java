import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }

        // TODO: em cada passada, ache o menor do resto, troque-o para o lugar e imprima a lista;
        // depois imprima as comparações e as trocas
    }
}
