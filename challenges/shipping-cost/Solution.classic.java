import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double weight = scanner.nextDouble();
        int distance = scanner.nextInt();
        String type = scanner.next();
        double order = scanner.nextDouble();
        if (weight <= 0) {
            System.out.println("Invalid weight");
        } else if (weight > 30) {
            System.out.println("Too heavy");
        } else if (type.equals("standard") && order >= 200.00) {
            System.out.println("Shipping: free");
        } else {
            double price = weight <= 1 ? 8.00 : weight <= 5 ? 12.50 : 20.00;
            if (distance > 500) price = price * 1.5;
            if (type.equals("express")) price = price * 2;
            System.out.printf("Shipping: %.2f%n", price);
        }
    }
}
