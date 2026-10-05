import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String secret = scanner.nextLine().trim();
        int lives = 6;
        String guessed = "";
        boolean won = false;
        System.out.println("Word: " + "_ ".repeat(secret.length()).trim());
        while (lives > 0 && !won) {
            String guess = scanner.nextLine().trim().toLowerCase();
            if (guess.length() != 1 || !Character.isLetter(guess.charAt(0))) {
                System.out.println("Invalid guess");
            } else if (guessed.contains(guess)) {
                System.out.println("Already guessed: " + guess);
            } else {
                guessed += guess;
                if (secret.contains(guess)) {
                    System.out.println("Good guess!");
                } else {
                    lives--;
                    System.out.println("Wrong! Lives left: " + lives);
                }
                String line = "Word:";
                won = true;
                for (char c : secret.toCharArray()) {
                    boolean shown = guessed.indexOf(c) >= 0;
                    if (!shown) won = false;
                    line += " " + (shown ? c : '_');
                }
                System.out.println(line);
            }
        }
        System.out.println((won ? "You win!" : "You lose!") + " The word was " + secret);
    }
}
