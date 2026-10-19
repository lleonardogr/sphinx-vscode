import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        long k = scanner.nextLong();
        int[] change = new int[n];
        for (int i = 0; i < n; i++) {
            change[i] = scanner.nextInt();
        }

        // TODO: conte os períodos que somam k com somas de prefixo e um HashMap, e ache o mais longo
    }
}
