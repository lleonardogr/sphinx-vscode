import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int q = scanner.nextInt();
        long found = 0, missing = 0, sum = 0;
        for (int i = 0; i < q; i++) {
            int op = scanner.nextInt();
            int key = scanner.nextInt();
            int value = scanner.nextInt();

            // TODO: put, get ou remove na sua própria tabela hash, e conte os gets
        }
        System.out.println("found: " + found);
        System.out.println("missing: " + missing);
        System.out.println("sum: " + sum);
        System.out.println("size: " + 0); // TODO: o número de chaves na sua tabela
    }
}
