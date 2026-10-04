void main() {
    int month = Integer.parseInt(IO.readln().trim());
    int year = Integer.parseInt(IO.readln().trim());
    boolean leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    int days = switch (month) {
        case 1, 3, 5, 7, 8, 10, 12 -> 31;
        case 4, 6, 9, 11 -> 30;
        case 2 -> leap ? 29 : 28;
        default -> -1;
    };
    IO.println(days == -1 ? "Invalid month" : String.valueOf(days));
}
