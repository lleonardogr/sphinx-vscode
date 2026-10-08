import java.util.Scanner;

public class Main {

    static int number(int[] b, int from, int count) {
        int n = 0;
        for (int i = from; i < from + count; i++) {
            n = n * 256 + b[i];
        }
        return n;
    }

    static String hex4(int n) {
        String digits = "0123456789ABCDEF";
        String s = "";
        for (int i = 0; i < 4; i++) {
            s = digits.charAt(n % 16) + s;
            n = n / 16;
        }
        return s;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] hex = scanner.nextLine().trim().split(" +");
        int[] b = new int[hex.length];
        for (int i = 0; i < hex.length; i++) {
            b[i] = Integer.parseInt(hex[i], 16);
        }
        int version = b[0] / 16;
        if (version != 4) {
            System.out.println("Not IPv4");
            return;
        }
        int ihl = b[0] % 16;
        int total = number(b, 2, 2);
        int protocol = b[9];
        String name = "Unknown";
        if (protocol == 1) {
            name = "ICMP";
        } else if (protocol == 6) {
            name = "TCP";
        } else if (protocol == 17) {
            name = "UDP";
        }
        // One's complement sum: add every 16-bit word, then fold the carries back in.
        long sum = 0;
        for (int i = 0; i < ihl * 4; i += 2) {
            sum += number(b, i, 2);
        }
        while (sum > 0xFFFF) {
            sum = sum % 65536 + sum / 65536;
        }
        System.out.println("Version: " + version);
        System.out.println("Header length: " + ihl * 4 + " bytes");
        System.out.println("Total length: " + total + " bytes");
        System.out.println("TTL: " + b[8]);
        System.out.println("Protocol: " + name + " (" + protocol + ")");
        System.out.println("Source: " + b[12] + "." + b[13] + "." + b[14] + "." + b[15]);
        System.out.println("Destination: " + b[16] + "." + b[17] + "." + b[18] + "." + b[19]);
        System.out.println("Checksum: 0x" + hex4(number(b, 10, 2)) + (sum == 0xFFFF ? " (valid)" : " (invalid)"));
        if (name.equals("UDP")) {
            int udp = ihl * 4;
            System.out.println("Ports: " + number(b, udp, 2) + " -> " + number(b, udp + 2, 2));
            String payload = "";
            for (int i = udp + 8; i < total; i++) {
                if (b[i] < 32 || b[i] > 126) {
                    payload += ".";
                } else {
                    payload += (char) b[i];
                }
            }
            System.out.println("Payload: " + (payload.length() == 0 ? "(empty)" : payload));
        }
    }
}
