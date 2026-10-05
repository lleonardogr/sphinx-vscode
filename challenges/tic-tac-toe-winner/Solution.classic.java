import java.util.*;

public class Main {

    static boolean wins(char[][] b, char p) {
        for (int i = 0; i < 3; i++) {
            if (b[i][0] == p && b[i][1] == p && b[i][2] == p) return true;
            if (b[0][i] == p && b[1][i] == p && b[2][i] == p) return true;
        }
        return (b[0][0] == p && b[1][1] == p && b[2][2] == p) || (b[0][2] == p && b[1][1] == p && b[2][0] == p);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        char[][] board = new char[3][];
        for (int r = 0; r < 3; r++) {
            board[r] = scanner.next().toCharArray();
        }
        int x = 0, o = 0;
        for (int r = 0; r < 3; r++) {
            for (int c = 0; c < 3; c++) {
                if (board[r][c] == 'X') x++;
                else if (board[r][c] == 'O') o++;
            }
        }
        boolean xw = wins(board, 'X'), ow = wins(board, 'O');
        String result;
        if (x - o < 0 || x - o > 1) result = "Invalid board";
        else if (xw && ow) result = "Invalid board";
        else if (xw) result = x == o + 1 ? "X wins" : "Invalid board";
        else if (ow) result = x == o ? "O wins" : "Invalid board";
        else result = x + o == 9 ? "Draw" : "Game in progress";
        System.out.println(result);
    }
}
