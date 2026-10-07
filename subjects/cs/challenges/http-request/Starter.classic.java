import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String requestLine = scanner.nextLine(); // for example GET /index.html HTTP/1.1
        String line = scanner.nextLine();
        while (!line.isEmpty()) {
            // TODO: check the header line and remember the Host

            line = scanner.nextLine();
        }
        // TODO: check the request line, then print the four lines or 400 Bad Request
    }
}
