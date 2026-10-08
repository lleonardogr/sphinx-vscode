import java.util.Scanner;

public class Main {
    static int width = 8;
    static long value = 0;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            String[] parts = scanner.nextLine().trim().split(" ");
            String command = parts[0];
            if (command.equals("quit")) {
                break;
            }
            // TODO: execute o comando e depois imprima o valor: bin ... | hex ... | unsigned ... | signed ...
            System.out.println("Unknown command");
        }
    }
}
