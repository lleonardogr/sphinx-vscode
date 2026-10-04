import java.util.Scanner;

// TODO: crie uma classe Book com os atributos title, author e year,
// um construtor e um método toString() que retorna:
//   "<title>" by <author> (<year>)

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] parts = scanner.nextLine().split(";");
            String title = parts[0];
            String author = parts[1];
            int year = Integer.parseInt(parts[2]);
            // TODO: crie um Book e imprima direto, por exemplo System.out.println(book);
        }
    }
}
