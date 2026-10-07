import java.util.Scanner;

public class Main {

    static long number(String dotted) {
        String[] p = dotted.split("\\.");
        return Long.parseLong(p[0]) * 16777216L + Long.parseLong(p[1]) * 65536 + Long.parseLong(p[2]) * 256 + Long.parseLong(p[3]);
    }

    static boolean matches(long address, long network, int prefix) {
        long size = 1L << (32 - prefix);
        return address / size == network / size;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int r = Integer.parseInt(scanner.nextLine().trim());
        String[][] table = new String[r][];
        for (int i = 0; i < r; i++) {
            table[i] = scanner.nextLine().trim().split("[/ ]");
        }
        int n = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String address = scanner.nextLine().trim();
            long a = number(address);
            String hop = "no route";
            int longest = -1;
            for (String[] route : table) {
                int prefix = Integer.parseInt(route[1]);
                if (prefix > longest && matches(a, number(route[0]), prefix)) {
                    longest = prefix;
                    hop = route[2];
                }
            }
            System.out.println(address + " -> " + hop);
        }
    }
}
