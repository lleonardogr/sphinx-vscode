import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int secret = scanner.nextInt();
        int guesses = 0;
        while (true) {
            int guess = scanner.nextInt();
            guesses++;
            if (guess == secret) break;
            System.out.println(guess < secret ? "Too low" : "Too high");
        }
        System.out.println("Correct! You needed " + guesses + " guesses.");
    }
}
