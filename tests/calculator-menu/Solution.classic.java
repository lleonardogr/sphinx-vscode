import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("=== Calculator ===");
        System.out.println("1. Add");
        System.out.println("2. Subtract");
        System.out.println("3. Multiply");
        System.out.println("4. Divide");
        System.out.println("0. Exit");

        int operations = 0;
        String option;
        do {
            option = scanner.nextLine().trim();
            switch (option) {
                case "0" -> { }
                case "1", "2", "3", "4" -> {
                    int a = scanner.nextInt();
                    int b = scanner.nextInt();
                    scanner.nextLine();
                    if (option.equals("4") && b == 0) {
                        System.out.println("Cannot divide by zero");
                    } else {
                        int result = switch (option) {
                            case "1" -> a + b;
                            case "2" -> a - b;
                            case "3" -> a * b;
                            default -> a / b;
                        };
                        String symbol = switch (option) {
                            case "1" -> "+";
                            case "2" -> "-";
                            case "3" -> "*";
                            default -> "/";
                        };
                        System.out.println(a + " " + symbol + " " + b + " = " + result);
                        operations++;
                    }
                }
                default -> System.out.println("Invalid option");
            }
        } while (!option.equals("0"));
        System.out.println("Operations: " + operations);
        System.out.println("Goodbye!");
    }
}
