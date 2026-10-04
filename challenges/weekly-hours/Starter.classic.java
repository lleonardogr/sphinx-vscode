import java.util.*;

enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // TODO: create an EnumMap<Day, Integer> and start every day at 0

        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            Day day = Day.valueOf(scanner.next());
            int hours = scanner.nextInt();
            // TODO: add the hours to that day
        }
        // TODO: print every day in week order, then the busiest day
    }
}
