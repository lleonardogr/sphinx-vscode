import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] hex = scanner.nextLine().trim().split(" ");
        int[] bytes = new int[hex.length];
        for (int i = 0; i < hex.length; i++) {
            bytes[i] = Integer.parseInt(hex[i], 16);
        }

        // TODO: leia os campos do cabeçalho IPv4 em bytes, confira o checksum e depois a parte UDP
    }
}
