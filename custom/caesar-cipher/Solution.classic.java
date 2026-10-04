import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int shift = scanner.nextInt();
        scanner.nextLine();
        String message = scanner.nextLine();
        String encoded = "";
        for (int i = 0; i < message.length(); i++) {
            char c = message.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                c = (char) ('A' + (c - 'A' + shift) % 26);
            } else if (c >= 'a' && c <= 'z') {
                c = (char) ('a' + (c - 'a' + shift) % 26);
            }
            encoded += c;
        }
        System.out.println(encoded);
    }
}
