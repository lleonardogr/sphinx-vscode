import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int total = scanner.nextInt();
        System.out.println("Hours: " + total / 3600);
        System.out.println("Minutes: " + (total % 3600) / 60);
        System.out.println("Seconds: " + total % 60);
    }
}
