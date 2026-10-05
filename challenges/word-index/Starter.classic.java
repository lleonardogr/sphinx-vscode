import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        List<String> lines = Stream.generate(scanner::nextLine).limit(n).collect(Collectors.toList());

        // TODO: build the index (word -> line numbers) with streams and print it
    }
}
