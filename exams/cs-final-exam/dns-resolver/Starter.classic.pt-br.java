import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int r = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < r; i++) {
            String[] record = scanner.nextLine().trim().split(" "); // nome, tipo, valor
            // TODO: guarde o registro
        }
        int q = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < q; i++) {
            String name = scanner.nextLine().trim().toLowerCase();
            // TODO: siga os CNAMEs e imprima a cadeia com os endereços, NXDOMAIN ou LOOP
        }
    }
}
