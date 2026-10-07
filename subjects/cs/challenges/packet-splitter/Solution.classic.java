import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long message = scanner.nextLong();
        long packetSize = scanner.nextLong();
        long header = scanner.nextLong();
        long payload = packetSize - header;
        if (payload < 1) {
            System.out.println("Header too big");
        } else {
            long full = message / payload;
            long rest = message % payload;
            long packets = rest == 0 ? full : full + 1;
            long lastPayload = rest == 0 ? payload : rest;
            System.out.println("Packets: " + packets);
            System.out.println("Last packet: " + (lastPayload + header) + " bytes");
            System.out.println("Total sent: " + (message + packets * header) + " bytes");
        }
    }
}
