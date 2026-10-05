String mask(String secret, String guessed) {
    StringBuilder line = new StringBuilder("Word:");
    for (int i = 0; i < secret.length(); i++) {
        char c = secret.charAt(i);
        line.append(' ').append(guessed.indexOf(c) >= 0 ? c : '_');
    }
    return line.toString();
}

boolean revealed(String secret, String guessed) {
    for (int i = 0; i < secret.length(); i++) {
        if (guessed.indexOf(secret.charAt(i)) < 0) return false;
    }
    return true;
}

void main() {
    String secret = IO.readln().trim();
    int lives = 6;
    String guessed = "";
    IO.println(mask(secret, guessed));
    while (lives > 0 && !revealed(secret, guessed)) {
        String guess = IO.readln().trim().toLowerCase();
        if (guess.length() != 1 || !Character.isLetter(guess.charAt(0))) {
            IO.println("Invalid guess");
            continue;
        }
        if (guessed.contains(guess)) {
            IO.println("Already guessed: " + guess);
            continue;
        }
        guessed += guess;
        if (secret.contains(guess)) {
            IO.println("Good guess!");
        } else {
            lives--;
            IO.println("Wrong! Lives left: " + lives);
        }
        IO.println(mask(secret, guessed));
    }
    IO.println((lives > 0 ? "You win!" : "You lose!") + " The word was " + secret);
}
