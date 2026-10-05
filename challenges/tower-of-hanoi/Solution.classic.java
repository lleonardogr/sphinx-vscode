import java.util.Scanner;

public class Main {

    static int moves = 0;

    static void hanoi(int n, char from, char to, char via) {
        if (n == 1) {
            System.out.println("Move disk 1 from " + from + " to " + to);
            moves++;
            return;
        }
        hanoi(n - 1, from, via, to);
        System.out.println("Move disk " + n + " from " + from + " to " + to);
        moves++;
        hanoi(n - 1, via, to, from);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        hanoi(n, 'A', 'C', 'B');
        System.out.println("Total moves: " + moves);
    }
}
