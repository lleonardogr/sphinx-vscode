import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String requestLine = scanner.nextLine();
        String[] parts = requestLine.split(" ", -1);
        String[] methods = {"GET", "POST", "PUT", "DELETE", "HEAD"};
        boolean valid = false;
        if (parts.length == 3) {
            for (String m : methods) {
                if (m.equals(parts[0])) {
                    valid = true;
                }
            }
        }
        String host = "";
        boolean hasHost = false;
        int count = 0;
        String line = scanner.nextLine();
        while (!line.isEmpty()) {
            count++;
            String[] nameValue = line.split(":", 2);
            if (nameValue.length < 2) {
                valid = false;
            } else if (nameValue[0].trim().toLowerCase().equals("host")) {
                host = nameValue[1].trim();
                hasHost = true;
            }
            line = scanner.nextLine();
        }
        if (valid && hasHost) {
            System.out.println("Method: " + parts[0]);
            System.out.println("Path: " + parts[1]);
            System.out.println("Host: " + host);
            System.out.println("Headers: " + count);
        } else {
            System.out.println("400 Bad Request");
        }
    }
}
