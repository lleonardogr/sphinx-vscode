import java.util.Scanner;

public class Main {

    static int value(String pair) {
        int total = 0;
        for (char c : pair.toCharArray()) {
            int d = Character.digit(c, 16);
            if (d < 0) {
                return -1;
            }
            total = total * 16 + d;
        }
        return total;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String color = scanner.next();
        String hex = color.startsWith("#") ? color.substring(1) : "";
        if (hex.length() == 3) {
            StringBuilder longForm = new StringBuilder();
            for (char c : hex.toCharArray()) {
                longForm.append(c).append(c);
            }
            hex = longForm.toString();
        }
        int r = hex.length() == 6 ? value(hex.substring(0, 2)) : -1;
        int g = hex.length() == 6 ? value(hex.substring(2, 4)) : -1;
        int b = hex.length() == 6 ? value(hex.substring(4, 6)) : -1;
        if (r < 0 || g < 0 || b < 0) {
            System.out.println("Invalid color");
        } else {
            long brightness = Math.round((299 * r + 587 * g + 114 * b) / 1000.0);
            System.out.printf("rgb(%d, %d, %d)%n", r, g, b);
            System.out.println("Brightness: " + brightness);
            System.out.println("Text: " + (brightness < 128 ? "white" : "black"));
        }
    }
}
