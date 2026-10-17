import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int slice = scanner.nextInt();
        String[] names = new String[n];
        int[] needs = new int[n];
        int[] left = new int[n];
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            names[i] = scanner.next();
            needs[i] = scanner.nextInt();
            left[i] = needs[i];
            queue.add(i);
        }
        int clock = 0;
        long totalWaiting = 0;
        while (!queue.isEmpty()) {
            int i = queue.remove();
            if (left[i] <= slice) {
                clock += left[i];
                left[i] = 0;
                System.out.println(names[i] + " finishes at " + clock);
                totalWaiting += clock - needs[i];
            } else {
                clock += slice;
                left[i] -= slice;
                queue.add(i);
            }
        }
        System.out.printf("average waiting: %.2f%n", (double) totalWaiting / n);
    }
}
