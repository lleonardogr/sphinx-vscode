import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] manager = new int[n + 1]; // manager[i] para os funcionários 2..n; o funcionário 1 é o CEO
        for (int i = 2; i <= n; i++) {
            manager[i] = scanner.nextInt();
        }

        // TODO: calcule o nível de cada funcionário e depois imprima as quatro linhas
    }
}
