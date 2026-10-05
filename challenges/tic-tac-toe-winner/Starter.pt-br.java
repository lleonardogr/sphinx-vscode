// TODO: devolva true se player ('X' ou 'O') tem três em uma linha, coluna ou diagonal
boolean wins(char[][] board, char player) {
    return false;
}

void main() {
    char[][] board = new char[3][];
    for (int r = 0; r < 3; r++) {
        board[r] = IO.readln().trim().toCharArray();
    }

    // TODO: conte as marcas, confira se o tabuleiro é válido e imprima o resultado
}
