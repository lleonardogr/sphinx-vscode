enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }

void main() {
    // TODO: create an EnumMap<Day, Integer> and start every day at 0

    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" ");
        Day day = Day.valueOf(parts[0]);
        int hours = Integer.parseInt(parts[1]);
        // TODO: add the hours to that day
    }
    // TODO: print every day in week order, then the busiest day
}
