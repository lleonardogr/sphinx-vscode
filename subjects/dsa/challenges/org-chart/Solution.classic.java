import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // Children lists, then a breadth-first walk from the CEO, one level at a time.
        List<List<Integer>> reports = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            reports.add(new ArrayList<>());
        }
        for (int i = 2; i <= n; i++) {
            reports.get(scanner.nextInt()).add(i);
        }
        Queue<Integer> queue = new ArrayDeque<>();
        queue.add(1);
        int levels = 0, widest = 0, widestSize = 0, noReports = 0;
        while (!queue.isEmpty()) {
            levels++;
            int size = queue.size();
            if (size > widestSize) {
                widestSize = size;
                widest = levels;
            }
            for (int k = 0; k < size; k++) {
                int person = queue.remove();
                if (reports.get(person).isEmpty()) {
                    noReports++;
                }
                queue.addAll(reports.get(person));
            }
        }
        System.out.println("levels: " + levels);
        System.out.println("widest level: " + widest);
        System.out.println("widest level size: " + widestSize);
        System.out.println("no reports: " + noReports);
    }
}
