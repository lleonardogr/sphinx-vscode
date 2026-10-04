import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        String line = new Scanner(System.in).nextLine().trim();
        Map<Integer, String> byLength = Arrays.stream(line.split(" "))
                .collect(Collectors.groupingBy(String::length, TreeMap::new, Collectors.joining(", ")));
        byLength.forEach((length, words) -> System.out.println(length + ": " + words));
    }
}
