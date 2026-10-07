import java.util.Scanner;

public class Main {

    static long toNumber(String dotted) {
        long n = 0;
        for (String part : dotted.split("\\.")) {
            n = (n << 8) | Long.parseLong(part);
        }
        return n;
    }

    static String toDotted(long n) {
        String[] bytes = new String[4];
        for (int i = 3; i >= 0; i--) {
            bytes[i] = String.valueOf(n % 256);
            n /= 256;
        }
        return String.join(".", bytes);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] input = scanner.next().split("/");
        int prefix = Integer.parseInt(input[1]);
        long address = toNumber(input[0]);
        long mask = (0xFFFFFFFFL << (32 - prefix)) & 0xFFFFFFFFL;
        long network = address & mask;
        long broadcast = network | (~mask & 0xFFFFFFFFL);
        System.out.println("Network: " + toDotted(network));
        System.out.println("Broadcast: " + toDotted(broadcast));
        System.out.println("First host: " + toDotted(network + 1));
        System.out.println("Last host: " + toDotted(broadcast - 1));
        System.out.println("Hosts: " + (broadcast - network - 1));
    }
}
