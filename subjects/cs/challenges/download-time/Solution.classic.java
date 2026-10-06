import java.util.Scanner;

public class Main {

    static long power(long base, int times) {
        long result = 1;
        for (int i = 0; i < times; i++) {
            result *= base;
        }
        return result;
    }

    static long bytes(long amount, String unit) {
        String[] si = {"B", "KB", "MB", "GB", "TB"};
        String[] binary = {"B", "KiB", "MiB", "GiB", "TiB"};
        for (int i = 0; i < si.length; i++) {
            if (si[i].equals(unit)) {
                return amount * power(1000, i);
            }
            if (binary[i].equals(unit)) {
                return amount * power(1024, i);
            }
        }
        return -1;
    }

    static long bitsPerSecond(long amount, String unit) {
        String[] units = {"bps", "Kbps", "Mbps", "Gbps"};
        for (int i = 0; i < units.length; i++) {
            if (units[i].equals(unit)) {
                return amount * power(1000, i);
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long sizeAmount = scanner.nextLong();
        String sizeUnit = scanner.next();
        long speedAmount = scanner.nextLong();
        String speedUnit = scanner.next();
        long bytes = bytes(sizeAmount, sizeUnit);
        long bps = bitsPerSecond(speedAmount, speedUnit);
        if (bytes < 0) {
            System.out.println("Invalid unit: " + sizeUnit);
        } else if (bps < 0) {
            System.out.println("Invalid unit: " + speedUnit);
        } else {
            long bits = bytes * 8;
            long seconds = bits / bps;
            if (bits % bps != 0) {
                seconds++;
            }
            System.out.printf("Time: %d:%02d:%02d%n", seconds / 3600, (seconds / 60) % 60, seconds % 60);
        }
    }
}
