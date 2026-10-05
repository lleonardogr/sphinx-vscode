import java.util.*;
import java.util.stream.*;

record Grade(String student, String course, int score) {}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        List<String> lines = Stream.generate(scanner::nextLine).limit(n).collect(Collectors.toList());

        // TODO: turn the lines into Grade records and print the four parts of the report with streams
    }
}
