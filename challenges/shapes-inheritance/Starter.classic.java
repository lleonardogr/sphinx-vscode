import java.util.Scanner;

abstract class Shape {
    abstract String name();

    abstract double area();
}

// Example: a complete shape.
class Circle extends Shape {
    private final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    String name() {
        return "Circle";
    }

    double area() {
        return Math.PI * radius * radius;
    }
}

// TODO: create class Square extends Shape (one side) and class Triangle extends Shape (base and height)

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        double total = 0;
        for (int i = 0; i < n; i++) {
            String type = scanner.next();
            Shape shape = null;
            if (type.equals("circle")) {
                shape = new Circle(scanner.nextDouble());
            }
            // TODO: create a Square for "square" and a Triangle for "triangle"

            // TODO: print the shape as  Name: area  (2 decimals) and add its area to total
        }
        // TODO: print  Total area: <total>  (2 decimals)
    }
}
