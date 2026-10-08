import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] names = {"byte", "short", "int"};
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            long x = scanner.nextLong();
            String type = "long";
            int bits = 8;
            for (int t = 0; t < names.length; t++) {
                long half = 1L << (bits - 1);
                if (-half <= x && x < half) {
                    type = names[t];
                    break;
                }
                bits = bits * 2;
            }
            System.out.println(x + ": " + type);
        }
    }
}
