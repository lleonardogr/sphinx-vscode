import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long n = scanner.nextLong();
        int digits = 1, sum = (int) (n % 10), largest = sum, even = sum % 2 == 0 ? 1 : 0;
        for (n /= 10; n > 0; n /= 10) {
            int d = (int) (n % 10);
            digits++;
            sum += d;
            if (d > largest) largest = d;
            if (d % 2 == 0) even++;
        }
        System.out.println("Digits: " + digits);
        System.out.println("Sum: " + sum);
        System.out.println("Largest: " + largest);
        System.out.println("Even digits: " + even);
    }
}
