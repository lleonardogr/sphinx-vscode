import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int k = scanner.nextInt();
        String[] readings = new String[k];
        for (int i = 0; i < k; i++) {
            readings[i] = scanner.next();
        }
        // TODO: print each reading's position, then count the glitches
    }
}
