import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int code = Integer.parseInt(scanner.next().substring(2), 16); // U+00E9 -> 233

        // TODO: descubra quantos bytes são necessários, monte-os e imprima-os em hex, separados por espaços
    }
}
