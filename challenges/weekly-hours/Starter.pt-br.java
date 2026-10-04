enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }

void main() {
    // TODO: crie um EnumMap<Day, Integer> e comece todos os dias em 0

    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" ");
        Day day = Day.valueOf(parts[0]);
        int hours = Integer.parseInt(parts[1]);
        // TODO: some as horas nesse dia
    }
    // TODO: imprima cada dia na ordem da semana e depois o dia mais cheio
}
