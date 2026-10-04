import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int month = scanner.nextInt();
        int year = scanner.nextInt();
        boolean leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        String answer = switch (month) {
            case 1, 3, 5, 7, 8, 10, 12 -> "31";
            case 4, 6, 9, 11 -> "30";
            case 2 -> leap ? "29" : "28";
            default -> "Invalid month";
        };
        System.out.println(answer);
    }
}
