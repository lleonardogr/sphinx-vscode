import java.util.*;

public class Main {

    // TODO: devolva true se player ('X' ou 'O') tem três em uma linha, coluna ou diagonal
    static boolean wins(char[][] board, char player) {
        return false;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        char[][] board = new char[3][];
        for (int r = 0; r < 3; r++) {
            board[r] = scanner.next().toCharArray();
        }

        // TODO: conte as marcas, confira se o tabuleiro é válido e imprima o resultado
    }
}
