import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] bytes = new int[n];
        for (int i = 0; i < n; i++) {
            bytes[i] = scanner.nextInt();
        }
        // TODO: imprima uma linha a cada 16 bytes: deslocamento, bytes em hexadecimal, texto
    }
}
