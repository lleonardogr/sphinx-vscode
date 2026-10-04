import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        String line = new Scanner(System.in).nextLine().trim();
        String squares = Arrays.stream(line.split(" "))
                .mapToInt(Integer::parseInt)
                .filter(n -> n % 2 == 0)
                .mapToObj(n -> String.valueOf(n * n))
                .collect(Collectors.joining(" "));
        System.out.println(squares.isEmpty() ? "(none)" : squares);
    }
}
