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
        if (hex.length() != 6) {
            System.out.println("Invalid color");
        } else {
            int r = value(hex.substring(0, 2));
            int g = value(hex.substring(2, 4));
            int b = value(hex.substring(4, 6));
            if (r < 0 || g < 0 || b < 0) {
                System.out.println("Invalid color");
            } else {
                System.out.printf("rgb(%d, %d, %d)%n", r, g, b);
            }
        }
    }
}
