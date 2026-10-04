// TODO: crie uma classe Person com:
//   - dois atributos: String name e int age
//   - um construtor Person(String name, int age)
//   - um método String introduce() que retorna "Hi, I'm <name> and I'm <age> years old."

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" ");
        String name = parts[0];
        int age = Integer.parseInt(parts[1]);
        // TODO: crie um objeto Person e imprima o que introduce() retorna
    }
}
