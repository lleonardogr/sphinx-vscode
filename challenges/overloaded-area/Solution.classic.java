import java.util.Scanner;

public class Main {

    static double area(double radius) {
        return Math.PI * radius * radius;
    }

    static double area(double width, double height) {
        return width * height;
    }

    static double area(double a, double b, double c) {
        double s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int t = scanner.nextInt();
        for (int i = 0; i < t; i++) {
            String shape = scanner.next();
            double area;
            if (shape.equals("circle")) {
                area = area(scanner.nextDouble());
            } else if (shape.equals("rectangle")) {
                area = area(scanner.nextDouble(), scanner.nextDouble());
            } else {
                area = area(scanner.nextDouble(), scanner.nextDouble(), scanner.nextDouble());
            }
            System.out.printf("Area of the %s: %.2f%n", shape, area);
        }
    }
}
