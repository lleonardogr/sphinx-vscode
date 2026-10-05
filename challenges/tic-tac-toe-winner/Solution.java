boolean wins(char[][] b, char p) {
    for (int i = 0; i < 3; i++) {
        if (b[i][0] == p && b[i][1] == p && b[i][2] == p) return true;
        if (b[0][i] == p && b[1][i] == p && b[2][i] == p) return true;
    }
    return (b[0][0] == p && b[1][1] == p && b[2][2] == p) || (b[0][2] == p && b[1][1] == p && b[2][0] == p);
}

void main() {
    char[][] board = new char[3][];
    for (int r = 0; r < 3; r++) {
        board[r] = IO.readln().trim().toCharArray();
    }
    int x = 0, o = 0;
    for (char[] row : board) {
        for (char c : row) {
            if (c == 'X') x++;
            if (c == 'O') o++;
        }
    }
    boolean xWins = wins(board, 'X');
    boolean oWins = wins(board, 'O');
    if ((x != o && x != o + 1) || (xWins && oWins) || (xWins && x != o + 1) || (oWins && x != o)) {
        IO.println("Invalid board");
    } else if (xWins) {
        IO.println("X wins");
    } else if (oWins) {
        IO.println("O wins");
    } else if (x + o == 9) {
        IO.println("Draw");
    } else {
        IO.println("Game in progress");
    }
}
