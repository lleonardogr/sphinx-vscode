import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long n = scanner.nextLong();
        int bits = n == 0 ? 1 : 0;
        while (n > 0) {
            n = n / 2;
            bits++;
        }
        int bytes = bits / 8;
        if (bits % 8 != 0) {
            bytes++;
        }
        System.out.println("Bits: " + bits);
        System.out.println("Bytes: " + bytes);
    }
}
