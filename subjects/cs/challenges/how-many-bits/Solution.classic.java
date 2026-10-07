import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String kind = scanner.next();
        long n = scanner.nextLong();
        if (kind.equals("bits")) {
            long values = 1;
            long i = 0;
            while (i < n) {
                values = values + values;
                i++;
            }
            System.out.println("Values: " + values);
            System.out.println("Largest: " + (values - 1));
        } else {
            int bits = n == 0 ? 1 : 0;
            while (n > 0) {
                n = n / 2;
                bits++;
            }
            System.out.println("Bits: " + bits);
            System.out.println("Bytes: " + (bits % 8 == 0 ? bits / 8 : bits / 8 + 1));
        }
    }
}
