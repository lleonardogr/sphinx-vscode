import java.util.Scanner;

public class Main {

    static int moves = 0;

    // TODO: mova n discos do pino "from" para o pino "to", usando o pino "via", imprimindo cada movimento
    static void hanoi(int n, char from, char to, char via) {
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        hanoi(n, 'A', 'C', 'B');
        System.out.println("Total moves: " + moves);
    }
}
