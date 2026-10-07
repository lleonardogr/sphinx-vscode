import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int r = Integer.parseInt(scanner.nextLine().trim());
        String[] routes = new String[r];
        for (int i = 0; i < r; i++) {
            routes[i] = scanner.nextLine().trim(); // for example 10.0.0.0/8 Office
        }
        int n = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String address = scanner.nextLine().trim();

            // TODO: find the matching route with the longest prefix and print address -> next hop
        }
    }
}
