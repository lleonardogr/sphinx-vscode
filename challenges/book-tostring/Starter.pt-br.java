// TODO: crie uma classe Book com os atributos title, author e year,
// um construtor e um método toString() que retorna:
//   "<title>" by <author> (<year>)

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().split(";");
        String title = parts[0];
        String author = parts[1];
        int year = Integer.parseInt(parts[2]);
        // TODO: crie um Book e imprima direto, por exemplo IO.println(book);
    }
}
