import java.util.Scanner;

// TODO: crie uma classe Person com:
//   - dois atributos: String name e int age
//   - um construtor Person(String name, int age)
//   - um método String introduce() que retorna "Hi, I'm <name> and I'm <age> years old."

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            String name = scanner.next();
            int age = scanner.nextInt();
            // TODO: crie um objeto Person e imprima o que introduce() retorna
        }
    }
}
