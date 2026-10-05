import java.util.Scanner;

public class Main {

    static int moves = 0;

    // TODO: move n disks from peg "from" to peg "to", using peg "via", printing each move
    static void hanoi(int n, char from, char to, char via) {
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        hanoi(n, 'A', 'C', 'B');
        System.out.println("Total moves: " + moves);
    }
}
