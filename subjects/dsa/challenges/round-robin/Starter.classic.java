import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int slice = scanner.nextInt();
        String[] names = new String[n];
        int[] needs = new int[n];
        for (int i = 0; i < n; i++) {
            names[i] = scanner.next();
            needs[i] = scanner.nextInt();
        }

        // TODO: run the processes in turns with a queue, print when each finishes, then the average waiting time
    }
}
