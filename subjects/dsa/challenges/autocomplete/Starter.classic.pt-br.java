import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        String[] words = new String[n];
        for (int i = 0; i < n; i++) {
            words[i] = scanner.next();
        }
        int q = scanner.nextInt();
        for (int i = 0; i < q; i++) {
            String prefix = scanner.next();

            // TODO: imprima quantas palavras começam com prefix, usando uma trie montada com as palavras
        }
    }
}
