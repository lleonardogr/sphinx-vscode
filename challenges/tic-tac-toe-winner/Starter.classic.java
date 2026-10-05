import java.util.*;

public class Main {

    // TODO: return true if player ('X' or 'O') has three in a row, a column or a diagonal
    static boolean wins(char[][] board, char player) {
        return false;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        char[][] board = new char[3][];
        for (int r = 0; r < 3; r++) {
            board[r] = scanner.next().toCharArray();
        }

        // TODO: count the marks, check the board is valid, and print the result
    }
}
