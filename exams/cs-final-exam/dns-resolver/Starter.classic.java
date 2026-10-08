import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int r = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < r; i++) {
            String[] record = scanner.nextLine().trim().split(" "); // name, type, value
            // TODO: store the record
        }
        int q = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < q; i++) {
            String name = scanner.nextLine().trim().toLowerCase();
            // TODO: follow the CNAMEs and print the chain with the addresses, NXDOMAIN or LOOP
        }
    }
}
