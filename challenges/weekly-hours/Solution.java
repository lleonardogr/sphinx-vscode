enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }

void main() {
    Scanner scanner = new Scanner(System.in);
    EnumMap<Day, Integer> hoursPerDay = new EnumMap<>(Day.class);
    for (Day day : Day.values()) {
        hoursPerDay.put(day, 0);
    }
    int n = scanner.nextInt();
    for (int i = 0; i < n; i++) {
        Day day = Day.valueOf(scanner.next());
        hoursPerDay.merge(day, scanner.nextInt(), Integer::sum);
    }
    Day busiest = Day.MONDAY;
    for (Map.Entry<Day, Integer> entry : hoursPerDay.entrySet()) {
        IO.println(entry.getKey() + ": " + entry.getValue());
        if (entry.getValue() > hoursPerDay.get(busiest)) {
            busiest = entry.getKey();
        }
    }
    IO.println("Busiest: " + busiest);
}
