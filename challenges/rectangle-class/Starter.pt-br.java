// TODO: crie uma classe Rectangle com:
//   - dois atributos int: width e height
//   - um construtor Rectangle(int width, int height)
//   - int area()          retorna width × height
//   - int perimeter()     retorna 2 × (width + height)
//   - boolean isSquare()  retorna true quando width é igual a height

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" ");
        int width = Integer.parseInt(parts[0]);
        int height = Integer.parseInt(parts[1]);
        // TODO: crie um Rectangle e imprima: Area: <area>, Perimeter: <perimeter>, Square: <isSquare>
    }
}
