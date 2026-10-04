import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        String line = new Scanner(System.in).nextLine().trim();
        IntSummaryStatistics stats = Arrays.stream(line.split(" "))
                .mapToInt(Integer::parseInt)
                .summaryStatistics();
        System.out.println("Count: " + stats.getCount());
        System.out.println("Sum: " + stats.getSum());
        System.out.println("Min: " + stats.getMin());
        System.out.println("Max: " + stats.getMax());
        System.out.println(String.format("Average: %.2f", stats.getAverage()));
    }
}
