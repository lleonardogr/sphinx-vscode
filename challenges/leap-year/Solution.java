void main() {
    int year = Integer.parseInt(IO.readln().trim());
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        IO.println("Leap year");
    } else {
        IO.println("Not a leap year");
    }
}
