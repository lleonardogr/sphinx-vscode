import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int minutes = scanner.nextInt();
        if (minutes <= 30) {
            System.out.println("Fee: free");
        } else {
            double fee = Math.ceil(minutes / 60.0) * 5;
            if (fee > 40) fee = 40;
            System.out.printf("Fee: %.2f%n", fee);
        }
    }
}
