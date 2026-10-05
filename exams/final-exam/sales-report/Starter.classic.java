import java.util.*;
import java.util.stream.*;

record Sale(String region, String product, int quantity, double price) {}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        List<String> lines = Stream.generate(scanner::nextLine).limit(n).collect(Collectors.toList());

        // TODO: turn the lines into Sale records and print the report with streams
    }
}
