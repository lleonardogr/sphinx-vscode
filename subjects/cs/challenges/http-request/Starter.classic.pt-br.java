import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String requestLine = scanner.nextLine(); // por exemplo GET /index.html HTTP/1.1
        String line = scanner.nextLine();
        while (!line.isEmpty()) {
            // TODO: confira a linha de cabeçalho e guarde o Host

            line = scanner.nextLine();
        }
        // TODO: confira a linha de pedido, depois imprima as quatro linhas ou 400 Bad Request
    }
}
