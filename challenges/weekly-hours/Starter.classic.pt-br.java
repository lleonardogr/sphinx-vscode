import java.util.*;

enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // TODO: crie um EnumMap<Day, Integer> e comece todos os dias em 0

        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            Day day = Day.valueOf(scanner.next());
            int hours = scanner.nextInt();
            // TODO: some as horas nesse dia
        }
        // TODO: imprima cada dia na ordem da semana e depois o dia mais cheio
    }
}
