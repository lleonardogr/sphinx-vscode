import java.util.*;
import java.util.stream.*;

record Player(String name, int score) {}

public class Main {
    public static void main(String[] args) {
        String line = new Scanner(System.in).nextLine().trim();
        // Each entry looks like name:score, for example "ana:90"

        // TODO: turn the entries into Player records, sort them, keep the top 3 and print the ranking
    }
}
