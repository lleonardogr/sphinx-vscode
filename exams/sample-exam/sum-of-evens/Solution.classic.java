import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int sum = 0;
        for (int i = 0; i < n; i++) {
            int value = scanner.nextInt();
            if (value % 2 == 0) {
                sum += value;
            }
        }
        System.out.println(sum);
    }
}
