int moves = 0;

// TODO: move n disks from peg "from" to peg "to", using peg "via", printing each move
void hanoi(int n, char from, char to, char via) {
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    hanoi(n, 'A', 'C', 'B');
    IO.println("Total moves: " + moves);
}
