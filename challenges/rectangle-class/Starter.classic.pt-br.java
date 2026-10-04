import java.util.Scanner;

// TODO: crie uma classe Rectangle com:
//   - dois atributos int: width e height
//   - um construtor Rectangle(int width, int height)
//   - int area()          retorna width × height
//   - int perimeter()     retorna 2 × (width + height)
//   - boolean isSquare()  retorna true quando width é igual a height

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            int width = scanner.nextInt();
            int height = scanner.nextInt();
            // TODO: crie um Rectangle e imprima: Area: <area>, Perimeter: <perimeter>, Square: <isSquare>
        }
    }
}
