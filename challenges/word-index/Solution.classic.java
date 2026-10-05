import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        List<String> lines = Stream.generate(scanner::nextLine).limit(n).collect(Collectors.toList());
        TreeMap<String, String> index = IntStream.rangeClosed(1, lines.size()).boxed()
                .flatMap(line -> Pattern.compile("[^a-z]+").splitAsStream(lines.get(line - 1).toLowerCase())
                        .filter(w -> w.length() > 0)
                        .map(w -> new AbstractMap.SimpleEntry<>(w, line)))
                .distinct()
                .collect(Collectors.groupingBy(Map.Entry::getKey, TreeMap::new,
                        Collectors.mapping(e -> String.valueOf(e.getValue()), Collectors.joining(", "))));
        index.forEach((word, where) -> System.out.println(word + ": " + where));
    }
}
