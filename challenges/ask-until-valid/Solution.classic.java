import java.util.Scanner;

public class Main {

    static int parseAge(String text) {
        int age = Integer.parseInt(text);
        if (age < 0 || age > 120) {
            throw new IllegalArgumentException("Out of range: " + age);
        }
        return age;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean accepted = false;
        while (!accepted) {
            String text = scanner.nextLine().trim();
            try {
                System.out.println("Age accepted: " + parseAge(text));
                accepted = true;
            } catch (NumberFormatException e) {
                System.out.println("Not a number: " + text);
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
