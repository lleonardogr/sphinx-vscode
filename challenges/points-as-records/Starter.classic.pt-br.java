import java.util.Scanner;

// TODO: complete os métodos distanceTo(Point other) e translate(int dx, int dy)
record Point(int x, int y) {
    double distanceTo(Point other) {
        return 0;
    }

    Point translate(int dx, int dy) {
        return this;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Point a = new Point(scanner.nextInt(), scanner.nextInt());
        Point b = new Point(scanner.nextInt(), scanner.nextInt());
        Point moved = a.translate(scanner.nextInt(), scanner.nextInt());
        System.out.println("A = " + a);
        System.out.println("B = " + b);
        System.out.printf("Distance: %.2f%n", a.distanceTo(b));
        System.out.println("A moved = " + moved);
        System.out.println("A moved equals B: " + moved.equals(b));
    }
}
