abstract class Shape {
    abstract String name();

    abstract double area();
}

// Exemplo: uma forma completa.
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

// TODO: crie class Square extends Shape (um lado) e class Triangle extends Shape (base e altura)

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    double total = 0;
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" "); // por exemplo ["circle", "2"] ou ["triangle", "4", "5"]
        String type = parts[0];
        Shape shape = null;
        if (type.equals("circle")) {
            shape = new Circle(Double.parseDouble(parts[1]));
        }
        // TODO: crie um Square para "square" e um Triangle para "triangle"

        // TODO: imprima a forma como  Nome: área  (2 casas decimais) e some a área em total
    }
    // TODO: imprima  Total area: <total>  (2 casas decimais)
}
