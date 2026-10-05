void main() {
    int secret = Integer.parseInt(IO.readln().trim());
    int guesses = 0;
    int guess = -1;
    while (guess != secret) {
        guess = Integer.parseInt(IO.readln().trim());
        guesses++;
        if (guess < secret) {
            IO.println("Too low");
        } else if (guess > secret) {
            IO.println("Too high");
        }
    }
    IO.println("Correct! You needed " + guesses + " guesses.");
}
