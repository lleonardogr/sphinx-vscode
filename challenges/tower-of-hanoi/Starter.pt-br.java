int moves = 0;

// TODO: mova n discos do pino "from" para o pino "to", usando o pino "via", imprimindo cada movimento
void hanoi(int n, char from, char to, char via) {
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    hanoi(n, 'A', 'C', 'B');
    IO.println("Total moves: " + moves);
}
