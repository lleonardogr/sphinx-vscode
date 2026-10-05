int moves = 0;

void hanoi(int n, char from, char to, char via) {
    if (n == 0) {
        return;
    }
    hanoi(n - 1, from, via, to);
    IO.println("Move disk " + n + " from " + from + " to " + to);
    moves++;
    hanoi(n - 1, via, to, from);
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    hanoi(n, 'A', 'C', 'B');
    IO.println("Total moves: " + moves);
}
