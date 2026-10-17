import java.util.*;

public class Main {

    static int countRepeated(Map<Integer, Integer> counts) {
        int repeated = 0;
        for (int times : counts.values()) {
            if (times >= 2) {
                repeated++;
            }
        }
        return repeated;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Map<Integer, Integer> counts = new HashMap<>();
        for (int i = 0; i < n; i++) {
            counts.merge(scanner.nextInt(), 1, Integer::sum);
        }
        System.out.println(countRepeated(counts));
    }
}
