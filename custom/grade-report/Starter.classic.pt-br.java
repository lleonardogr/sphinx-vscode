import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] grades = new int[n];
        for (int i = 0; i < n; i++) {
            grades[i] = scanner.nextInt();
        }

        // TODO: calcule a média, a maior, a menor e quantos passaram, e imprima o relatório
    }
}
