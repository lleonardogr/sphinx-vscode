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

class Square extends Shape {
    private final double side;

    Square(double side) {
        this.side = side;
    }

    String name() {
        return "Square";
    }

    double area() {
        return side * side;
    }
}

class Triangle extends Shape {
    private final double base;
    private final double height;

    Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }

    String name() {
        return "Triangle";
    }

    double area() {
        return base * height / 2;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        double total = 0;
        for (int i = 0; i < n; i++) {
            String type = scanner.next();
            Shape shape;
            if (type.equals("circle")) {
                shape = new Circle(scanner.nextDouble());
            } else if (type.equals("square")) {
                shape = new Square(scanner.nextDouble());
            } else {
                shape = new Triangle(scanner.nextDouble(), scanner.nextDouble());
            }
            System.out.println(String.format("%s: %.2f", shape.name(), shape.area()));
            total += shape.area();
        }
        System.out.println(String.format("Total area: %.2f", total));
    }
}
