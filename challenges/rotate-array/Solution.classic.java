import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int k = scanner.nextInt() % n;
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }
        StringJoiner out = new StringJoiner(" ");
        for (int i = 0; i < n; i++) {
            out.add(String.valueOf(numbers[(i - k + n) % n]));
        }
        System.out.println(out);
    }
}
