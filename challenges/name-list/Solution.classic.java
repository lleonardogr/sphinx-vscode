import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        String line = new Scanner(System.in).nextLine().trim();
        String names = Arrays.stream(line.split(" "))
                .map(name -> name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase())
                .distinct()
                .sorted()
                .collect(Collectors.joining(", "));
        System.out.println(names);
    }
}
