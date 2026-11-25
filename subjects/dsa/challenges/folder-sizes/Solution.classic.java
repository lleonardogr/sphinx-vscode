import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        long limit = scanner.nextLong();
        // Without building nodes: every folder on a file's path gets the file's size added to its total.
        Map<String, Long> totals = new HashMap<>();
        long all = 0;
        for (int i = 0; i < n; i++) {
            String path = scanner.next();
            long size = scanner.nextLong();
            all += size;
            int slash = path.indexOf('/');
            while (slash >= 0) {
                totals.merge(path.substring(0, slash), size, Long::sum);
                slash = path.indexOf('/', slash + 1);
            }
        }
        int overLimit = 0;
        String largestPath = null;
        long largestSize = 0;
        for (Map.Entry<String, Long> e : totals.entrySet()) {
            long total = e.getValue();
            if (total >= limit) {
                overLimit++;
            }
            if (total > largestSize || (total == largestSize && e.getKey().compareTo(largestPath) < 0)) {
                largestSize = total;
                largestPath = e.getKey();
            }
        }
        System.out.println("folders: " + totals.size());
        System.out.println("total size: " + all);
        System.out.println("folders over limit: " + overLimit);
        System.out.println("largest folder: " + (largestPath == null ? "none" : largestPath));
        System.out.println("largest folder size: " + largestSize);
    }
}
