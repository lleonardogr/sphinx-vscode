import java.util.Scanner;

public class Main {

    // TODO: área de um círculo com este raio
    static double area(double radius) {
        return 0;
    }

    // TODO: área de um retângulo
    static double area(double width, double height) {
        return 0;
    }

    // TODO: área de um triângulo de lados a, b e c (fórmula de Heron)
    static double area(double a, double b, double c) {
        return 0;
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
