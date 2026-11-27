import java.util.Scanner;

// TODO: escreva uma classe abstrata Notification:
//   - um campo private final com o destinatário, definido pelo construtor
//   - abstract String channel()             ("EMAIL", "SMS" or "PUSH")
//   - abstract String format(String text)   (como este canal formata o texto)
//   - String send(String text), que devolve: CANAL to DESTINATÁRIO: texto formatado

// TODO: escreva Email, Sms e Push, cada uma estendendo Notification

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] parts = scanner.nextLine().split(" ", 3);   // tipo, destinatário, texto
            // TODO: crie a notificação certa para parts[0] e imprima o que send(parts[2]) devolve
        }
    }
}
